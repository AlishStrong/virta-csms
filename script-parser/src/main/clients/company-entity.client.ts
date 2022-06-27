import axios, { AxiosResponse } from 'axios';
import { CompanyEntity } from '../models/company.model';

export const getCompanyEntityById = async (companyId: number) => {
    return axios.get<CompanyEntity>(`http://${process.env.CLIENT_HOST}:${process.env.CLIENT_PORT}/company/${companyId}`)
        .then((response: AxiosResponse<CompanyEntity>) => response.data)
        .catch(_error => {
            // console.log(error.response?.data);
            return {} as CompanyEntity;
        });
};
