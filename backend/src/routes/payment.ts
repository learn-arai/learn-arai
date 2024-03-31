import Elysia, { t } from 'elysia';

import { middleware } from '../middleware';

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Missing Stripe Secret Key');
}

if (!process.env.STRIPE_PRODUCT_PREMIUM) {
    throw new Error('Missing Stripe Premium Product ID');
}

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const priceId = {
    premium: process.env.STRIPE_PRODUCT_PREMIUM,
};

export const paymentRoute = new Elysia({ prefix: '/payment' })
    .use(middleware)
    .post('/checkout/create', async (context) => {
        const { set } = context;
        const { user } = context;

        if (!user) {
            set.status = 401;
            return {
                status: 'error',
                message: 'Unauthorized, Please sign in and try again',
            };
        }

        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId.premium,
                    quantity: 1,
                },
            ],
            ui_mode: 'embedded',
            return_url: `${process.env.WEB_URL}/checkout/callback?session_id={CHECKOUT_SESSION_ID}`,
        });

        // TODO: Remove this
        // console.log(session);

        const { id: sessionId, client_secret: clientSecret } = session;

        return {
            status: 'success',
            data: {
                session_id: sessionId,
                client_secret: clientSecret,
            },
        };
    })
    .get(
        '/checkout/session',
        async (context) => {
            const { query } = context;
            const { session_id } = query;

            const session = await stripe.checkout.sessions.retrieve(session_id);
            const customer = await stripe.customers.retrieve(session.customer);

            return {
                status: 'success',
                data: {
                    status: session.status,
                    payment_status: session.payment_status,
                    customer_email: customer.email,
                },
            };
        },
        {
            query: t.Object({
                session_id: t.String(),
            }),
        },
    );
