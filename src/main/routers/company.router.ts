import express, { Request, Response } from 'express';
import { CompanyRelationship } from '../models/company-relationship.model';
import { Company, CompanyToCreate } from '../models/company.model';
import relationshipService from '../services/company-relationship.service';
import companyService from '../services/company.service';
import { Errors } from '../utils/error.enums';
import utils from '../utils/utils';

const companyRouter = express.Router();

const createCompany = async (request: Request, response: Response) => {
    const body = request.body as CompanyToCreate;
    if (body.name) {
        const companyId = await companyService.createCompany(body);
        response.status(201).json({ id: companyId, name: body.name } as Company);
    } else {
        throw new Error(Errors.WRONG_STRUCTURE);
    }
};

const getAllCompanies = async (_request: Request, response: Response) => {
    const allCompanies = await companyService.getAllCompanies().then((companies: Company[]) => {
        return Promise.all(companies.map(async (c: Company) => {
            c.childrenIds = await relationshipService.getAllChildrenIDs(c.id);
            return c;
        }));
    });

    response.status(200).json(allCompanies);
};

const getCompanyById = async (request: Request, response: Response) => {
    const companyId = utils.parseId(request.params.id);
    const company = await companyService.getCompanyByID(companyId).then(async (c: Company) => {
        if (c.id) {
            c.childrenIds = await relationshipService.getAllChildrenIDs(c.id);
        }
        return c;
    });

    if (utils.isEmpty(company)) {
        return response.status(404).json({ message: `Requested company ${companyId} was not found!` });
    } else {
        return response.status(200).json(company);
    }
};

const updateCompany = async (request: Request, response: Response) => {
    const body = request.body as Company;
    if (body.id && body.name) {
        const affectedRows = await companyService.updateCompany(body);
        if (affectedRows === 1) {
            const children = await relationshipService.getAllChildrenIDs(body.id);
            response.status(200).json({ id: body.id, name: body.name, childrenIds: children } as Company);
        } else {
            throw new Error(Errors.WRONG_STRUCTURE);
        }
    } else {
        throw new Error(Errors.WRONG_STRUCTURE);
    }
};

const addChild = async (request: Request, response: Response) => {
    const body = request.body as Pick<CompanyRelationship, 'child_id'>;
    const parentId = utils.parseId(request.params.id);
    const childId = body.child_id;
    if (!childId || childId === parentId) throw new Error(Errors.WRONG_STRUCTURE);
    if (!(await companyService.getCompanyByID(parentId)).id) throw new Error(Errors.PARENT_NOT_EXIST);
    if (!(await companyService.getCompanyByID(childId)).id) throw new Error(Errors.CHILD_NOT_EXIST);
    if (!(await relationshipService.isOrphan(childId))) throw new Error(Errors.COMPANY_RELATIONSHIP);

    await relationshipService.setRelationship(parentId, childId);
    response.status(200).json({ message: `Child company ${childId} was added to Parent company ${parentId}` });
};

const removeChild = async (request: Request, response: Response) => {
    const body = request.body as Pick<CompanyRelationship, 'child_id'>;
    const parentId = utils.parseId(request.params.id);
    const childId = body.child_id;

    if (!childId || childId === parentId) throw new Error(Errors.WRONG_STRUCTURE);
    if (!(await companyService.getCompanyByID(parentId)).id) throw new Error(Errors.PARENT_NOT_EXIST);
    if (!(await companyService.getCompanyByID(childId)).id) throw new Error(Errors.CHILD_NOT_EXIST);
    if (!(await relationshipService.isParent(parentId, childId))) throw new Error(Errors.COMPANY_PARENTHOOD);

    await relationshipService.removeRelationship(parentId, childId);
    response.status(200).json({ message: `Child company ${childId} was removed from Parent company ${parentId}` });
};

const deleteCompany = async (request: Request, response: Response) => {
    const companyId = utils.parseId(request.params.id);
    await companyService.deleteCompanyByID(companyId);
    response.status(200).json({ message: `Deleted company ${companyId}` });
};

companyRouter.post('/', createCompany);
companyRouter.get('/all', getAllCompanies);
companyRouter.get('/:id', getCompanyById);
companyRouter.put('/', updateCompany);
companyRouter.post('/:id/add-child', addChild);
companyRouter.post('/:id/remove-child', removeChild);
companyRouter.delete('/:id', deleteCompany);

export default companyRouter;
