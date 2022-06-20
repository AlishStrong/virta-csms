export interface Station {
  id: number;
  name: string;
  company_id: number;
  station_type_id?: number | null; // null is needed for the mysql2 which does not understand undefined
}

export type StationToCreate = Pick<Station, 'name'> & Pick<Station, 'company_id'> & Pick<Station, 'station_type_id'>;
