import logger from '@cloud-burger/logger';
import cors from 'cors';
import express, { Router } from 'express';
import { env } from './env';
import { createCustomer } from './handlers/customer/create';

const app = express();
const PORT = +env.PORT;

const BASE_PATH = '/app';

const router = Router();

router.post('/customer', createCustomer);

app.use(cors());
app.use(express.json());
app.use(BASE_PATH, router);

app.listen(PORT, () => {
  logger.info({
    message: `App listening on port ${PORT}`,
  });
});
