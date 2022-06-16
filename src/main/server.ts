import express from 'express';
import 'express-async-errors';
import stationTypeRouter from './routers/station-type.router';
import { API } from './utils/api-paths.enums';
import middleware from './utils/middleware';

const server = express();
server.use(express.json());

server.use(API.STATION_TYPES, stationTypeRouter);

// Add postprocessing middleware here
server.use(middleware.unknownEndpoint);
server.use(middleware.errorHandler);

export default server;
