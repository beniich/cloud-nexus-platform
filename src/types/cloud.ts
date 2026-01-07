export interface Droplet {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'starting';
  region: string;
  size: string;
  ip: string;
  cpu: number;
  ram: number;
  cost: number;
}

export interface Domain {
  id: string;
  name: string;
  records: number;
  status: 'active' | 'pending';
}

export interface Database {
  id: string;
  name: string;
  engine: 'postgres' | 'mysql' | 'redis';
  status: 'active' | 'creating' | 'maintenance';
  size: string;
  region: string;
}

export interface CloudKPIData {
  activeDroplets: number;
  activeDomains: number;
  monthlyCost: number;
  totalResources: number;
}
