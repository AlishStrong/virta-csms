import { UserCommand } from '../main/models/user-command.model';

describe('Begin command', () => {
    it('Should create Begin command', () => {
        const command = new UserCommand('Begin');
        expect(command.type).toBe('Begin');
        expect(command.allArg).toBeUndefined();
        expect(command.numericArg).toBeUndefined();
    });

    it('Should not create wrong Begin command', () => {
        const command = new UserCommand('Begin wrong');
        expect(command.type).toBeUndefined();
        expect(command.allArg).toBeUndefined();
        expect(command.numericArg).toBeUndefined();
    });

    it('Should not create wrong begin command', () => {
        const command = new UserCommand('begin');
        expect(command.type).toBeUndefined();
        expect(command.allArg).toBeUndefined();
        expect(command.numericArg).toBeUndefined();
    });

    it('Should not create wrong begin command', () => {
        const command = new UserCommand('begin wrong');
        expect(command.type).toBeUndefined();
        expect(command.allArg).toBeUndefined();
        expect(command.numericArg).toBeUndefined();
    });
});
