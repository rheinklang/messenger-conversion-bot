import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import serverless from 'serverless-http';

import { verifyWebhook } from './hooks/verify';
import { processHook } from './hooks/process';
import { PRODUCTION } from './config';

const app = express();
const BASE_URL = '/.netlify/functions/api';

// Middleware injection
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Debugging and logging
app.get('*', (req, res, next) => {
    const queryKeys = Object.keys(req.query);

    console.log(
        '%s %s %s %s',
        req.protocol.toUpperCase(),
        req.method.toUpperCase(),
        req.path.replace(BASE_URL, ''),
        queryKeys.length > 0 ? queryKeys.join(', ') : ''
    );

    next();
})

app.get('/', (req, res) => {
    res.json({
        hello: "world"
    });
});

// Verification endpoint
app.get(`/.netlify/functions/api/verify`, verifyWebhook);
app.get(`/verify`, verifyWebhook);

// Processing endpoint
app.post(`/.netlify/functions/api/verify`, processHook);

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log('Error middleware: %s', err.message);
    res.status(500).json({
        error: err.message,
        url: req.url
    });

    next(err);
});

export const handler = serverless(app);
export default app;