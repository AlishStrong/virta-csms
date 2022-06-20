import executeQuery from '../database/database';
import { StationData } from '../models/station-data.model';
import utils from '../utils/utils';

const getStationDataByCompanyIDs = async (companyIds: number[]) => {
    utils.validateIds(companyIds);
    const queryString = 'SELECT s.id AS stationId, s.name as stationName, st.maxPower \n' +
                        'FROM `csms`.`station` AS s \n' +
                        'JOIN `csms`.`station_type` AS st ON (s.station_type_id = st.id) \n' +
                        `WHERE s.company_id IN (${companyIds}) \n` +
                        'ORDER BY s.id ASC';
    return await executeQuery(queryString) as StationData[];
};

export default {
    getStationDataByCompanyIDs
};
