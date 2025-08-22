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

export interface CollectionCuratorParams {
  collection_type: string;
  target_market: string;
  season: string;
  price_range: string;
  style_theme?: string;
  piece_count?: number;
}

export interface CollectionCuratorResult extends ToolResult {
  collection_overview: {
    name: string;
    concept: string;
    target_customer: string;
    price_positioning: string;
    key_themes: string[];
  };
  garment_breakdown: Array<{
    category: string;
    pieces: Array<{
      name: string;
      description: string;
      fabric_suggestions: string[];
      color_options: string[];
      price_tier: string;
      commercial_appeal: number;
      styling_versatility: number;
    }>;
  }>;
  color_story: {
    primary_colors: string[];
    accent_colors: string[];
    neutral_base: string[];
    color_ratios: string;
  };
  commercial_strategy: {
    hero_pieces: string[];
    volume_drivers: string[];
    margin_builders: string[];
    trend_pieces: string[];
  };
  merchandising_tips: string[];
  production_notes: string[];
}

/**
 * Tool for curating cohesive fashion collections that balance creativity with commercial viability
 */
export class CollectionCuratorTool extends BaseDeclarativeTool<
  CollectionCuratorParams,
  CollectionCuratorResult
> {
  static readonly Name = 'collection_curator';

  constructor(_config: Config) {
    super(
      CollectionCuratorTool.Name,
      'Collection Curator',
      'Create cohesive fashion collections that balance creativity with commercial viability and market positioning',
      'fashion_design' as Kind,
      {
        type: 'object',
        properties: {
          collection_type: {
            type: 'string',
            description: 'Type of fashion collection to curate',
            enum: [
              'Capsule Collection',
              'Seasonal Collection',
              'Resort Collection',
              'Holiday Collection',
              'Collaboration Collection',
              'Limited Edition',
              'Core/Basics Collection',
              'Trend-focused Collection',
            ],
          },
          target_market: {
            type: 'string',
            description: 'Target market segment',
            enum: [
              'Fast Fashion',
              'Contemporary',
              'Designer',
              'Luxury',
              'Sustainable',
              'Activewear',
              'Workwear',
              'Casual/Lifestyle',
            ],
          },
          season: {
            type: 'string',
            description: 'Target season for the collection',
            enum: [
              'Spring',
              'Summer',
              'Fall',
              'Winter',
              'Resort',
              'Pre-Fall',
              'Holiday',
            ],
          },
          price_range: {
            type: 'string',
            description: 'Target price range for the collection',
            enum: [
              'Economy ($10-50)',
              'Mid-Market ($50-200)',
              'Premium ($200-500)',
              'Luxury ($500+)',
            ],
          },
          style_theme: {
            type: 'string',
            description: 'Style theme or inspiration (optional)',
            enum: [
              'Minimalist',
              'Bohemian',
              'Urban/Street',
              'Romantic',
              'Classic/Preppy',
              'Avant-garde',
              'Retro/Vintage',
              'Sporty/Athletic',
              'Professional/Workwear',
              'Eco/Sustainable',
            ],
          },
          piece_count: {
            type: 'integer',
            description: 'Number of pieces in collection (8-50)',
            minimum: 8,
            maximum: 50,
          },
        },
        required: ['collection_type', 'target_market', 'season', 'price_range'],
      },
    );
  }

  createInvocation(
    params: CollectionCuratorParams,
  ): ToolInvocation<CollectionCuratorParams, CollectionCuratorResult> {
    return {
      params,
      getDescription: () => {
        const count = params.piece_count || 20;
        const theme = params.style_theme ? ` ${params.style_theme}` : '';
        return `Curating **${count}-piece ${params.collection_type}** for **${params.target_market}** market (${params.season}${theme})`;
      },
      toolLocations: () => [],
      shouldConfirmExecute: async () => false,
      execute: async () => this.execute(params),
    };
  }

  private async execute(
    params: CollectionCuratorParams,
  ): Promise<CollectionCuratorResult> {
    const collectionOverview = this.generateCollectionOverview(params);
    const garmentBreakdown = this.generateGarmentBreakdown(params);
    const colorStory = this.generateColorStory(params);
    const commercialStrategy = this.generateCommercialStrategy(
      params,
      garmentBreakdown,
    );
    const merchandisingTips = this.generateMerchandisingTips(params);
    const productionNotes = this.generateProductionNotes(params);

    const result: CollectionCuratorResult = {
      llmContent: `Collection: ${collectionOverview.name}`,
      returnDisplay: this.formatCollectionResults(
        collectionOverview,
        garmentBreakdown,
        colorStory,
        commercialStrategy,
        merchandisingTips,
        productionNotes,
      ),
      collection_overview: collectionOverview,
      garment_breakdown: garmentBreakdown,
      color_story: colorStory,
      commercial_strategy: commercialStrategy,
      merchandising_tips: merchandisingTips,
      production_notes: productionNotes,
    };

    return result;
  }

  private generateCollectionOverview(params: CollectionCuratorParams): {
    name: string;
    concept: string;
    target_customer: string;
    price_positioning: string;
    key_themes: string[];
  } {
    const collectionNames = this.generateCollectionName(params);
    const concept = this.generateConcept(params);
    const targetCustomer = this.generateTargetCustomer(params);
    const pricePositioning = this.generatePricePositioning(params);
    const keyThemes = this.generateKeyThemes(params);

    return {
      name: collectionNames,
      concept,
      target_customer: targetCustomer,
      price_positioning: pricePositioning,
      key_themes: keyThemes,
    };
  }

  private generateCollectionName(params: CollectionCuratorParams): string {
    const seasonalNames: Record<string, string[]> = {
      Spring: ['Bloom', 'Renewal', 'Fresh Start', 'Garden', 'Dawn'],
      Summer: ['Solstice', 'Coastal', 'Radiance', 'Horizon', 'Escape'],
      Fall: ['Harvest', 'Russet', 'Transition', 'Warmth', 'Golden'],
      Winter: ['Frost', 'Solstice', 'Cozy', 'Alpine', 'Refuge'],
      Resort: ['Oasis', 'Escape', 'Wanderlust', 'Breeze', 'Paradise'],
      Holiday: ['Celebration', 'Sparkle', 'Festive', 'Luxe', 'Gala'],
    };

    const themeNames: Record<string, string[]> = {
      Minimalist: ['Essential', 'Pure', 'Clean', 'Form', 'Space'],
      Bohemian: ['Free Spirit', 'Wanderer', 'Artisan', 'Nomad', 'Journey'],
      'Urban/Street': ['Metro', 'Concrete', 'Pulse', 'Edge', 'Underground'],
      Romantic: ['Romance', 'Poetry', 'Dream', 'Grace', 'Whisper'],
      'Eco/Sustainable': ['Earth', 'Conscious', 'Future', 'Green', 'Harmony'],
    };

    const seasonName = seasonalNames[params.season]?.[0] || params.season;
    const themeName = params.style_theme
      ? themeNames[params.style_theme]?.[0]
      : '';

    if (themeName) {
      return `${themeName} ${seasonName}`;
    }

    return `${seasonName} ${params.collection_type.replace(' Collection', '')}`;
  }

  private generateConcept(params: CollectionCuratorParams): string {
    const conceptTemplates: Record<string, string> = {
      'Capsule Collection': `A carefully curated capsule that maximizes versatility and style impact with essential pieces that seamlessly integrate into the modern wardrobe.`,
      'Seasonal Collection': `A comprehensive seasonal offering that captures the essence of ${params.season.toLowerCase()} through thoughtful design, appropriate fabrications, and current trend interpretation.`,
      'Resort Collection': `An elevated travel-inspired collection designed for the sophisticated consumer seeking effortless style for vacation and leisure occasions.`,
      'Holiday Collection': `A special occasion collection that balances celebration-ready glamour with wearable luxury for the holiday season.`,
      Sustainable: `An environmentally conscious collection that proves sustainable fashion can be both stylish and commercially viable without compromising on design integrity.`,
    };

    let baseConcept =
      conceptTemplates[params.collection_type] ||
      conceptTemplates['Seasonal Collection'];

    // Customize based on market
    if (params.target_market === 'Luxury') {
      baseConcept +=
        ' Crafted with exceptional attention to detail and premium materials for the discerning luxury consumer.';
    } else if (params.target_market === 'Fast Fashion') {
      baseConcept +=
        ' Designed for trend-conscious consumers seeking current style at accessible price points.';
    }

    return baseConcept;
  }

  private generateTargetCustomer(params: CollectionCuratorParams): string {
    const customerProfiles: Record<string, string> = {
      'Fast Fashion':
        'Trend-conscious consumers aged 18-35 seeking current styles at accessible prices with frequent wardrobe updates',
      Contemporary:
        'Style-aware professionals aged 25-45 balancing quality and price for modern lifestyle needs',
      Designer:
        'Fashion-forward consumers aged 30-50 investing in unique design and premium quality with strong brand loyalty',
      Luxury:
        'Affluent consumers aged 35-65 prioritizing exceptional quality, exclusivity, and heritage craftsmanship',
      Sustainable:
        'Environmentally conscious consumers aged 25-50 valuing ethical production, quality, and long-term wardrobe investment',
      Activewear:
        'Health-conscious consumers aged 20-45 seeking performance and style for active lifestyles',
    };

    return (
      customerProfiles[params.target_market] ||
      'Style-conscious consumers seeking quality and value in their wardrobe choices'
    );
  }

  private generatePricePositioning(params: CollectionCuratorParams): string {
    const priceStrategies: Record<string, string> = {
      'Economy ($10-50)':
        'Competitive pricing strategy focusing on accessibility and volume, with strategic style leadership in key trend pieces',
      'Mid-Market ($50-200)':
        'Value positioning balancing quality and price, offering accessible luxury with selective premium details',
      'Premium ($200-500)':
        'Premium positioning emphasizing superior quality, design innovation, and brand heritage',
      'Luxury ($500+)':
        'Luxury positioning with emphasis on exclusivity, exceptional craftsmanship, and premium materials',
    };

    return (
      priceStrategies[params.price_range] ||
      'Balanced pricing strategy offering quality and value'
    );
  }

  private generateKeyThemes(params: CollectionCuratorParams): string[] {
    const baseThemes = ['Versatility', 'Quality', 'Modern Lifestyle'];

    const seasonalThemes: Record<string, string[]> = {
      Spring: ['Renewal', 'Fresh Colors', 'Lightweight Layers'],
      Summer: ['Breathability', 'UV Protection', 'Vacation Ready'],
      Fall: ['Transitional Layering', 'Rich Textures', 'Warm Tones'],
      Winter: ['Insulation', 'Luxury Comfort', 'Holiday Glamour'],
      Resort: [
        'Effortless Luxury',
        'Travel Friendly',
        'Relaxed Sophistication',
      ],
    };

    const marketThemes: Record<string, string[]> = {
      Luxury: ['Heritage Craftsmanship', 'Exclusivity', 'Timeless Appeal'],
      Sustainable: [
        'Environmental Responsibility',
        'Transparency',
        'Longevity',
      ],
      'Fast Fashion': ['Trend Leadership', 'Accessibility', 'Style Innovation'],
    };

    const themes = [...baseThemes];
    themes.push(...(seasonalThemes[params.season] || []));
    themes.push(...(marketThemes[params.target_market] || []));

    return themes.slice(0, 5); // Return top 5 themes
  }

  private generateGarmentBreakdown(params: CollectionCuratorParams): Array<{
    category: string;
    pieces: Array<{
      name: string;
      description: string;
      fabric_suggestions: string[];
      color_options: string[];
      price_tier: string;
      commercial_appeal: number;
      styling_versatility: number;
    }>;
  }> {
    const pieceCount = params.piece_count || 20;
    const categoryMix = this.getCategoryMix(params, pieceCount);

    const breakdown: Array<{
      category: string;
      pieces: Array<{
        name: string;
        description: string;
        fabric_suggestions: string[];
        color_options: string[];
        price_tier: string;
        commercial_appeal: number;
        styling_versatility: number;
      }>;
    }> = [];

    for (const [category, count] of Object.entries(categoryMix)) {
      const pieces = this.generatePiecesForCategory(category, count, params);
      breakdown.push({
        category,
        pieces,
      });
    }

    return breakdown;
  }

  private getCategoryMix(
    params: CollectionCuratorParams,
    pieceCount: number,
  ): Record<string, number> {
    // Category distribution based on collection type and market
    const baseMix: Record<string, Record<string, number>> = {
      'Capsule Collection': {
        Tops: 0.4,
        Bottoms: 0.3,
        Outerwear: 0.2,
        Accessories: 0.1,
      },
      'Seasonal Collection': {
        Tops: 0.35,
        Bottoms: 0.25,
        Dresses: 0.2,
        Outerwear: 0.15,
        Accessories: 0.05,
      },
      'Resort Collection': {
        Dresses: 0.3,
        Tops: 0.3,
        Bottoms: 0.2,
        Swimwear: 0.15,
        Accessories: 0.05,
      },
      'Holiday Collection': {
        Dresses: 0.4,
        Tops: 0.3,
        Outerwear: 0.2,
        Accessories: 0.1,
      },
    };

    const mix =
      baseMix[params.collection_type] || baseMix['Seasonal Collection'];
    const categoryMix: Record<string, number> = {};

    for (const [category, ratio] of Object.entries(mix)) {
      categoryMix[category] = Math.max(1, Math.round(pieceCount * ratio));
    }

    return categoryMix;
  }

  private generatePiecesForCategory(
    category: string,
    count: number,
    params: CollectionCuratorParams,
  ): Array<{
    name: string;
    description: string;
    fabric_suggestions: string[];
    color_options: string[];
    price_tier: string;
    commercial_appeal: number;
    styling_versatility: number;
  }> {
    const pieces = [];
    const pieceTemplates = this.getPieceTemplates(category, params);

    for (let i = 0; i < count; i++) {
      const template = pieceTemplates[i % pieceTemplates.length];
      pieces.push({
        ...template,
        color_options: this.getColorOptionsForPiece(template, params),
        fabric_suggestions: this.getFabricSuggestionsForPiece(template, params),
      });
    }

    return pieces;
  }

  private getPieceTemplates(
    category: string,
    _params: CollectionCuratorParams,
  ): Array<{
    name: string;
    description: string;
    price_tier: string;
    commercial_appeal: number;
    styling_versatility: number;
  }> {
    const templates: Record<
      string,
      Array<{
        name: string;
        description: string;
        price_tier: string;
        commercial_appeal: number;
        styling_versatility: number;
      }>
    > = {
      Tops: [
        {
          name: 'Classic Button-Down Shirt',
          description:
            'Timeless wardrobe essential with clean lines and versatile styling options',
          price_tier: 'Core',
          commercial_appeal: 9,
          styling_versatility: 10,
        },
        {
          name: 'Relaxed T-Shirt',
          description:
            'Effortless casual piece with modern fit and premium feel',
          price_tier: 'Volume',
          commercial_appeal: 10,
          styling_versatility: 8,
        },
        {
          name: 'Statement Blouse',
          description:
            'Elevated piece with unique details for special occasions',
          price_tier: 'Premium',
          commercial_appeal: 7,
          styling_versatility: 6,
        },
      ],
      Bottoms: [
        {
          name: 'High-Waist Tailored Trousers',
          description:
            'Professional yet comfortable pants suitable for work and weekend',
          price_tier: 'Core',
          commercial_appeal: 8,
          styling_versatility: 9,
        },
        {
          name: 'Classic Jeans',
          description: 'Perfect-fit denim in timeless wash with modern details',
          price_tier: 'Volume',
          commercial_appeal: 10,
          styling_versatility: 9,
        },
        {
          name: 'Wide-Leg Palazzo Pants',
          description: 'Flowing, comfortable pants with sophisticated drape',
          price_tier: 'Premium',
          commercial_appeal: 6,
          styling_versatility: 7,
        },
      ],
      Dresses: [
        {
          name: 'Midi Wrap Dress',
          description:
            'Universally flattering silhouette perfect for multiple occasions',
          price_tier: 'Core',
          commercial_appeal: 9,
          styling_versatility: 8,
        },
        {
          name: 'Little Black Dress',
          description:
            'Essential evening piece with modern twist on classic silhouette',
          price_tier: 'Premium',
          commercial_appeal: 8,
          styling_versatility: 7,
        },
        {
          name: 'Casual Shirt Dress',
          description: 'Effortless day dress with shirt-inspired details',
          price_tier: 'Volume',
          commercial_appeal: 8,
          styling_versatility: 9,
        },
      ],
      Outerwear: [
        {
          name: 'Classic Blazer',
          description:
            'Structured yet comfortable blazer for professional and casual wear',
          price_tier: 'Premium',
          commercial_appeal: 8,
          styling_versatility: 9,
        },
        {
          name: 'Denim Jacket',
          description: 'Timeless casual layer with vintage-inspired details',
          price_tier: 'Core',
          commercial_appeal: 9,
          styling_versatility: 8,
        },
        {
          name: 'Lightweight Cardigan',
          description:
            'Soft, comfortable layer perfect for transitional weather',
          price_tier: 'Volume',
          commercial_appeal: 8,
          styling_versatility: 10,
        },
      ],
    };

    return templates[category] || templates['Tops'];
  }

  private getColorOptionsForPiece(
    piece: { name: string; price_tier: string },
    params: CollectionCuratorParams,
  ): string[] {
    const colorStory = this.generateColorStory(params);

    if (piece.price_tier === 'Volume') {
      // Volume pieces get neutral + one accent
      return [colorStory.neutral_base[0], colorStory.primary_colors[0]];
    } else if (piece.price_tier === 'Premium') {
      // Premium pieces get accent colors
      return colorStory.accent_colors.slice(0, 2);
    } else {
      // Core pieces get primary colors
      return colorStory.primary_colors.slice(0, 2);
    }
  }

  private getFabricSuggestionsForPiece(
    piece: { name: string },
    _params: CollectionCuratorParams,
  ): string[] {
    const fabricMap: Record<string, string[]> = {
      shirt: ['Cotton poplin', 'Linen blend', 'Silk crepe'],
      pants: ['Wool twill', 'Cotton blend', 'Ponte knit'],
      dress: ['Jersey knit', 'Chiffon', 'Cotton sateen'],
      blazer: ['Wool suiting', 'Cotton blend', 'Linen blend'],
      jeans: ['Denim', 'Stretch denim', 'Organic cotton denim'],
    };

    const pieceName = piece.name.toLowerCase();
    for (const [key, fabrics] of Object.entries(fabricMap)) {
      if (pieceName.includes(key)) {
        return fabrics;
      }
    }

    return ['Cotton blend', 'Jersey knit', 'Ponte knit'];
  }

  private generateColorStory(params: CollectionCuratorParams): {
    primary_colors: string[];
    accent_colors: string[];
    neutral_base: string[];
    color_ratios: string;
  } {
    const seasonalColors: Record<
      string,
      {
        primary_colors: string[];
        accent_colors: string[];
        neutral_base: string[];
      }
    > = {
      Spring: {
        primary_colors: ['Sage Green', 'Coral Pink', 'Sky Blue'],
        accent_colors: ['Lemon Yellow', 'Lavender'],
        neutral_base: ['Cream', 'Light Gray', 'Khaki'],
      },
      Summer: {
        primary_colors: ['Ocean Blue', 'Sunset Orange', 'White'],
        accent_colors: ['Hot Pink', 'Turquoise'],
        neutral_base: ['Sand', 'Navy', 'Stone Gray'],
      },
      Fall: {
        primary_colors: ['Burnt Orange', 'Forest Green', 'Burgundy'],
        accent_colors: ['Mustard Yellow', 'Deep Purple'],
        neutral_base: ['Camel', 'Charcoal', 'Cream'],
      },
      Winter: {
        primary_colors: ['Navy Blue', 'Emerald Green', 'Crimson Red'],
        accent_colors: ['Gold', 'Silver'],
        neutral_base: ['Black', 'Ivory', 'Charcoal Gray'],
      },
      Resort: {
        primary_colors: ['Coral', 'Aqua', 'White'],
        accent_colors: ['Fuchsia', 'Lime Green'],
        neutral_base: ['Sand', 'Navy', 'Natural Linen'],
      },
    };

    const colors = seasonalColors[params.season] || seasonalColors['Spring'];

    return {
      ...colors,
      color_ratios: '60% Neutrals, 30% Primary Colors, 10% Accent Colors',
    };
  }

  private generateCommercialStrategy(
    params: CollectionCuratorParams,
    garmentBreakdown: Array<{
      category: string;
      pieces: Array<{
        name: string;
        commercial_appeal: number;
        styling_versatility: number;
        price_tier: string;
      }>;
    }>,
  ): {
    hero_pieces: string[];
    volume_drivers: string[];
    margin_builders: string[];
    trend_pieces: string[];
  } {
    const allPieces = garmentBreakdown.flatMap((cat) => cat.pieces);

    const heroPieces = allPieces
      .filter(
        (piece) =>
          piece.commercial_appeal >= 8 && piece.styling_versatility >= 8,
      )
      .map((piece) => piece.name)
      .slice(0, 3);

    const volumeDrivers = allPieces
      .filter(
        (piece) =>
          piece.price_tier === 'Volume' || piece.commercial_appeal >= 9,
      )
      .map((piece) => piece.name)
      .slice(0, 5);

    const marginBuilders = allPieces
      .filter((piece) => piece.price_tier === 'Premium')
      .map((piece) => piece.name)
      .slice(0, 4);

    const trendPieces = allPieces
      .filter(
        (piece) =>
          piece.commercial_appeal <= 7 && piece.price_tier !== 'Volume',
      )
      .map((piece) => piece.name)
      .slice(0, 3);

    return {
      hero_pieces: heroPieces,
      volume_drivers: volumeDrivers,
      margin_builders: marginBuilders,
      trend_pieces: trendPieces,
    };
  }

  private generateMerchandisingTips(params: CollectionCuratorParams): string[] {
    const baseTips = [
      'Lead with hero pieces in marketing and visual merchandising',
      'Create outfit bundles combining volume drivers with margin builders',
      'Use trend pieces to create excitement and draw traffic',
      'Maintain 70/30 ratio of core styles to trend pieces for commercial stability',
    ];

    const marketSpecificTips: Record<string, string[]> = {
      'Fast Fashion': [
        'Rapid inventory turnover - plan for 4-6 week selling cycles',
        'Strong social media presence with influencer collaborations',
        'Frequent newness to maintain customer engagement',
      ],
      Luxury: [
        'Focus on storytelling and heritage in marketing',
        'Limited production runs to maintain exclusivity',
        'Personal shopping services to build customer relationships',
      ],
      Sustainable: [
        'Transparency in production and materials sourcing',
        'Education-focused marketing about sustainability benefits',
        'Capsule wardrobe styling guides for customers',
      ],
    };

    const tips = [...baseTips];
    if (marketSpecificTips[params.target_market]) {
      tips.push(...marketSpecificTips[params.target_market]);
    }

    return tips;
  }

  private generateProductionNotes(params: CollectionCuratorParams): string[] {
    const baseNotes = [
      'Plan fabric sourcing 3-4 months before production start',
      'Create tech packs with detailed construction specifications',
      'Build in 15% buffer for potential demand fluctuations',
      'Establish quality control checkpoints throughout production',
    ];

    const seasonalNotes: Record<string, string[]> = {
      Spring: [
        'Lighter fabrics require careful handling to prevent distortion',
        'Plan for transitional weather with appropriate fabric weights',
      ],
      Summer: [
        'Focus on breathable fabrics and moisture-wicking properties',
        'Consider UV protection for outdoor-focused pieces',
      ],
      Fall: [
        'Layer-friendly construction for transitional dressing',
        'Test durability of heavier fabrics and hardware',
      ],
      Winter: [
        'Insulation testing for outerwear pieces',
        'Weather resistance testing for appropriate pieces',
      ],
    };

    const notes = [...baseNotes];
    if (seasonalNotes[params.season]) {
      notes.push(...seasonalNotes[params.season]);
    }

    return notes;
  }

  private formatCollectionResults(
    overview: {
      name: string;
      concept: string;
      target_customer: string;
      price_positioning: string;
      key_themes: string[];
    },
    garmentBreakdown: Array<{
      category: string;
      pieces: Array<{
        name: string;
        description: string;
        fabric_suggestions: string[];
        color_options: string[];
        price_tier: string;
        commercial_appeal: number;
        styling_versatility: number;
      }>;
    }>,
    colorStory: {
      primary_colors: string[];
      accent_colors: string[];
      neutral_base: string[];
      color_ratios: string;
    },
    commercialStrategy: {
      hero_pieces: string[];
      volume_drivers: string[];
      margin_builders: string[];
      trend_pieces: string[];
    },
    merchandisingTips: string[],
    productionNotes: string[],
  ): string {
    let result = `# ${overview.name}\n\n`;

    result += `## Collection Overview\n`;
    result += `**Concept:** ${overview.concept}\n\n`;
    result += `**Target Customer:** ${overview.target_customer}\n\n`;
    result += `**Price Positioning:** ${overview.price_positioning}\n\n`;
    result += `**Key Themes:** ${overview.key_themes.join(', ')}\n\n`;

    result += `## Color Story\n`;
    result += `**Primary Colors:** ${colorStory.primary_colors.join(', ')}\n`;
    result += `**Accent Colors:** ${colorStory.accent_colors.join(', ')}\n`;
    result += `**Neutral Base:** ${colorStory.neutral_base.join(', ')}\n`;
    result += `**Color Ratios:** ${colorStory.color_ratios}\n\n`;

    result += `## Garment Breakdown\n`;
    garmentBreakdown.forEach((category) => {
      result += `### ${category.category}\n`;
      category.pieces.forEach((piece, index) => {
        result += `#### ${index + 1}. ${piece.name} (${piece.price_tier})\n`;
        result += `- **Description:** ${piece.description}\n`;
        result += `- **Fabrics:** ${piece.fabric_suggestions.join(', ')}\n`;
        result += `- **Colors:** ${piece.color_options.join(', ')}\n`;
        result += `- **Commercial Appeal:** ${piece.commercial_appeal}/10\n`;
        result += `- **Versatility:** ${piece.styling_versatility}/10\n\n`;
      });
    });

    result += `## Commercial Strategy\n`;
    result += `**Hero Pieces:** ${commercialStrategy.hero_pieces.join(', ')}\n`;
    result += `**Volume Drivers:** ${commercialStrategy.volume_drivers.join(', ')}\n`;
    result += `**Margin Builders:** ${commercialStrategy.margin_builders.join(', ')}\n`;
    result += `**Trend Pieces:** ${commercialStrategy.trend_pieces.join(', ')}\n\n`;

    result += `## Merchandising Tips\n`;
    merchandisingTips.forEach((tip, index) => {
      result += `${index + 1}. ${tip}\n`;
    });
    result += `\n`;

    result += `## Production Notes\n`;
    productionNotes.forEach((note, index) => {
      result += `${index + 1}. ${note}\n`;
    });

    return result;
  }
}
