import _ from 'lodash';
import { getCompanyEntityById } from './clients/company-entity.client';
import { getAllStations, getStationById } from './clients/station.client';
import { Company } from './models/company.model';
import { Station } from './models/station.model';
import { StepData } from './models/step-data.model';

const canStartStation = (stationId: number, newStepData: StepData): boolean => !newStepData.totalChargingStations.has(stationId);

const addOrUpdateCompany = (companyId: number, station: Station, data: StepData): void => {
    let addOrUpdateCompany = data.companies.find(c => c.id === companyId);
    if (addOrUpdateCompany) {
        // update company
        addOrUpdateCompany.chargingStations.add(station.id);
        addOrUpdateCompany.cargingPower += station.maxPower;
    } else {
        // add company
        addOrUpdateCompany = {
            id: companyId,
            chargingStations: new Set([station.id]),
            cargingPower: station.maxPower
        } as Company;
        data.companies.push(addOrUpdateCompany);
    }
};

export const startStation = async (stationId: number, newStepData: StepData, data: StepData[]) => {
    // step 1 check if station can be started
    const canStart = canStartStation(stationId, newStepData);
    if (canStart) {
        // step 2 get the station object from DB
        const station = await getStationById(stationId);
        if (!_.isEmpty(station)) {
            // // step 3 create new StepData object
            // const newStepData = _.cloneDeep(data[data.length - 1]);

            // step 4 name StepData.step = `Start station ${stationId}`
            newStepData.step = `Start station ${stationId}`;

            // step 5 add station's maxPower to the StepData's totalChargingPower
            newStepData.totalChargingPower += station.maxPower;

            // step 6 add station's id to the StepData's totalChargingStations
            newStepData.totalChargingStations.add(stationId);

            // step 7 add station company or update if it exists
            addOrUpdateCompany(station.company_id, station, newStepData);

            // step 8 add/update parent companies in the data.companies
            for (
                let ce = await getCompanyEntityById(station.company_id);
                !_.isEmpty(ce) && ce.parent_id;
                ce = await getCompanyEntityById(ce.parent_id)
            ) {
                // company has a parent
                addOrUpdateCompany(ce.parent_id, station, newStepData);
            }

            newStepData.companies.sort((a: Company, b: Company) => a.id - b.id);
            // step 9 push the new StepData
            data.push(newStepData);
        } else {
            console.log(`Station ${stationId} does not exist!`);
        }
    } else {
        console.log(`Station ${stationId} is already started!`);
    }
};

export const startAllStations = async (newStepData: StepData, data: StepData[]) => {
    // const newStepData = _.cloneDeep(data[data.length - 1]);
    newStepData.step = 'Start station all';

    const stations = await getAllStations();
    for (const station of stations) {
        const canStart = canStartStation(station.id, newStepData);
        if (canStart) {
            newStepData.totalChargingPower += station.maxPower;
            newStepData.totalChargingStations.add(station.id);
            addOrUpdateCompany(station.company_id, station, newStepData);

            for (
                let ce = await getCompanyEntityById(station.company_id);
                ce && ce.parent_id;
                ce = await getCompanyEntityById(ce.parent_id)
            ) {
                addOrUpdateCompany(ce.parent_id, station, newStepData);
            }
        }
    }

    newStepData.companies.sort((a: Company, b: Company) => a.id - b.id);
    data.push(newStepData);
};
