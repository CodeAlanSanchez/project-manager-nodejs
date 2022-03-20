import dotenv from 'dotenv';

dotenv.config();

import { __prod__, DOMAIN, COOKIE_NAME, SESSION_SECRET } from './config';
import express from 'express';
import session from 'express-session';
import cors from 'cors';

import { createRoutes } from './utils/routing';
import { bugRouter, inviteRouter, projectRouter, userRouter } from './routes';

console.log(__prod__, DOMAIN);

const app = express();

const PORT = process.env.PORT || 4000;

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));

app.use(express.json({ limit: '30mb', strict: true }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));

app.use(
  session({
    name: COOKIE_NAME,
    secret: SESSION_SECRET || '123',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 365,
      httpOnly: true,
      sameSite: 'none',
      secure: false,
      domain: __prod__ ? DOMAIN : undefined,
    },
  })
);

createRoutes(
  [
    { router: userRouter, name: '' },
    { router: projectRouter, name: 'project' },
    { router: bugRouter, name: 'bug' },
    { router: inviteRouter, name: 'invite' },
  ],
  app
);

app.listen(PORT, () => {
  console.log(`Server is ready on port ${PORT}`);
});
