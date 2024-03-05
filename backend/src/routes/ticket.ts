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
                });
                ws.close();
                return;
            }

            if (user.type === 'user' && ticket.user_id !== user.id) {
                ws.send({
                    status: 'error',
                    message:
                        'Unauthorized, You are not allowed to access this room',
                });
                ws.close();
                return;
            }

            ws.subscribe(slug);
            ws.send({
                message: `Connected to ${slug} room`,
                userId: 'system',
            });

            const history = await sql`
                SELECT
                    ticket_message.content AS message,
                    ticket_message.created_at AS createdAt
                FROM
                    ticket_message
                WHERE
                    ticket_message.ticket_id = ${ticket.id}
                ORDER BY
                    ticket_message.created_at
                LIMIT 10
            `;

            for (let i = 0; i < history.length; i++) {
                ws.send({
                    message: history[i].message,
                    user: history[i].user,
                    createdAt: history[i].createdAt,
                });
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

            ws.send(message);
            ws.publish(slug, message);
        },
    });
