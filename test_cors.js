import cors from 'cors';
import express from 'express';

const app = express();
const corsOptions = {
  origin: true,
  credentials: true,
};
app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.json({ ok: true });
});

app.listen(3002, () => console.log('started'));
