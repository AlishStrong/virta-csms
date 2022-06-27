import _ from 'lodash';
import { getStationById } from './clients/station.client';
import { StepData } from './models/step-data.model';

/**
 * Checks if a station based on its ID can be stopped.
 *
 * @param stationId to check
 * @param newStepData StepData of a previous step to see if it contains the station's ID
 * @returns true if the station's ID is in the StepData and thus can be stopped; false otherwise
 */
const canStopStation = (stationId: number, newStepData: StepData): boolean => newStepData.totalChargingStations.has(stationId);

export const stopStation = async (stationId: number, newStepData: StepData, data: StepData[]) => {
    // step 1 check if station can be stoped
    const canStop = canStopStation(stationId, newStepData);
    if (canStop) {
        // step 2 get the station object from DB because correct maxPower must be deducted!
        const station = await getStationById(stationId);
        if (!_.isEmpty(station)) {
            // step 3 name StepData.step = `Stop station ${stationId}`
            newStepData.step = `Stop station ${stationId}`;

            // step 4 remove station's maxPower from the StepData's totalChargingPower
            newStepData.totalChargingPower -= station.maxPower;

            // step 5 remove station's id from the StepData's totalChargingStations
            newStepData.totalChargingStations.delete(stationId);

            // step 6 remove station's id from StepData.companies
            // and those companies that had only that station in chargingStations
            newStepData.companies = newStepData.companies.map(c => {
                const containedStation = c.chargingStations.delete(stationId);
                if (containedStation) {
                    c.cargingPower -= station.maxPower;
                }
                return c;
            }).filter(c => c.chargingStations.size > 0);

            // step 7 push the new StepData
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
