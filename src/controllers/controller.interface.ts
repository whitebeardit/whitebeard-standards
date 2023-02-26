/* eslint-disable import/no-extraneous-dependencies */
import { Router } from 'express';

export interface IController {
  getRoutes(): Router;
}
