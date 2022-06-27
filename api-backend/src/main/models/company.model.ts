// import { CompanyRelationship } from './company-relationship.model';

export interface Company {
  id: number;
  name: string;
  // childrenIds: Pick<CompanyRelationship, 'child_id'>[];
  childrenIds: number[];
  parent_id?: number;
}

export type CompanyToCreate = Pick<Company, 'name'>;
