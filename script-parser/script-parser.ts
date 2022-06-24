import readline from 'readline';
import { StepData } from './interfaces';
import { startAllStations, startStation } from './start-command';
import { stopAllStations, stopStation } from './stop-command';
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let data: StepData[] = [];
let beginTimestamp: Date;

const canBegin = () => data.length === 0;
const canAddOrEnd = () => data.length >= 1 && data[0].step === 'Begin';
const replacer = (_key: string, value: string | number | Set<number> | object) => (value instanceof Set ? [...value] : value);

const storeStep = (step: string) => {
    step = step.trim();
    if (step === 'Begin' && canBegin()) {
        beginTimestamp = new Date();
        const beginStep: StepData = {
            step,
            timestamp: beginTimestamp.valueOf(),
            companies: [],
            totalChargingStations: new Set(),
            totalChargingPower: 0
        };
        data.push(beginStep);
    }
    if (canAddOrEnd()) {
        if (step === 'End') {
            const beforeEnd = data[data.length - 1];
            const endStep: StepData = { ...beforeEnd, step, timestamp: beginTimestamp.valueOf() };
            data.push(endStep);
            rl.close();
        } else {
            const argArr = step.split(' ');
            if (argArr.length === 2 && argArr[0] === 'Wait' && +argArr[1]) {
                // Wait command was given
                beginTimestamp.setSeconds(beginTimestamp.getSeconds() + +argArr[1]);
            }
            if (argArr.length === 3 && (argArr[0] === 'Start' || argArr[0] === 'Stop') && argArr[1] === 'station') {
                if (argArr[0] === 'Start') {
                    // Start station command was given
                    if (+argArr[2]) {
                        // start specific station
                        startStation(+argArr[2], data);
                    }
                    if (argArr[2] === 'all') {
                        // start all stations
                        startAllStations(data);
                    }
                }
                if (argArr[0] === 'Stop') {
                    // Stop station command was given
                    if (+argArr[2]) {
                        // stop specific station
                        stopStation(+argArr[2], data);
                    }
                    if (argArr[2] === 'all') {
                        // stop all stations
                        stopAllStations(data);
                    }
                }
                const lastStep = data[data.length - 1];
                lastStep.timestamp = beginTimestamp.valueOf();
            }
        }
    } else {
        console.error('Wrong command!');
    }
    rl.prompt();
};

rl.prompt();

rl.on('line', storeStep);

rl.on('close', function () {
    console.log('\n');
    console.log(JSON.stringify({ data }, replacer, 2));
    data = [];
    process.exit(0);
});
