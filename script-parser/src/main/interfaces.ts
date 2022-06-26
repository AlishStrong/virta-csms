export interface Company {
  id: number;
  chargingStations: Set<number>;
  cargingPower: number;
}

export interface CompanyEntity {
  id: number;
  name: string;
  children: number[];
  parent_id?: number;
}

export interface Station {
  id: number;
  maxPower: number;
  company_id: number;
}

export interface StepData {
    step: string;
    timestamp: number;
    companies: Company[];
    totalChargingStations: Set<number>;
    totalChargingPower: number;
}
