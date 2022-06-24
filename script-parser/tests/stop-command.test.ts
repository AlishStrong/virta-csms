import { StepData } from '../interfaces';
import { startAllStations } from '../start-command';
import { stopAllStations, stopStation } from '../stop-command';
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

test('Should start all stations correctly', () => {
    startAllStations(data);
    expect(data.length).toBe(2);
    const lastRecord = data[data.length - 1];
    expect(lastRecord.step).toBe('Start station all');
    expect(lastRecord.totalChargingPower).toBe(stations.reduce((pr, c) => pr += c.maxPower, 0));
});

test('should stop a station', () => {
    stopStation(1, data);
    expect(data.length).toBe(3);
    const lastRecord = data[data.length - 1];
    expect(lastRecord.step).toBe('Stop station 1');
    expect(lastRecord.totalChargingPower).toBe(stations.reduce((pr, c) => pr += c.maxPower, 0) - stations[0].maxPower);
});

test('should not stop a station twice', () => {
    stopStation(1, data);
    expect(data.length).toBe(3);
    const lastRecord = data[data.length - 1];
    expect(lastRecord.step).toBe('Stop station 1');
    expect(lastRecord.totalChargingPower).toBe(stations.reduce((pr, c) => pr += c.maxPower, 0) - stations[0].maxPower);
});

test('should not stop a station that does not exist', () => {
    stopStation(111, data);
    expect(data.length).toBe(3);
    const lastRecord = data[data.length - 1];
    expect(lastRecord.step).toBe('Stop station 1');
    expect(lastRecord.totalChargingPower).toBe(stations.reduce((pr, c) => pr += c.maxPower, 0) - stations[0].maxPower);
});

test('should stop all stations', () => {
    stopAllStations(data);
    expect(data.length).toBe(4);
    const lastRecord = data[data.length - 1];
    expect(lastRecord.step).toBe('Stop station all');
    expect(lastRecord.totalChargingPower).toBe(0);
});
