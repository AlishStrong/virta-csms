import { ResultSetHeader } from 'mysql2';
import executeQuery from '../database/database';
import { StationType, StationTypeToCreate } from '../models/station-type.model';

const createStationType = async (s: StationTypeToCreate): Promise<number> => {
    const result = await executeQuery('INSERT INTO `station_type` (`name`, `maxPower`) VALUES (?, ?)', [s.name, s.maxPower]) as ResultSetHeader;
    return result.insertId;
};

const getAllStationTypes = async (): Promise<StationType[]> => {
    return await executeQuery('SELECT * FROM `station_type`  ORDER BY `id`') as StationType[];
};

const getStationTypeByID = async (stationTypeId: number): Promise<StationType> => {
    const result = await executeQuery('SELECT * FROM `station_type` WHERE `id` = ?', [stationTypeId]) as StationType[];
    if (result.length > 0) {
        return result[0];
    } else {
        return {} as StationType;
    }
};

const updateStationType = async (st: StationType): Promise<number> => {
    const result = await executeQuery('UPDATE `station_type` SET `name` = ?, `maxPower` = ? WHERE `id` = ?', [st.name, st.maxPower, st.id]) as ResultSetHeader;
    return result.affectedRows;
};

const deleteStationTypeByID = async (stationTypeId: number): Promise<void> => {
    await executeQuery('DELETE FROM `station_type` WHERE `id` = ?', [stationTypeId]);
};

export default {
    createStationType,
    getAllStationTypes,
    getStationTypeByID,
    updateStationType,
    deleteStationTypeByID
};
