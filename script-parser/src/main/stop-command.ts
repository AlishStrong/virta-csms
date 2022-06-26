import { StepData } from './interfaces';
import { stations } from './test-data';

const canStopStation = (stationId: number, newStepData: StepData): boolean => newStepData.totalChargingStations.has(stationId);

export const stopStation = (stationId: number, newStepData: StepData, data: StepData[]): void => {
    // step 1 check if station can be stoped
    const canStop = canStopStation(stationId, newStepData);
    if (canStop) {
        // step 2 get the station object from DB because correct maxPower must be deducted!
        const station = stations.find(s => s.id === stationId); // TODO make a request to REST Client!
        if (station) {
            // step 3 create new StepData
            // const newStepData = _.cloneDeep(data[data.length - 1]);

            // step 4 name StepData.step = `Stop station ${stationId}`
            newStepData.step = `Stop station ${stationId}`;

            // step 5 remove station's maxPower from the StepData's totalChargingPower
            newStepData.totalChargingPower -= station.maxPower;

            // step 6 remove station's id from the StepData's totalChargingStations
            newStepData.totalChargingStations.delete(stationId);

            // step 7 remove station's id from StepData.companies
            // and those companies that had only that station in chargingStations
            newStepData.companies = newStepData.companies.map(c => {
                const containedStation = c.chargingStations.delete(stationId);
                if (containedStation) {
                    c.cargingPower -= station.maxPower;
                }
                return c;
            }).filter(c => c.chargingStations.size > 0);

            // step 8 push the new StepData
            data.push(newStepData);
        }
    } else {
        console.log(`Could not Stop station ${stationId}!`);
    }
};

export const stopAllStations = (newStepData: StepData, data: StepData[]): void => {
    newStepData.step = 'Stop station all';
    newStepData.companies = [];
    newStepData.totalChargingStations.clear();
    newStepData.totalChargingPower = 0;
    data.push(newStepData);
};
