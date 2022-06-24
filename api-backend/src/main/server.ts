import 'dotenv/config';
import express from 'express';
import 'express-async-errors';
import companyRouter from './routers/company.router';
import stationTypeRouter from './routers/station-type.router';
import stationRouter from './routers/station.router';
import { API } from './utils/api-paths.enums';
import middleware from './utils/middleware';

const server = express();
server.use(express.json());

server.use(API.STATION_TYPES, stationTypeRouter);
server.use(API.COMPANY, companyRouter);
server.use(API.STATION, stationRouter);

// Add postprocessing middleware here
server.use(middleware.unknownEndpoint);
server.use(middleware.errorHandler);

export default server;
