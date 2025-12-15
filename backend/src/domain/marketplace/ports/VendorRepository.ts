import { Vendor } from '../entities/Vendor';

export interface VendorRepository {
    findBySlug(slug: string): Promise<Vendor | null>;
}
