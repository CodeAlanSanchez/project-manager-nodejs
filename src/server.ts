import { __prod__, DOMAIN, COOKIE_NAME } from './config';
import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';

import { createRoutes } from './utils/routing';
import { bugRouter, projectRouter, userRouter } from './routes';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 4000;

app.use(express.json({ limit: '30mb', strict: true }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));

app.use(
  session({
    name: COOKIE_NAME,
    secret: process.env.SECRET || '123',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 365,
      httpOnly: true,
      sameSite: 'lax',
      secure: __prod__,
      domain: __prod__ ? DOMAIN : undefined,
    },
  })
);

createRoutes(
  [
    { router: userRouter, name: '' },
    { router: projectRouter, name: 'project' },
    { router: bugRouter, name: 'bug' },
  ],
  app
);

app.listen(PORT, () => {
  console.log(`Server is ready on port ${PORT}`);
});
