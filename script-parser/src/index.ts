import readline from 'readline';
import { StepData } from './main/models/step-data.model';
import { UserCommand } from './main/models/user-command.model';
import { processUserCommand } from './main/script-parser';

/**
 * Replacer function for JSON.stringify().
 * The function locates a Set property within the object supplied to JSON.stringify()
 * and transforms it into an array, for proper stdout
 *
 * @param _key object's property name; not needed
 * @param value of the object's property
 * @returns replacer function that transforms a Set into an Array and keeps other properties in the original form
 */
const replacer = (_key: string, value: string | number | Set<number> | object) => (value instanceof Set ? [...value] : value);

let data: StepData[] = [];
let timestamp: Date;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const processLine = async (line: string) => {
    const command = new UserCommand(line);
    if (command.type === 'Begin' || (!timestamp && command.type === 'End')) {
        timestamp = new Date();
    }
    const processed = await processUserCommand(command, timestamp, data);
    if (processed && command.type === 'End' && data[data.length - 1].step === 'End') {
        rl.close();
    } else {
        rl.prompt();
    }
};

rl.on('line', processLine);

rl.on('close', () => {
    console.log('\n');
    console.log(JSON.stringify({ data }, replacer, 2));
    data = [];
    process.exit(0);
});

rl.prompt();
