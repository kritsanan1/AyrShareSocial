
import fetch from 'node-fetch';

interface LighthouseResult {
  score: number;
  categories: {
    performance: { score: number };
    accessibility: { score: number };
    'best-practices': { score: number };
    seo: { score: number };
    pwa: { score: number };
  };
  audits: {
    'viewport': { score: number; details?: any };
    'tap-targets': { score: number; details?: any };
    'font-size': { score: number; details?: any };
  };
}

export class LighthouseService {
  private apiKey: string;
  private baseUrl = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async testMobileResponsiveness(url: string): Promise<LighthouseResult> {
    try {
      const params = new URLSearchParams({
        url: url,
        key: this.apiKey,
        strategy: 'mobile',
        category: 'performance',
        category: 'accessibility',
        category: 'best-practices',
        category: 'seo',
        category: 'pwa'
      });

      const response = await fetch(`${this.baseUrl}?${params}`);
      const data = await response.json() as any;

      if (!response.ok) {
        throw new Error(`Lighthouse API error: ${data.error?.message || 'Unknown error'}`);
      }

      const lighthouse = data.lighthouseResult;
      
      return {
        score: lighthouse.categories.performance.score * 100,
        categories: {
          performance: { score: lighthouse.categories.performance.score * 100 },
          accessibility: { score: lighthouse.categories.accessibility.score * 100 },
          'best-practices': { score: lighthouse.categories['best-practices'].score * 100 },
          seo: { score: lighthouse.categories.seo.score * 100 },
          pwa: { score: lighthouse.categories.pwa.score * 100 }
        },
        audits: {
          'viewport': {
            score: lighthouse.audits.viewport?.score * 100 || 0,
            details: lighthouse.audits.viewport?.details
          },
          'tap-targets': {
            score: lighthouse.audits['tap-targets']?.score * 100 || 0,
            details: lighthouse.audits['tap-targets']?.details
          },
          'font-size': {
            score: lighthouse.audits['font-size']?.score * 100 || 0,
            details: lighthouse.audits['font-size']?.details
          }
        }
      };
    } catch (error) {
      console.error('Lighthouse API test failed:', error);
      throw error;
    }
  }

  async testMultipleUrls(urls: string[]): Promise<{ url: string; results: LighthouseResult }[]> {
    const results = await Promise.allSettled(
      urls.map(async (url) => ({
        url,
        results: await this.testMobileResponsiveness(url)
      }))
    );

    return results
      .filter((result): result is PromiseFulfilledResult<{ url: string; results: LighthouseResult }> => 
        result.status === 'fulfilled'
      )
      .map(result => result.value);
  }
}
