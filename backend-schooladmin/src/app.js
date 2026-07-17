import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes/index.js';
import { corsOptions } from './config/cors.js';
import { notFoundHandler, errorHandler } from './middlewares/errorHandler.js';
import { env } from './config/env.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.set('trust proxy', 1);
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.nodeEnv === 'development' ? 'dev' : 'combined'));

// Static serving for uploaded license documents
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/api/v1', routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
