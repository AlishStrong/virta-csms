import { getStationById } from '../../main/clients/station.client';

test('Station client should get station by id', async () => {
    const station = await getStationById(1);
    expect(station.id).toBe(1);
});
