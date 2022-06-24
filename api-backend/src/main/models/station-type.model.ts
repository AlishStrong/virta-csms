export interface StationType {
  id: number;
  name: string;
  maxPower: number;
}

export type StationTypeToCreate = Pick<StationType, 'name'> & Pick<StationType, 'maxPower'>;
