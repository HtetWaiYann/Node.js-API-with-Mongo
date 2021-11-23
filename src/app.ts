import "reflect-metadata";

import config from './config';
import express from 'express';
import Logger from './loaders/logger';
// import loader from './loaders';

async function startServer() {
  const app = express();

  // const loader1 = await loader({expressApp: app})

  await require('./loaders').default({ expressApp: app });

  app.listen(config.port, () => {
    console.log("Server listening on port: " + config.port)
    Logger.info(`
      ################################################
      🛡️  Server listening on port: ${config.port} 🛡️
      ################################################
    `);
  }).on('error', err => {
    Logger.error(err);
    process.exit(1);
  });

}

startServer();

