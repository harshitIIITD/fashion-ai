/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseDeclarativeTool, ToolResult, ToolInvocation, Kind } from './tools.js';
import { Config } from '../config/config.js';

export interface ColorPaletteParams {
  inspiration: string;
  palette_type: string;
  color_count?: number;
  season?: string;
}

export interface ColorPaletteResult extends ToolResult {
  palette: Array<{
    name: string;
    hex: string;
    rgb: string;
    description: string;
    usage: string;
  }>;
  harmony: string;
  inspiration_notes: string;
}

/**
 * Tool for generating fashion color palettes based on inspiration and trends
 */
export class ColorPaletteTool extends BaseDeclarativeTool<
  ColorPaletteParams,
  ColorPaletteResult
> {
  static readonly Name = 'color_palette';

  constructor(_config: Config) {
    super(
      ColorPaletteTool.Name,
      'Fashion Color Palette Generator',
      'Generate harmonious color palettes for fashion collections based on inspiration sources',
      'fashion_design' as Kind, // Using a custom kind for fashion tools
      {
        type: 'object',
        properties: {
          inspiration: {
            type: 'string',
            description: 'Source of inspiration for the color palette (e.g., "sunset", "ocean", "vintage film", "art deco")',
          },
          palette_type: {
            type: 'string',
            description: 'Type of color harmony to create',
            enum: [
              'Monochromatic',
              'Complementary',
              'Triadic',
              'Analogous',
              'Split-Complementary',
              'Neutral',
              'Bold & Vibrant',
              'Pastel Dreams',
            ],
          },
          color_count: {
            type: 'integer',
            description: 'Number of colors in the palette (3-8)',
            minimum: 3,
            maximum: 8,
          },
          season: {
            type: 'string',
            description: 'Season for the collection (optional)',
            enum: ['Spring', 'Summer', 'Fall', 'Winter'],
          },
        },
        required: ['inspiration', 'palette_type'],
      },
    );
  }

  createInvocation(params: ColorPaletteParams): ToolInvocation<ColorPaletteParams, ColorPaletteResult> {
    return {
      params,
      getDescription: () => {
        const count = params.color_count || 5;
        const season = params.season ? ` for ${params.season}` : '';
        return `Creating **${params.palette_type}** color palette with ${count} colors inspired by "${params.inspiration}"${season}`;
      },
      toolLocations: () => [],
      shouldConfirmExecute: async () => false,
      execute: async () => this.execute(params),
    };
  }

  private async execute(params: ColorPaletteParams): Promise<ColorPaletteResult> {
    const palette = this.generateColorPalette(params);
    const harmony = this.getHarmonyDescription(params.palette_type);
    const inspirationNotes = this.getInspirationNotes(params.inspiration);

    const result: ColorPaletteResult = {
      llmContent: `Color Palette: ${params.inspiration} (${params.palette_type})`,
      returnDisplay: this.formatPaletteResults(palette, harmony, inspirationNotes, params),
      palette,
      harmony,
      inspiration_notes: inspirationNotes,
    };

    return result;
  }

  private generateColorPalette(params: ColorPaletteParams): Array<{
    name: string;
    hex: string;
    rgb: string;
    description: string;
    usage: string;
  }> {
    const count = params.color_count || 5;
    
    // Color palette databases based on inspiration
    const inspirationPalettes: Record<string, Array<{
      name: string;
      hex: string;
      rgb: string;
      description: string;
      usage: string;
    }>> = {
      sunset: [
        { name: 'Golden Hour', hex: '#FFB347', rgb: '255, 179, 71', description: 'Warm golden orange', usage: 'Accent pieces, accessories' },
        { name: 'Coral Blush', hex: '#FF7F7F', rgb: '255, 127, 127', description: 'Soft coral pink', usage: 'Tops, dresses' },
        { name: 'Deep Crimson', hex: '#DC143C', rgb: '220, 20, 60', description: 'Rich red', usage: 'Statement pieces' },
        { name: 'Twilight Purple', hex: '#663399', rgb: '102, 51, 153', description: 'Deep purple', usage: 'Evening wear' },
        { name: 'Night Sky', hex: '#2F2F4F', rgb: '47, 47, 79', description: 'Dark slate gray', usage: 'Base colors, outerwear' },
      ],
      ocean: [
        { name: 'Seafoam', hex: '#20B2AA', rgb: '32, 178, 170', description: 'Light sea green', usage: 'Light layers, accessories' },
        { name: 'Azure Blue', hex: '#007FFF', rgb: '0, 127, 255', description: 'Bright sky blue', usage: 'Casual wear, activewear' },
        { name: 'Navy Depth', hex: '#000080', rgb: '0, 0, 128', description: 'Deep navy', usage: 'Formal wear, base pieces' },
        { name: 'Pearl White', hex: '#F8F8FF', rgb: '248, 248, 255', description: 'Soft white', usage: 'Shirts, undergarments' },
        { name: 'Storm Gray', hex: '#708090', rgb: '112, 128, 144', description: 'Cool gray', usage: 'Outerwear, accessories' },
      ],
      forest: [
        { name: 'Sage Green', hex: '#9CAF88', rgb: '156, 175, 136', description: 'Muted green', usage: 'Casual wear, knitwear' },
        { name: 'Forest Pine', hex: '#228B22', rgb: '34, 139, 34', description: 'Deep forest green', usage: 'Outerwear, formal pieces' },
        { name: 'Moss Brown', hex: '#8B7355', rgb: '139, 115, 85', description: 'Earthy brown', usage: 'Leather goods, accessories' },
        { name: 'Bark Brown', hex: '#654321', rgb: '101, 67, 33', description: 'Rich brown', usage: 'Shoes, belts' },
        { name: 'Cream', hex: '#FFFDD0', rgb: '255, 253, 208', description: 'Natural cream', usage: 'Base layers, linings' },
      ],
    };

    // Get base palette or generate one
    let basePalette = inspirationPalettes[params.inspiration.toLowerCase()] || this.generateGenericPalette(params);
    
    // Adjust for season if specified
    if (params.season) {
      basePalette = this.adjustForSeason(basePalette, params.season);
    }

    // Return specified number of colors
    return basePalette.slice(0, count);
  }

  private generateGenericPalette(params: ColorPaletteParams) {
    // Generate a basic palette based on palette type
    const palettes = {
      'Monochromatic': [
        { name: 'Light Base', hex: '#E6E6FA', rgb: '230, 230, 250', description: 'Light lavender', usage: 'Base layers' },
        { name: 'Medium Tone', hex: '#9370DB', rgb: '147, 112, 219', description: 'Medium orchid', usage: 'Main pieces' },
        { name: 'Deep Shade', hex: '#4B0082', rgb: '75, 0, 130', description: 'Deep indigo', usage: 'Accents' },
      ],
      'Complementary': [
        { name: 'Primary Blue', hex: '#0066CC', rgb: '0, 102, 204', description: 'Royal blue', usage: 'Main garments' },
        { name: 'Accent Orange', hex: '#FF6600', rgb: '255, 102, 0', description: 'Vibrant orange', usage: 'Accent pieces' },
        { name: 'Neutral Gray', hex: '#808080', rgb: '128, 128, 128', description: 'Medium gray', usage: 'Balance pieces' },
      ],
      'Neutral': [
        { name: 'Ivory', hex: '#FFFFF0', rgb: '255, 255, 240', description: 'Soft ivory', usage: 'Base pieces' },
        { name: 'Taupe', hex: '#B8860B', rgb: '184, 134, 11', description: 'Warm taupe', usage: 'Mid-tones' },
        { name: 'Charcoal', hex: '#36454F', rgb: '54, 69, 79', description: 'Deep charcoal', usage: 'Statement pieces' },
      ],
    };

    return palettes[params.palette_type as keyof typeof palettes] || palettes['Neutral'];
  }

  private adjustForSeason(palette: Array<{
    name: string;
    hex: string;
    rgb: string;
    description: string;
    usage: string;
  }>, _season: string): Array<{
    name: string;
    hex: string;
    rgb: string;
    description: string;
    usage: string;
  }> {
    // This would adjust colors based on seasonal trends
    // For now, return as-is
    return palette;
  }

  private getHarmonyDescription(paletteType: string): string {
    const descriptions: Record<string, string> = {
      'Monochromatic': 'Colors from the same hue family with varying saturation and brightness',
      'Complementary': 'Colors that are opposite each other on the color wheel',
      'Triadic': 'Three colors equally spaced around the color wheel',
      'Analogous': 'Colors that are next to each other on the color wheel',
      'Split-Complementary': 'A base color and two colors adjacent to its complement',
      'Neutral': 'Muted colors that work well as base tones',
      'Bold & Vibrant': 'High-saturation colors that make strong statements',
      'Pastel Dreams': 'Soft, light colors with low saturation',
    };

    return descriptions[paletteType] || 'Custom color harmony';
  }

  private getInspirationNotes(inspiration: string): string {
    return `This palette draws inspiration from "${inspiration}", capturing its essence through carefully selected colors that evoke the mood and atmosphere of the source. Each color has been chosen to work harmoniously with others while maintaining the authentic feel of the inspiration.`;
  }

  private formatPaletteResults(palette: Array<{
    name: string;
    hex: string;
    rgb: string;
    description: string;
    usage: string;
  }>, harmony: string, notes: string, params: ColorPaletteParams): string {
    let result = `# Color Palette: ${params.inspiration}\n\n`;
    result += `**Type:** ${params.palette_type}\n`;
    result += `**Harmony:** ${harmony}\n\n`;

    result += `## Color Swatches\n`;
    palette.forEach((color, index) => {
      result += `### ${index + 1}. ${color.name}\n`;
      result += `- **Hex:** ${color.hex}\n`;
      result += `- **RGB:** ${color.rgb}\n`;
      result += `- **Description:** ${color.description}\n`;
      result += `- **Usage:** ${color.usage}\n\n`;
    });

    result += `## Inspiration Notes\n${notes}\n\n`;
    
    result += `## Color Combinations\n`;
    result += `- **Primary:** ${palette[0]?.name} + ${palette[1]?.name}\n`;
    result += `- **Accent:** ${palette[2]?.name}\n`;
    if (palette.length > 3) {
      result += `- **Supporting:** ${palette.slice(3).map(c => c.name).join(', ')}\n`;
    }

    return result;
  }
}