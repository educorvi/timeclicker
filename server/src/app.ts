import cors from 'cors';
import express, { json, static as staticContent, urlencoded } from 'express';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { errorHandler } from './errorHandler';
import { logger } from './globals';
import { RegisterRoutes } from './generated/routes';
import swaggerDocument from './generated/swagger.json';

export function createApp() {
    const app = express();
    const projectRoot = path
        .resolve(__dirname)
        .split('server')
        .slice(0, -1)
        .join('server');
    const vuePath = path.join(projectRoot, 'client', 'dist');

    // Trust only explicitly configured proxies so client-provided forwarding headers cannot bypass rate limits.
    app.set(
        'trust proxy',
        process.env.TRUST_PROXY
            ? Number.parseInt(process.env.TRUST_PROXY, 10)
            : false
    );
    app.use(
        rateLimit({
            windowMs: 15 * 60 * 1000,
            max: 1000,
            standardHeaders: true,
            legacyHeaders: false,
        })
    );
    app.use(cors());
    app.use(urlencoded({ extended: true }));
    app.use(json());
    RegisterRoutes(app);
    app.get('/api/swagger.json', (_req, res) => res.send(swaggerDocument));
    app.use(staticContent(vuePath));
    app.use(errorHandler);
    app.get(/.*/, (_req, res) => {
        res.sendFile(path.join(vuePath, 'index.html'), (error) => {
            if (error) logger.error(error);
        });
    });

    return app;
}
