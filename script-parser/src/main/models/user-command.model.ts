export type CommandType = 'Begin' | 'End' | 'Wait' | 'Start station' | 'Stop station';


export class UserCommand {
    private _type?: CommandType;
    private _allArg?: 'all';
    private _numericArg?: number;

    constructor(line: string) {
        const lineArr = line.trim().split(' ');
        if (lineArr.length === 1) {
            if (lineArr[0] === 'Begin' || lineArr[0] === 'End') {
                this._type = lineArr[0];
            }
        } else {
            if (lineArr.length === 2 && lineArr[0] === 'Wait' && +lineArr[1]) {
                this._type = 'Wait';
                this._numericArg = +lineArr[1];
            } else if (
                lineArr.length === 3 &&
                (lineArr[0] === 'Start' || lineArr[0] === 'Stop') &&
                lineArr[1] === 'station' &&
                (lineArr[2] === 'all' || +lineArr[2])
            ) {
                this._type = lineArr[0] === 'Start' ? 'Start station' : 'Stop station';
                lineArr[2] === 'all' ? this._allArg = 'all' : this._numericArg = +lineArr[2];
            }
        }
    }

    public get type() {
        return this._type;
    }

    public get allArg() {
        return this._allArg;
    }

    public get numericArg() {
        return this._numericArg;
    }
}
