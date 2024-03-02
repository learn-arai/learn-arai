FROM oven/bun

WORKDIR /app

COPY package.json .
COPY bun.lockb .

RUN bun install --production

COPY src src
COPY lib lib
COPY tsconfig.json .
# COPY public public

# Environment variables
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}
ARG RESEND_API_KEY
ENV RESEND_API_KEY=${RESEND_API_KEY}

ENV NODE_ENV production
CMD ["bun", "src/index.ts"]

EXPOSE 3000