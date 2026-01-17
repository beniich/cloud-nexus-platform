export type DeploymentProviderType = 'vercel' | 'netlify';

export type DeploymentStatus =
    | 'queued'
    | 'building'
    | 'deploying'
    | 'ready'
    | 'error'
    | 'cancelled';

export interface DeploymentConfig {
    provider: DeploymentProviderType;
    buildCommand?: string;
    outputDirectory: string;
    environmentVariables?: Record<string, string>;
    customDomain?: string;
}

export interface DeploymentResult {
    id: string;
    url: string;
    status: DeploymentStatus;
    createdAt: string;
    deployedAt?: string;
    error?: string;
    logs: DeploymentLog[];
    preview: boolean;
}

export interface DeploymentLog {
    timestamp: string;
    level: 'info' | 'warn' | 'error';
    message: string;
}

export interface DNSRecord {
    type: 'A' | 'AAAA' | 'CNAME' | 'TXT';
    name: string;
    value: string;
    ttl?: number;
}

export interface DomainVerification {
    domain: string;
    verified: boolean;
    records: DNSRecord[];
    lastChecked: string;
    errors?: string[];
}

export interface SSLStatus {
    enabled: boolean;
    issuer?: string;
    expiresAt?: string;
    autoRenew: boolean;
    status: 'active' | 'pending' | 'expired' | 'error';
}

export interface DeploymentProvider {
    name: DeploymentProviderType;
    deploy(site: any, buildOutput: any): Promise<DeploymentResult>;
    getStatus(deploymentId: string): Promise<DeploymentResult>;
    rollback(deploymentId: string): Promise<void>;
    configureCustomDomain(domain: string): Promise<DNSRecord[]>;
    verifyDomain(domain: string): Promise<DomainVerification>;
}
