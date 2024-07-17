-- cria banco de dados
CREATE DATABASE self_service;

-- conecta no banco criado
\c self_service;

-- cria schema default
CREATE SCHEMA IF NOT EXISTS public;

-- define schema criado como padrão
SET search_path TO public;

-- criação da tabela customers
CREATE TABLE IF NOT EXISTS customers (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    document_number VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100) NOT NULL,
    status VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL, 
    updated_at TIMESTAMP NOT NULL
)
