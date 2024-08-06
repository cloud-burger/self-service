import logger from '@cloud-burger/logger';
import cors from 'cors';
import express, { Router } from 'express';
import { env } from './env';

import { createCustomer } from './handlers/customer/create';
import { findCustomerByDocumentNumber } from './handlers/customer/find-by-document-number';
import { createProduct } from './handlers/order/create-product';
import { deleteProduct } from './handlers/order/delete-product';
import { findProductsByCategory } from './handlers/order/find-products-by-category';
import { listOrders } from './handlers/order/list-orders';
import { updateProduct } from './handlers/order/update-product';

const app = express();
const PORT = +env.PORT;

const router = Router();

// Customer
router.post('/customer', createCustomer);
router.get('/customer/:documentNumber', findCustomerByDocumentNumber);

// Product
router.get('/product/:category', findProductsByCategory);
router.post('/product', createProduct);
router.put('/product/:id', updateProduct);
router.delete('/product/:id', deleteProduct);

// Orders
router.get('/orders', listOrders);

app.use(cors());
app.use(express.json());
app.use(router);

app.listen(PORT, () => {
  logger.info({
    message: `App listening on port ${PORT}`,
  });
});
