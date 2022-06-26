import { CompanyEntity, Station } from './interfaces';

export const companyEntities: CompanyEntity[] = [
    {
        id: 1,
        name: 'company 1',
        children: [2, 3]
    },
    {
        id: 2,
        name: 'company 2',
        children: [],
        parent_id: 1
    },
    {
        id: 3,
        name: 'company 3',
        children: [],
        parent_id: 1
    }
];

export const stations: Station[] = [
    {
        id: 1,
        maxPower: 10,
        company_id: 3
    },
    {
        id: 2,
        maxPower: 20,
        company_id: 2
    },
    {
        id: 3,
        maxPower: 30,
        company_id: 2
    },
    {
        id: 4,
        maxPower: 40,
        company_id: 3
    },
    {
        id: 5,
        maxPower: 50,
        company_id: 1
    }
];
