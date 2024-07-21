import logger from '@cloud-burger/logger';
import cors from 'cors';
import express, { Router } from 'express';
import { env } from './env';

import { createCustomer } from './handlers/customer/create';
import { findCustomerByDocumentNumber } from './handlers/customer/find-by-document-number';
import { createProduct } from './handlers/order/create-product';

const app = express();
const PORT = +env.PORT;

const BASE_PATH = '/app';

const router = Router();

// Customer
router.post('/customer', createCustomer);
router.get('/customer/:documentNumber', findCustomerByDocumentNumber);

// Product
router.post('/product', createProduct);

app.use(cors());
app.use(express.json());
app.use(BASE_PATH, router);

app.listen(PORT, () => {
  logger.info({
    message: `App listening on port ${PORT}`,
  });
});
