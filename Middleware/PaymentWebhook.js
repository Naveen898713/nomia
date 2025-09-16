// PaymentWebhook.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const OrderModel = require('../Models/OrderModel');
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

module.exports.stripeWebhookHandler = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    try {
      const orderData = {
        stripeSessionId: session.id,
        customerEmail: session.customer_details.email,
        userId: session.metadata?.userId || 'unknown',
        plants: JSON.parse(session.metadata?.plants || '[]'),
        amountTotal: session.amount_total / 100,
        paymentStatus: session.payment_status,
        createdAt: new Date(),
      };

      await OrderModel.create(orderData);
      console.log("✅ Order saved to database:", orderData);
    } catch (error) {
      console.error("❌ Failed to store order:", error);
    }
  }

  res.json({ received: true });
};
