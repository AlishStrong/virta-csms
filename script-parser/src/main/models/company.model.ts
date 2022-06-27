export interface Company {
  id: number;
  chargingStations: Set<number>;
  cargingPower: number;
}

export interface CompanyEntity {
  id: number;
  name: string;
  childrenIds: number[];
  parent_id?: number;
}
