BEGIN;

CREATE TYPE PACKAGE_TYPE AS ENUM ('free', 'premium');
CREATE TYPE USER_TYPE AS ENUM ('user', 'supporter');

CREATE TABLE IF NOT EXISTS auth_user (
    id      TEXT PRIMARY KEY,
    package PACKAGE_TYPE NOT NULL DEFAULT 'free',
    type    USER_TYPE NOT NULL DEFAULT 'user',    

    first_name   TEXT NOT NULL,
    last_name    TEXT NOT NULL,
    phone_number TEXT UNIQUE NOT NULL,

    email           TEXT UNIQUE NOT NULL,
    email_verified  BOOLEAN NOT NULL DEFAULT FALSE,
    hashed_password TEXT NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_session (
    id         TEXT PRIMARY KEY,
    expires_at TIMESTAMPTZ NOT NULL,
    user_id    TEXT NOT NULL REFERENCES auth_user(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS auth_email_verification (
    id         TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    code       CHAR(6) NOT NULL,
    user_id    TEXT UNIQUE NOT NULL REFERENCES auth_user(id) ON DELETE CASCADE,
    email      TEXT,
    expires_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS file (
    id          TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    uploaded_by TEXT NOT NULL REFERENCES auth_user(id),

    -- Access Control (up > down)
    public                          BOOLEAN NOT NULL DEFAULT TRUE,
    can_only_access_by_classroom_id TEXT NULL, -- FK Below
    can_only_access_by_group_id     TEXT NULL, -- FK Below
    can_only_access_by_student_id   TEXT NULL, -- FK Below

    name      TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    file_type TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS classroom (
    id          TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    slug        TEXT NOT NULL UNIQUE,
    name        TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    thumbnail   TEXT NULL REFERENCES file(id),

    default_group TEXT NULL, -- FK Below

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by TEXT NOT NULL REFERENCES auth_user(id)
);

CREATE TABLE IF NOT EXISTS teach (
    classroom_id TEXT NOT NULL REFERENCES classroom(id) ON DELETE CASCADE,
    user_id      TEXT NOT NULL REFERENCES auth_user(id) ON DELETE CASCADE,

    added_by TEXT REFERENCES auth_user(id),
    added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    PRIMARY KEY (classroom_id, user_id)
);

CREATE TABLE IF NOT EXISTS study (
    classroom_id    TEXT NOT NULL REFERENCES classroom(id) ON DELETE CASCADE,
    user_id         TEXT NOT NULL REFERENCES auth_user(id) ON DELETE CASCADE,
    is_class_hidden BOOLEAN DEFAULT FALSE,

    PRIMARY KEY (classroom_id, user_id)
);

CREATE TABLE IF NOT EXISTS classroom_group (
    id           TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    slug         TEXT NOT NULL UNIQUE,
    classroom_id TEXT NOT NULL REFERENCES classroom(id) ON DELETE CASCADE,
    title        TEXT NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by TEXT NOT NULL REFERENCES auth_user(id)
);

CREATE TABLE IF NOT EXISTS classroom_invite_code (
    id           TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    classroom_id TEXT NOT NULL REFERENCES classroom(id),

    code         CHAR(6) NOT NULL UNIQUE,
    expires_at   TIMESTAMPTZ
);

-- group <====> user
CREATE TABLE IF NOT EXISTS classroom_group_member (
    group_id TEXT NOT NULL REFERENCES classroom_group(id) ON DELETE CASCADE,
    user_id  TEXT NOT NULL REFERENCES auth_user(id) ON DELETE CASCADE,

    added_by_invide_code TEXT REFERENCES classroom_invite_code(id),
    added_by_teacher     TEXT REFERENCES auth_user(id),
    added_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    PRIMARY KEY (group_id, user_id)
);

-- invite code <====> group
CREATE TABLE IF NOT EXISTS classroom_invite_code_group (
    code_id  TEXT NOT NULL REFERENCES classroom_invite_code(id) ON DELETE CASCADE,
    group_id TEXT NOT NULL REFERENCES classroom_group(id) ON DELETE CASCADE,

    PRIMARY KEY (code_id, group_id)
);

CREATE TABLE IF NOT EXISTS assignment (
    id           TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    slug         TEXT NOT NULL UNIQUE,
    classroom_id TEXT NOT NULL REFERENCES classroom(id) ON DELETE CASCADE,
    group_id     TEXT NOT NULL REFERENCES classroom_group(id) ON DELETE CASCADE,
    
    title        TEXT NOT NULL,
    description  TEXT NOT NULL,
    due_date     TIMESTAMPTZ NOT NULL,
    max_score    INTEGER NOT NULL,

    can_submit_after_due BOOLEAN NOT NULL DEFAULT TRUE,

    created_by TEXT NOT NULL REFERENCES auth_user(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assignment_attachment (
    assignment_id TEXT NOT NULL REFERENCES assignment(id) ON DELETE CASCADE,
    file_id       TEXT NOT NULL REFERENCES file(id) ON DELETE CASCADE,

    PRIMARY KEY (assignment_id, file_id)
);

CREATE TABLE IF NOT EXISTS assignment_submission (
    assignment_id TEXT NOT NULL REFERENCES assignment(id) ON DELETE CASCADE,
    user_id       TEXT NOT NULL REFERENCES auth_user(id) ON DELETE CASCADE,
    score         INTEGER NULL,

    is_submitted BOOLEAN NOT NULL DEFAULT TRUE,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    PRIMARY KEY (assignment_id, user_id)
);

CREATE TABLE IF NOT EXISTS assignment_submission_attachment (
    assignment_id TEXT NOT NULL REFERENCES assignment(id) ON DELETE CASCADE,
    user_id       TEXT NOT NULL REFERENCES auth_user(id) ON DELETE CASCADE,
    file_id       TEXT NOT NULL REFERENCES file(id) ON DELETE CASCADE,

    PRIMARY KEY (assignment_id, user_id, file_id)
);

CREATE TABLE IF NOT EXISTS grader (
    id           TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    slug         TEXT NOT NULL UNIQUE,
    classroom_id TEXT NOT NULL REFERENCES classroom(id) ON DELETE CASCADE,
    group_id     TEXT NOT NULL REFERENCES classroom_group(id) ON DELETE CASCADE,
    
    cpu_limit    DECIMAL(9, 3) NOT NULL, -- in milliseconds (ms) (0.000 -> 999,999.999 = ~16.6 minutes)
    memory_limit DECIMAL(9, 3) NOT NULL, -- in megabytes (MB)
    
    title            TEXT NOT NULL,
    instruction_file TEXT NOT NULL REFERENCES file(id),
    due_date         TIMESTAMPTZ NULL,

    can_submit_after_due BOOLEAN NOT NULL DEFAULT TRUE,

    created_by TEXT NOT NULL REFERENCES auth_user(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ticket (
    id           TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    slug         TEXT NOT NULL UNIQUE,
    user_id      TEXT NOT NULL REFERENCES auth_user(id) ON DELETE CASCADE,
    supporter_id TEXT NULL REFERENCES auth_user(id) ON DELETE CASCADE,
    is_close     BOOLEAN NOT NULL DEFAULT FALSE,

    title       TEXT NOT NULL,
    description TEXT NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ticket ====> message
CREATE TABLE IF NOT EXISTS ticket_message (
    id        TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id TEXT NOT NULL REFERENCES ticket(id) ON DELETE CASCADE,
    user_id   TEXT NOT NULL REFERENCES auth_user(id) ON DELETE CASCADE,
    
    content   TEXT NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS stripe_customer (
    user_id TEXT PRIMARY KEY REFERENCES auth_user(id) ON DELETE CASCADE,
    -- The user's customer ID in Stripe. User must not be able to update this.
    customer_id TEXT NOT NULL
);

-- Products are created and managed in Stripe and synced to our DB via Stripe webhooks.
CREATE TABLE IF NOT EXISTS stripe_product (
    -- Product ID from Stripe, e.g. prod_1234.
    id TEXT PRIMARY KEY,
    -- Whether the product is currently available for purchase.
    active BOOLEAN,
    -- The product's name, meant to be displayable to the customer. Whenever this product is sold via a subscription, name will show up on associated invoice line item descriptions.
    name TEXT,
    -- The product's description, meant to be displayable to the customer. Use this field to optionally store a long form explanation of the product being sold for your own rendering purposes.
    description TEXT,
    -- A URL of the product image in Stripe, meant to be displayable to the customer.
    image TEXT,
    -- Set of key-value pairs, used to store additional information about the object in a structured format.
    metadata JSONB
);

-- Prices are created and managed in Stripe and synced to our DB via Stripe webhooks.
CREATE TYPE PRICING_TYPE AS ENUM ('one_time', 'recurring');
CREATE TYPE PRICING_PLAN_INTERVAL AS ENUM ('day', 'week', 'month', 'year');
CREATE TABLE IF NOT EXISTS stripe_price (
    -- Price ID from Stripe, e.g. price_1234.
    id TEXT PRIMARY KEY,
    -- The ID of the prduct that this price belongs to.
    product_id TEXT REFERENCES stripe_product(id), 
    -- Whether the price can be used for new purchases.
    active BOOLEAN,
    -- A brief description of the price.
    description TEXT,
    -- The unit amount as a positive integer in the smallest currency unit (e.g., 100 cents for US$1.00 or 100 for ¥100, a zero-decimal currency).
    unit_amount BIGINT,
    -- Three-letter ISO currency code, in lowercase.
    currency TEXT check (char_length(currency) = 3),
    -- One of `one_time` or `recurring` depending on whether the price is for a one-time purchase or a recurring (subscription) purchase.
    type PRICING_TYPE,
    -- The frequency at which a subscription is billed. One of `day`, `week`, `month` or `year`.
    interval PRICING_PLAN_INTERVAL,
    -- The number of intervals (specified in the `interval` attribute) between subscription billings. For example, `interval=month` and `interval_count=3` bills every 3 months.
    interval_count INTEGER,
    -- Default number of trial days when subscribing a customer to this price using [`trial_from_plan=true`](https://stripe.com/docs/api#create_subscription-trial_from_plan).
    trial_period_days INTEGER,
    -- Set of key-value pairs, used to store additional information about the object in a structured format.
    metadata JSONB
);

-- Subscriptions are created and managed in Stripe and synced to our DB via Stripe webhooks.
CREATE TYPE SUBSCRIPTION_STATUS AS ENUM ('trialing', 'active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'unpaid', 'paused');
CREATE TABLE IF NOT EXISTS stripe_subscription (
    -- Subscription ID from Stripe, e.g. sub_1234.
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES auth_user(id) NOT NULL,
    -- The status of the subscription object, one of subscription_status type above.
    status SUBSCRIPTION_STATUS,
    -- Set of key-value pairs, used to store additional information about the object in a structured format.
    metadata JSONB,
    -- ID of the price that created this subscription.
    price_id TEXT REFERENCES stripe_price(id),
    -- Quantity multiplied by the unit amount of the price creates the amount of the subscription. Can be used to charge multiple seats.
    quantity INTEGER,
    -- If true the subscription has been canceled by the user and will be deleted at the end of the billing period.
    cancel_at_period_end BOOLEAN,
    -- Time at which the subscription was created.
    created TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('UTC'::TEXT, NOW()) NOT NULL,
    -- Start of the current period that the subscription has been invoiced for.
    current_period_start TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('UTC'::TEXT, NOW()) NOT NULL,
    -- End of the current period that the subscription has been invoiced for. At the end of this period, a new invoice will be created.
    current_period_end TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('UTC'::TEXT, NOW()) NOT NULL,
    -- If the subscription has ended, the timestamp of the date the subscription ended.
    ended_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('UTC'::TEXT, NOW()),
    -- A date in the future at which the subscription will automatically get canceled.
    cancel_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('UTC'::TEXT, NOW()),
    -- If the subscription has been canceled, the date of that cancellation. If the subscription was canceled with `cancel_at_period_end`, `canceled_at` will still reflect the date of the initial cancellation request, not the end of the subscription period when the subscription is automatically moved to a canceled state.
    canceled_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('UTC'::TEXT, NOW()),
    -- If the subscription has a trial, the beginning of that trial.
    trial_start TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('UTC'::TEXT, NOW()),
    -- If the subscription has a trial, the end of that trial.
    trial_end TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('UTC'::TEXT, NOW())
);

ALTER TABLE classroom
  ADD FOREIGN KEY (default_group)
  REFERENCES classroom_group (id);

ALTER TABLE file
  ADD FOREIGN KEY (can_only_access_by_classroom_id)
  REFERENCES classroom (id);

ALTER TABLE file
  ADD FOREIGN KEY (can_only_access_by_group_id)
  REFERENCES classroom_group (id);

ALTER TABLE file
  ADD FOREIGN KEY (can_only_access_by_student_id)
  references auth_user (id);

COMMIT;
