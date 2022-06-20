import { ResultSetHeader } from 'mysql2';
import supertest from 'supertest';
import executeQuery from '../../main/database/database';
import { StationType, StationTypeToCreate } from '../../main/models/station-type.model';
import server from '../../main/server';
import { API } from '../../main/utils/api-paths.enums';
import { Errors } from '../../main/utils/error.enums';

const api = supertest(server);

const stationType: StationTypeToCreate = {
    name: 'test station type',
    maxPower: 100
};

let createdStationTypeId: number;
let existingId: number;

beforeAll(async () => {
    await executeQuery('DELETE FROM `station_type`');
    await executeQuery('DELETE FROM `company`');
    await executeQuery('DELETE FROM `company_relationship`');
    await executeQuery('DELETE FROM `station`');
});

afterAll(async () => {
    await executeQuery('DELETE FROM `station_type`');
    await executeQuery('DELETE FROM `company`');
    await executeQuery('DELETE FROM `company_relationship`');
    await executeQuery('DELETE FROM `station`');
});

describe('CREATE Station Type', () => {
    it ('should create Station Type', async () => {
        const response = await api.post(`${API.STATION_TYPES}`)
            .send(stationType)
            .expect(201);
        expect(response.body).toMatchObject(stationType);

        createdStationTypeId = (response.body as StationType).id;
    });

    it('should not create an existing Station Type', async () => {
        const response = await api.post(`${API.STATION_TYPES}`)
            .send(stationType)
            .expect(400);
        expect(response.body).toStrictEqual({ error: Errors.DUPLICATE_ENTRY });
    });

    it('should not create a Station Type without a name', async () => {
        const noName = {
            maxPower: 50
        };
        const response = await api.post(`${API.STATION_TYPES}`)
            .send(noName)
            .expect(400);
        expect(response.body).toStrictEqual({ error: Errors.WRONG_STRUCTURE });
    });

    it('should not create a Station Type without maxPower', async () => {
        const noMaxPower = {
            name: 'name'
        };
        const response = await api.post(`${API.STATION_TYPES}`)
            .send(noMaxPower)
            .expect(400);
        expect(response.body).toStrictEqual({ error: Errors.WRONG_STRUCTURE });
    });
});

describe('READ Station Type', () => {
    it('should get all Station Types', async () => {
        const created = await executeQuery('INSERT INTO `station_type` (`name`, `maxPower`) VALUES ("station type one", 50), ("station type two", 10)') as ResultSetHeader;

        const response = await api.get(`${API.STATION_TYPES}/all`)
            .expect(200);

        expect(response.body).toHaveLength(3);
        existingId = created.insertId;
    });

    it('should get an existing Station Type', async () => {
        const response = await api.get(`${API.STATION_TYPES}/${createdStationTypeId}`)
            .expect(200);
        expect(response.body).toMatchObject({ name:'test station type', maxPower: 100 });
    });

    it('should not get a non-existing Station Type', async () => {
        const response = await api.get(`${API.STATION_TYPES}/${createdStationTypeId + 10}`)
            .expect(404);
        expect(response.body).toStrictEqual({ message: `Requested station type ${createdStationTypeId + 10} was not found!` });
    });

    it('should notify if ID is wrong', async () => {
        const response = await api.get(`${API.STATION_TYPES}/wrong-id`)
            .expect(404);
        expect(response.body).toStrictEqual({ error: Errors.INCORRECT_ID });
    });
});

describe('UPDATE Station Type', () => {
    it('should update Station Type with new values', async () => {
        const forUpdate = {
            id: createdStationTypeId,
            name: 'updated name',
            maxPower: 300
        };

        const response = await api.put(`${API.STATION_TYPES}`)
            .send(forUpdate)
            .expect(200);

        expect(response.body.name).toBe('updated name');
        expect(response.body.maxPower).toBe(300);
    });

    it('should not update Station Type with duplicate name values', async () => {
        const forUpdate = {
            id: createdStationTypeId,
            name: 'station type one',
            maxPower: 300
        };

        const response = await api.put(`${API.STATION_TYPES}`)
            .send(forUpdate)
            .expect(400);

        expect(response.body).toStrictEqual({ error: Errors.DUPLICATE_ENTRY });
    });

    it('should not update Station Type that does not exist', async () => {
        const forUpdate = {
            id: createdStationTypeId + 100,
            name: 'does not exist',
            maxPower: 300
        };

        const response = await api.put(`${API.STATION_TYPES}`)
            .send(forUpdate)
            .expect(400);

        expect(response.body).toStrictEqual({ error: Errors.WRONG_STRUCTURE });
    });
});

describe('DELETE Station Type', () => {
    it('should delete existing Station Type', async () => {
        const responseReadAllBefore = await api.get(`${API.STATION_TYPES}/all`)
            .expect(200);
        const countBefore = (responseReadAllBefore.body as StationType[]).length;

        const response = await api.delete(`${API.STATION_TYPES}/${existingId}`)
            .expect(200);
        expect(response.body).toStrictEqual({ message: `Deleted station type ${existingId}` });

        const responseReadAllAfter = await api.get(`${API.STATION_TYPES}/all`)
            .expect(200);
        const countAfter = (responseReadAllAfter.body as StationType[]).length;
        expect(countAfter).toBe(countBefore - 1);
    });

    it('should not delete non-existing Station Type', async () => {
        const responseReadAllBefore = await api.get(`${API.STATION_TYPES}/all`)
            .expect(200);
        const countBefore = (responseReadAllBefore.body as StationType[]).length;

        const response = await api.delete(`${API.STATION_TYPES}/${existingId+100}`)
            .expect(200);
        expect(response.body).toStrictEqual({ message: `Deleted station type ${existingId+100}` });

        const responseReadAllAfter = await api.get(`${API.STATION_TYPES}/all`)
            .expect(200);
        const countAfter = (responseReadAllAfter.body as StationType[]).length;
        expect(countAfter).toBe(countBefore);
    });

    it('should not delete when ID is wrong', async () => {
        const responseReadAllBefore = await api.get(`${API.STATION_TYPES}/all`)
            .expect(200);
        const countBefore = (responseReadAllBefore.body as StationType[]).length;

        const response = await api.delete(`${API.STATION_TYPES}/wrong`)
            .expect(404);
        expect(response.body).toStrictEqual({ error: Errors.INCORRECT_ID });

        const responseReadAllAfter = await api.get(`${API.STATION_TYPES}/all`)
            .expect(200);
        const countAfter = (responseReadAllAfter.body as StationType[]).length;
        expect(countAfter).toBe(countBefore);
    });
});
