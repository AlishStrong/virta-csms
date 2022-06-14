import express, { Request, Response } from 'express';
import { StationType } from '../models/station-type.model';
import utils from '../utils/utils';

const stationTypeRouter = express.Router();

const createStationType = (request: Request, response: Response) => {
    const body = request.body as StationType;
    response.send(`created station type ${body}`);
};

const getAllStationTypes = (_request: Request, response: Response) => {
    response.send('get all station types');
};

const getStationTypeById = (request: Request, response: Response) => {
    const stationTypeId = utils.parseId(request.params.id);
    response.send(`get station type ${stationTypeId}`);
};

const deleteStationType = (request: Request, response: Response) => {
    const stationTypeId = utils.parseId(request.params.id);
    response.send(`delete station type ${stationTypeId}`);
};

stationTypeRouter.post('/', createStationType);
stationTypeRouter.get('/all', getAllStationTypes);
stationTypeRouter.get('/:id', getStationTypeById);
stationTypeRouter.delete('/:id', deleteStationType);

export default stationTypeRouter;
