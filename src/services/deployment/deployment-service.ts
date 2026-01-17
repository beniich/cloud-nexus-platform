import type {
    DeploymentProvider,
    DeploymentResult,
    DeploymentConfig,
    DNSRecord,
    DomainVerification
} from '../../types/deployment.types';

import { VercelProvider } from './vercel-provider';
import { NetlifyProvider } from './netlify-provider';

export class DeploymentService {
    private providers: Map<string, DeploymentProvider>;

    constructor() {
        this.providers = new Map();
        this.providers.set('vercel', new VercelProvider());
        this.providers.set('netlify', new NetlifyProvider());
    }

    /**
     * Déploie un site sur le provider choisi
     */
    async deploy(
        site: any,
        buildOutput: any,
        config: DeploymentConfig
    ): Promise<DeploymentResult> {
        const provider = this.providers.get(config.provider);

        if (!provider) {
            throw new Error(`Unknown deployment provider: ${config.provider}`);
        }

        try {
            const result = await provider.deploy(site, buildOutput);

            // Configurer le domaine personnalisé si spécifié
            if (config.customDomain) {
                await provider.configureCustomDomain(config.customDomain);
            }

            return result;
        } catch (error) {
            throw new Error(`Deployment failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Récupère le statut d'un déploiement
     */
    async getDeploymentStatus(
        provider: string,
        deploymentId: string
    ): Promise<DeploymentResult> {
        const deploymentProvider = this.providers.get(provider);

        if (!deploymentProvider) {
            throw new Error(`Unknown deployment provider: ${provider}`);
        }

        return deploymentProvider.getStatus(deploymentId);
    }

    /**
     * Rollback vers un déploiement précédent
     */
    async rollback(provider: string, deploymentId: string): Promise<void> {
        const deploymentProvider = this.providers.get(provider);

        if (!deploymentProvider) {
            throw new Error(`Unknown deployment provider: ${provider}`);
        }

        await deploymentProvider.rollback(deploymentId);
    }

    /**
     * Vérifie la configuration DNS d'un domaine
     */
    async verifyDomain(
        provider: string,
        domain: string
    ): Promise<DomainVerification> {
        const deploymentProvider = this.providers.get(provider);

        if (!deploymentProvider) {
            throw new Error(`Unknown deployment provider: ${provider}`);
        }

        return deploymentProvider.verifyDomain(domain);
    }

    /**
     * Obtient les enregistrements DNS requis
     */
    async getDNSRecords(
        provider: string,
        domain: string
    ): Promise<DNSRecord[]> {
        const deploymentProvider = this.providers.get(provider);

        if (!deploymentProvider) {
            throw new Error(`Unknown deployment provider: ${provider}`);
        }

        return deploymentProvider.configureCustomDomain(domain);
    }
}

export default DeploymentService;
