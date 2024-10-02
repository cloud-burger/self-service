import logger from '@cloud-burger/logger';
import cors from 'cors';
import express, { Router } from 'express';
import { env } from './env';

import * as bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import swagger from '../../docs/open-api.json';
import { createCustomer } from './handlers/customer/create';
import { findCustomerByDocumentNumber } from './handlers/customer/find-by-document-number';
import { createOrder } from './handlers/order/create';
import { listOrders } from './handlers/order/list';
import { createProduct } from './handlers/order/product/create';
import { deleteProduct } from './handlers/order/product/delete';
import { findProductsByCategory } from './handlers/order/product/find-by-category';
import { updateProduct } from './handlers/order/product/update';
import { updateOrderStatus } from './handlers/order/update-status';
import { createPayment } from './handlers/payment/create';
import { paymentReceiver } from '~/gateways/http/mercado-pago/webhook/mercado-pago-webhook';

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
router.put('/order/:id', updateOrderStatus);

router.post('/payment/:orderId', createPayment);
router.post('/webhook', paymentReceiver);

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
