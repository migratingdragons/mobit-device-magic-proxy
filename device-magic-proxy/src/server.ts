import express from 'express';
import bodyParser from 'body-parser';
import { processRequest } from './app';
import { Event } from './types';

const app = express();
app.use(bodyParser.json());

app.post('/proxy', async (req, res) => {
    const event: Event = { body: req.body };
    const result = await processRequest(event);
    res.status(result.statusCode).json(JSON.parse(result.body));
});

const listener = app.listen(process.env.PORT, () => {
    console.log("Your app is listening on port " + (listener.address() as any).port);
});
