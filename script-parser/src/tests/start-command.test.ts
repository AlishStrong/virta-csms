import _ from 'lodash';
import { getAllStations } from '../main/clients/station.client';
import { Station } from '../main/models/station.model';
import { StepData } from '../main/models/step-data.model';
import { startAllStations, startStation } from '../main/start-command';

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

test('Should add Start station 2 command', async () => {
    await startStation(2, newStepData, data);
    expect(data.length).toBe(2);
    const lastRecord = data[data.length - 1];
    expect(lastRecord.step).toBe('Start station 2');
    expect(lastRecord.totalChargingPower).toBe(10);
    expect(lastRecord.totalChargingStations).toContain(2);
    const companies = lastRecord.companies;
    expect(companies.length).toBe(2);
});

test('Should add Start station 3 command', async () => {
    await startStation(3, newStepData, data);
    expect(data.length).toBe(3);
    const lastRecord = data[data.length - 1];
    expect(lastRecord.step).toBe('Start station 3');
    expect(lastRecord.totalChargingPower).toBe(20);
    expect(lastRecord.totalChargingStations).toContain(2);
    expect(lastRecord.totalChargingStations).toContain(3);
    const companies = lastRecord.companies;
    expect(companies.length).toBe(2);
});

test('Should add Start station 1 command', async () => {
    await startStation(1, newStepData, data);
    expect(data.length).toBe(4);
    const lastRecord = data[data.length - 1];
    expect(lastRecord.step).toBe('Start station 1');
    expect(lastRecord.totalChargingPower).toBe(30);
    expect(lastRecord.totalChargingStations).toContain(1);
    expect(lastRecord.totalChargingStations).toContain(2);
    expect(lastRecord.totalChargingStations).toContain(3);
    const companies = lastRecord.companies;
    expect(companies.length).toBe(3);
});

test('Should not add Start station 2 command again', async () => {
    await startStation(2, newStepData, data);
    expect(data.length).toBe(4);
    const lastRecord = data[data.length - 1];
    expect(lastRecord.step).toBe('Start station 1');
    expect(lastRecord.totalChargingPower).toBe(30);
    expect(lastRecord.totalChargingStations).toContain(1);
    expect(lastRecord.totalChargingStations).toContain(2);
    expect(lastRecord.totalChargingStations).toContain(3);
    const companies = lastRecord.companies;
    expect(companies.length).toBe(3);
});

test('Should not start a station that does not exist', async () => {
    await startStation(20, newStepData, data);
    expect(data.length).toBe(4);
    const lastRecord = data[data.length - 1];
    expect(lastRecord.step).toBe('Start station 1');
    expect(lastRecord.totalChargingPower).toBe(30);
    expect(lastRecord.totalChargingStations).toContain(1);
    expect(lastRecord.totalChargingStations).toContain(2);
    expect(lastRecord.totalChargingStations).toContain(3);
    const companies = lastRecord.companies;
    expect(companies.length).toBe(3);
});

test('Should start all stations correctly', async () => {
    await startAllStations(newStepData, data);
    expect(data.length).toBe(5);
    const lastRecord = data[data.length - 1];
    expect(lastRecord.step).toBe('Start station all');
    expect(lastRecord.totalChargingPower).toBe(stations.reduce((pr, c) => pr += c.maxPower, 0));
});
