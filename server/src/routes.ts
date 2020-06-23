import express from 'express';
import { storeValidator } from './validators/PointsValidator';

import multer from 'multer';
import multerConfig from './config/multer';

import PointsController from './controllers/PointsController';
import ItemsController from './controllers/ItemsController';

const routes = express.Router();
const upload = multer(multerConfig);

const pointsController = new PointsController;
const itemsController = new ItemsController;

routes.get('/items', itemsController.index);
routes.get('/points', pointsController.index);
routes.get('/points/:id', pointsController.show);

routes.post(
  '/points',
  upload.single('image'),
  storeValidator,
  pointsController.create,
);

export default routes;

//Service-Pattern
//Repository-Pattern-(Data-Mapper)