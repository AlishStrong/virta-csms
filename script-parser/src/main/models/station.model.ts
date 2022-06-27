export interface StationEntity {
  id: number;
  name: string;
  company_id: number;
  station_type_id?: number;
}

export interface StationTypeEntity {
  id: number;
  name: string;
  maxPower: number;
}

export interface Station {
  id: number;
  maxPower: number;
  company_id: number;
}
