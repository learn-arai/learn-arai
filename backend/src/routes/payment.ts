import Elysia, { t } from 'elysia';

import { sql } from '@/lib/db';
import Stripe from 'stripe';

import { middleware } from '../middleware';

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Missing Stripe Secret Key');
}

if (!process.env.STRIPE_PRODUCT_PREMIUM) {
    throw new Error('Missing Stripe Premium Product ID');
}

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Change to control trial period length
const TRIAL_PERIOD_DAYS = 0;

const priceId = {
    premium: process.env.STRIPE_PRODUCT_PREMIUM,
};

export const paymentRoute = new Elysia({ prefix: '/payment' })
    .use(middleware)
    .post('/webhook', async (context) => {
        const { set, headers, request } = context;
        const sig = headers['stripe-signature'] as string;
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

        const body = await request.text();

        if (!sig || !webhookSecret) {
            set.status = 400;
            return {
                status: 'error',
                message: 'Webhook secret not found.',
            };
        }

        let event;
        try {
            event = await stripe.webhooks.constructEventAsync(
                body,
                sig,
                webhookSecret,
            );
        } catch (err: any) {
            console.log(`[/payment/webhook] ❌ Error message: ${err.message}`);

            set.status = 400;
            return {
                status: 'error',
                message: `Webhook Error: ${err.message}`,
            };
        }

        // https://github.dev/vercel/nextjs-subscription-payments
        switch (event.type) {
            case 'product.created':
            case 'product.updated':
                const product = event.data.object as Stripe.Product;
                // UPSERT
                await sql`
                INSERT INTO stripe_product
                    (id, active, name, description, image, metadata)
                VALUES
                    (${product.id}, ${product.active}, ${product.name}, ${product.description ?? null}, ${product.images?.[0] ?? null}, ${JSON.stringify(product.metadata)}::jsonb)
                ON CONFLICT (id)
                DO UPDATE SET
                    active = ${product.active},
                    name = ${product.name},
                    description = ${product.description ?? null},
                    image = ${product.images?.[0] ?? null},
                    metadata = ${JSON.stringify(product.metadata)}::jsonb;
                `;

                break;
            case 'price.created':
            case 'price.updated':
                const price = event.data.object;
                // UPSERT
                await sql`
                INSERT INTO stripe_price
                    (id, product_id, active, currency, type, unit_amount, interval, interval_count, trial_period_days)
                VALUES
                    (${price.id}, ${price.product}, ${price.active}, ${price.currency}, ${price.type}, ${price.unit_amount ?? null}, ${price.recurring?.interval ?? null}, ${price.recurring?.interval_count ?? null}, ${price.recurring?.trial_period_days ?? TRIAL_PERIOD_DAYS})
                ON CONFLICT (id)
                DO UPDATE SET
                    product_id = ${typeof price.product === 'string' ? price.product : ''},
                    active = ${price.active},
                    currency = ${price.currency},
                    type = ${price.type},
                    unit_amount = ${price.unit_amount ?? null},
                    interval = ${price.recurring?.interval ?? null},
                    interval_count = ${price.recurring?.interval_count ?? null},
                    trial_period_days = ${price.recurring?.trial_period_days ?? TRIAL_PERIOD_DAYS};
                `;
                break;
            case 'price.deleted':
                // await deletePriceRecord(event.data.object as Stripe.Price);
                break;
            case 'product.deleted':
                // await deleteProductRecord(event.data.object as Stripe.Product);
                break;
            case 'customer.subscription.created':
            case 'customer.subscription.updated':
            case 'customer.subscription.deleted':
                // const subscription = event.data.object as Stripe.Subscription;
                // await manageSubscriptionStatusChange(
                //     subscription.id,
                //     subscription.customer as string,
                //     event.type === 'customer.subscription.created',
                // );
                break;
            case 'checkout.session.completed':
                // const checkoutSession = event.data
                //     .object as Stripe.Checkout.Session;
                // if (checkoutSession.mode === 'subscription') {
                //     const subscriptionId = checkoutSession.subscription;
                //     await manageSubscriptionStatusChange(
                //         subscriptionId as string,
                //         checkoutSession.customer as string,
                //         true,
                //     );
                // }
                break;
            default:
                console.log(
                    `[/payment/webhook] ❌ Unhandled relevant event: ${event.type}`,
                );
        }

        set.status = 200;
        return {
            received: true,
        };
    })
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
