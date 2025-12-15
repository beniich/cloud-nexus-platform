export interface SocialMediaPort {
    fetchLatestPosts(vendorId: string): Promise<any[]>;
}
