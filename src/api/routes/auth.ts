import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import AuthService from '../../services/auth';
import { celebrate, Joi } from 'celebrate';
import { Logger } from 'winston';
import { IUserInputDTO } from '../../interfaces/IUser';
import middlewares from '../middlewares';

const route = Router();

export default (app: Router) => {
  app.use('/auth', route);

  //Sign up
  route.post(
    '/signup',
    celebrate({
      body: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      const logger:Logger = Container.get('logger');
      logger.debug('Calling Sign-Up endpoint with body: %o', req.body );
      try {
        const authServiceInstance = Container.get(AuthService);
        const result = await authServiceInstance.SignUp(req.body as IUserInputDTO);
        return res.status(200).json(result);
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );

  // Sign in
  route.post(
    '/signin',
    celebrate({
      body: Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { email, password } = req.body;
        const authServiceInstance = Container.get(AuthService);
        const result = await authServiceInstance.SignIn(email, password);
        return res.json(result).status(200);
      } catch (e) {
        // logger.error('🔥 error: %o',  e );
        return next(e);
      }
    },
  );

  // Log out function - We try to get the token from the header first using the middlewares
  route.post('/logout', middlewares.isAuth, (req: Request, res: Response, next: NextFunction) => {
    // const logger:Logger = Container.get('logger');
    // logger.debug('Calling Sign-Out endpoint with body: %o', req.body);
    try {
      // const logger:Logger = Container.get('logger');
      // logger.info("Ha! Token is correct!");
      return res.status(200).json({
        "message" : "You are logged out."
      });
    } catch (e) {
      // logger.error('🔥 error %o', e);
      return next(e);
    }
  });
};
