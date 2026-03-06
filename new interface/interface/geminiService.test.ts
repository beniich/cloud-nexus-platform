import { describe, it, expect, vi, beforeEach } from 'vitest';
import { geminiService } from '@services/geminiService';

// Mock de l'API Google Gemini
global.fetch = vi.fn();

describe('GeminiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateContent', () => {
    it('should generate content successfully', async () => {
      const mockResponse = {
        candidates: [
          {
            content: {
              parts: [{ text: 'Generated content' }],
            },
          },
        ],
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await geminiService.generateContent('Test prompt');

      expect(result).toBe('Generated content');
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('generativelanguage.googleapis.com'),
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );
    });

    it('should handle API errors', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      } as Response);

      await expect(
        geminiService.generateContent('Test prompt')
      ).rejects.toThrow('Failed to generate content');
    });

    it('should handle network errors', async () => {
      vi.mocked(fetch).mockRejectedValueOnce(
        new Error('Network error')
      );

      await expect(
        geminiService.generateContent('Test prompt')
      ).rejects.toThrow('Network error');
    });

    it('should handle empty response', async () => {
      const mockResponse = {
        candidates: [],
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await geminiService.generateContent('Test prompt');

      expect(result).toBe('');
    });
  });

  describe('getInsights', () => {
    it('should get insights based on metrics', async () => {
      const mockMetrics = {
        cpu: 85,
        memory: 70,
        storage: 60,
        network: 40,
      };

      const mockInsight = 'CPU usage is high. Consider scaling resources.';

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          candidates: [
            {
              content: {
                parts: [{ text: mockInsight }],
              },
            },
          ],
        }),
      } as Response);

      const result = await geminiService.getInsights(mockMetrics);

      expect(result).toBe(mockInsight);
      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining('85'),
        })
      );
    });

    it('should cache insights for same metrics', async () => {
      const mockMetrics = {
        cpu: 50,
        memory: 50,
        storage: 50,
        network: 50,
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          candidates: [
            {
              content: {
                parts: [{ text: 'Insight' }],
              },
            },
          ],
        }),
      } as Response);

      // Premier appel
      await geminiService.getInsights(mockMetrics);
      
      // Deuxième appel avec les mêmes métriques
      await geminiService.getInsights(mockMetrics);

      // Fetch ne devrait être appelé qu'une seule fois
      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('analyzePerformance', () => {
    it('should analyze performance trends', async () => {
      const mockData = [
        { timestamp: Date.now() - 3600000, cpu: 50, memory: 60 },
        { timestamp: Date.now() - 1800000, cpu: 60, memory: 65 },
        { timestamp: Date.now(), cpu: 70, memory: 70 },
      ];

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          candidates: [
            {
              content: {
                parts: [{ text: 'Performance is degrading' }],
              },
            },
          ],
        }),
      } as Response);

      const result = await geminiService.analyzePerformance(mockData);

      expect(result).toContain('degrading');
    });
  });
});
