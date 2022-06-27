import axios, { AxiosResponse } from 'axios';
import { CompanyEntity } from '../models/company.model';

/**
 * Obtains a CompanyEntity by making a request to api-backend service with company's ID
 *
 * @returns a CompanyEntity object, or an empty object if there was an issue
 */
export const getCompanyEntityById = async (companyId: number) => {
    return axios.get<CompanyEntity>(`http://${process.env.CLIENT_HOST}:${process.env.CLIENT_PORT}/company/${companyId}`)
        .then((response: AxiosResponse<CompanyEntity>) => response.data)
        .catch(_error => {
            // console.log(error.response?.data);
            return {} as CompanyEntity;
        });
};
