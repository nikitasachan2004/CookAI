import express from 'express';
import { authRouter } from './server/auth/routes.js';
const app = express();
app.use((req, res, next) => { console.log(req.method, req.url); next(); });
app.use('/api/auth', authRouter);
app.use((req, res) => { res.status(404).send('Not found'); });
app.listen(3002, () => console.log('started on 3002'));
