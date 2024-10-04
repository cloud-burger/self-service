import Joi from 'joi';
import process from 'node:process';

interface EnvSchemaProps {
  PORT: string;
  DATABASE_USERNAME: string;
  DATABASE_NAME: string;
  DATABASE_PASSWORD: string;
  DATABASE_PORT: string;
  DATABASE_HOST: string;
  DATABASE_CONNECTION_TIMEOUT: string;
  NOTIFICATION_WEBHOOK: string;
  MERCADO_PAGO_URL: string;
  MERCADO_PAGO_API_TOKEN: string;
  MERCADO_PAGO_USER_ID: string;
}

export const envSchema = Joi.object({
  PORT: Joi.string().required(),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_PORT: Joi.string().required(),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_CONNECTION_TIMEOUT: Joi.string().required(),
  NOTIFICATION_WEBHOOK: Joi.string().required(),
  MERCADO_PAGO_URL: Joi.string().required(),
  MERCADO_PAGO_API_TOKEN: Joi.string().required(),
  MERCADO_PAGO_USER_ID: Joi.string().required(),
});

const { value } = envSchema.validate(process.env);

export const env = value as EnvSchemaProps;
