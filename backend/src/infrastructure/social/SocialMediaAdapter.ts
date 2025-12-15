import { SocialMediaPort } from '../../domain/marketplace/ports/SocialMediaPort';

export class SocialMediaAdapter implements SocialMediaPort {
    async fetchLatestPosts(vendorId: string): Promise<any[]> {
        return [
            { platform: 'instagram', mediaUrl: 'https://insta.fake/post1' },
            { platform: 'tiktok', mediaUrl: 'https://tiktok.fake/video1' }
        ];
    }
}
