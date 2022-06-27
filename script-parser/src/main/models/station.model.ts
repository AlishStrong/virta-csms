// The form returned by api-backend service
export interface StationEntity {
  id: number;
  name: string;
  company_id: number;
  station_type_id?: number;
}

// The form returned by api-backend service
export interface StationTypeEntity {
  id: number;
  name: string;
  maxPower: number;
}

// The form needed for StepData
export interface Station {
  id: number;
  maxPower: number;
  company_id: number;
}
