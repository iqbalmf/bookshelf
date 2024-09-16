import { server } from '@hapi/hapi';
import routes from './route.js';

const init = async () => {
  const stateServer = server({
    port: 9000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*']
      }
    }
  });
  stateServer.route(routes);
  await stateServer.start();
  console.log(`Server berjalan pada ${stateServer.info.uri}`);
};
init();