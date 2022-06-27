import _ from 'lodash';
import { getAllStations } from '../main/clients/station.client';
import { Station } from '../main/models/station.model';
import { StepData } from '../main/models/step-data.model';
import { startAllStations } from '../main/start-command';
import { stopAllStations, stopStation } from '../main/stop-command';

const data: StepData[] = [];
let newStepData: StepData;

let stations: Station[];

beforeAll(async () => {
    const beginTimestamp = new Date();
    const beginStep: StepData = {
        step: 'Begin',
        timestamp: beginTimestamp.valueOf(),
        companies: [],
        totalChargingStations: new Set(),
        totalChargingPower: 0
    };
    data.push(beginStep);

    stations = await getAllStations();
});

beforeEach(() => {
    newStepData = _.cloneDeep(data[data.length - 1]);
});


test('Should start all stations correctly', async () => {
    await startAllStations(newStepData, data);
    expect(data.length).toBe(2);
    const lastRecord = data[data.length - 1];
    expect(lastRecord.step).toBe('Start station all');
    expect(lastRecord.totalChargingPower).toBe(stations.reduce((pr, c) => pr += c.maxPower, 0));
});

test('should stop a station', async () => {
    await stopStation(1, newStepData, data);
    expect(data.length).toBe(3);
    const lastRecord = data[data.length - 1];
    expect(lastRecord.step).toBe('Stop station 1');
    expect(lastRecord.totalChargingPower).toBe(stations.reduce((pr, c) => pr += c.maxPower, 0) - stations[0].maxPower);
});

test('should not stop a station twice', async () => {
    await stopStation(1, newStepData, data);
    expect(data.length).toBe(3);
    const lastRecord = data[data.length - 1];
    expect(lastRecord.step).toBe('Stop station 1');
    expect(lastRecord.totalChargingPower).toBe(stations.reduce((pr, c) => pr += c.maxPower, 0) - stations[0].maxPower);
});

test('should not stop a station that does not exist', async () => {
    await stopStation(111, newStepData, data);
    expect(data.length).toBe(3);
    const lastRecord = data[data.length - 1];
    expect(lastRecord.step).toBe('Stop station 1');
    expect(lastRecord.totalChargingPower).toBe(stations.reduce((pr, c) => pr += c.maxPower, 0) - stations[0].maxPower);
});

test('should stop all stations', () => {
    stopAllStations(newStepData, data);
    expect(data.length).toBe(4);
    const lastRecord = data[data.length - 1];
    expect(lastRecord.step).toBe('Stop station all');
    expect(lastRecord.totalChargingPower).toBe(0);
});
