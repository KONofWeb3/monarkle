import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { authRouter } from './routes/auth.routes.js';
import { householdRouter } from './routes/household.routes.js';
import { pspRouter } from './routes/psp.routes.js';
import { collectorRouter } from './routes/collector.routes.js';
import { adminRouter } from './routes/admin.routes.js';
import { errorHandler, notFoundHandler } from './lib/errors.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true, service: 'monarkle-api' }));

app.use('/auth', authRouter);
app.use('/household', householdRouter);
app.use('/psp', pspRouter);
app.use('/collector', collectorRouter);
app.use('/admin', adminRouter);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = Number(process.env.PORT ?? 4000);
app.listen(PORT, () => {
  console.log(`MONARKLE API listening on http://localhost:${PORT}`);
});
