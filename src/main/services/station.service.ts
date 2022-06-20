import { ResultSetHeader } from 'mysql2';
import executeQuery from '../database/database';
import { Station, StationToCreate } from '../models/station.model';

const createStation = async (s: StationToCreate): Promise<number> => {
    const result = await executeQuery('INSERT INTO `station` (`name`, `company_id`, `station_type_id`) VALUES (?, ?, ?)', [s.name, s.company_id, s.station_type_id]) as ResultSetHeader;
    return result.insertId;
};

const getAllStations = async (): Promise<Station[]> => {
    return await executeQuery('SELECT * FROM `station`  ORDER BY `id`') as Station[];
};

const getStationByID = async (stationId: number): Promise<Station> => {
    const result = await executeQuery('SELECT * FROM `station` WHERE `id` = ?', [stationId]) as Station[];
    if (result.length > 0) {
        return result[0];
    } else {
        return {} as Station;
    }
};

const updateStation = async (s: Station): Promise<number> => {
    const result = await executeQuery('UPDATE `station` SET `name` = ?, `company_id` = ?, `station_type_id` = ? WHERE `id` = ?', [s.name, s.company_id, s.station_type_id, s.id]) as ResultSetHeader;
    return result.affectedRows;
};

const deleteStationByID = async (stationId: number): Promise<void> => {
    await executeQuery('DELETE FROM `station` WHERE `id` = ?', [stationId]);
};

export default {
    createStation,
    getAllStations,
    getStationByID,
    updateStation,
    deleteStationByID
};
