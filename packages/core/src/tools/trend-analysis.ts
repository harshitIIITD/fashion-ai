/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  BaseDeclarativeTool,
  ToolResult,
  ToolInvocation,
  Kind,
} from './tools.js';
import { Config } from '../config/config.js';

export interface TrendAnalysisParams {
  season: string;
  category: string;
  market?: string;
  age_group?: string;
}

export interface TrendAnalysisResult extends ToolResult {
  trends: Array<{
    name: string;
    confidence: number;
    description: string;
    colors: string[];
    materials: string[];
    target_audience: string;
  }>;
  market_insights: string;
  recommendations: string[];
}

/**
 * Tool for analyzing fashion trends based on season, category, and market
 */
export class TrendAnalysisTool extends BaseDeclarativeTool<
  TrendAnalysisParams,
  TrendAnalysisResult
> {
  static readonly Name = 'trend_analysis';

  constructor(_config: Config) {
    super(
      TrendAnalysisTool.Name,
      'Fashion Trend Analysis',
      'Analyze current fashion trends for specific seasons, categories, and markets',
      'fashion_analysis' as Kind, // Using a custom kind for fashion tools
      {
        type: 'object',
        properties: {
          season: {
            type: 'string',
            description:
              'Season for trend analysis (Spring, Summer, Fall, Winter, or Year-round)',
            enum: ['Spring', 'Summer', 'Fall', 'Winter', 'Year-round'],
          },
          category: {
            type: 'string',
            description: 'Fashion category to analyze',
            enum: [
              'Womens Apparel',
              'Mens Apparel',
              'Accessories',
              'Footwear',
              'Activewear',
              'Luxury',
              'Fast Fashion',
              'Sustainable Fashion',
            ],
          },
          market: {
            type: 'string',
            description: 'Target market (optional)',
            enum: ['North America', 'Europe', 'Asia Pacific', 'Global'],
          },
          age_group: {
            type: 'string',
            description: 'Target age group (optional)',
            enum: ['Gen Z', 'Millennials', 'Gen X', 'Baby Boomers', 'All Ages'],
          },
        },
        required: ['season', 'category'],
      },
    );
  }

  createInvocation(
    params: TrendAnalysisParams,
  ): ToolInvocation<TrendAnalysisParams, TrendAnalysisResult> {
    return {
      params,
      getDescription: () => {
        const market = params.market ? ` in ${params.market}` : '';
        const ageGroup = params.age_group ? ` for ${params.age_group}` : '';
        return `Analyzing **${params.season} ${params.category}** trends${market}${ageGroup}`;
      },
      toolLocations: () => [],
      shouldConfirmExecute: async () => false,
      execute: async () => this.execute(params),
    };
  }

  private async execute(
    params: TrendAnalysisParams,
  ): Promise<TrendAnalysisResult> {
    // Mock trend analysis - in a real implementation, this would connect to fashion APIs,
    // analyze social media data, runway shows, etc.

    const mockTrends = this.generateMockTrends(params);
    const marketInsights = this.generateMarketInsights(params);
    const recommendations = this.generateRecommendations(params);

    const result: TrendAnalysisResult = {
      llmContent: `Fashion Trend Analysis for ${params.season} ${params.category}`,
      returnDisplay: this.formatTrendResults(
        mockTrends,
        marketInsights,
        recommendations,
      ),
      trends: mockTrends,
      market_insights: marketInsights,
      recommendations,
    };

    return result;
  }

  private generateMockTrends(params: TrendAnalysisParams) {
    const seasonalColors = {
      Spring: ['Mint Green', 'Coral Pink', 'Lavender', 'Butter Yellow'],
      Summer: ['Ocean Blue', 'Sunset Orange', 'White', 'Bright Pink'],
      Fall: ['Burnt Orange', 'Deep Burgundy', 'Forest Green', 'Camel'],
      Winter: ['Navy Blue', 'Charcoal Gray', 'Emerald Green', 'Crimson Red'],
      'Year-round': ['Black', 'White', 'Navy', 'Beige'],
    };

    const trendNames = {
      'Womens Apparel': [
        'Oversized Blazers',
        'Midi Dresses',
        'Wide-leg Trousers',
      ],
      'Mens Apparel': ['Relaxed Tailoring', 'Vintage Band Tees', 'Cargo Pants'],
      Accessories: ['Statement Earrings', 'Belt Bags', 'Chunky Chains'],
      Footwear: ['Platform Sneakers', 'Combat Boots', 'Loafers'],
    };

    const trends = (
      trendNames[params.category as keyof typeof trendNames] || [
        'Contemporary Styles',
      ]
    ).map((name, _index) => ({
      name,
      confidence: 0.8 + Math.random() * 0.2,
      description: `${name} are trending this ${params.season.toLowerCase()} with modern silhouettes and innovative designs.`,
      colors:
        seasonalColors[params.season as keyof typeof seasonalColors] ||
        seasonalColors['Year-round'],
      materials: [
        'Organic Cotton',
        'Recycled Polyester',
        'Linen',
        'Wool Blend',
      ],
      target_audience: params.age_group || 'All Demographics',
    }));

    return trends;
  }

  private generateMarketInsights(params: TrendAnalysisParams): string {
    return (
      `The ${params.category} market for ${params.season} shows strong growth potential. ` +
      `Sustainability and comfort remain key drivers, with a 25% increase in demand for eco-friendly materials. ` +
      `${params.market || 'Global'} consumers are prioritizing versatile pieces that transition between seasons.`
    );
  }

  private generateRecommendations(params: TrendAnalysisParams): string[] {
    return [
      `Focus on sustainable materials for ${params.category} in ${params.season}`,
      'Incorporate bold colors while maintaining timeless silhouettes',
      'Consider cross-seasonal versatility in design',
      'Leverage social media trends and influencer partnerships',
      'Monitor competitor pricing and positioning strategies',
    ];
  }

  private formatTrendResults(
    trends: Array<{
      name: string;
      confidence: number;
      description: string;
      colors: string[];
      materials: string[];
      target_audience: string;
    }>,
    insights: string,
    recommendations: string[],
  ): string {
    let result = `# Fashion Trend Analysis\n\n`;

    result += `## Key Trends\n`;
    trends.forEach((trend, index) => {
      result += `### ${index + 1}. ${trend.name}\n`;
      result += `**Confidence:** ${(trend.confidence * 100).toFixed(1)}%\n`;
      result += `**Description:** ${trend.description}\n`;
      result += `**Key Colors:** ${trend.colors.join(', ')}\n`;
      result += `**Materials:** ${trend.materials.join(', ')}\n\n`;
    });

    result += `## Market Insights\n${insights}\n\n`;

    result += `## Recommendations\n`;
    recommendations.forEach((rec, index) => {
      result += `${index + 1}. ${rec}\n`;
    });

    return result;
  }
}
