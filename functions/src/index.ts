// functions/src/index.ts

import { onRequest } from "firebase-functions/v2/https";
import { setGlobalOptions } from "firebase-functions/v2";
import * as admin from "firebase-admin";
import { MercadoPagoConfig, Preference, Payment } from "mercadopago";

admin.initializeApp();
const db = admin.firestore();

// Especifica que las funciones en este archivo necesitarán este secret.
// Esto le indica a Firebase que debe asegurarse de que el permiso exista durante el deploy.
setGlobalOptions({ secrets: ["MERCADOPAGO_ACCESSTOKEN"] });

/**
 * Crea una preferencia de pago en Mercado Pago.
 */
export const createSubscription = onRequest(
  { cors: true, region: "us-central1" }, // Especificar la región es una buena práctica
  async (request, response) => {
    
    // Accedemos al secret a través de process.env
    const accessToken = process.env.MERCADOPAGO_ACCESSTOKEN;

    // --- CAMBIO CLAVE: VERIFICACIÓN ROBUSTA ---
    if (!accessToken) {
      console.error("CRITICAL ERROR: El secret 'MERCADOPAGO_ACCESSTOKEN' no está disponible en el entorno de ejecución de la función. Revisa la configuración de secrets en Google Cloud.");
      response.status(500).send({ error: "Error de configuración interna del servidor." });
      return;
    }

    const client = new MercadoPagoConfig({ accessToken });
    const { userId, userEmail, userName } = request.body.data || request.body;

    if (!userId || !userEmail) {
      response.status(400).send({ error: "Faltan datos del usuario (userId, userEmail)." });
      return;
    }

    try {
      const preference = new Preference(client);
      const result = await preference.create({
        body: {
          items: [{
            id: "Suscripcion_Montu_Trainer",
            title: "Suscripción Mensual Montu para Entrenadores",
            quantity: 1,
            unit_price: 20.00,
            currency_id: "USD",
          }],
          external_reference: userId,
          payer: { email: userEmail, name: userName },
          notification_url: "https://us-central1-montu-a4901.cloudfunctions.net/receiveWebhook", 
          back_urls: {
            success: "https://montu-a4901.web.app",
            pending: "https://montu-a4901.web.app",
            failure: "https://montu-a4901.web.app",
          },
          auto_return: "approved",
        },
      });

      console.log(`Preferencia de pago creada para el usuario: ${userId}`);
      response.status(200).send({ checkoutUrl: result.init_point });
    } catch (error) {
      console.error("Error al crear la suscripción en Mercado Pago:", error);
      response.status(500).send({ error: "Error interno al contactar a Mercado Pago." });
    }
  }
);

/**
 * Recibe las notificaciones (webhooks) de Mercado Pago.
 */
export const receiveWebhook = onRequest(
  { region: "us-central1" }, // No necesita CORS, pero sí la región
  async (request, response) => {
    const { query } = request;
    const topic = query.topic || query.type;

    if (topic === "payment") {
        const paymentId = query.id || query["data.id"];
        const accessToken = process.env.MERCADOPAGO_ACCESSTOKEN;

        if (!accessToken) {
          console.error("CRITICAL ERROR: El secret 'MERCADOPAGO_ACCESSTOKEN' no está disponible en el webhook.");
          response.status(500).send("Error de configuración del servidor.");
          return;
        }

        try {
            const paymentClient = new Payment(new MercadoPagoConfig({ accessToken }));
            const payment = await paymentClient.get({ id: String(paymentId) });
            const userId = payment.external_reference;

            if (userId && payment.status === "approved") {
                const userRef = db.collection("users").doc(userId);
                const trainerData = {
                  role: "trainer",
                  subscriptionStatus: "active",
                  email: payment.payer?.email,
                  username: payment.payer?.first_name ? `${payment.payer.first_name} ${payment.payer.last_name || ''}`.trim() : "Nuevo Entrenador",
                };
                await userRef.set(trainerData, { merge: true });
                console.log(`Suscripción activada para el usuario: ${userId}`);
            }
        } catch (error) {
            console.error("Error al procesar el webhook de Mercado Pago:", error);
        }
    }
    response.status(200).send("ok");
});