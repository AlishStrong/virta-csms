/* eslint-disable @typescript-eslint/no-non-null-assertion */
import axios, { AxiosResponse } from 'axios';
import { Station, StationEntity, StationTypeEntity } from '../models/station.model';

/**
 * Obtains StationTypeEntity object by calling an ednpoint on api-backend service
 * and extracts maxPower value from it that is then returned
 *
 * @param stationTypeId to request
 * @returns numerical value of maxPower property of the StationTypeEntity
 */
const getStationTypeMaxPowerById = async (stationTypeId: number): Promise<number> => {
    return await axios.get<StationTypeEntity>(`http://${process.env.CLIENT_HOST}:${process.env.CLIENT_PORT}/station-type/${stationTypeId}`)
        .then((response: AxiosResponse<StationTypeEntity>) => response.data.maxPower);
};

/**
 * First obtains StationEntity of a given ID by calling an endpoint on api-backend service.
 * Then maps the result to Station object; maxPower value is obtained from calling getStationTypeMaxPowerById()
 *
 * @param stationId to be obtain StationEntity from api-backend service
 * @returns formed Station object, or an empty object if there was an issue
 */
export const getStationById = async (stationId: number): Promise<Station> => {
    return await axios.get<StationEntity>(`http://${process.env.CLIENT_HOST}:${process.env.CLIENT_PORT}/station/${stationId}`)
        .then(async (response: AxiosResponse<StationEntity>) => {
            if (response.data.station_type_id) {
                const station: Station = {
                    id: response.data.id,
                    company_id: response.data.company_id,
                    maxPower: await getStationTypeMaxPowerById(response.data.station_type_id)
                };
                return station;
            } else {
                throw new Error('Station has no Station type defined');
            }
        })
        .catch(_error => {
            // console.log(error.response?.data);
            return {} as Station;
        });
};

/**
 * Obtains all StationEntities by making a request to api-backend service
 * and maps them to Station objects; maxPower value is obtained from calling getStationTypeMaxPowerById()
 *
 * @returns an array of Station objects, or an empty array if there was an issue
 */
export const getAllStations = async () => {
    return await axios.get<StationEntity[]>(`http://${process.env.CLIENT_HOST}:${process.env.CLIENT_PORT}/station/all`)
        .then(async (response: AxiosResponse<StationEntity[]>) => {
            if (response.data.length > 0) {
                return Promise.all(response.data
                    .filter(se => se.station_type_id)
                    .map(async se => {
                        return {
                            id: se.id,
                            company_id: se.company_id,
                            maxPower: await getStationTypeMaxPowerById(se.station_type_id!)
                        } as Station;
                    })
                );
            } else {
                return [];
            }
        })
        .catch(_error => {
            // console.log(error.response?.data);
            return [] as Station[];
        });
};
