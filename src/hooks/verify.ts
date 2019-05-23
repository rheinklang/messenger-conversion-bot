import { RequestHandler } from "express";
import { VERIFY_TOKEN } from '../config';

export const verifyWebhook: RequestHandler = (req, res) => {
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    if (mode && token === VERIFY_TOKEN) {
        res.status(200).send(challenge);
    } else {
        res.status(403).send({
            error: "Invalid verification token",
            params: req.query
        });
    }
};
