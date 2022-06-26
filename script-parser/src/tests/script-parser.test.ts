import { StepData } from '../main/interfaces';
import { UserCommand } from '../main/models/user-command.model';
import { processUserCommand } from '../main/script-parser';
import { companyEntities, stations } from '../main/test-data';

let data: StepData[] = [];
let userCommand: UserCommand;
const timestamp = new Date();

describe('Parse Begin command', () => {
    it ('should process Begin', () => {
        userCommand = new UserCommand('Begin');
        processUserCommand(userCommand, timestamp, data);
        const lastRecord = data[data.length - 1];
        expect(data.length).toBe(1);
        expect(lastRecord.step).toBe('Begin');
        expect(lastRecord.timestamp).toBe(timestamp.valueOf());
    });

    it('should not process wrongly composed Begin', () => {
        console.log = jest.fn();
        userCommand = new UserCommand('Begin wrong');
        processUserCommand(userCommand, timestamp, data);
        const lastRecord = data[data.length - 1];
        expect(data.length).toBe(1);
        expect(lastRecord.step).toBe('Begin');
        expect(console.log).toHaveBeenCalledWith('Wrong command was supplied!');
    });

    it('should not Begin twice', () => {
        console.log = jest.fn();
        userCommand = new UserCommand('Begin');
        processUserCommand(userCommand, timestamp, data);
        const lastRecord = data[data.length - 1];
        expect(data.length).toBe(1);
        expect(lastRecord.step).toBe('Begin');
        expect(console.log).toHaveBeenCalledWith('You cannot Begin twice!');
    });
});

describe('Parse End command', () => {
    beforeEach(() => {
        data = [];
    });

    it ('should process End after Begin', () => {
        userCommand = new UserCommand('Begin');
        processUserCommand(userCommand, timestamp, data);
        userCommand = new UserCommand('End');
        processUserCommand(userCommand, timestamp, data);
        const lastRecord = data[data.length - 1];
        expect(data.length).toBe(2);
        expect(lastRecord.step).toBe('End');
    });

    it('should not process wrongly composed End', () => {
        console.log = jest.fn();
        userCommand = new UserCommand('End wrong');
        processUserCommand(userCommand, timestamp, data);
        expect(data.length).toBe(0);
        expect(console.log).toHaveBeenCalledWith('Wrong command was supplied!');
    });

    it('should not process End before Begin', () => {
        console.log = jest.fn();
        userCommand = new UserCommand('End');
        processUserCommand(userCommand, timestamp, data);
        expect(data.length).toBe(0);
        expect(console.log).toHaveBeenCalledWith('You cannot End before Begin!');
    });
});

describe('Parse Wait command', () => {
    beforeEach(() => {
        data = [];
    });

    it('should increment timestamp by the Wait amount', () => {
        userCommand = new UserCommand('Begin');
        processUserCommand(userCommand, timestamp, data);

        const waitSec = 10;
        userCommand = new UserCommand(`Wait ${waitSec}`);
        processUserCommand(userCommand, timestamp, data);

        userCommand = new UserCommand('End');
        processUserCommand(userCommand, timestamp, data);
        const firstRecord = data[0];
        const lastRecord = data[data.length - 1];
        expect(data.length).toBe(2);
        expect(firstRecord.step).toBe('Begin');
        expect(lastRecord.step).toBe('End');
        expect(lastRecord.timestamp).toBe(firstRecord.timestamp + waitSec * 1000);
    });

    it('should not modify timestamp if the Wait amount is not given', () => {
        userCommand = new UserCommand('Begin');
        processUserCommand(userCommand, timestamp, data);

        userCommand = new UserCommand('Wait');
        processUserCommand(userCommand, timestamp, data);

        userCommand = new UserCommand('End');
        processUserCommand(userCommand, timestamp, data);
        const firstRecord = data[0];
        const lastRecord = data[data.length - 1];
        expect(data.length).toBe(2);
        expect(firstRecord.step).toBe('Begin');
        expect(lastRecord.step).toBe('End');
        expect(lastRecord.timestamp).toBe(firstRecord.timestamp);
    });

    it('should not modify timestamp if the Wait command is wrong', () => {
        userCommand = new UserCommand('Begin');
        processUserCommand(userCommand, timestamp, data);

        userCommand = new UserCommand('Wait wrong');
        processUserCommand(userCommand, timestamp, data);

        userCommand = new UserCommand('End');
        processUserCommand(userCommand, timestamp, data);
        const firstRecord = data[0];
        const lastRecord = data[data.length - 1];
        expect(data.length).toBe(2);
        expect(firstRecord.step).toBe('Begin');
        expect(lastRecord.step).toBe('End');
        expect(lastRecord.timestamp).toBe(firstRecord.timestamp);
    });
});

describe('Parse Start and Stop station commands', () => {
    beforeAll(() => {
        data = [];
    });

    it('should not Start station before Begin', () => {
        console.log = jest.fn();
        userCommand = new UserCommand('Start station 1');
        processUserCommand(userCommand, timestamp, data);
        expect(data.length).toBe(0);
        expect(console.log).toHaveBeenCalledWith('You cannot Start station before Begin!');
    });

    it('should Start station 1', () => {
        userCommand = new UserCommand('Begin');
        processUserCommand(userCommand, timestamp, data);

        userCommand = new UserCommand('Start station 1');
        processUserCommand(userCommand, timestamp, data);

        const lastRecord = data[data.length - 1];

        expect(data.length).toBe(2);
        expect(lastRecord.step).toBe('Start station 1');
        expect(lastRecord.totalChargingStations).toContain(1);
        expect(lastRecord.totalChargingPower).toBe(10);
        expect(lastRecord.companies).toHaveLength(2);
    });

    it('should not Start station twice', () => {
        console.log = jest.fn();

        userCommand = new UserCommand('Start station 1');
        processUserCommand(userCommand, timestamp, data);
        expect(console.log).toHaveBeenCalledWith('Station 1 is already started!');

        const lastRecord = data[data.length - 1];
        expect(lastRecord.step).toBe('Start station 1');
        expect(lastRecord.totalChargingStations).toContain(1);
        expect(lastRecord.totalChargingPower).toBe(10);
        expect(lastRecord.companies).toHaveLength(2);
    });

    it('should not Start station that does not exist', () => {
        console.log = jest.fn();

        userCommand = new UserCommand('Start station 111');
        processUserCommand(userCommand, timestamp, data);
        expect(console.log).toHaveBeenCalledWith('Station 111 does not exist!');

        const lastRecord = data[data.length - 1];
        expect(lastRecord.step).toBe('Start station 1');
        expect(lastRecord.totalChargingStations).toContain(1);
        expect(lastRecord.totalChargingPower).toBe(10);
        expect(lastRecord.companies).toHaveLength(2);
    });

    it('should not parse a wrong Start command', () => {
        console.log = jest.fn();

        userCommand = new UserCommand('Start station wrong');
        processUserCommand(userCommand, timestamp, data);
        expect(console.log).toHaveBeenCalledWith('Wrong command was supplied!');

        const lastRecord = data[data.length - 1];
        expect(lastRecord.step).toBe('Start station 1');
        expect(lastRecord.totalChargingStations).toContain(1);
        expect(lastRecord.totalChargingPower).toBe(10);
        expect(lastRecord.companies).toHaveLength(2);
    });

    it('should Start station all', () => {
        userCommand = new UserCommand('Start station all');
        processUserCommand(userCommand, timestamp, data);

        const lastRecord = data[data.length - 1];
        expect(data.length).toBe(3);
        expect(lastRecord.step).toBe('Start station all');
        expect([...lastRecord.totalChargingStations]).toStrictEqual(stations.map(s => s.id));
        expect(lastRecord.totalChargingPower).toBe(stations.reduce((prev, curr) => prev + curr.maxPower, 0));
        expect(lastRecord.companies).toHaveLength(companyEntities.length);
    });

    it('should Stop station 1', () => {
        userCommand = new UserCommand('Stop station 1');
        processUserCommand(userCommand, timestamp, data);
        const lastRecord = data[data.length - 1];
        expect(data.length).toBe(4);
        expect(lastRecord.step).toBe('Stop station 1');
        expect(lastRecord.totalChargingPower).toBe(stations.filter(s => s.id !== 1).reduce((prev, curr) => prev + curr.maxPower, 0));
        expect([...lastRecord.totalChargingStations]).toStrictEqual(stations.filter(s => s.id !== 1).map(s => s.id));
        expect([...(new Set(lastRecord.companies.flatMap(c => [...c.chargingStations])))]).toStrictEqual(stations.filter(s => s.id !== 1).map(s => s.id));
    });

    it('should not Stop station twice', () => {
        console.log = jest.fn();

        userCommand = new UserCommand('Stop station 1');
        processUserCommand(userCommand, timestamp, data);
        expect(console.log).toHaveBeenCalledWith('Could not Stop station 1!');

        const lastRecord = data[data.length - 1];
        expect(data.length).toBe(4);
        expect(lastRecord.step).toBe('Stop station 1');
        expect(lastRecord.totalChargingPower).toBe(stations.filter(s => s.id !== 1).reduce((prev, curr) => prev + curr.maxPower, 0));
        expect([...lastRecord.totalChargingStations]).toStrictEqual(stations.filter(s => s.id !== 1).map(s => s.id));
        expect([...(new Set(lastRecord.companies.flatMap(c => [...c.chargingStations])))]).toStrictEqual(stations.filter(s => s.id !== 1).map(s => s.id));
    });

    it('should not Stop station that does not exist', () => {
        console.log = jest.fn();

        userCommand = new UserCommand('Stop station 111');
        processUserCommand(userCommand, timestamp, data);
        expect(console.log).toHaveBeenCalledWith('Could not Stop station 111!');

        const lastRecord = data[data.length - 1];
        expect(data.length).toBe(4);
        expect(lastRecord.step).toBe('Stop station 1');
        expect(lastRecord.totalChargingPower).toBe(stations.filter(s => s.id !== 1).reduce((prev, curr) => prev + curr.maxPower, 0));
        expect([...lastRecord.totalChargingStations]).toStrictEqual(stations.filter(s => s.id !== 1).map(s => s.id));
        expect([...(new Set(lastRecord.companies.flatMap(c => [...c.chargingStations])))]).toStrictEqual(stations.filter(s => s.id !== 1).map(s => s.id));
    });

    it('should not parse a wrong Stop command', () => {
        console.log = jest.fn();

        userCommand = new UserCommand('Stop station wrong');
        processUserCommand(userCommand, timestamp, data);
        expect(console.log).toHaveBeenCalledWith('Wrong command was supplied!');

        const lastRecord = data[data.length - 1];
        expect(data.length).toBe(4);
        expect(lastRecord.step).toBe('Stop station 1');
        expect(lastRecord.totalChargingPower).toBe(stations.filter(s => s.id !== 1).reduce((prev, curr) => prev + curr.maxPower, 0));
        expect([...lastRecord.totalChargingStations]).toStrictEqual(stations.filter(s => s.id !== 1).map(s => s.id));
        expect([...(new Set(lastRecord.companies.flatMap(c => [...c.chargingStations])))]).toStrictEqual(stations.filter(s => s.id !== 1).map(s => s.id));
    });

    it ('should Stop station all', () => {
        userCommand = new UserCommand('Stop station all');
        processUserCommand(userCommand, timestamp, data);
        const lastRecord = data[data.length - 1];
        expect(data.length).toBe(5);
        expect(lastRecord.step).toBe('Stop station all');
        expect(lastRecord.totalChargingPower).toBe(0);
        expect([...lastRecord.totalChargingStations]).toStrictEqual([]);
        expect(lastRecord.companies).toStrictEqual([]);
    });
});
