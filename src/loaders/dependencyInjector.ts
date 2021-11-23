import { Container } from 'typedi';
import LoggerInstance from './logger';
import config from '../config';

export default ({ models }: { models: { name: string; model: any }[] }) => {
  try {
    models.forEach(m => {
      Container.set(m.name, m.model);
    });

    Container.set('logger', LoggerInstance);

    // LoggerInstance.info('✌️ Agenda injected into container');

    return {};
  } catch (e) {
    // LoggerInstance.error('🔥 Error on dependency injector loader: %o', e);
    throw e;
  }
};
