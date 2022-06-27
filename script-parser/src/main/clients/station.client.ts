/* eslint-disable @typescript-eslint/no-non-null-assertion */
import axios, { AxiosResponse } from 'axios';
import { Station, StationEntity, StationTypeEntity } from '../models/station.model';

const getStationTypeById = async (stationTypeId: number): Promise<number> => {
    return await axios.get<StationTypeEntity>(`http://localhost:3001/station-type/${stationTypeId}`)
        .then((response: AxiosResponse<StationTypeEntity>) => response.data.maxPower);
};

export const getStationById = async (stationId: number): Promise<Station> => {
    return await axios.get<StationEntity>(`http://localhost:3001/station/${stationId}`)
        .then(async (response: AxiosResponse<StationEntity>) => {
            if (response.data.station_type_id) {
                const station: Station = {
                    id: response.data.id,
                    company_id: response.data.company_id,
                    maxPower: await getStationTypeById(response.data.station_type_id)
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

export const getAllStations = async () => {
    return await axios.get<StationEntity[]>('http://localhost:3001/station/all')
        .then(async (response: AxiosResponse<StationEntity[]>) => {
            if (response.data.length > 0) {
                return Promise.all(response.data
                    .filter(se => se.station_type_id)
                    .map(async se => {
                        return {
                            id: se.id,
                            company_id: se.company_id,
                            maxPower: await getStationTypeById(se.station_type_id!)
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
