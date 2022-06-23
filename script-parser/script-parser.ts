/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import readline from 'readline';
import { StepData } from './interfaces';
import { stations } from './test-data';
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const data: StepData[] = [];
let beginTimestamp: Date;

const canBegin = () => data.length === 0;
const canAddOrEnd = () => data.length >= 1 && data[0].step === 'Begin';

const canStartStation = (stationId: number) => !data[data.length - 1].totalChargingStations.has(stationId);

const startStation = (stationId: number): void => {
    // step 1 check if station can be started
    const canStart = canStartStation(stationId);
    if (canStart) {
        // step 2 get the station object from DB
        const station = stations.find(s => s.id === stationId);
        if (station) {
            // step 3 create new StepData object
            const newStepData = structuredClone(data[data.length - 1]);

            // step 4 add station's maxPower to the StepData's totalChargingPower
            newStepData.totalChargingPower += station.maxPower;

            // step 5 add station's id to the StepData's totalChargingStations
            newStepData.totalChargingStations.add(stationId);
        }
    }
};

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
            const endStep: StepData = { ...beforeEnd, step };
            data.push(endStep);
            rl.close();
        } else {
            const argArr = step.split(' ');
            if (argArr.length === 2 && argArr[0] === 'Wait' && isNaN(+argArr[1])) {
                // Wait command was given
                beginTimestamp.setSeconds(beginTimestamp.getSeconds() + +argArr[1]);
            }
            if (argArr.length === 3 && (argArr[0] === 'Start' || argArr[0] === 'Stop') && argArr[1] === 'station') {
                if (argArr[0] === 'Start') {
                    // Start station command was given
                    if (isNaN(+argArr[2])) {
                        // start specific station

                    }
                    if (argArr[2] === 'all') {
                        // start all stations
                    }
                }
                if (argArr[0] === 'Stop') {
                    // Stop station command was given
                    if (isNaN(+argArr[2])) {
                        // stop specific station
                    }
                    if (argArr[2] === 'all') {
                        // stop all stations
                    }
                }
            }
            rl.prompt();
        }
    } else {
        console.error('Wrong command!');
    }
};

rl.prompt();

rl.on('line', storeStep);

rl.on('close', function () {
    console.log('\n');
    console.log({ data });
    process.exit(0);
});
