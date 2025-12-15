import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { StorefrontController } from '../controllers/StorefrontController';
import { GetStorefrontUseCase } from '../../application/use-cases/vendor/GetStorefrontUseCase';
import { PrismaVendorRepository } from '../../infrastructure/persistence/PrismaVendorRepository';
import { SocialMediaAdapter } from '../../infrastructure/social/SocialMediaAdapter';

@Module({
    controllers: [StorefrontController],
    providers: [
        GetStorefrontUseCase,
        { provide: PrismaClient, useValue: new PrismaClient() }, // Providing actual PrismaClient instance
        // Dependency Injection mapping using String Tokens as defined in @Inject()
        { provide: 'VendorRepository', useClass: PrismaVendorRepository },
        { provide: 'SocialMediaPort', useClass: SocialMediaAdapter }
    ],
})
export class MarketplaceModule { }
