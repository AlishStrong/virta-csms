import supertest from 'supertest';
import server from '../../main/server';
import { API } from '../../main/utils/api-paths.enums';

const api = supertest(server);

describe('GET station-type', () => {
    it('should return all station types when requested /all', async () => {
        const result = await api.get(`${API.STATION_TYPES}/all`)
            .expect(200);
        expect(result.text).toBe('get all station types');
    });

    it('should return a station type when correct ID is provided', async (correctId = 10) => {
        const result = await api.get(`${API.STATION_TYPES}/${correctId}`)
            .expect(200);
        expect(result.text).toBe(`get station type ${correctId}`);
    });

    it('should return error when non-number-convertable ID is provided', async (wrongId = 'ten') => {
        const result = await api.get(`${API.STATION_TYPES}/${wrongId}`)
            .expect(404);
        expect(result.body.error).toBe('Incorrect ID');
    });
});
