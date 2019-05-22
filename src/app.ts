import express from 'express';
import bodyParser from 'body-parser';

// hooks
import { verifyWebhook } from './hooks/verify';
import { PRODUCTION } from './config';

const app = express();
const port = PRODUCTION ? 80 : 9003;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Verification endpoint
app.get('/api/v1/hook/verify', verifyWebhook);

app.post('/api/v1/hook/process', (req, res) => {
    // Parse the request body from the POST
    let body = req.body;

    // Check the webhook event is from a Page subscription
    if (body.object === 'page') {

        // Iterate over each entry - there may be multiple if batched
        body.entry.forEach((entry: { messaging: any[] }) => {

            // Get the webhook event. entry.messaging is an array, but 
            // will only ever contain one event, so we get index 0
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);

        });

        // Return a '200 OK' response to all events
        res.status(200).send('EVENT_RECEIVED');

    } else {
        // Return a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
});

// Start server
app.listen(port, () => {
    console.log('Server listening on port %s in %s mode ...', port, PRODUCTION ? "production" : "development");
});