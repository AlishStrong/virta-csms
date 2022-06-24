import express, { Request, Response } from 'express';
import { StationType, StationTypeToCreate } from '../models/station-type.model';
import stationTypeService from '../services/station-type.service';
import { Errors } from '../utils/error.enums';
import utils from '../utils/utils';

const stationTypeRouter = express.Router();

const createStationType = async (request: Request, response: Response) => {
    const body = request.body as StationTypeToCreate;
    if (body.name && body.maxPower) {
        const stationTypeId = await stationTypeService.createStationType(body);
        response.status(201).json({ id: stationTypeId, name: body.name, maxPower: body.maxPower } as StationType);
    } else {
        throw new Error(Errors.WRONG_STRUCTURE);
    }
};

const getAllStationTypes = async (_request: Request, response: Response) => {
    const allStationTypes = await stationTypeService.getAllStationTypes();
    response.status(200).json(allStationTypes);
};

const getStationTypeById = async (request: Request, response: Response) => {
    const stationTypeId = utils.parseId(request.params.id);
    const stationType = await stationTypeService.getStationTypeByID(stationTypeId);
    if (utils.isEmpty(stationType)) {
        return response.status(404).json({ message: `Requested station type ${stationTypeId} was not found!` });
    } else {
        return response.status(200).json(stationType);
    }
};

const updateStationType = async (request: Request, response: Response) => {
    const body = request.body as StationType;
    if (body.id && body.name && body.maxPower) {
        const affectedRows = await stationTypeService.updateStationType(body);
        if (affectedRows === 1) {
            response.status(200).json({ id: body.id, name: body.name, maxPower: body.maxPower });
        } else {
            throw new Error(Errors.WRONG_STRUCTURE);
        }
    } else {
        throw new Error(Errors.WRONG_STRUCTURE);
    }
};

const deleteStationType = async (request: Request, response: Response) => {
    const stationTypeId = utils.parseId(request.params.id);
    await stationTypeService.deleteStationTypeByID(stationTypeId);
    response.status(200).json({ message: `Deleted station type ${stationTypeId}` });
};

stationTypeRouter.post('/', createStationType);
stationTypeRouter.get('/all', getAllStationTypes);
stationTypeRouter.get('/:id', getStationTypeById);
stationTypeRouter.put('/', updateStationType);
stationTypeRouter.delete('/:id', deleteStationType);

export default stationTypeRouter;
