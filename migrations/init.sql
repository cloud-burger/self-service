-- cria banco de dados
CREATE DATABASE self_service;

-- conecta no banco criado
\c self_service;

-- define schema como padrão
SET search_path TO public;

-- criação da tabela customers
CREATE TABLE IF NOT EXISTS customers (
    id VARCHAR(100),
    name VARCHAR(100) NOT NULL,
    document_number VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP NOT NULL, 
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT customers_pk PRIMARY KEY (id)
);

-- criação de index document number na tabela customers
CREATE INDEX IF NOT EXISTS customers_document_number_index ON public.customers using btree (document_number);

-- criação da tabela products
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(100),
    name VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description VARCHAR(200) NOT NULL,
    amount NUMERIC NOT NULL,
    image BYTEA,
    created_at TIMESTAMP NOT NULL, 
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT products_pk PRIMARY KEY (id)
);

-- criação de index category na tabela products
CREATE INDEX IF NOT EXISTS products_category_index ON public.products using btree (category);

-- criação da tabela orders
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(100),
    amount NUMERIC NOT NULL,
    customer_id VARCHAR(100),
    status VARCHAR(30) NOT NULL,
    created_at TIMESTAMP NOT NULL, 
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT orders_pk PRIMARY KEY (id),
    FOREIGN KEY (customer_id) REFERENCES public.customers(id)
);

-- criação da tabela orders_products
CREATE TABLE IF NOT EXISTS orders_products (
    order_id VARCHAR(100),
    product_id VARCHAR(100),
    quantity NUMERIC NOT NULL,
    PRIMARY KEY (order_id, product_id),
    FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE
);