import { ResultSetHeader } from 'mysql2';
import executeQuery from '../database/database';
import { CompanyRelationship } from '../models/company-relationship.model';

const setRelationship = async (parentId: number, childId: number) => {
    await executeQuery('INSERT INTO `company_relationship` (`parent_id`, `child_id`) VALUES (?, ?)', [parentId, childId]) as ResultSetHeader;
};

const removeRelationship = async (parentId: number, childId: number) => {
    await executeQuery('DELETE FROM `company_relationship` WHERE `parent_id` = ? AND `child_id` = ?', [parentId, childId]) as ResultSetHeader;
};

const getAllChildrenIDs = async (parentId: number) => {
    const result = await executeQuery('SELECT `child_id` FROM `company_relationship` WHERE `parent_id` = ? ORDER BY `child_id`', [parentId]) as Pick<CompanyRelationship, 'child_id'>[];
    return result.map(obj => obj.child_id);
};

const isOrphan = async (childId: number): Promise<boolean> => {
    const result = await executeQuery('SELECT `parent_id` FROM `company_relationship` WHERE `child_id` = ?', [childId]) as Pick<CompanyRelationship, 'parent_id'>[];
    return result.length === 0;
};

const isParent = async (parentId: number, childId: number): Promise<boolean> => {
    const result = await executeQuery('SELECT `parent_id` FROM `company_relationship` WHERE `child_id` = ?', [childId]) as Pick<CompanyRelationship, 'parent_id'>[];
    if (result.length === 0) {
        return false;
    } else {
        return parentId === result[0].parent_id;
    }
};

export default {
    setRelationship,
    removeRelationship,
    getAllChildrenIDs,
    isOrphan,
    isParent
};
