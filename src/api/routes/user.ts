import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { celebrate, Joi } from 'celebrate';
import { Logger } from 'winston';
import { resetPwdInput } from '../../interfaces/IUser';
import middlewares from '../middlewares';
import UserService from '../../services/user';

const route = Router();

export default (app: Router) => {
  app.use('/user', route);

  //Reset Password
  route.post(
    '/resetpwd',
    celebrate({
      body: Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
        newpassword: Joi.string().required(),
      }),
    }),
    middlewares.isAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      const logger:Logger = Container.get('logger');
      logger.debug('Calling Reset Password endpoint with body: %o', req.body );
      try {
        const authServiceInstance = Container.get(UserService);
        const result = await authServiceInstance.updatePassword(req.body as resetPwdInput);
        return res.status(201).json(result);
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );

  route.post(
    '/delete',
    celebrate({
      body: Joi.object({
        id: Joi.string().required()
      }),
    }),
    middlewares.isAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      const logger:Logger = Container.get('logger');
      logger.debug('Calling Sign-Up endpoint with body: %o', req.body );
      try {
        const authServiceInstance = Container.get(UserService);
        const result = await authServiceInstance.deleteUser(req.body.id);
        return res.status(201).json(result);
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );

};