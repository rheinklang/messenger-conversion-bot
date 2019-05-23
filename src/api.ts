import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import serverless from 'serverless-http';

import { verifyWebhook } from './hooks/verify';
import { processHook } from './hooks/process';
import { PRODUCTION } from './config';

const api = express();
const BASE_URL = '/.netlify/functions/api';

// Middleware injection
api.use(cors());
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: true }));

// Debugging and logging
api.get('*', (req, res, next) => {
    const queryKeys = Object.keys(req.query);

    console.log(
        '%s %s %s ?%s',
        req.protocol.toUpperCase(),
        req.method.toUpperCase(),
        req.path.replace(BASE_URL, ''),
        queryKeys.length > 0 ? queryKeys.join(',') : ''
    );

    next();
})

// Index access is forbidden, reject call directly
api.get('/', (req, res) => {
    res.sendStatus(403);
});

// Verification endpoint
api.get(`/.netlify/functions/api/webhook`, verifyWebhook);
api.get(`/webhook`, verifyWebhook);

// Processing endpoint
api.post(`/.netlify/functions/api/webhook`, processHook);
api.post(`/webhook`, processHook);

// Error handler
api.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).json({
        error: err.message,
        url: req.url
    });

    next(err);
});

// Lambda export for netlify
export const handler = serverless(api);

// Local development only
export default api;