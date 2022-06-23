import { StepData } from '../interfaces';
import { startAllStations, startStation } from '../start-command';
import { stations } from '../test-data';

const data: StepData[] = [];

beforeAll(() => {
    const beginTimestamp = new Date();
    const beginStep: StepData = {
        step: 'Begin',
        timestamp: beginTimestamp.valueOf(),
        companies: [],
        totalChargingStations: new Set(),
        totalChargingPower: 0
    };
    data.push(beginStep);
});

test('Should add Start station 2 command', () => {
    startStation(2, data);
    expect(data.length).toBe(2);
    const lastRecord = data[data.length - 1];
    expect(lastRecord.step).toBe('Start station 2');
    expect(lastRecord.totalChargingPower).toBe(20);
    expect(lastRecord.totalChargingStations).toContain(2);
    const companies = lastRecord.companies;
    expect(companies.length).toBe(2);
});

test('Should add Start station 3 command', () => {
    startStation(3, data);
    expect(data.length).toBe(3);
    const lastRecord = data[data.length - 1];
    expect(lastRecord.step).toBe('Start station 3');
    expect(lastRecord.totalChargingPower).toBe(50);
    expect(lastRecord.totalChargingStations).toContain(2);
    expect(lastRecord.totalChargingStations).toContain(3);
    const companies = lastRecord.companies;
    expect(companies.length).toBe(2);
});

test('Should add Start station 1 command', () => {
    startStation(1, data);
    expect(data.length).toBe(4);
    const lastRecord = data[data.length - 1];
    expect(lastRecord.step).toBe('Start station 1');
    expect(lastRecord.totalChargingPower).toBe(60);
    expect(lastRecord.totalChargingStations).toContain(1);
    expect(lastRecord.totalChargingStations).toContain(2);
    expect(lastRecord.totalChargingStations).toContain(3);
    const companies = lastRecord.companies;
    expect(companies.length).toBe(3);
});

test('Should not add Start station 2 command again', () => {
    startStation(2, data);
    expect(data.length).toBe(4);
    const lastRecord = data[data.length - 1];
    expect(lastRecord.step).toBe('Start station 1');
    expect(lastRecord.totalChargingPower).toBe(60);
    expect(lastRecord.totalChargingStations).toContain(1);
    expect(lastRecord.totalChargingStations).toContain(2);
    expect(lastRecord.totalChargingStations).toContain(3);
    const companies = lastRecord.companies;
    expect(companies.length).toBe(3);
});

test('Should not start a station that does not exist', () => {
    startStation(20, data);
    expect(data.length).toBe(4);
    const lastRecord = data[data.length - 1];
    expect(lastRecord.step).toBe('Start station 1');
    expect(lastRecord.totalChargingPower).toBe(60);
    expect(lastRecord.totalChargingStations).toContain(1);
    expect(lastRecord.totalChargingStations).toContain(2);
    expect(lastRecord.totalChargingStations).toContain(3);
    const companies = lastRecord.companies;
    expect(companies.length).toBe(3);
});

test('Should start all stations correctly', () => {
    startAllStations(data);
    expect(data.length).toBe(5);
    const lastRecord = data[data.length - 1];
    expect(lastRecord.step).toBe('Start station all');
    expect(lastRecord.totalChargingPower).toBe(stations.reduce((pr, c) => pr += c.maxPower, 0));
});

it('show the result', () => {
    console.log(data);
});

