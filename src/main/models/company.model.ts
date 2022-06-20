import { CompanyRelationship } from './company-relationship.model';

export interface Company {
  id: number;
  name: string;
  parentId?: number;
  childrenIds?: Pick<CompanyRelationship, 'child_id'>[];
}

export type CompanyToCreate = Pick<Company, 'name'>;
