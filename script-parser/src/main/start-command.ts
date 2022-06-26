import { Company, Station, StepData } from './interfaces';
import { companyEntities, stations } from './test-data';

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

export const startStation = (stationId: number, newStepData: StepData, data: StepData[]): void => {
    // step 1 check if station can be started
    const canStart = canStartStation(stationId, newStepData);
    if (canStart) {
        // step 2 get the station object from DB
        const station = stations.find(s => s.id === stationId); // TODO make a request to REST Client!
        if (station) {
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
                let ce = companyEntities.find(c => c.id === station.company_id); // TODO make a request to REST Client!
                ce && ce.parent_id;
                ce = companyEntities.find(c => c.id === ce?.parent_id) // TODO make a request to REST Client!
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

export const startAllStations = (newStepData: StepData, data: StepData[]): void => {
    // const newStepData = _.cloneDeep(data[data.length - 1]);
    newStepData.step = 'Start station all';

    // TODO make a request to REST Client!
    for (const station of stations) {
        const canStart = canStartStation(station.id, newStepData);
        if (canStart) {
            newStepData.totalChargingPower += station.maxPower;
            newStepData.totalChargingStations.add(station.id);
            addOrUpdateCompany(station.company_id, station, newStepData);

            for (
                let ce = companyEntities.find(c => c.id === station.company_id); // TODO make a request to REST Client!
                ce && ce.parent_id;
                ce = companyEntities.find(c => c.id === ce?.parent_id) // TODO make a request to REST Client!
            ) {
                addOrUpdateCompany(ce.parent_id, station, newStepData);
            }
        }
    }

    newStepData.companies.sort((a: Company, b: Company) => a.id - b.id);
    data.push(newStepData);
};
