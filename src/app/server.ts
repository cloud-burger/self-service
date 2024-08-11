import logger from '@cloud-burger/logger';
import cors from 'cors';
import express, { Router } from 'express';
import { env } from './env';

import * as bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import swagger from '../../docs/open-api.json';
import { createCustomer } from './handlers/customer/create';
import { findCustomerByDocumentNumber } from './handlers/customer/find-by-document-number';
import { createOrder } from './handlers/order/create-order';
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
router.get('/order', listOrders);
router.post('/order', createOrder);

// Swagger
app.use(bodyParser.json());
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swagger));

app.use(cors());
app.use(express.json());
app.use(router);

app.listen(PORT, () => {
  logger.info({
    message: `App listening on port ${PORT}`,
  });
});
