CREATE TABLE "ClientUser" (
    client_id SERIAL PRIMARY KEY,
    client_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    billing_address VARCHAR(100) NOT NULL
);

CREATE TABLE "User" (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(30) NOT NULL UNIQUE,
    password_hash BYTEA NOT NULL,
    client_id INT NOT NULL REFERENCES "ClientUser"(client_id) ON DELETE CASCADE
);

CREATE TABLE "Category" (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL
);

CREATE TABLE "Product" (
    product_id SERIAL PRIMARY KEY,
    product_name VARCHAR(50) NOT NULL,
    description VARCHAR(1000) NOT NULL,
    image_url VARCHAR(1000),
    stock INT NOT NULL DEFAULT 0 CHECK (stock > -1),
    total_purchases BIGINT NOT NULL DEFAULT 0,
    unit_price DOUBLE PRECISION NOT NULL CHECK (unit_price > -1),
    supplier_id INT NOT NULL REFERENCES "ClientUser"(client_id),
    category_id INT NOT NULL REFERENCES "Category"(category_id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "OrderState" (
    state_id SERIAL PRIMARY KEY,
    state_name VARCHAR(50) NOT NULL
);

CREATE TABLE "Order" (
    order_id SERIAL PRIMARY KEY,
    client_id INT NOT NULL REFERENCES "ClientUser"(client_id),
    supplier_id INT NOT NULL REFERENCES "ClientUser"(client_id),
    total_cost DOUBLE PRECISION NOT NULL DEFAULT 0 CHECK (total_cost > -1),
    purchase_date DATE NOT NULL DEFAULT CURRENT_DATE,
    delivery_date DATE NOT NULL DEFAULT CURRENT_DATE + 5,
    state_id INT NOT NULL REFERENCES "OrderState"(state_id) DEFAULT 1
);

CREATE TABLE "OrderStateUpdate" (
    order_id SERIAL PRIMARY KEY,
    original_state_id INT NOT NULL REFERENCES "OrderState"(state_id),
    new_state_id INT NOT NULL REFERENCES "OrderState"(state_id),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "ProductOrder" (
    product_id INT NOT NULL REFERENCES "Product"(product_id),
    order_id INT NOT NULL REFERENCES "Order"(order_id),
    amount INT NOT NULL CHECK (amount > 0)
);

INSERT INTO "ClientUser"(client_id, client_name, email, phone_number, billing_address) VALUES ('0', 'None', 'None', 'None', 'None');
INSERT INTO "OrderState"(state_name) VALUES ('Confirmed'), ('Dispatched'), ('Delivered'), ('Canceled');