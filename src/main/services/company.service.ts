import { ResultSetHeader } from 'mysql2';
import executeQuery from '../database/database';
import { Company, CompanyToCreate } from '../models/company.model';

const createCompany = async (companyToCreate: CompanyToCreate) => {
    const result = await executeQuery('INSERT INTO `company` (`name`) VALUES (?)', Object.values(companyToCreate)) as ResultSetHeader;
    return result.insertId;
};

const getAllCompanies = async (): Promise<Company[]> => {
    return await executeQuery('SELECT * FROM `company` ORDER BY `id`') as Company[];
};

const getCompanyByID = async (companyId: number): Promise<Company> => {
    const result = await executeQuery('SELECT * FROM `company` WHERE `id` = ?', [companyId]) as Company[];
    if (result.length > 0) {
        return result[0];
    } else {
        return {} as Company;
    }
};

const updateCompany = async (company: Company): Promise<number> => {
    const result = await executeQuery('UPDATE `company` SET `name` = ? WHERE `id` = ?', [company.name, company.id]) as ResultSetHeader;
    return result.affectedRows;
};

const deleteCompanyByID = async (companyId: number): Promise<void> => {
    await executeQuery('DELETE FROM `company` WHERE `id` = ?', [companyId]);
};

export default {
    createCompany,
    getAllCompanies,
    getCompanyByID,
    updateCompany,
    deleteCompanyByID
};
