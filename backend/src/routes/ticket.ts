import { Elysia, t } from 'elysia';

import { sql } from '@/lib/db';
import { generateSlug } from '@/lib/utils';

import { middleware } from '../middleware';

export const ticketRoute = new Elysia({ prefix: '/ticket' })
    .use(middleware)
    .post(
        '/create',
        async ({ user, session, set, body }) => {
            if (!user || !session) {
                set.status = 401;
                return {
                    status: 'error',
                    message: 'Unauthenticated, Please sign in and try again',
                };
            }

            const { description, title } = body;
            const slug = generateSlug();

            await sql`
            INSERT INTO ticket
                (title, description, user_id, slug)
            VALUES
                (${title}, ${description}, ${user.id}, ${slug})
            `;

            return {
                status: 'success',
                message: 'Ticket created',
                data: {
                    slug,
                },
            };
        },
        {
            body: t.Object({
                title: t.String(),
                description: t.String(),
            }),
        },
    )
    .ws('/:slug/chat', {
        async open(ws) {
            const {
                user,
                session,
                params: { slug },
            } = ws.data;

            if (!user || !session) {
                ws.send({
                    status: 'error',
                    message: 'Unauthenticated, Please sign in and try again',
                });
                ws.close();
                return;
            }

            const [ticket] = await sql`
                SELECT * FROM ticket 
                WHERE slug = ${slug}
            `;

            if (!ticket) {
                ws.send({
                    status: 'error',
                    message: 'Ticket not found',
                    type: 'system',
                });
                ws.close();
                return;
            }

            if (user.type === 'user' && ticket.user_id !== user.id) {
                ws.send({
                    status: 'error',
                    message:
                        'Unauthorized, You are not allowed to access this room',
                    type: 'system',
                });
                ws.close();
                return;
            }

            const history = await sql`
                SELECT
                    ticket_message.content AS message,
                    ticket_message.created_at,
                    ticket_message.user_id
                FROM
                    ticket_message
                WHERE
                    ticket_message.ticket_id = ${ticket.id}
                ORDER BY
                    ticket_message.created_at
            `;

            for (let i = 0; i < history.length; i++) {
                ws.send({
                    message: history[i].message,
                    type: history[i].user_id === user.id ? 'you' : 'other',
                    createdAt: history[i].created_at,
                });
            }

            if (ticket.is_close) {
                ws.send({
                    status: 'error',
                    message: 'Ticket is closed',
                    type: 'system',
                });
            } else {
                ws.subscribe(slug);

                ws.send({
                    message: `Connected to ${slug} room`,
                    type: 'system',
                });
            }

            if (user.type === 'supporter') {
                ws.send({
                    message:
                        "You are supporter! Please don't be stupid to customers",
                    type: 'system',
                });
            }

            if (ticket.is_close) {
                ws.close();
                return;
            }
        },
        message(ws, data) {
            const {
                user,
                params: { slug },
            } = ws.data;

            const message = data as {
                message: string;
            };

            if (!message.message) {
                return;
            }

            if (!user) {
                ws.send({
                    status: 'error',
                    message: 'Unauthenticated, Please sign in and try again',
                });
                return;
            }

            sql`
                INSERT INTO ticket_message
                    (ticket_id, user_id, content)
                VALUES
                    (
                        (SELECT id FROM ticket WHERE slug = ${slug}),
                        ${user.id},
                        ${message.message}
                    )
                `.then((_) => {}); // Without this, the query will not run

            ws.send({
                message: message.message,
                type: 'you',
                createdAt: Date.now(),
            });
            ws.publish(slug, {
                message: message.message,
                type: 'other',
                createdAt: Date.now(),
            });
        },
        close(ws) {
            const {
                params: { slug },
            } = ws.data;

            ws.unsubscribe(slug);
        },
    })
    .post('/:slug/close', async ({ user, session, set, params }) => {
        const { slug } = params;

        if (!user || !session) {
            set.status = 401;
            return {
                status: 'error',
                message: 'Unauthenticated, Please sign in and try again',
            };
        }

        const [ticket] = await sql`
            SELECT * FROM ticket 
            WHERE slug = ${slug}
        `;

        if (!ticket) {
            return {
                status: 'error',
                message: 'Ticket not found',
            };
        }

        if (user.type === 'user' && ticket.user_id !== user.id) {
            return {
                status: 'error',
                message:
                    'Unauthorized, You are not allowed to access this room',
            };
        }

        await sql`
            UPDATE ticket
            SET is_close = TRUE
            WHERE slug = ${slug}
        `;

        return {
            status: 'success',
            message: 'Ticket closed',
        };
    })
    .get(
        '/history',
        async ({ user, session, set, query }) => {
            const all = query['all'] == '0' ? false : true;

            if (!user || !session) {
                set.status = 401;
                return {
                    status: 'error',
                    message: 'Unauthenticated, Please sign in and try again',
                };
            }

            let ticket;
            if (user.type === 'user') {
                ticket = await sql`
                    SELECT
                        slug,
                        title,
                        description,
                        user_id AS "userId",
                        supporter_id AS "supporterId",
                        created_at AS "createdAt",
                        is_close AS "isClose"
                    FROM ticket
                    WHERE 
                        user_id = ${user.id}
                    ORDER BY is_close, created_at DESC
                `;
            } else {
                ticket = await sql`
                    SELECT
                        slug,
                        title,
                        description,
                        user_id AS "userId",
                        supporter_id AS "supporterId",
                        created_at AS "createdAt",
                        is_close AS "isClose"
                    FROM ticket
                    ORDER BY is_close, created_at DESC
                `;
            }

            return {
                status: 'success',
                data: ticket,
            };
        },
        {
            query: t.Object({
                all: t.Optional(t.String()),
            }),
        },
    );
