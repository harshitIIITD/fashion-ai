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

export interface FabricMaterialParams {
  garment_type: string;
  season: string;
  sustainability_focus?: string;
  budget_range?: string;
  target_market?: string;
}

export interface FabricMaterialResult extends ToolResult {
  recommended_fabrics: Array<{
    name: string;
    type: string;
    properties: string[];
    sustainability_score: number;
    price_range: string;
    best_use: string;
    care_instructions: string;
  }>;
  sustainability_notes: string;
  seasonal_considerations: string;
  alternatives: string[];
}

/**
 * Tool for advising on fabric and material selection based on garment type, season, and sustainability goals
 */
export class FabricMaterialAdvisorTool extends BaseDeclarativeTool<
  FabricMaterialParams,
  FabricMaterialResult
> {
  static readonly Name = 'fabric_material_advisor';

  constructor(_config: Config) {
    super(
      FabricMaterialAdvisorTool.Name,
      'Fabric & Material Advisor',
      'Recommend appropriate fabrics and materials based on garment type, season, and sustainability goals',
      'fashion_design' as Kind,
      {
        type: 'object',
        properties: {
          garment_type: {
            type: 'string',
            description: 'Type of garment being designed',
            enum: [
              'T-Shirt',
              'Dress',
              'Jeans',
              'Blazer',
              'Sweater',
              'Coat',
              'Activewear',
              'Underwear',
              'Formal Wear',
              'Casual Wear',
              'Outerwear',
              'Knitwear',
            ],
          },
          season: {
            type: 'string',
            description: 'Target season for the garment',
            enum: ['Spring', 'Summer', 'Fall', 'Winter', 'All-Season'],
          },
          sustainability_focus: {
            type: 'string',
            description: 'Level of sustainability focus (optional)',
            enum: ['High', 'Medium', 'Low', 'No Preference'],
          },
          budget_range: {
            type: 'string',
            description: 'Budget range for materials (optional)',
            enum: ['Economy', 'Mid-Range', 'Premium', 'Luxury'],
          },
          target_market: {
            type: 'string',
            description: 'Target market segment (optional)',
            enum: [
              'Fast Fashion',
              'Contemporary',
              'Designer',
              'Luxury',
              'Sustainable',
            ],
          },
        },
        required: ['garment_type', 'season'],
      },
    );
  }

  createInvocation(
    params: FabricMaterialParams,
  ): ToolInvocation<FabricMaterialParams, FabricMaterialResult> {
    return {
      params,
      getDescription: () => {
        const sustainability = params.sustainability_focus
          ? ` with ${params.sustainability_focus.toLowerCase()} sustainability`
          : '';
        const budget = params.budget_range
          ? ` in ${params.budget_range.toLowerCase()} range`
          : '';
        return `Recommending fabrics for **${params.garment_type}** for **${params.season}**${sustainability}${budget}`;
      },
      toolLocations: () => [],
      shouldConfirmExecute: async () => false,
      execute: async () => this.execute(params),
    };
  }

  private async execute(
    params: FabricMaterialParams,
  ): Promise<FabricMaterialResult> {
    const recommendedFabrics = this.generateFabricRecommendations(params);
    const sustainabilityNotes = this.getSustainabilityNotes(params);
    const seasonalConsiderations = this.getSeasonalConsiderations(params);
    const alternatives = this.getAlternatives(params);

    const result: FabricMaterialResult = {
      llmContent: `Fabric & Material Recommendations for ${params.garment_type} (${params.season})`,
      returnDisplay: this.formatFabricResults(
        recommendedFabrics,
        sustainabilityNotes,
        seasonalConsiderations,
        alternatives,
        params,
      ),
      recommended_fabrics: recommendedFabrics,
      sustainability_notes: sustainabilityNotes,
      seasonal_considerations: seasonalConsiderations,
      alternatives,
    };

    return result;
  }

  private generateFabricRecommendations(params: FabricMaterialParams): Array<{
    name: string;
    type: string;
    properties: string[];
    sustainability_score: number;
    price_range: string;
    best_use: string;
    care_instructions: string;
  }> {
    // Fabric database organized by garment type and season
    const fabricDatabase: Record<
      string,
      Record<
        string,
        Array<{
          name: string;
          type: string;
          properties: string[];
          sustainability_score: number;
          price_range: string;
          best_use: string;
          care_instructions: string;
        }>
      >
    > = {
      'T-Shirt': {
        Summer: [
          {
            name: 'Organic Cotton Jersey',
            type: 'Natural',
            properties: ['Breathable', 'Soft', 'Moisture-wicking', 'Durable'],
            sustainability_score: 8.5,
            price_range: 'Mid-Range',
            best_use: 'Casual everyday wear',
            care_instructions: 'Machine wash cold, tumble dry low',
          },
          {
            name: 'Bamboo Viscose',
            type: 'Semi-synthetic',
            properties: [
              'Antibacterial',
              'Silky smooth',
              'Moisture-wicking',
              'UV protection',
            ],
            sustainability_score: 7.0,
            price_range: 'Mid-Range',
            best_use: 'Active and casual wear',
            care_instructions: 'Machine wash cold, air dry',
          },
          {
            name: 'Recycled Polyester',
            type: 'Synthetic',
            properties: [
              'Quick-dry',
              'Wrinkle-resistant',
              'Color retention',
              'Lightweight',
            ],
            sustainability_score: 6.5,
            price_range: 'Economy',
            best_use: 'Activewear and casual pieces',
            care_instructions: 'Machine wash cold, tumble dry low',
          },
        ],
        Winter: [
          {
            name: 'Merino Wool Blend',
            type: 'Natural',
            properties: [
              'Temperature regulating',
              'Soft',
              'Odor-resistant',
              'Warm',
            ],
            sustainability_score: 7.5,
            price_range: 'Premium',
            best_use: 'Base layers and casual wear',
            care_instructions: 'Hand wash or gentle cycle, lay flat to dry',
          },
        ],
      },
      Dress: {
        Spring: [
          {
            name: 'Tencel Lyocell',
            type: 'Semi-synthetic',
            properties: [
              'Drapes beautifully',
              'Moisture-wicking',
              'Biodegradable',
              'Soft',
            ],
            sustainability_score: 9.0,
            price_range: 'Mid-Range',
            best_use: 'Flowing dresses and blouses',
            care_instructions: 'Machine wash cool, hang to dry',
          },
          {
            name: 'Linen',
            type: 'Natural',
            properties: [
              'Breathable',
              'Durable',
              'Natural texture',
              'Gets softer with wear',
            ],
            sustainability_score: 8.0,
            price_range: 'Mid-Range',
            best_use: 'Casual and semi-formal dresses',
            care_instructions: 'Machine wash warm, iron while damp',
          },
        ],
        Fall: [
          {
            name: 'Wool Crepe',
            type: 'Natural',
            properties: [
              'Drapes well',
              'Wrinkle-resistant',
              'Warm',
              'Professional look',
            ],
            sustainability_score: 7.0,
            price_range: 'Premium',
            best_use: 'Professional and formal dresses',
            care_instructions: 'Dry clean or gentle hand wash',
          },
        ],
      },
      Jeans: {
        'All-Season': [
          {
            name: 'Organic Cotton Denim',
            type: 'Natural',
            properties: ['Durable', 'Classic feel', 'Breathable', 'Ages well'],
            sustainability_score: 8.0,
            price_range: 'Mid-Range',
            best_use: 'Traditional jeans construction',
            care_instructions: 'Wash inside out, cold water, air dry',
          },
          {
            name: 'Recycled Cotton Denim',
            type: 'Natural/Recycled',
            properties: [
              'Eco-friendly',
              'Soft feel',
              'Good stretch recovery',
              'Unique texture',
            ],
            sustainability_score: 9.0,
            price_range: 'Mid-Range',
            best_use: 'Sustainable denim lines',
            care_instructions: 'Cold wash, minimal washing, air dry',
          },
        ],
      },
      Activewear: {
        'All-Season': [
          {
            name: 'Recycled Polyester Blend',
            type: 'Synthetic',
            properties: ['Moisture-wicking', 'Stretch', 'Quick-dry', 'Durable'],
            sustainability_score: 6.5,
            price_range: 'Mid-Range',
            best_use: 'High-performance athletic wear',
            care_instructions: 'Machine wash cold, tumble dry low',
          },
          {
            name: 'Merino Wool Athletic',
            type: 'Natural',
            properties: [
              'Odor-resistant',
              'Temperature regulating',
              'Soft',
              'Natural',
            ],
            sustainability_score: 8.0,
            price_range: 'Premium',
            best_use: 'Premium athletic and outdoor wear',
            care_instructions: 'Gentle wash, air dry',
          },
        ],
      },
    };

    // Get recommendations for the specific garment and season
    let recommendations =
      fabricDatabase[params.garment_type]?.[params.season] ||
      fabricDatabase[params.garment_type]?.['All-Season'] ||
      [];

    // If no specific recommendations, provide generic alternatives
    if (recommendations.length === 0) {
      recommendations = this.getGenericRecommendations(params);
    }

    // Filter based on sustainability focus
    if (params.sustainability_focus === 'High') {
      recommendations = recommendations.filter(
        (fabric) => fabric.sustainability_score >= 8.0,
      );
    } else if (params.sustainability_focus === 'Medium') {
      recommendations = recommendations.filter(
        (fabric) => fabric.sustainability_score >= 6.0,
      );
    }

    // Filter based on budget if specified
    if (params.budget_range) {
      const budgetFilter: Record<string, string[]> = {
        Economy: ['Economy'],
        'Mid-Range': ['Economy', 'Mid-Range'],
        Premium: ['Mid-Range', 'Premium'],
        Luxury: ['Premium', 'Luxury'],
      };
      const allowedRanges = budgetFilter[params.budget_range] || [
        'Economy',
        'Mid-Range',
        'Premium',
        'Luxury',
      ];
      recommendations = recommendations.filter((fabric) =>
        allowedRanges.includes(fabric.price_range),
      );
    }

    return recommendations.slice(0, 4); // Return top 4 recommendations
  }

  private getGenericRecommendations(params: FabricMaterialParams) {
    // Generic recommendations based on season
    const genericRecommendations: Record<
      string,
      Array<{
        name: string;
        type: string;
        properties: string[];
        sustainability_score: number;
        price_range: string;
        best_use: string;
        care_instructions: string;
      }>
    > = {
      Spring: [
        {
          name: 'Cotton Poplin',
          type: 'Natural',
          properties: ['Crisp', 'Breathable', 'Versatile', 'Easy care'],
          sustainability_score: 7.0,
          price_range: 'Mid-Range',
          best_use: 'Shirts and lightweight garments',
          care_instructions: 'Machine wash warm, iron if needed',
        },
      ],
      Summer: [
        {
          name: 'Linen Blend',
          type: 'Natural',
          properties: ['Cool', 'Breathable', 'Lightweight', 'Casual'],
          sustainability_score: 7.5,
          price_range: 'Mid-Range',
          best_use: 'Summer garments',
          care_instructions: 'Machine wash cool, air dry',
        },
      ],
      Fall: [
        {
          name: 'Cotton Fleece',
          type: 'Natural',
          properties: ['Warm', 'Soft', 'Comfortable', 'Casual'],
          sustainability_score: 6.5,
          price_range: 'Economy',
          best_use: 'Casual warm garments',
          care_instructions: 'Machine wash warm, tumble dry',
        },
      ],
      Winter: [
        {
          name: 'Wool Blend',
          type: 'Natural',
          properties: ['Warm', 'Insulating', 'Durable', 'Classic'],
          sustainability_score: 7.0,
          price_range: 'Premium',
          best_use: 'Winter garments',
          care_instructions: 'Dry clean or gentle wash',
        },
      ],
    };

    return (
      genericRecommendations[params.season] || genericRecommendations['Spring']
    );
  }

  private getSustainabilityNotes(params: FabricMaterialParams): string {
    let notes = '';

    if (params.sustainability_focus === 'High') {
      notes =
        'Prioritizing eco-friendly materials with minimal environmental impact. Consider certifications like GOTS, OEKO-TEX, or Cradle to Cradle. Look for closed-loop production processes and renewable fiber sources.';
    } else if (params.sustainability_focus === 'Medium') {
      notes =
        'Balancing sustainability with performance and cost. Consider natural fibers, recycled materials, and responsible production practices.';
    } else {
      notes =
        'While sustainability may not be the primary focus, consider these eco-friendly alternatives that offer comparable performance and often better long-term value.';
    }

    return notes;
  }

  private getSeasonalConsiderations(params: FabricMaterialParams): string {
    const considerations: Record<string, string> = {
      Spring:
        'Spring fabrics should be lightweight and breathable for transitional weather. Consider moisture-wicking properties for unpredictable temperatures.',
      Summer:
        'Summer fabrics must prioritize breathability, moisture management, and UV protection. Light colors and natural fibers work best.',
      Fall: 'Fall fabrics should provide warmth while remaining breathable. Consider layering capabilities and durability for active lifestyles.',
      Winter:
        'Winter fabrics need excellent insulation while avoiding bulk. Consider wind resistance and moisture management for outdoor activities.',
      'All-Season':
        'Versatile fabrics that perform across multiple seasons. Focus on adaptability and layering potential.',
    };

    return considerations[params.season] || considerations['All-Season'];
  }

  private getAlternatives(_params: FabricMaterialParams): string[] {
    const alternatives = [
      'Consider blends for enhanced performance characteristics',
      'Explore innovative eco-fabrics like mushroom leather or algae-based materials',
      'Look into local suppliers to reduce transportation impact',
      'Investigate fabric recycling programs for end-of-life considerations',
      'Consider fabric weight variations for different applications',
    ];

    return alternatives;
  }

  private formatFabricResults(
    fabrics: Array<{
      name: string;
      type: string;
      properties: string[];
      sustainability_score: number;
      price_range: string;
      best_use: string;
      care_instructions: string;
    }>,
    sustainabilityNotes: string,
    seasonalConsiderations: string,
    alternatives: string[],
    params: FabricMaterialParams,
  ): string {
    let result = `# Fabric & Material Recommendations\n\n`;
    result += `**Garment Type:** ${params.garment_type}\n`;
    result += `**Season:** ${params.season}\n`;
    if (params.sustainability_focus) {
      result += `**Sustainability Focus:** ${params.sustainability_focus}\n`;
    }
    if (params.budget_range) {
      result += `**Budget Range:** ${params.budget_range}\n`;
    }
    result += `\n`;

    result += `## Recommended Fabrics\n`;
    fabrics.forEach((fabric, index) => {
      result += `### ${index + 1}. ${fabric.name}\n`;
      result += `- **Type:** ${fabric.type}\n`;
      result += `- **Properties:** ${fabric.properties.join(', ')}\n`;
      result += `- **Sustainability Score:** ${fabric.sustainability_score}/10\n`;
      result += `- **Price Range:** ${fabric.price_range}\n`;
      result += `- **Best Use:** ${fabric.best_use}\n`;
      result += `- **Care:** ${fabric.care_instructions}\n\n`;
    });

    result += `## Seasonal Considerations\n${seasonalConsiderations}\n\n`;

    result += `## Sustainability Notes\n${sustainabilityNotes}\n\n`;

    result += `## Additional Considerations\n`;
    alternatives.forEach((alt, index) => {
      result += `${index + 1}. ${alt}\n`;
    });

    return result;
  }
}
