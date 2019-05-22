import express from 'express';
import bodyParser from 'body-parser';
import serverless from 'serverless-http';

import { verifyWebhook } from './hooks/verify';
import { processHook } from './hooks/process';

const app = express();
const router = express.Router();

// Middleware injection
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Verification endpoint
router.get('/api/v1/hook/verify', verifyWebhook);

// Processing endpoint
router.post('/api/v1/hook/process', processHook);

// Path must route to a lambda
app.use('/.netlify/functions/server', router);

export const handler = serverless(app);
export default app;