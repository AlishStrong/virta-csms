import { ResultSetHeader } from 'mysql2';
import supertest from 'supertest';
import executeQuery from '../../main/database/database';
import { CompanyToCreate } from '../../main/models/company.model';
import { StationType, StationTypeToCreate } from '../../main/models/station-type.model';
import { Station, StationToCreate } from '../../main/models/station.model';
import server from '../../main/server';
import { API } from '../../main/utils/api-paths.enums';
import { Errors } from '../../main/utils/error.enums';

const api = supertest(server);

const companyOne: CompanyToCreate = {
    name: 'test company one'
};
let createdCompanyId: number;

const stationType: StationTypeToCreate = {
    name: 'test station type',
    maxPower: 100
};
let createdStationTypeId: number;

const stationOne: StationToCreate = {
    name: 'test station one',
    station_type_id: null,
    company_id: 0
};

const stationTwo: StationToCreate = {
    name: 'test station two',
    station_type_id: null,
    company_id: 0
};

let createdStationOneId: number;
// let createdStationTwoId: number;

beforeAll(async () => {
    await executeQuery('DELETE FROM `station_type`');
    await executeQuery('DELETE FROM `company`');
    await executeQuery('DELETE FROM `company_relationship`');
    await executeQuery('DELETE FROM `station`');

    const companyResult = await executeQuery('INSERT INTO `company` (`name`) VALUES (?)', Object.values(companyOne)) as ResultSetHeader;
    createdCompanyId = companyResult.insertId;
    const stationTypeResult = await executeQuery('INSERT INTO `station_type` (`name`, `maxPower`) VALUES (?, ?)', Object.values(stationType)) as ResultSetHeader;
    createdStationTypeId = stationTypeResult.insertId;

    stationOne.company_id = createdCompanyId;
    stationOne.station_type_id = createdStationTypeId;

    stationTwo.company_id = createdCompanyId;
});

afterAll(async () => {
    await executeQuery('DELETE FROM `station_type`');
    await executeQuery('DELETE FROM `company`');
    await executeQuery('DELETE FROM `company_relationship`');
    await executeQuery('DELETE FROM `station`');
});

test('should populate DB with company and station type', async () => {
    const responseCompanies = await api.get(`${API.COMPANY}/all`)
        .expect(200);
    expect(responseCompanies.body).toHaveLength(1);

    const responseSTs = await api.get(`${API.STATION_TYPES}/all`)
        .expect(200);
    expect(responseSTs.body).toHaveLength(1);
});

describe('CREATE Station', () => {
    it ('should create Station', async () => {
        const response = await api.post(`${API.STATION}`)
            .send(stationOne)
            .expect(201);
        expect(response.body).toMatchObject(stationOne);

        createdStationOneId = (response.body as StationType).id;
    });

    it ('should still create Station if station_type_id is not provided', async () => {
        const response = await api.post(`${API.STATION}`)
            .send(stationTwo)
            .expect(201);

        const createdStation = response.body as Station;
        expect(createdStation).toMatchObject(stationTwo);
        expect(createdStation.station_type_id).toBeNull();

        // createdStationTwoId = (response.body as StationType).id;
    });

    it('should not create an existing Station', async () => {
        const response = await api.post(`${API.STATION}`)
            .send(stationOne)
            .expect(400);
        expect(response.body).toStrictEqual({ error: Errors.DUPLICATE_ENTRY });
    });

    it('should not create a Station without a name', async () => {
        const noName = {
            company_id: stationOne.company_id
        } as Station;
        const response = await api.post(`${API.STATION}`)
            .send(noName)
            .expect(400);
        expect(response.body).toStrictEqual({ error: Errors.WRONG_STRUCTURE });
    });

    it('should not create a Station without a company_id', async () => {
        const noCompanyId= {
            name: stationOne.name
        } as Station;
        const response = await api.post(`${API.STATION}`)
            .send(noCompanyId)
            .expect(400);
        expect(response.body).toStrictEqual({ error: Errors.WRONG_STRUCTURE });
    });

    it('should not create a Station with non-existent company_id', async () => {
        const stationWithWrongCompanyId = { ...stationOne } as Station;
        stationWithWrongCompanyId.company_id = createdCompanyId + 100;
        const response = await api.post(`${API.STATION}`)
            .send(stationWithWrongCompanyId)
            .expect(404);
        expect(response.body).toStrictEqual({ error: Errors.COMPANY_NOT_EXIST });
    });

    it('should not create a Station with non-existent station_type_id', async () => {
        const stationWithWrongStationTypeId = { ...stationOne } as Station;
        stationWithWrongStationTypeId.company_id = createdCompanyId;
        stationWithWrongStationTypeId.station_type_id = createdStationTypeId + 100;
        const response = await api.post(`${API.STATION}`)
            .send(stationWithWrongStationTypeId)
            .expect(404);
        expect(response.body).toStrictEqual({ error: Errors.STATION_TYPE_NOT_EXIST });
    });
});

describe('READ Station', () => {
    it('should get all Station Types', async () => {
        const response = await api.get(`${API.STATION}/all`)
            .expect(200);

        expect(response.body).toHaveLength(2);
    });

    it('should get an existing Station', async () => {
        const response = await api.get(`${API.STATION}/${createdStationOneId}`)
            .expect(200);
        expect(response.body).toMatchObject(stationOne);
    });

    it('should not get a non-existing Station', async () => {
        const response = await api.get(`${API.STATION}/${createdStationOneId + 10}`)
            .expect(404);
        expect(response.body).toStrictEqual({ message: `Requested station ${createdStationOneId + 10} was not found!` });
    });

    it('should notify if ID is wrong', async () => {
        const response = await api.get(`${API.STATION}/wrong-id`)
            .expect(404);
        expect(response.body).toStrictEqual({ error: Errors.INCORRECT_ID });
    });
});

describe('UPDATE Station', () => {
    it('should update Station with new values', async () => {
        const forUpdate = { ...stationOne } as Station;
        forUpdate.name = 'updated name';
        forUpdate.id = createdStationOneId;

        const response = await api.put(`${API.STATION}`)
            .send(forUpdate)
            .expect(200);

        expect(response.body.name).toBe('updated name');
    });

    it('should update Station with station_type_id of null', async () => {
        const responseBefore = await api.get(`${API.STATION}/${createdStationOneId}`)
            .expect(200);
        const stationBefore = responseBefore.body as Station;
        expect(stationBefore.station_type_id).toBe(createdStationTypeId);

        const forUpdate = { ...stationBefore };
        forUpdate.station_type_id = null;

        const responseAfter = await api.put(`${API.STATION}`)
            .send(forUpdate)
            .expect(200);

        const stationAfter = responseAfter.body as Station;

        expect(stationAfter.station_type_id).toBeNull();
    });

    it('should not update Station with duplicate name values', async () => {
        const forUpdate = { ...stationOne } as Station;
        forUpdate.name = stationTwo.name;
        forUpdate.id = createdStationOneId;

        const response = await api.put(`${API.STATION}`)
            .send(forUpdate)
            .expect(400);

        expect(response.body).toStrictEqual({ error: Errors.DUPLICATE_ENTRY });
    });

    it('should not update Station with missing company_id', async () => {
        const forUpdate = {} as Station;
        forUpdate.name = stationOne.name;
        forUpdate.id = createdStationOneId;

        const response = await api.put(`${API.STATION}`)
            .send(forUpdate)
            .expect(400);

        expect(response.body).toStrictEqual({ error: Errors.WRONG_STRUCTURE });
    });

    it('should not update Station with non-existent company_id', async () => {
        const forUpdate = { ...stationOne } as Station;
        forUpdate.company_id = createdCompanyId + 100;
        forUpdate.id = createdStationOneId;

        const response = await api.put(`${API.STATION}`)
            .send(forUpdate)
            .expect(404);

        expect(response.body).toStrictEqual({ error: Errors.COMPANY_NOT_EXIST });
    });

    it('should not update Station with non-existent station_type_id', async () => {
        const forUpdate = { ...stationOne } as Station;
        forUpdate.station_type_id = createdStationTypeId + 100;
        forUpdate.id = createdStationOneId;

        const response = await api.put(`${API.STATION}`)
            .send(forUpdate)
            .expect(404);

        expect(response.body).toStrictEqual({ error: Errors.STATION_TYPE_NOT_EXIST });
    });

    it('should not update Station that does not exist', async () => {
        const forUpdate = { ...stationOne } as Station;
        forUpdate.id = createdStationOneId + 100;

        const response = await api.put(`${API.STATION}`)
            .send(forUpdate)
            .expect(400);

        expect(response.body).toStrictEqual({ error: Errors.WRONG_STRUCTURE });
    });
});

describe('DELETE Station', () => {
    it('should delete existing Station', async () => {
        const responseReadAllBefore = await api.get(`${API.STATION}/all`)
            .expect(200);
        const countBefore = (responseReadAllBefore.body as StationType[]).length;

        const response = await api.delete(`${API.STATION}/${createdStationOneId}`)
            .expect(200);
        expect(response.body).toStrictEqual({ message: `Deleted station ${createdStationOneId}` });

        const responseReadAllAfter = await api.get(`${API.STATION}/all`)
            .expect(200);
        const countAfter = (responseReadAllAfter.body as StationType[]).length;
        expect(countAfter).toBe(countBefore - 1);
    });

    it('should not delete non-existing Station', async () => {
        const responseReadAllBefore = await api.get(`${API.STATION}/all`)
            .expect(200);
        const countBefore = (responseReadAllBefore.body as StationType[]).length;

        const response = await api.delete(`${API.STATION}/${createdStationOneId + 100}`)
            .expect(200);
        expect(response.body).toStrictEqual({ message: `Deleted station ${createdStationOneId + 100}` });

        const responseReadAllAfter = await api.get(`${API.STATION}/all`)
            .expect(200);
        const countAfter = (responseReadAllAfter.body as StationType[]).length;
        expect(countAfter).toBe(countBefore);
    });

    it('should not delete when ID is wrong', async () => {
        const responseReadAllBefore = await api.get(`${API.STATION}/all`)
            .expect(200);
        const countBefore = (responseReadAllBefore.body as StationType[]).length;

        const response = await api.delete(`${API.STATION}/wrong`)
            .expect(404);
        expect(response.body).toStrictEqual({ error: Errors.INCORRECT_ID });

        const responseReadAllAfter = await api.get(`${API.STATION}/all`)
            .expect(200);
        const countAfter = (responseReadAllAfter.body as StationType[]).length;
        expect(countAfter).toBe(countBefore);
    });
});
