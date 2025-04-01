import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

export function sendVerificationCode(email: string, code: string) {
    if (process.env.NODE_ENV === 'development') return;

    resend.emails.send({
        // from: 'noreply@learnarai.online',
        from: 'noreply@learnarai.athichal.com',
        to: email,
        subject: 'Email Verification for LearnArai',
        html: `<!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Document</title>
        
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                <link
                    href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body style="margin: 0; padding: 0">
                <div
                    style="
                        width: 100%;
                        padding: 2rem 0 2rem 0;
                        background-color: #f8f6f6;
                    "
                >
                    <div
                        style="
                            max-width: 45rem;
                            background-color: #ffffff;
                            margin: 0 auto 0 auto;
                            padding: 2rem 1.5rem 2rem 1.5rem;
                            font-family: 'Open Sans', sans-serif;
                            font-style: normal;
                            color: gray;
                        "
                    >
                        <h1 style="color: black">
                            <span style="font-weight: 900;">
                                <span style="color: #1da0ea">Learn</span
                                ><span style="color: #fd4444">Arai</span></span
                            >
                            Verify Code
                        </h1>
                        <p>Please use the following verification code:</p>
                        <p
                            style="
                                font-size: 3rem;
                                padding: 0;
                                margin: 0;
                                font-weight: bolder;
                                color: #1da0ea;
                            "
                        >
                            ${code}
                        </p>
                        <p style="padding-bottom: 4rem">
                            You can only use it once and it will expire after 5 mins.
                        </p>
                        <p>
                            If you did not request this, please disregard this email and
                            contact our
                            <a
                                style="color: #1da0ea"
                                href="https://learnarai.online/support"
                                >support</a
                            >. Do not reply to this automated email.
                        </p>
                    </div>
                </div>
            </body>
        </html>
        `,
    });
}
