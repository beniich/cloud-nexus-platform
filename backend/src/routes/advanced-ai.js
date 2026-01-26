
// ============================================================
// 3. ADVANCED AI FEATURES
// ============================================================

import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import express from 'express';

const router = express.Router();

export class AdvancedAIService {

    constructor() {
        if (process.env.ANTHROPIC_API_KEY) {
            this.anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
        } else {
            console.warn('⚠️ ANTHROPIC_API_KEY missing. Claude features disabled.');
        }

        if (process.env.OPENAI_API_KEY) {
            this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        } else {
            console.warn('⚠️ OPENAI_API_KEY missing. OpenAI features disabled.');
        }
    }

    // Image generation (DALL-E 3)
    async generateImage(prompt, size = '1024x1024') {
        if (!this.openai) throw new Error('OpenAI not configured');

        const response = await this.openai.images.generate({
            model: 'dall-e-3',
            prompt,
            n: 1,
            size,
            quality: 'hd'
        });

        return {
            url: response.data[0].url,
            revisedPrompt: response.data[0].revised_prompt
        };
    }

    // Code analysis with Claude
    async analyzeCode(code, language) {
        if (!this.anthropic) throw new Error('Anthropic not configured');

        const message = await this.anthropic.messages.create({
            model: 'claude-3-sonnet-20240229', // Updated to valid model
            max_tokens: 2000,
            messages: [{
                role: 'user',
                content: `Analyze this ${language} code and provide:
1. Security vulnerabilities
2. Performance issues
3. Best practices violations
4. Improvement suggestions

Code:
\`\`\`${language}
${code}
\`\`\`

Respond in JSON format:
{
  "security": [],
  "performance": [],
  "quality": [],
  "suggestions": []
}`
            }]
        });

        try {
            return JSON.parse(message.content[0].text);
        } catch (e) {
            return { error: "Failed to parse AI response", raw: message.content[0].text };
        }
    }

    // SEO optimization
    async optimizeSEO(content) {
        if (!this.anthropic) throw new Error('Anthropic not configured');

        const message = await this.anthropic.messages.create({
            model: 'claude-3-sonnet-20240229',
            max_tokens: 1500,
            messages: [{
                role: 'user',
                content: `Optimize this content for SEO:

${content}

Return JSON with:
{
  "title": "optimized title (60 chars max)",
  "metaDescription": "description (160 chars max)",
  "keywords": ["keyword1", "keyword2"],
  "headings": ["h1", "h2", "h3"],
  "improvements": []
}`
            }]
        });

        try {
            return JSON.parse(message.content[0].text);
        } catch (e) {
            return { error: "Failed to parse AI response", raw: message.content[0].text };
        }
    }

    // Content moderation
    async moderateContent(text) {
        if (!this.openai) throw new Error('OpenAI not configured');

        const response = await this.openai.moderations.create({
            input: text
        });

        const results = response.results[0];
        return {
            flagged: results.flagged,
            categories: results.categories,
            safe: !results.flagged
        };
    }

    // Text-to-speech
    async textToSpeech(text, voice = 'alloy') {
        if (!this.openai) throw new Error('OpenAI not configured');

        const mp3 = await this.openai.audio.speech.create({
            model: 'tts-1-hd',
            voice,
            input: text
        });

        return Buffer.from(await mp3.arrayBuffer());
    }

    // Vision analysis
    async analyzeImage(imageUrl) {
        if (!this.openai) throw new Error('OpenAI not configured');

        const response = await this.openai.chat.completions.create({
            model: 'gpt-4-vision-preview',
            messages: [{
                role: 'user',
                content: [
                    { type: 'text', text: 'Describe this image in detail for alt text and accessibility.' },
                    { type: 'image_url', image_url: { url: imageUrl } }
                ]
            }],
            max_tokens: 500
        });

        return response.choices[0].message.content;
    }
}

export const aiService = new AdvancedAIService();

// API Routes
router.post('/generate-image', async (req, res) => {
    try {
        const { prompt, size } = req.body;
        const result = await aiService.generateImage(prompt, size);
        res.json({ success: true, ...result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/analyze-code', async (req, res) => {
    try {
        const { code, language } = req.body;
        const analysis = await aiService.analyzeCode(code, language);
        res.json({ success: true, analysis });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/optimize-seo', async (req, res) => {
    try {
        const { content } = req.body;
        const optimized = await aiService.optimizeSEO(content);
        res.json({ success: true, ...optimized });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/moderate', async (req, res) => {
    try {
        const { text } = req.body;
        const result = await aiService.moderateContent(text);
        res.json({ success: true, ...result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
