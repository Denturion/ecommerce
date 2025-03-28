import dotenv from 'dotenv';
import express from 'express';
import { connectDB } from './config/db';
import cors from 'cors';
import { Request, Response } from 'express';

dotenv.config();
const app = express();

// Middleware
app.use(
	cors({
		origin: process.env.FRONTEND_URL,
		methods: ['GET', 'POST', 'PATCH', 'DELETE'],
	})
);
app.use(express.json());

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.post('/create-checkout-session', async (req, res) => {
	try {
		const { cart, customerId, success_url, cancel_url } = req.body;

		console.log('Recieved  request to create checkout session:', {
			cart,
			customerId,
			success_url,
			cancel_url,
		});

		if (!cart || !Array.isArray(cart) || cart.length === 0) {
			console.error('Cart validation failed');

			return res
				.status(400)
				.send({ error: 'Cart is required and must not be empty' });
		}

		if (!customerId) {
			console.error('Customer ID validation failed');

			return res.status(400).send({ error: 'Customer ID is required' });
		}

		const lineItems = cart.map((item: any) => ({
			price_data: {
				currency: 'usd',
				product_data: {
					name: item.name,
				},
				unit_amount: item.price * 100,
			},
			quantity: item.quantity,
		}));

		console.log('Line items for Stripe session:', lineItems);

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			line_items: lineItems,
			mode: 'payment',
			success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${process.env.FRONTEND_URL}/cart`,
			client_reference_id: customerId,
		});

		res.send({ sessionId: session.id });
	} catch (error) {
		console.error('Error creating checkout session:', error);
		res.status(500).send({ error: 'Failed to create checkout session' });
	}
});

app.get('/session_status', async (req: Request, res: Response) => {
	try {
		const sessionId = req.query.session_id as string;

		if (!sessionId) {
			return res.status(400).send({ error: 'Session ID is required' });
		}

		const session = await stripe.checkout.sessions.retrieve(sessionId);

		res.send({
			status: session.status,
			payment_status: session.payment_status,
			customer_email: session.customer_details?.email,
		});
	} catch (error) {
		console.error('Error retrieving session status:', error);
		res.status(500).send({ error: 'Failed to retrieve session status' });
	}
});

// Routes
import productRouter from './routes/products';
import customerRouter from './routes/customers';
import orderRouter from './routes/orders';
import orderItemRouter from './routes/orderItems';
app.use('/products', productRouter);
app.use('/customers', customerRouter);
app.use('/orders', orderRouter);
app.use('/order-items', orderItemRouter);

// Attempt to connect to the database
connectDB();
// Start Express server
const PORT = 3000;
app.listen(PORT, () => {
	console.log(`The server is running at http://localhost:${PORT}`);
});
