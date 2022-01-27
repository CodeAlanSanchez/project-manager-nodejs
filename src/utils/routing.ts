import { Router } from 'express';

type input = {
  router: Router;
  name: any;
}

export const createRoutes = (items: input[], app: any) => {
  items.map((item: any) => app.use(`/api/${item.name}`, item.router));
};
