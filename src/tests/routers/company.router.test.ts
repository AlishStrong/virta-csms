/* eslint-disable @typescript-eslint/no-unused-vars */
import supertest from 'supertest';
import executeQuery from '../../main/database/database';
import { Company } from '../../main/models/company.model';
import server from '../../main/server';
import { API } from '../../main/utils/api-paths.enums';
import { Errors } from '../../main/utils/error.enums';

const api = supertest(server);

const companyOne = {
    name: 'test company one',
};
const companyTwo = {
    name: 'test company two',
};
const companyThree = {
    name: 'test company three',
};
let createdCompanyOneId: number;
let createdCompanyTwoId: number;
let createdCompanyThreeId: number;


beforeAll(async () => {
    await executeQuery('DELETE FROM `company`');
    await executeQuery('DELETE FROM `company_relationship`');
});

afterAll(async () => {
    await executeQuery('DELETE FROM `station_type`');
    await executeQuery('DELETE FROM `company_relationship`');
});

describe('CREATE Company', () => {
    it('should create a new Company', async () => {
        const responseOne = await api.post(`${API.COMPANY}`)
            .send(companyOne)
            .expect(201);

        expect(responseOne.body).toMatchObject(companyOne);

        const responseTwo = await api.post(`${API.COMPANY}`)
            .send(companyTwo)
            .expect(201);

        expect(responseTwo.body).toMatchObject(companyTwo);

        const responseThree = await api.post(`${API.COMPANY}`)
            .send(companyThree)
            .expect(201);

        expect(responseThree.body).toMatchObject(companyThree);

        createdCompanyOneId = (responseOne.body as Company).id;
        createdCompanyTwoId = (responseTwo.body as Company).id;
        createdCompanyThreeId = (responseThree.body as Company).id;
    });

    it('should not create a Company with a missing name', async () => {
        const response = await api.post(`${API.COMPANY}`)
            .send({})
            .expect(400);

        expect(response.body).toStrictEqual({ error: Errors.WRONG_STRUCTURE });
    });

    it('should not create a Company with an existing name', async () => {
        const response = await api.post(`${API.COMPANY}`)
            .send(companyOne)
            .expect(400);

        expect(response.body).toStrictEqual({ error: Errors.DUPLICATE_ENTRY });
    });
});

describe('READ Company', () => {
    it('should get all Companies', async () => {
        const response = await api.get(`${API.COMPANY}/all`)
            .expect(200);

        expect(response.body).toHaveLength(3);
    });

    it('should get an existing Company', async () => {
        const response = await api.get(`${API.COMPANY}/${createdCompanyOneId}`)
            .expect(200);
        expect(response.body).toMatchObject({ id: createdCompanyOneId, name: companyOne.name });
    });

    it('should not get a non-existing Company', async () => {
        const response = await api.get(`${API.COMPANY}/${createdCompanyOneId + 10}`)
            .expect(404);
        expect(response.body).toStrictEqual({ message: `Requested company ${createdCompanyOneId + 10} was not found!` });
    });

    it('should notify if ID is wrong', async () => {
        const response = await api.get(`${API.COMPANY}/wrong-id`)
            .expect(404);
        expect(response.body).toStrictEqual({ error: Errors.INCORRECT_ID });
    });
});

describe('UPDATE Company', () => {
    it('should update Company with new values', async () => {
        const response = await api.put(`${API.COMPANY}`)
            .send({ id: createdCompanyOneId, name: 'cp 1' })
            .expect(200);

        expect(response.body.name).toBe('cp 1');
    });

    it('should not update Company with duplicate name values', async () => {
        const response = await api.put(`${API.COMPANY}`)
            .send({ id: createdCompanyTwoId, name: 'cp 1' })
            .expect(400);

        expect(response.body).toStrictEqual({ error: Errors.DUPLICATE_ENTRY });
    });

    it('should not update Company that does not exist', async () => {
        const response = await api.put(`${API.COMPANY}`)
            .send({ id: createdCompanyThreeId + 10, name: 'I dont exist' })
            .expect(400);

        expect(response.body).toStrictEqual({ error: Errors.WRONG_STRUCTURE });
    });

    describe('Update Company to Company relationship', () => {
        describe('Adding Child to Parent', () => {
            it('should add a child Company to a parent Company', async () => {
                const response = await api.post(`${API.COMPANY}/${createdCompanyOneId}/add-child`)
                    .send({ child_id: createdCompanyTwoId })
                    .expect(200);

                expect(response.body).toStrictEqual({ message: `Child company ${createdCompanyTwoId} was added to Parent company ${createdCompanyOneId}` });

                const parentCompanyResponse = await api.get(`${API.COMPANY}/${createdCompanyOneId}`)
                    .expect(200);

                const parentCompany = parentCompanyResponse.body as Company;
                expect(parentCompany.childrenIds).toHaveLength(1);
                expect(parentCompany.childrenIds).toContainEqual({ child_id: createdCompanyTwoId });
            });

            it('should not add a child Company that already has a parent', async () => {
                const response = await api.post(`${API.COMPANY}/${createdCompanyThreeId}/add-child`)
                    .send({ child_id: createdCompanyTwoId })
                    .expect(400);

                expect(response.body).toStrictEqual({ error: Errors.COMPANY_RELATIONSHIP });

                const parentCompanyResponse = await api.get(`${API.COMPANY}/${createdCompanyThreeId}`)
                    .expect(200);

                const parentCompany = parentCompanyResponse.body as Company;
                expect(parentCompany.childrenIds).toHaveLength(0);
            });

            it('should fail if parent Company does not exist', async () => {
                const response = await api.post(`${API.COMPANY}/${createdCompanyThreeId + 10}/add-child`)
                    .send({ child_id: createdCompanyTwoId })
                    .expect(404);

                expect(response.body).toStrictEqual({ error: Errors.PARENT_NOT_EXIST });
            });

            it('should fail if child Company does not exist', async () => {
                const response = await api.post(`${API.COMPANY}/${createdCompanyThreeId}/add-child`)
                    .send({ child_id: createdCompanyTwoId + 10 })
                    .expect(404);

                expect(response.body).toStrictEqual({ error: Errors.CHILD_NOT_EXIST });
            });

            it('should fail if child Company ID was not supplied', async () => {
                const response = await api.post(`${API.COMPANY}/${createdCompanyThreeId}/add-child`)
                    .send({})
                    .expect(400);

                expect(response.body).toStrictEqual({ error: Errors.WRONG_STRUCTURE });
            });

            it('should fail if parent Company ID is wrong', async () => {
                const response = await api.post(`${API.COMPANY}/wrong/add-child`)
                    .send({})
                    .expect(404);

                expect(response.body).toStrictEqual({ error: Errors.INCORRECT_ID });
            });

            it('should fail if child Company is same as parent Company', async () => {
                const response = await api.post(`${API.COMPANY}/${createdCompanyThreeId}/add-child`)
                    .send({ child_id: createdCompanyThreeId })
                    .expect(400);

                expect(response.body).toStrictEqual({ error: Errors.WRONG_STRUCTURE });
            });
        });

        describe('Removing Child from Parent', () => {
            it('should remove a child Company from a parent Company', async () => {
                const response = await api.post(`${API.COMPANY}/${createdCompanyOneId}/remove-child`)
                    .send({ child_id: createdCompanyTwoId })
                    .expect(200);

                expect(response.body).toStrictEqual({ message: `Child company ${createdCompanyTwoId} was removed from Parent company ${createdCompanyOneId}` });

                const parentCompanyResponse = await api.get(`${API.COMPANY}/${createdCompanyOneId}`)
                    .expect(200);

                const parentCompany = parentCompanyResponse.body as Company;
                expect(parentCompany.childrenIds).toHaveLength(0);
            });

            it('should fail if Companies are not in a relation', async () => {
                const response = await api.post(`${API.COMPANY}/${createdCompanyThreeId}/remove-child`)
                    .send({ child_id: createdCompanyTwoId })
                    .expect(400);

                expect(response.body).toStrictEqual({ error: Errors.COMPANY_PARENTHOOD });
            });

            it('should fail if parent Company does not exist', async () => {
                const response = await api.post(`${API.COMPANY}/${createdCompanyThreeId + 10}/remove-child`)
                    .send({ child_id: createdCompanyTwoId })
                    .expect(404);

                expect(response.body).toStrictEqual({ error: Errors.PARENT_NOT_EXIST });
            });

            it('should fail if child Company does not exist', async () => {
                const response = await api.post(`${API.COMPANY}/${createdCompanyThreeId}/remove-child`)
                    .send({ child_id: createdCompanyTwoId + 10 })
                    .expect(404);

                expect(response.body).toStrictEqual({ error: Errors.CHILD_NOT_EXIST });
            });

            it('should fail if child Company ID was not supplied', async () => {
                const response = await api.post(`${API.COMPANY}/${createdCompanyThreeId}/remove-child`)
                    .send({})
                    .expect(400);

                expect(response.body).toStrictEqual({ error: Errors.WRONG_STRUCTURE });
            });

            it('should fail if parent Company ID is wrong', async () => {
                const response = await api.post(`${API.COMPANY}/wrong/remove-child`)
                    .send({})
                    .expect(404);

                expect(response.body).toStrictEqual({ error: Errors.INCORRECT_ID });
            });

            it('should fail if child Company is same as parent Company', async () => {
                const response = await api.post(`${API.COMPANY}/${createdCompanyThreeId}/remove-child`)
                    .send({ child_id: createdCompanyThreeId })
                    .expect(400);

                expect(response.body).toStrictEqual({ error: Errors.WRONG_STRUCTURE });
            });
        });
    });
});

describe('DELETE Company', () => {
    it('should delete existing Company', async () => {
        const preAddChildResponse = await api.post(`${API.COMPANY}/${createdCompanyOneId}/add-child`)
            .send({ child_id: createdCompanyTwoId })
            .expect(200);

        expect(preAddChildResponse.body).toStrictEqual({ message: `Child company ${createdCompanyTwoId} was added to Parent company ${createdCompanyOneId}` });

        const readAllBeforeResponse = await api.get(`${API.COMPANY}/all`)
            .expect(200);
        const allCompaniesBefore = readAllBeforeResponse.body as Company[];

        expect(allCompaniesBefore.find(c => c.id === createdCompanyOneId)?.childrenIds).toContainEqual({ child_id: createdCompanyTwoId });

        const response = await api.delete(`${API.COMPANY}/${createdCompanyTwoId}`)
            .expect(200);
        expect(response.body).toStrictEqual({ message: `Deleted company ${createdCompanyTwoId}` });

        const responseReadAllAfter = await api.get(`${API.COMPANY}/all`)
            .expect(200);
        const countAfter = (responseReadAllAfter.body as Company[]).length;
        expect(countAfter).toBe(allCompaniesBefore.length - 1);
    });

    it('should not delete non-existing Company', async () => {
        const responseReadAll = await api.get(`${API.COMPANY}/all`)
            .expect(200);
        const count = (responseReadAll.body as Company[]).length;

        const response = await api.delete(`${API.COMPANY}/${createdCompanyTwoId + 100}`)
            .expect(200);
        expect(response.body).toStrictEqual({ message: `Deleted company ${createdCompanyTwoId + 100}` });

        const responseReadAllAfter = await api.get(`${API.COMPANY}/all`)
            .expect(200);
        const countAfter = (responseReadAllAfter.body as Company[]).length;
        expect(countAfter).toBe(count);
    });

    it('should not delete when ID is wrong', async () => {
        const responseReadAll = await api.get(`${API.COMPANY}/all`)
            .expect(200);
        const count = (responseReadAll.body as Company[]).length;

        const response = await api.delete(`${API.COMPANY}/wrong`)
            .expect(404);
        expect(response.body).toStrictEqual({ error: Errors.INCORRECT_ID });

        const responseReadAllAfter = await api.get(`${API.COMPANY}/all`)
            .expect(200);
        const countAfter = (responseReadAllAfter.body as Company[]).length;
        expect(countAfter).toBe(count);
    });
});
