import _ from 'lodash';
import { StepData } from './models/step-data.model';
import { UserCommand } from './models/user-command.model';
import { startAllStations, startStation } from './start-command';
import { stopAllStations, stopStation } from './stop-command';

const canBegin = (data: StepData[]) => data.length === 0;
const canAddOrEnd = (data: StepData[]) => data.length >= 1 && data[0].step === 'Begin';

const processBegin = (timestamp: Date, data: StepData[]): boolean => {
    if (canBegin(data)) {
        const beginStep: StepData = {
            step: 'Begin',
            timestamp: timestamp.valueOf(),
            companies: [],
            totalChargingStations: new Set(),
            totalChargingPower: 0
        };
        return !!data.push(beginStep);
    } else {
        console.log('You cannot Begin twice!');
        return false;
    }
};

const updateTimestamp = (timestamp: Date, seconds = 0): boolean => {
    return !!timestamp.setSeconds(timestamp.getSeconds() + seconds);
};

const processStartStation = async (command: UserCommand, timestamp: Date, data: StepData[]): Promise<boolean> => {
    if (canAddOrEnd(data)) {
        const newStepData = _.cloneDeep(data[data.length - 1]);
        newStepData.timestamp = timestamp.valueOf();
        if (command.allArg) {
            await startAllStations(newStepData, data);
        }
        if (command.numericArg) {
            await startStation(command.numericArg, newStepData, data);
        }
        return true;
    } else {
        console.log('You cannot Start station before Begin!');
        return false;
    }
};

const processStopStation = async (command: UserCommand, timestamp: Date, data: StepData[]): Promise<boolean> => {
    if (canAddOrEnd(data)) {
        const newStepData = _.cloneDeep(data[data.length - 1]);
        newStepData.timestamp = timestamp.valueOf();
        if (command.allArg) {
            stopAllStations(newStepData, data);
        }
        if (command.numericArg) {
            await stopStation(command.numericArg, newStepData, data);
        }
        return true;
    } else {
        console.log('Wrong command was supplied!');
        return false;
    }
};

const processEnd = (timestamp: Date, data: StepData[]): boolean => {
    if (canAddOrEnd(data)) {
        const beforeEnd = _.cloneDeep(data[data.length - 1]);
        const endStep: StepData = { ...beforeEnd, step: 'End', timestamp: timestamp.valueOf() };
        return !!data.push(endStep);
    } else {
        console.log('You cannot End before Begin!');
        return false;
    }
};

export const processUserCommand = async (command: UserCommand, timestamp: Date, data: StepData[]): Promise<boolean> => {
    switch (command.type) {
        case 'Begin':
            return processBegin(timestamp, data);
        case 'Wait':
            return updateTimestamp(timestamp, command.numericArg);
        case 'Start station':
            return await processStartStation(command, timestamp, data);
        case 'Stop station':
            return await processStopStation(command, timestamp, data);
        case 'End':
            return processEnd(timestamp, data);
        default:
            console.log('Wrong command was supplied!');
            return false;
    }
};
