// The form needed for StepData
export interface Company {
  id: number;
  chargingStations: Set<number>;
  cargingPower: number;
}

// The form returned by api-backend service
export interface CompanyEntity {
  id: number;
  name: string;
  childrenIds: number[];
  parent_id?: number;
}
