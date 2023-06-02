import Fastify from 'fastify';
import { dirname, join } from 'path';
import openapiGlue from 'fastify-openapi-glue';
import { fileURLToPath } from 'url';
import RouteHandler from './RouteHandler.js';
import swaggerUi, { FastifySwaggerUiOptions } from '@fastify/swagger-ui';
import swagger, { FastifyStaticSwaggerOptions } from '@fastify/swagger';

const server = Fastify({
  logger: true,
});

const dirName = dirname(fileURLToPath(import.meta.url));

const glueOptions = {
  specification: join(dirName, './api.json'),
  service: new RouteHandler(),
};
server.register(openapiGlue, glueOptions);

const fastifySwaggerUiOptions: FastifySwaggerUiOptions = {
  routePrefix: `/doc`,
};

const fastifySwaggerOptions: FastifyStaticSwaggerOptions = {
  mode: 'static',
  specification: {
    path: join(dirName, './api.json'),
    baseDir: '',
  },
};

server.register(swagger, fastifySwaggerOptions);
server.register(swaggerUi, fastifySwaggerUiOptions);

// Run the server!
try {
  server.listen({ port: 3000, host: '0.0.0.0' }, function (err, address) {
    if (err) {
      server.log.error(err);
      process.exit(1);
    }
    server.log?.info(`Server listening at ${address}`);
  });
} catch (error) {
  console.error('An error occurred:', error);
}
