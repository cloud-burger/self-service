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
    image VARCHAR(1000),
    created_at TIMESTAMP NOT NULL, 
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT products_pk PRIMARY KEY (id)
);

-- criação de index category na tabela products
CREATE INDEX IF NOT EXISTS products_category_index ON public.products using btree (category);

-- criação da tabela orders
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(100),
    number SERIAL UNIQUE,
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
    notes VARCHAR(100),
    PRIMARY KEY (order_id, product_id),
    FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE
);

-- criação da tabela payments
CREATE TABLE IF NOT EXISTS payments (
    id VARCHAR(100),
    amount NUMERIC NOT NULL,
    order_id VARCHAR(100),
    emv VARCHAR(300) NOT NULL,
    external_id NUMERIC,
    status VARCHAR(30) NOT NULL,
    created_at TIMESTAMP NOT NULL, 
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT payments_pk PRIMARY KEY (id),
    FOREIGN KEY (order_id) REFERENCES public.orders(id)
);

-- customers
INSERT INTO customers VALUES('5c1c5144-be00-4f01-8853-2f37cca74465', 'João Silva', '12345678900', 'joao.silva@example.com', now(), now());
INSERT INTO customers VALUES('982ad0de-eb12-47f9-8cd1-8e2055d7f87a', 'Carlos Souza', '34567890122', 'carlos.souza@example.com', now(), now());
INSERT INTO customers VALUES('bba39fad-9d9b-4802-823f-8ce288175cc3', 'Ana Costa', '45678901233', 'ana.costa@example.com', now(), now());
INSERT INTO customers VALUES('1cd903f5-eb34-4d0a-84f0-8b6e9875fd8f', 'Fernanda Rocha', '67890123455', 'fernanda.rocha@example.com', now(), now());
INSERT INTO customers VALUES('8627cac5-852c-4691-8663-a7b839b383a5', 'Ricardo Almeida', '78901234566', 'ricardo.almeida@example.com', now(), now());
INSERT INTO customers VALUES('b95167f0-6375-4fff-8366-b6326ac6e636', 'Luciana Pereira', '89012345677', 'luciana.pereira@example.com', now(), now());
INSERT INTO customers VALUES('acb1c279-7f77-4d4c-9709-d6c4b51aba90', 'Rafael Santos', '90123456788', 'rafael.santos@example.com', now(), now());
INSERT INTO customers VALUES('23ecc2e3-45fd-48ba-8369-9ca94ea8ec71', 'Camila Martins', '01234567899', 'camila.martins@example.com', now(), now());

-- products
INSERT INTO products VALUES('bee3e0c8-be36-4f7d-bc6f-2440dccd0d89', 'Cheeseburger', 'BURGER', 'Delicioso cheeseburger com alface, tomate e molho especial.', 15.99, null, now(), now());
INSERT INTO products VALUES('c3dd096a-485a-46f6-9243-11501733a36f', 'Hambúrguer de Frango', 'BURGER', 'Hambúrguer de frango grelhado com maionese e salada.', 13.50, null, now(), now());
INSERT INTO products VALUES('847f8247-32e4-473b-8dc8-afec9b93ae22', 'Hambúrguer Vegano', 'BURGER', 'Hambúrguer vegano com cogumelos, alface e molho de tahine.', 14.00, null, now(), now());
INSERT INTO products VALUES('cc6eb804-bf6e-421c-87ac-8da5e03b6e5f', 'Bacon Burger', 'BURGER', 'Hambúrguer com bacon crocante, queijo cheddar e molho barbecue.', 17.50, null, now(), now());
INSERT INTO products VALUES('ac8f589b-ba83-4207-912a-88eec233614e', 'X-Salada', 'BURGER', 'Hambúrguer com queijo, alface, tomate e maionese.', 12.99, null, now(), now());
INSERT INTO products VALUES('69fff21c-972e-4d59-8395-252f83b9a534', 'Bolo de Chocolate', 'DESSERT', 'Bolo de chocolate úmido com cobertura cremosa de chocolate.', 7.50, null, now(), now());
INSERT INTO products VALUES('3109a581-9967-4f6a-84cb-23335edf8cc1', 'Sorvete de Baunilha', 'DESSERT', 'Sorvete cremoso de baunilha feito com favas de baunilha reais.', 5.00, null, now(), now());
INSERT INTO products VALUES('9de2e56e-103f-4795-b698-b616d5f5f13c', 'Brownie', 'DESSERT', 'Brownie de chocolate intenso com pedaços de nozes.', 6.00, null, now(), now());
INSERT INTO products VALUES('b1e06711-4a19-4e51-9f69-7876b6634dd2', 'Pudim de Leite', 'DESSERT', 'Pudim de leite condensado com calda de caramelo.', 4.50, null, now(), now());
INSERT INTO products VALUES('ea27f30b-062b-4238-8c4c-e7f8fd309fa6', 'Torta de Limão', 'DESSERT', 'Torta de limão com cobertura de merengue.', 5.50, null, now(), now());
INSERT INTO products VALUES('5c6d0d64-b3f0-4513-88dc-ef9bf24e4cd8', 'Milkshake de Morango', 'DRINK', 'Milkshake cremoso de morango feito com frutas frescas.', 8.00, null, now(), now());
INSERT INTO products VALUES('8d4e85d3-0176-40b5-a4c1-0b2783d87acd', 'Suco de Laranja', 'DRINK', 'Suco de laranja natural e refrescante.', 4.00, null, now(), now());
INSERT INTO products VALUES('372cd3a3-0897-4fc5-aced-213fec203ee4', 'Refrigerante', 'DRINK', 'Refrigerante gelado de cola.', 3.50, null, now(), now());
INSERT INTO products VALUES('663f97cc-c8b8-4887-8a56-b7ac06716b39', 'Chá Gelado', 'DRINK', 'Chá gelado de limão.', 3.99, null, now(), now());
INSERT INTO products VALUES('717632f7-f947-46e8-9828-e2aa59742b01', 'Café', 'DRINK', 'Café quente e aromático.', 2.50, null, now(), now());
INSERT INTO products VALUES('5500c5df-a754-44a7-82d6-ca7fe3803733', 'Batata Frita', 'SIDE', 'Batatas fritas crocantes com molho de ketchup.', 5.00, null, now(), now());
INSERT INTO products VALUES('5af4ccb8-dda3-4228-b703-6a2386ad9559', 'Anéis de Cebola', 'SIDE', 'Anéis de cebola empanados e fritos.', 6.00, null, now(), now());
INSERT INTO products VALUES('4d4cd844-eb18-4e39-b57a-9ab7951a4548', 'Salada Caesar', 'SIDE', 'Salada Caesar com alface, croutons e molho especial.', 7.50, null, now(), now());
INSERT INTO products VALUES('7077641f-036b-4fa7-9dd2-cd4f4985dc60', 'Mozzarella Sticks', 'SIDE', 'Palitos de mussarela empanados e fritos.', 8.00, null, now(), now());
INSERT INTO products VALUES('60868805-bf67-4e8f-8d04-ac0ff94f009c', 'Salada de Frutas', 'SIDE', 'Salada de frutas frescas da estação.', 6.50, null, now(), now());

-- orders
INSERT INTO orders (id, amount, customer_id, status, created_at, updated_at) VALUES('1376c2b4-74bd-477c-8f44-7cc593e8c734', 45.48, '5c1c5144-be00-4f01-8853-2f37cca74465', 'RECEIVED', now(), now());
INSERT INTO orders (id, amount, customer_id, status, created_at, updated_at) VALUES('a0aad9ce-35ea-43a6-b3e8-ac8d63943fd7', 32.50, null, 'PREPARING', now(), now());
INSERT INTO orders (id, amount, customer_id, status, created_at, updated_at) VALUES('52541b29-b267-4ec7-a311-a4ed5cd087af', 19.50, '982ad0de-eb12-47f9-8cd1-8e2055d7f87a', 'PREPARING', now(), now());
INSERT INTO orders (id, amount, customer_id, status, created_at, updated_at) VALUES('7aa7bc1a-5e31-420f-867c-72f5ba460e35', 16.00, 'bba39fad-9d9b-4802-823f-8ce288175cc3', 'RECEIVED', now(), now());
INSERT INTO orders (id, amount, customer_id, status, created_at, updated_at) VALUES('c53c89b6-2459-421d-9a91-9e9e89aee932', 31.00, null, 'DONE', now(), now());
INSERT INTO orders (id, amount, customer_id, status, created_at, updated_at) VALUES('6489d886-987f-406b-be43-204bf79e5de2', 84.48, '1cd903f5-eb34-4d0a-84f0-8b6e9875fd8f', 'DONE', now(), now());
INSERT INTO orders (id, amount, customer_id, status, created_at, updated_at) VALUES('063289a6-cd2f-4be0-baaa-7f2132a5a9bf', 23.50, '8627cac5-852c-4691-8663-a7b839b383a5', 'FINISHED', now(), now());
INSERT INTO orders (id, amount, customer_id, status, created_at, updated_at) VALUES('9cdb3b16-f115-43aa-9b4b-05c0de1007eb', 24.00, 'b95167f0-6375-4fff-8366-b6326ac6e636', 'FINISHED', now(), now());
INSERT INTO orders (id, amount, customer_id, status, created_at, updated_at) VALUES('1deda162-6c13-407d-bbff-68e4ee7ea401', 64.99, 'acb1c279-7f77-4d4c-9709-d6c4b51aba90', 'FINISHED', now(), now());
INSERT INTO orders (id, amount, customer_id, status, created_at, updated_at) VALUES('849df40b-877c-4f80-9083-cd02d5f04605', 40.98, '23ecc2e3-45fd-48ba-8369-9ca94ea8ec71', 'DONE', now(), now());

-- order products
INSERT INTO orders_products VALUES('1376c2b4-74bd-477c-8f44-7cc593e8c734', 'c3dd096a-485a-46f6-9243-11501733a36f', 1, null);
INSERT INTO orders_products VALUES('1376c2b4-74bd-477c-8f44-7cc593e8c734', 'bee3e0c8-be36-4f7d-bc6f-2440dccd0d89', 2, null);
INSERT INTO orders_products VALUES('a0aad9ce-35ea-43a6-b3e8-ac8d63943fd7', '69fff21c-972e-4d59-8395-252f83b9a534', 3, null);
INSERT INTO orders_products VALUES('a0aad9ce-35ea-43a6-b3e8-ac8d63943fd7', '3109a581-9967-4f6a-84cb-23335edf8cc1', 2, null);
INSERT INTO orders_products VALUES('52541b29-b267-4ec7-a311-a4ed5cd087af', '5c6d0d64-b3f0-4513-88dc-ef9bf24e4cd8', 1, null);
INSERT INTO orders_products VALUES('52541b29-b267-4ec7-a311-a4ed5cd087af', '8d4e85d3-0176-40b5-a4c1-0b2783d87acd', 2, null);
INSERT INTO orders_products VALUES('52541b29-b267-4ec7-a311-a4ed5cd087af', '372cd3a3-0897-4fc5-aced-213fec203ee4', 1, null);
INSERT INTO orders_products VALUES('7aa7bc1a-5e31-420f-867c-72f5ba460e35', '5500c5df-a754-44a7-82d6-ca7fe3803733', 2, null);
INSERT INTO orders_products VALUES('7aa7bc1a-5e31-420f-867c-72f5ba460e35', '5af4ccb8-dda3-4228-b703-6a2386ad9559', 1, null);
INSERT INTO orders_products VALUES('c53c89b6-2459-421d-9a91-9e9e89aee932', '4d4cd844-eb18-4e39-b57a-9ab7951a4548', 2, null);
INSERT INTO orders_products VALUES('c53c89b6-2459-421d-9a91-9e9e89aee932', '7077641f-036b-4fa7-9dd2-cd4f4985dc60', 2, null);
INSERT INTO orders_products VALUES('6489d886-987f-406b-be43-204bf79e5de2', 'bee3e0c8-be36-4f7d-bc6f-2440dccd0d89', 2, null);
INSERT INTO orders_products VALUES('6489d886-987f-406b-be43-204bf79e5de2', 'cc6eb804-bf6e-421c-87ac-8da5e03b6e5f', 3, null);
INSERT INTO orders_products VALUES('063289a6-cd2f-4be0-baaa-7f2132a5a9bf', '69fff21c-972e-4d59-8395-252f83b9a534', 1, null);
INSERT INTO orders_products VALUES('063289a6-cd2f-4be0-baaa-7f2132a5a9bf', '3109a581-9967-4f6a-84cb-23335edf8cc1', 2, null);
INSERT INTO orders_products VALUES('063289a6-cd2f-4be0-baaa-7f2132a5a9bf', '9de2e56e-103f-4795-b698-b616d5f5f13c', 1, null);
INSERT INTO orders_products VALUES('9cdb3b16-f115-43aa-9b4b-05c0de1007eb', '5c6d0d64-b3f0-4513-88dc-ef9bf24e4cd8', 2, null);
INSERT INTO orders_products VALUES('9cdb3b16-f115-43aa-9b4b-05c0de1007eb', '8d4e85d3-0176-40b5-a4c1-0b2783d87acd', 2, null);
INSERT INTO orders_products VALUES('1deda162-6c13-407d-bbff-68e4ee7ea401', 'bee3e0c8-be36-4f7d-bc6f-2440dccd0d89', 1, null);
INSERT INTO orders_products VALUES('1deda162-6c13-407d-bbff-68e4ee7ea401', '847f8247-32e4-473b-8dc8-afec9b93ae22', 1, null);
INSERT INTO orders_products VALUES('1deda162-6c13-407d-bbff-68e4ee7ea401', 'cc6eb804-bf6e-421c-87ac-8da5e03b6e5f', 2, null);
INSERT INTO orders_products VALUES('849df40b-877c-4f80-9083-cd02d5f04605', 'ac8f589b-ba83-4207-912a-88eec233614e', 2, null);
INSERT INTO orders_products VALUES('849df40b-877c-4f80-9083-cd02d5f04605', '69fff21c-972e-4d59-8395-252f83b9a534', 3, null);

INSERT INTO public.payments VALUES('4c75c2df-f5d4-4f45-b35b-390e9d52d5b7', 45.48, '1376c2b4-74bd-477c-8f44-7cc593e8c734', '00020101021243650016COM.MERCADOLIBRE020130636d2d2370b-8f44-46bd-9f81-7ec48a63c63c5204000053039865802BR5909Test Test6009SAO PAULO62070503***6304D55C', 1234556, 'PAID', now(), now());
INSERT INTO public.payments VALUES('85e3a35c-1ecb-4ed5-b599-8b39a5118f39', 32.50, 'a0aad9ce-35ea-43a6-b3e8-ac8d63943fd7', '00020101021243650016COM.MERCADOLIBRE020130636d2d2370b-8f44-46bd-9f81-7ec48a63c63c5204000053039865802BR5909Test Test6009SAO PAULO62070503***6304D55C', 1234557, 'PAID', now(), now());
INSERT INTO public.payments VALUES('ee379546-6b28-486c-bfbe-fcb656baca56', 19.50, '52541b29-b267-4ec7-a311-a4ed5cd087af', '00020101021243650016COM.MERCADOLIBRE020130636d2d2370b-8f44-46bd-9f81-7ec48a63c63c5204000053039865802BR5909Test Test6009SAO PAULO62070503***6304D55C', 1234558, 'PAID', now(), now());
INSERT INTO public.payments VALUES('1a8597df-d8a2-47ce-9c4a-d014ec9036e7', 16.00, '7aa7bc1a-5e31-420f-867c-72f5ba460e35', '00020101021243650016COM.MERCADOLIBRE020130636d2d2370b-8f44-46bd-9f81-7ec48a63c63c5204000053039865802BR5909Test Test6009SAO PAULO62070503***6304D55C', 1234559, 'PAID', now(), now());
INSERT INTO public.payments VALUES('e9df5ea8-2781-4345-b0f6-dc599881541d', 31.00, 'c53c89b6-2459-421d-9a91-9e9e89aee932', '00020101021243650016COM.MERCADOLIBRE020130636d2d2370b-8f44-46bd-9f81-7ec48a63c63c5204000053039865802BR5909Test Test6009SAO PAULO62070503***6304D55C', 1234551, 'PAID', now(), now());
INSERT INTO public.payments VALUES('57a21737-10e4-4f23-962e-28845f529500', 84.48, '6489d886-987f-406b-be43-204bf79e5de2', '00020101021243650016COM.MERCADOLIBRE020130636d2d2370b-8f44-46bd-9f81-7ec48a63c63c5204000053039865802BR5909Test Test6009SAO PAULO62070503***6304D55C', 1234552, 'PAID', now(), now());
INSERT INTO public.payments VALUES('1f15a7d3-3c6f-4836-bcb6-d5827b854dfb', 23.50, '063289a6-cd2f-4be0-baaa-7f2132a5a9bf', '00020101021243650016COM.MERCADOLIBRE020130636d2d2370b-8f44-46bd-9f81-7ec48a63c63c5204000053039865802BR5909Test Test6009SAO PAULO62070503***6304D55C', 1234553, 'PAID', now(), now());
INSERT INTO public.payments VALUES('c0cd450e-11cb-4b7c-935c-41092c819ac5', 24.00, '9cdb3b16-f115-43aa-9b4b-05c0de1007eb', '00020101021243650016COM.MERCADOLIBRE020130636d2d2370b-8f44-46bd-9f81-7ec48a63c63c5204000053039865802BR5909Test Test6009SAO PAULO62070503***6304D55C', 1234554, 'PAID', now(), now());
INSERT INTO public.payments VALUES('30090dd9-ac43-41de-8ad4-0b909f9f588e', 64.99, '1deda162-6c13-407d-bbff-68e4ee7ea401', '00020101021243650016COM.MERCADOLIBRE020130636d2d2370b-8f44-46bd-9f81-7ec48a63c63c5204000053039865802BR5909Test Test6009SAO PAULO62070503***6304D55C', 1234555, 'PAID', now(), now());
INSERT INTO public.payments VALUES('fe205443-eddd-4e7c-aabe-7a47f5fc071b', 40.98, '849df40b-877c-4f80-9083-cd02d5f04605', '00020101021243650016COM.MERCADOLIBRE020130636d2d2370b-8f44-46bd-9f81-7ec48a63c63c5204000053039865802BR5909Test Test6009SAO PAULO62070503***6304D55C', 1234521, 'PAID', now(), now());