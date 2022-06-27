import axios, { AxiosResponse } from 'axios';
import { CompanyEntity } from '../models/company.model';

export const getCompanyEntityById = async (companyId: number) => {
    return axios.get<CompanyEntity>(`http://localhost:3001/company/${companyId}`)
        .then((response: AxiosResponse<CompanyEntity>) => response.data)
        .catch(_error => {
            // console.log(error.response?.data);
            return {} as CompanyEntity;
        });
};
