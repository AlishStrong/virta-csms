import { Company } from './company.model';

export interface StepData {
  step: string;
  timestamp: number;
  companies: Company[];
  totalChargingStations: Set<number>;
  totalChargingPower: number;
}
