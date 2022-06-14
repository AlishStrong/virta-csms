export interface Company {
  id: number;
  name: string;
  parentId?: number;
  childrenIds?: number[];
}
