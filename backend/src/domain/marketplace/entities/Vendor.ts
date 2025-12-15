export class Vendor {
    constructor(
        public readonly id: string,
        public readonly storeSlug: string,
        public readonly name: string,
        public theme: VendorTheme,
        public socialAccounts: SocialAccounts
    ) { }
}

export interface VendorTheme {
    primaryColor: string;
    bannerUrl: string;
}

export interface SocialAccounts {
    instagram?: { username: string; connected: boolean };
    tiktok?: { username: string; connected: boolean };
}
