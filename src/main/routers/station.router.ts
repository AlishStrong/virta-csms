import express, { Request, Response } from 'express';
import { Station, StationToCreate } from '../models/station.model';
import companyService from '../services/company.service';
import stationTypeService from '../services/station-type.service';
import stationService from '../services/station.service';
import { Errors } from '../utils/error.enums';
import utils from '../utils/utils';

const stationTypeRouter = express.Router();

const createStation = async (request: Request, response: Response) => {
    const body = request.body as StationToCreate;
    if (!body.name || !body.company_id) throw new Error(Errors.WRONG_STRUCTURE);
    if (!(await companyService.getCompanyByID(body.company_id)).id) throw new Error(Errors.COMPANY_NOT_EXIST);
    if (body.station_type_id) {
        if (!(await stationTypeService.getStationTypeByID(body.station_type_id)).id) throw new Error(Errors.STATION_TYPE_NOT_EXIST);
    } else {
        body.station_type_id = null;
    }
    const stationTypeId = await stationService.createStation(body);
    response.status(201).json({ id: stationTypeId, name: body.name, company_id: body.company_id, station_type_id: body.station_type_id } as Station);
};

const getAllStations = async (_request: Request, response: Response) => {
    const allStations = await stationService.getAllStations();
    response.status(200).json(allStations);
};

const getStationById = async (request: Request, response: Response) => {
    const stationTypeId = utils.parseId(request.params.id);
    const stationType = await stationService.getStationByID(stationTypeId);
    if (utils.isEmpty(stationType)) {
        return response.status(404).json({ message: `Requested station ${stationTypeId} was not found!` });
    } else {
        return response.status(200).json(stationType);
    }
};

const updateStation = async (request: Request, response: Response) => {
    const body = request.body as Station;
    if (!body.id || !body.name || !body.company_id) throw new Error(Errors.WRONG_STRUCTURE);
    if (!(await companyService.getCompanyByID(body.company_id)).id) throw new Error(Errors.COMPANY_NOT_EXIST);
    if (body.station_type_id) {
        if (!(await stationTypeService.getStationTypeByID(body.station_type_id)).id) throw new Error(Errors.STATION_TYPE_NOT_EXIST);
    } else {
        body.station_type_id = null;
    }

    const affectedRows = await stationService.updateStation(body);
    if (affectedRows === 1) {
        response.status(200).json({ id: body.id, name: body.name, company_id: body.company_id, station_type_id: body.station_type_id });
    } else {
        throw new Error(Errors.WRONG_STRUCTURE);
    }
};

const deleteStation = async (request: Request, response: Response) => {
    const stationTypeId = utils.parseId(request.params.id);
    await stationService.deleteStationByID(stationTypeId);
    response.status(200).json({ message: `Deleted station ${stationTypeId}` });
};

stationTypeRouter.post('/', createStation);
stationTypeRouter.get('/all', getAllStations);
stationTypeRouter.get('/:id', getStationById);
stationTypeRouter.put('/', updateStation);
stationTypeRouter.delete('/:id', deleteStation);

export default stationTypeRouter;
