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

export interface SizeConversionParams {
  size: string;
  from_region: string;
  to_region: string;
  category: string;
  gender?: string;
}

export interface SizeConversionResult extends ToolResult {
  original_size: string;
  converted_size: string;
  region_from: string;
  region_to: string;
  category: string;
  size_chart: Array<{
    region: string;
    size: string;
    measurements?: string;
  }>;
  notes: string;
}

/**
 * Tool for converting fashion sizes between different regions and standards
 */
export class SizeConversionTool extends BaseDeclarativeTool<
  SizeConversionParams,
  SizeConversionResult
> {
  static readonly Name = 'size_conversion';

  constructor(_config: Config) {
    super(
      SizeConversionTool.Name,
      'Fashion Size Conversion',
      'Convert clothing sizes between different regional standards (US, EU, UK, etc.)',
      'fashion_utility' as Kind,
      {
        type: 'object',
        properties: {
          size: {
            type: 'string',
            description: 'The size to convert (e.g., "M", "8", "40", "L")',
          },
          from_region: {
            type: 'string',
            description: 'Source region standard',
            enum: ['US', 'EU', 'UK', 'AU', 'IT', 'FR', 'DE', 'JP', 'CN'],
          },
          to_region: {
            type: 'string',
            description: 'Target region standard',
            enum: ['US', 'EU', 'UK', 'AU', 'IT', 'FR', 'DE', 'JP', 'CN'],
          },
          category: {
            type: 'string',
            description: 'Clothing category for accurate conversion',
            enum: [
              'Tops',
              'Bottoms',
              'Dresses',
              'Shoes',
              'Bras',
              'Suits',
              'Jeans',
              'Outerwear',
            ],
          },
          gender: {
            type: 'string',
            description: 'Gender category (optional)',
            enum: ['Women', 'Men', 'Unisex'],
          },
        },
        required: ['size', 'from_region', 'to_region', 'category'],
      },
    );
  }

  createInvocation(
    params: SizeConversionParams,
  ): ToolInvocation<SizeConversionParams, SizeConversionResult> {
    return {
      params,
      getDescription: () => {
        const gender = params.gender ? ` ${params.gender}` : '';
        return `Converting${gender} ${params.category} size **${params.size}** from **${params.from_region}** to **${params.to_region}**`;
      },
      toolLocations: () => [],
      shouldConfirmExecute: async () => false,
      execute: async () => this.execute(params),
    };
  }

  private async execute(
    params: SizeConversionParams,
  ): Promise<SizeConversionResult> {
    const conversion = this.convertSize(params);
    const sizeChart = this.generateSizeChart(params);
    const notes = this.getConversionNotes(params);

    const result: SizeConversionResult = {
      llmContent: `Size Conversion: ${params.size} (${params.from_region}) = ${conversion} (${params.to_region})`,
      returnDisplay: this.formatConversionResults(
        params,
        conversion,
        sizeChart,
        notes,
      ),
      original_size: params.size,
      converted_size: conversion,
      region_from: params.from_region,
      region_to: params.to_region,
      category: params.category,
      size_chart: sizeChart,
      notes,
    };

    return result;
  }

  private convertSize(params: SizeConversionParams): string {
    // Mock size conversion logic - in a real implementation, this would use comprehensive size charts
    const { size, from_region, to_region, category } = params;

    // Sample conversion tables (simplified)
    const conversionTables: Record<
      string,
      Record<string, Record<string, string>>
    > = {
      Tops: {
        US_to_EU: {
          XS: '32',
          S: '34',
          M: '36',
          L: '38',
          XL: '40',
          '0': '32',
          '2': '34',
          '4': '36',
          '6': '38',
          '8': '40',
        },
        EU_to_US: { '32': 'XS', '34': 'S', '36': 'M', '38': 'L', '40': 'XL' },
        US_to_UK: {
          XS: '6',
          S: '8',
          M: '10',
          L: '12',
          XL: '14',
          '0': '4',
          '2': '6',
          '4': '8',
          '6': '10',
          '8': '12',
        },
        UK_to_US: { '6': 'XS', '8': 'S', '10': 'M', '12': 'L', '14': 'XL' },
      },
      Shoes: {
        US_to_EU: {
          '5': '35',
          '6': '36',
          '7': '37',
          '8': '38',
          '9': '39',
          '10': '40',
          '11': '41',
        },
        EU_to_US: {
          '35': '5',
          '36': '6',
          '37': '7',
          '38': '8',
          '39': '9',
          '40': '10',
          '41': '11',
        },
        US_to_UK: {
          '5': '3',
          '6': '4',
          '7': '5',
          '8': '6',
          '9': '7',
          '10': '8',
          '11': '9',
        },
        UK_to_US: {
          '3': '5',
          '4': '6',
          '5': '7',
          '6': '8',
          '7': '9',
          '8': '10',
          '9': '11',
        },
      },
    };

    const conversionKey = `${from_region}_to_${to_region}`;
    const categoryTable = conversionTables[category];

    if (categoryTable && categoryTable[conversionKey]) {
      const converted = categoryTable[conversionKey][size];
      if (converted) {
        return converted;
      }
    }

    // Fallback for sizes not in table
    if (from_region === to_region) {
      return size;
    }

    // Generic numeric conversion attempt
    const numericSize = parseFloat(size);
    if (!isNaN(numericSize)) {
      if (from_region === 'US' && to_region === 'EU') {
        return Math.round(numericSize + 30).toString();
      } else if (from_region === 'EU' && to_region === 'US') {
        return Math.round(numericSize - 30).toString();
      }
    }

    return `${size} (approx)`;
  }

  private generateSizeChart(
    params: SizeConversionParams,
  ): Array<{ region: string; size: string; measurements?: string }> {
    // Generate a sample size chart for the category
    const charts: Record<
      string,
      Array<{ region: string; size: string; measurements?: string }>
    > = {
      Tops: [
        { region: 'US', size: 'XS/0-2', measurements: 'Bust: 32-34"' },
        { region: 'EU', size: '32-34', measurements: 'Bust: 81-86cm' },
        { region: 'UK', size: '6-8', measurements: 'Bust: 32-34"' },
      ],
      Shoes: [
        { region: 'US', size: '7', measurements: 'Length: 9.25"' },
        { region: 'EU', size: '37', measurements: 'Length: 23.5cm' },
        { region: 'UK', size: '5', measurements: 'Length: 9.25"' },
      ],
    };

    return (
      charts[params.category] || [
        { region: params.from_region, size: params.size },
        { region: params.to_region, size: this.convertSize(params) },
      ]
    );
  }

  private getConversionNotes(params: SizeConversionParams): string {
    const notes = [
      `Size conversions may vary between brands and manufacturers.`,
      `Always check individual brand size charts for accurate fitting.`,
      `Consider body measurements for the most accurate size selection.`,
    ];

    if (params.category === 'Shoes') {
      notes.push(
        `Shoe sizes can vary significantly by brand and style. Try before buying when possible.`,
      );
    }

    if (params.category === 'Jeans') {
      notes.push(
        `Denim sizing often uses waist measurements in inches or centimeters.`,
      );
    }

    return notes.join(' ');
  }

  private formatConversionResults(
    params: SizeConversionParams,
    conversion: string,
    sizeChart: Array<{ region: string; size: string; measurements?: string }>,
    notes: string,
  ): string {
    let result = `# Size Conversion Results\n\n`;

    result += `**Original:** ${params.size} (${params.from_region})\n`;
    result += `**Converted:** ${conversion} (${params.to_region})\n`;
    result += `**Category:** ${params.category}\n`;
    if (params.gender) {
      result += `**Gender:** ${params.gender}\n`;
    }
    result += `\n`;

    result += `## Size Chart Reference\n`;
    sizeChart.forEach((entry) => {
      result += `- **${entry.region}:** ${entry.size}`;
      if (entry.measurements) {
        result += ` (${entry.measurements})`;
      }
      result += `\n`;
    });

    result += `\n## Important Notes\n${notes}\n`;

    return result;
  }
}
