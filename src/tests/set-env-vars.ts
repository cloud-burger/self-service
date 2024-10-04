import * as process from 'node:process';

process.env.PORT = '3000';
process.env.DATABASE_USERNAME = 'user';
process.env.DATABASE_NAME = 'self-service';
process.env.DATABASE_PASSWORD = 'senha123';
process.env.DATABASE_PORT = '3001';
process.env.DATABASE_HOST = 'http://localhost/db';
process.env.DATABASE_CONNECTION_TIMEOUT = '100000';
process.env.NOTIFICATION_WEBHOOK = 'http://localhost:9000';
process.env.MERCADO_PAGO_URL = 'https://api.mercadopago.com';
process.env.MERCADO_PAGO_API_TOKEN = 'APP_USR-7785106356073680-091816-d1c29245fbb399a70031428b1c22463c-1995444195';
process.env.MERCADO_PAGO_USER_ID = '1995444195';
