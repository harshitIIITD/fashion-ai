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

export interface MoodBoardParams {
  theme: string;
  style_direction: string;
  color_story?: string;
  target_audience?: string;
  season?: string;
}

export interface MoodBoardResult extends ToolResult {
  concept: {
    title: string;
    description: string;
    key_words: string[];
    mood: string;
  };
  visual_elements: Array<{
    category: string;
    description: string;
    inspiration_source: string;
    visual_weight: string;
  }>;
  color_palette: Array<{
    color: string;
    hex: string;
    usage: string;
    mood_contribution: string;
  }>;
  texture_materials: Array<{
    material: string;
    texture: string;
    application: string;
    sensory_impact: string;
  }>;
  styling_notes: string[];
  execution_tips: string[];
}

/**
 * Tool for generating detailed mood board concepts for fashion collections
 */
export class MoodBoardGeneratorTool extends BaseDeclarativeTool<
  MoodBoardParams,
  MoodBoardResult
> {
  static readonly Name = 'mood_board_generator';

  constructor(_config: Config) {
    super(
      MoodBoardGeneratorTool.Name,
      'Mood Board Generator',
      'Create detailed mood board concepts with visual elements, colors, textures, and styling direction for fashion collections',
      'fashion_design' as Kind,
      {
        type: 'object',
        properties: {
          theme: {
            type: 'string',
            description:
              'Central theme or inspiration for the mood board (e.g., "Urban Jungle", "Vintage Romance", "Minimalist Future")',
          },
          style_direction: {
            type: 'string',
            description: 'Overall style direction for the collection',
            enum: [
              'Minimalist',
              'Bohemian',
              'Urban/Street',
              'Romantic',
              'Avant-garde',
              'Classic/Timeless',
              'Sporty/Athletic',
              'Grunge/Edgy',
              'Preppy',
              'Vintage/Retro',
              'Futuristic',
              'Natural/Organic',
            ],
          },
          color_story: {
            type: 'string',
            description: 'Color direction preference (optional)',
            enum: [
              'Monochromatic',
              'Earth Tones',
              'Bright & Bold',
              'Pastels',
              'Jewel Tones',
              'Neutrals',
              'Black & White',
              'Sunset Inspired',
              'Ocean Blues',
              'Forest Greens',
            ],
          },
          target_audience: {
            type: 'string',
            description: 'Target customer demographic (optional)',
            enum: [
              'Gen Z',
              'Millennials',
              'Gen X',
              'Luxury',
              'Contemporary',
              'Mass Market',
            ],
          },
          season: {
            type: 'string',
            description: 'Target season (optional)',
            enum: ['Spring', 'Summer', 'Fall', 'Winter', 'Resort', 'Pre-Fall'],
          },
        },
        required: ['theme', 'style_direction'],
      },
    );
  }

  createInvocation(
    params: MoodBoardParams,
  ): ToolInvocation<MoodBoardParams, MoodBoardResult> {
    return {
      params,
      getDescription: () => {
        const audience = params.target_audience
          ? ` for ${params.target_audience}`
          : '';
        const season = params.season ? ` ${params.season}` : '';
        return `Creating **${params.style_direction}** mood board with theme "${params.theme}"${season}${audience}`;
      },
      toolLocations: () => [],
      shouldConfirmExecute: async () => false,
      execute: async () => this.execute(params),
    };
  }

  private async execute(params: MoodBoardParams): Promise<MoodBoardResult> {
    const concept = this.generateConcept(params);
    const visualElements = this.generateVisualElements(params);
    const colorPalette = this.generateColorPalette(params);
    const textureMaterials = this.generateTextureMaterials(params);
    const stylingNotes = this.generateStylingNotes(params);
    const executionTips = this.generateExecutionTips(params);

    const result: MoodBoardResult = {
      llmContent: `Mood Board: ${concept.title}`,
      returnDisplay: this.formatMoodBoardResults(
        concept,
        visualElements,
        colorPalette,
        textureMaterials,
        stylingNotes,
        executionTips,
      ),
      concept,
      visual_elements: visualElements,
      color_palette: colorPalette,
      texture_materials: textureMaterials,
      styling_notes: stylingNotes,
      execution_tips: executionTips,
    };

    return result;
  }

  private generateConcept(params: MoodBoardParams): {
    title: string;
    description: string;
    key_words: string[];
    mood: string;
  } {
    // Theme-based concept generation
    const conceptTemplates: Record<
      string,
      {
        title: string;
        description: string;
        key_words: string[];
        mood: string;
      }
    > = {
      'Urban Jungle': {
        title: 'Urban Jungle: Nature Meets City',
        description:
          'A fusion of organic natural elements with urban sophistication, where botanical prints meet architectural lines and earthy textures contrast with sleek surfaces.',
        key_words: [
          'Organic',
          'Architectural',
          'Botanical',
          'Contrast',
          'Texture',
          'Growth',
        ],
        mood: 'Sophisticated yet natural, energetic with grounded elements',
      },
      'Vintage Romance': {
        title: 'Vintage Romance: Timeless Elegance',
        description:
          'Nostalgic femininity with delicate details, soft silhouettes, and romantic embellishments that evoke vintage charm with modern sensibility.',
        key_words: [
          'Feminine',
          'Delicate',
          'Nostalgic',
          'Soft',
          'Romantic',
          'Timeless',
        ],
        mood: 'Dreamy and romantic with sophisticated vintage appeal',
      },
      'Minimalist Future': {
        title: 'Minimalist Future: Clean Innovation',
        description:
          'Forward-thinking design with clean lines, innovative materials, and purposeful simplicity that embodies futuristic minimalism.',
        key_words: [
          'Clean',
          'Innovative',
          'Purposeful',
          'Geometric',
          'Streamlined',
          'Progressive',
        ],
        mood: 'Cool and confident with optimistic forward-thinking energy',
      },
    };

    // Get base concept or generate custom one
    let concept = conceptTemplates[params.theme];

    if (!concept) {
      concept = {
        title: `${params.theme}: ${params.style_direction} Collection`,
        description: `A ${params.style_direction.toLowerCase()} interpretation of ${params.theme}, blending contemporary design with thoughtful attention to detail and modern lifestyle needs.`,
        key_words: this.generateKeywords(params),
        mood: this.generateMoodDescription(params),
      };
    }

    // Adjust concept based on style direction
    concept = this.adjustConceptForStyle(concept, params);

    return concept;
  }

  private generateKeywords(params: MoodBoardParams): string[] {
    const styleKeywords: Record<string, string[]> = {
      Minimalist: ['Clean', 'Essential', 'Purposeful', 'Refined', 'Geometric'],
      Bohemian: [
        'Free-spirited',
        'Eclectic',
        'Textural',
        'Artisanal',
        'Layered',
      ],
      'Urban/Street': [
        'Edgy',
        'Contemporary',
        'Bold',
        'Functional',
        'Authentic',
      ],
      Romantic: ['Feminine', 'Delicate', 'Soft', 'Dreamy', 'Graceful'],
      'Avant-garde': [
        'Innovative',
        'Experimental',
        'Bold',
        'Artistic',
        'Unconventional',
      ],
      'Classic/Timeless': [
        'Elegant',
        'Refined',
        'Quality',
        'Sophisticated',
        'Enduring',
      ],
      'Sporty/Athletic': [
        'Dynamic',
        'Functional',
        'Performance',
        'Energetic',
        'Technical',
      ],
      'Grunge/Edgy': [
        'Rebellious',
        'Raw',
        'Authentic',
        'Distressed',
        'Unconventional',
      ],
      Preppy: ['Polished', 'Traditional', 'Collegiate', 'Classic', 'Refined'],
      'Vintage/Retro': [
        'Nostalgic',
        'Timeless',
        'Character',
        'Heritage',
        'Authentic',
      ],
      Futuristic: [
        'Progressive',
        'Innovative',
        'Technical',
        'Streamlined',
        'Advanced',
      ],
      'Natural/Organic': [
        'Sustainable',
        'Earthy',
        'Authentic',
        'Textural',
        'Harmonious',
      ],
    };

    return (
      styleKeywords[params.style_direction] || [
        'Contemporary',
        'Thoughtful',
        'Modern',
        'Refined',
        'Intentional',
      ]
    );
  }

  private generateMoodDescription(params: MoodBoardParams): string {
    const moodMap: Record<string, string> = {
      Minimalist: 'Calm and confident with purposeful simplicity',
      Bohemian: 'Free-spirited and artistic with eclectic charm',
      'Urban/Street': 'Bold and authentic with contemporary edge',
      Romantic: 'Soft and dreamy with feminine elegance',
      'Avant-garde': 'Innovative and bold with artistic vision',
      'Classic/Timeless': 'Sophisticated and refined with enduring appeal',
      'Sporty/Athletic': 'Energetic and dynamic with performance focus',
      'Grunge/Edgy': 'Raw and rebellious with authentic attitude',
      Preppy: 'Polished and traditional with collegiate charm',
      'Vintage/Retro': 'Nostalgic and charming with timeless character',
      Futuristic: 'Progressive and innovative with optimistic vision',
      'Natural/Organic': 'Harmonious and grounded with sustainable beauty',
    };

    return (
      moodMap[params.style_direction] ||
      'Contemporary and thoughtful with modern sensibility'
    );
  }

  private adjustConceptForStyle(
    concept: {
      title: string;
      description: string;
      key_words: string[];
      mood: string;
    },
    params: MoodBoardParams,
  ) {
    // Modify concept based on additional parameters
    if (params.target_audience) {
      if (params.target_audience === 'Gen Z') {
        concept.description +=
          ' with bold self-expression and sustainability consciousness.';
      } else if (params.target_audience === 'Luxury') {
        concept.description +=
          ' with premium materials and exceptional craftsmanship.';
      }
    }

    return concept;
  }

  private generateVisualElements(params: MoodBoardParams): Array<{
    category: string;
    description: string;
    inspiration_source: string;
    visual_weight: string;
  }> {
    const elements = [
      {
        category: 'Photography',
        description: this.getPhotographyDescription(params),
        inspiration_source: this.getPhotographySource(params),
        visual_weight: 'Primary',
      },
      {
        category: 'Silhouettes',
        description: this.getSilhouetteDescription(params),
        inspiration_source: 'Fashion sketches and editorial imagery',
        visual_weight: 'Primary',
      },
      {
        category: 'Textures',
        description: this.getTextureDescription(params),
        inspiration_source: 'Material close-ups and textile samples',
        visual_weight: 'Secondary',
      },
      {
        category: 'Typography',
        description: this.getTypographyDescription(params),
        inspiration_source: 'Editorial fonts and branding elements',
        visual_weight: 'Accent',
      },
      {
        category: 'Details',
        description: this.getDetailsDescription(params),
        inspiration_source: 'Construction details and hardware closeups',
        visual_weight: 'Accent',
      },
    ];

    return elements;
  }

  private getPhotographyDescription(params: MoodBoardParams): string {
    const stylePhotography: Record<string, string> = {
      Minimalist:
        'Clean architectural photography with strong geometric lines and negative space',
      Bohemian:
        'Rich, textural lifestyle photography with warm natural lighting',
      'Urban/Street':
        'Dynamic street photography capturing authentic urban energy',
      Romantic:
        'Soft, dreamy photography with natural light and organic movement',
      'Avant-garde': 'Experimental artistic photography with bold compositions',
      'Classic/Timeless':
        'Elegant portrait photography with sophisticated styling',
      'Natural/Organic':
        'Nature photography showcasing organic forms and sustainable elements',
    };

    return (
      stylePhotography[params.style_direction] ||
      'Contemporary lifestyle photography with thoughtful composition'
    );
  }

  private getPhotographySource(params: MoodBoardParams): string {
    const sources: Record<string, string> = {
      Minimalist: 'Architecture magazines and contemporary art books',
      Bohemian: 'Travel photography and artisanal craft documentation',
      'Urban/Street': 'Street style blogs and urban exploration photography',
      Romantic: 'Wedding editorials and vintage fashion photography',
      'Natural/Organic': 'Nature documentaries and sustainable lifestyle blogs',
    };

    return (
      sources[params.style_direction] ||
      'Fashion editorials and lifestyle photography'
    );
  }

  private getSilhouetteDescription(params: MoodBoardParams): string {
    const silhouettes: Record<string, string> = {
      Minimalist: 'Clean, geometric silhouettes with purposeful proportions',
      Bohemian: 'Flowing, layered silhouettes with organic movement',
      'Urban/Street': 'Relaxed, functional silhouettes with contemporary edge',
      Romantic: 'Soft, feminine silhouettes with graceful draping',
      'Avant-garde': 'Experimental, sculptural silhouettes pushing boundaries',
    };

    return (
      silhouettes[params.style_direction] ||
      'Contemporary silhouettes with modern proportions'
    );
  }

  private getTextureDescription(params: MoodBoardParams): string {
    const textures: Record<string, string> = {
      Minimalist: 'Smooth, refined textures with subtle surface interest',
      Bohemian: 'Rich, varied textures with handcrafted qualities',
      'Urban/Street': 'Technical and natural textures with authentic character',
      Romantic: 'Soft, delicate textures with feminine appeal',
    };

    return (
      textures[params.style_direction] ||
      'Contemporary textures balancing visual and tactile interest'
    );
  }

  private getTypographyDescription(params: MoodBoardParams): string {
    const typography: Record<string, string> = {
      Minimalist: 'Clean sans-serif typography with excellent readability',
      Bohemian: 'Hand-lettered and script fonts with organic character',
      'Urban/Street': 'Bold, contemporary fonts with street art influence',
      Romantic: 'Elegant serif and script fonts with feminine charm',
    };

    return (
      typography[params.style_direction] ||
      'Contemporary typography supporting brand personality'
    );
  }

  private getDetailsDescription(params: MoodBoardParams): string {
    const details: Record<string, string> = {
      Minimalist: 'Clean hardware and precise construction details',
      Bohemian: 'Artisanal embellishments and unique handcrafted elements',
      'Urban/Street': 'Functional hardware and authentic construction details',
      Romantic: 'Delicate embellishments and feminine detail work',
    };

    return (
      details[params.style_direction] ||
      'Thoughtful details supporting design integrity'
    );
  }

  private generateColorPalette(params: MoodBoardParams): Array<{
    color: string;
    hex: string;
    usage: string;
    mood_contribution: string;
  }> {
    // Color story database
    const colorStories: Record<
      string,
      Array<{
        color: string;
        hex: string;
        usage: string;
        mood_contribution: string;
      }>
    > = {
      'Earth Tones': [
        {
          color: 'Warm Sand',
          hex: '#D4B896',
          usage: 'Base neutrals',
          mood_contribution: 'Grounding and natural',
        },
        {
          color: 'Terracotta',
          hex: '#B85C4C',
          usage: 'Accent pieces',
          mood_contribution: 'Warmth and earthiness',
        },
        {
          color: 'Sage Green',
          hex: '#9CAF88',
          usage: 'Mid-tone pieces',
          mood_contribution: 'Calm and natural',
        },
        {
          color: 'Clay Brown',
          hex: '#8B5A3C',
          usage: 'Structure pieces',
          mood_contribution: 'Stability and depth',
        },
      ],
      Monochromatic: [
        {
          color: 'Pure White',
          hex: '#FFFFFF',
          usage: 'Base pieces',
          mood_contribution: 'Clean and pure',
        },
        {
          color: 'Light Gray',
          hex: '#E5E5E5',
          usage: 'Light accents',
          mood_contribution: 'Soft sophistication',
        },
        {
          color: 'Medium Gray',
          hex: '#808080',
          usage: 'Mid-tone pieces',
          mood_contribution: 'Modern balance',
        },
        {
          color: 'Charcoal',
          hex: '#36454F',
          usage: 'Statement pieces',
          mood_contribution: 'Depth and authority',
        },
      ],
      Pastels: [
        {
          color: 'Soft Pink',
          hex: '#F8BBD9',
          usage: 'Feminine accents',
          mood_contribution: 'Gentle and romantic',
        },
        {
          color: 'Lavender',
          hex: '#E6E6FA',
          usage: 'Light pieces',
          mood_contribution: 'Calm and dreamy',
        },
        {
          color: 'Mint Green',
          hex: '#F5FFFA',
          usage: 'Fresh accents',
          mood_contribution: 'Fresh and youthful',
        },
        {
          color: 'Peach',
          hex: '#FFCBA4',
          usage: 'Warm accents',
          mood_contribution: 'Warmth and optimism',
        },
      ],
    };

    // Get color story based on parameters
    let palette = colorStories[params.color_story || 'Monochromatic'];

    // If no specific color story, generate based on style
    if (!palette) {
      palette = this.generateStyleBasedPalette(params);
    }

    return palette;
  }

  private generateStyleBasedPalette(params: MoodBoardParams): Array<{
    color: string;
    hex: string;
    usage: string;
    mood_contribution: string;
  }> {
    const stylePalettes: Record<
      string,
      Array<{
        color: string;
        hex: string;
        usage: string;
        mood_contribution: string;
      }>
    > = {
      'Urban/Street': [
        {
          color: 'Concrete Gray',
          hex: '#95A5A6',
          usage: 'Base pieces',
          mood_contribution: 'Urban authenticity',
        },
        {
          color: 'Traffic Orange',
          hex: '#FF6B35',
          usage: 'Bold accents',
          mood_contribution: 'Energy and visibility',
        },
        {
          color: 'Steel Blue',
          hex: '#4682B4',
          usage: 'Denim and structure',
          mood_contribution: 'Cool confidence',
        },
        {
          color: 'Black',
          hex: '#000000',
          usage: 'Statement pieces',
          mood_contribution: 'Urban edge',
        },
      ],
      Romantic: [
        {
          color: 'Blush Pink',
          hex: '#FFB3BA',
          usage: 'Feminine pieces',
          mood_contribution: 'Soft romance',
        },
        {
          color: 'Cream',
          hex: '#FFF8DC',
          usage: 'Base pieces',
          mood_contribution: 'Elegant softness',
        },
        {
          color: 'Dusty Rose',
          hex: '#DCAE96',
          usage: 'Mid-tone pieces',
          mood_contribution: 'Vintage charm',
        },
        {
          color: 'Sage',
          hex: '#87A96B',
          usage: 'Natural accents',
          mood_contribution: 'Organic balance',
        },
      ],
    };

    return (
      stylePalettes[params.style_direction] || [
        {
          color: 'Neutral Base',
          hex: '#F5F5F5',
          usage: 'Foundation pieces',
          mood_contribution: 'Clean backdrop',
        },
        {
          color: 'Accent Color',
          hex: '#4A90A4',
          usage: 'Highlight pieces',
          mood_contribution: 'Contemporary appeal',
        },
        {
          color: 'Deep Tone',
          hex: '#2F3640',
          usage: 'Structure pieces',
          mood_contribution: 'Sophisticated depth',
        },
      ]
    );
  }

  private generateTextureMaterials(params: MoodBoardParams): Array<{
    material: string;
    texture: string;
    application: string;
    sensory_impact: string;
  }> {
    const styleTextures: Record<
      string,
      Array<{
        material: string;
        texture: string;
        application: string;
        sensory_impact: string;
      }>
    > = {
      Minimalist: [
        {
          material: 'Smooth Cotton',
          texture: 'Clean and crisp',
          application: 'Shirts and dresses',
          sensory_impact: 'Refined and comfortable',
        },
        {
          material: 'Matte Leather',
          texture: 'Smooth with subtle grain',
          application: 'Shoes and accessories',
          sensory_impact: 'Luxurious and durable',
        },
        {
          material: 'Technical Knit',
          texture: 'Smooth with structure',
          application: 'Activewear and outerwear',
          sensory_impact: 'Modern and functional',
        },
      ],
      Bohemian: [
        {
          material: 'Chunky Knit',
          texture: 'Rich and textural',
          application: 'Sweaters and cardigans',
          sensory_impact: 'Cozy and handcrafted',
        },
        {
          material: 'Embroidered Cotton',
          texture: 'Raised patterns',
          application: 'Tops and dresses',
          sensory_impact: 'Artisanal and unique',
        },
        {
          material: 'Suede',
          texture: 'Soft and napped',
          application: 'Jackets and accessories',
          sensory_impact: 'Luxurious and tactile',
        },
        {
          material: 'Macramé',
          texture: 'Knotted and dimensional',
          application: 'Accessories and details',
          sensory_impact: 'Handmade and textural',
        },
      ],
      'Urban/Street': [
        {
          material: 'Denim',
          texture: 'Rugged and worn',
          application: 'Jeans and jackets',
          sensory_impact: 'Authentic and durable',
        },
        {
          material: 'Canvas',
          texture: 'Sturdy and matte',
          application: 'Outerwear and bags',
          sensory_impact: 'Functional and reliable',
        },
        {
          material: 'Technical Mesh',
          texture: 'Perforated and technical',
          application: 'Activewear and footwear',
          sensory_impact: 'Modern and breathable',
        },
      ],
      Romantic: [
        {
          material: 'Chiffon',
          texture: 'Sheer and flowing',
          application: 'Dresses and blouses',
          sensory_impact: 'Ethereal and feminine',
        },
        {
          material: 'Lace',
          texture: 'Delicate and openwork',
          application: 'Details and overlays',
          sensory_impact: 'Romantic and intricate',
        },
        {
          material: 'Silk',
          texture: 'Smooth and lustrous',
          application: 'Blouses and dresses',
          sensory_impact: 'Luxurious and elegant',
        },
      ],
    };

    return (
      styleTextures[params.style_direction] || [
        {
          material: 'Cotton Blend',
          texture: 'Smooth and versatile',
          application: 'General garments',
          sensory_impact: 'Comfortable and reliable',
        },
        {
          material: 'Knit Jersey',
          texture: 'Stretchy and soft',
          application: 'Casual wear',
          sensory_impact: 'Comfortable and easy-wearing',
        },
      ]
    );
  }

  private generateStylingNotes(params: MoodBoardParams): string[] {
    const styleNotes: Record<string, string[]> = {
      Minimalist: [
        'Focus on impeccable fit and proportion',
        'Limit accessories to essential, high-quality pieces',
        'Emphasize fabric quality over embellishment',
        'Use negative space effectively in composition',
      ],
      Bohemian: [
        'Layer different textures and patterns thoughtfully',
        'Incorporate handcrafted and vintage elements',
        'Mix high and low price points for authenticity',
        'Balance loose silhouettes with fitted pieces',
      ],
      'Urban/Street': [
        'Combine athletic and casual pieces naturally',
        'Focus on functional details and construction',
        'Mix designer and accessible brands',
        'Emphasize authentic street culture references',
      ],
      Romantic: [
        'Balance feminine details with modern silhouettes',
        'Layer delicate pieces for depth and interest',
        'Choose soft, flattering lighting for photography',
        'Incorporate vintage elements sparingly',
      ],
    };

    return (
      styleNotes[params.style_direction] || [
        'Maintain consistency in aesthetic vision',
        'Balance trendy elements with timeless appeal',
        'Consider target market preferences',
        'Ensure commercial viability of design choices',
      ]
    );
  }

  private generateExecutionTips(_params: MoodBoardParams): string[] {
    return [
      'Create physical mood boards alongside digital versions for texture authenticity',
      'Use a mix of photography styles - lifestyle, detail shots, and editorial',
      'Include fabric swatches and material samples when possible',
      'Maintain visual hierarchy with varying image sizes and weights',
      "Consider the board's story flow from concept to execution",
      'Include both aspirational and accessible reference points',
      'Test color combinations in different lighting conditions',
      'Gather feedback from target demographic representatives',
    ];
  }

  private formatMoodBoardResults(
    concept: {
      title: string;
      description: string;
      key_words: string[];
      mood: string;
    },
    visualElements: Array<{
      category: string;
      description: string;
      inspiration_source: string;
      visual_weight: string;
    }>,
    colorPalette: Array<{
      color: string;
      hex: string;
      usage: string;
      mood_contribution: string;
    }>,
    textureMaterials: Array<{
      material: string;
      texture: string;
      application: string;
      sensory_impact: string;
    }>,
    stylingNotes: string[],
    executionTips: string[],
  ): string {
    let result = `# ${concept.title}\n\n`;

    result += `## Concept Overview\n`;
    result += `**Description:** ${concept.description}\n\n`;
    result += `**Key Words:** ${concept.key_words.join(', ')}\n\n`;
    result += `**Mood:** ${concept.mood}\n\n`;

    result += `## Visual Elements\n`;
    visualElements.forEach((element) => {
      result += `### ${element.category} (${element.visual_weight})\n`;
      result += `- **Description:** ${element.description}\n`;
      result += `- **Source:** ${element.inspiration_source}\n\n`;
    });

    result += `## Color Palette\n`;
    colorPalette.forEach((color, index) => {
      result += `### ${index + 1}. ${color.color} (${color.hex})\n`;
      result += `- **Usage:** ${color.usage}\n`;
      result += `- **Mood Impact:** ${color.mood_contribution}\n\n`;
    });

    result += `## Textures & Materials\n`;
    textureMaterials.forEach((material, index) => {
      result += `### ${index + 1}. ${material.material}\n`;
      result += `- **Texture:** ${material.texture}\n`;
      result += `- **Application:** ${material.application}\n`;
      result += `- **Sensory Impact:** ${material.sensory_impact}\n\n`;
    });

    result += `## Styling Direction\n`;
    stylingNotes.forEach((note, index) => {
      result += `${index + 1}. ${note}\n`;
    });
    result += `\n`;

    result += `## Execution Tips\n`;
    executionTips.forEach((tip, index) => {
      result += `${index + 1}. ${tip}\n`;
    });

    return result;
  }
}
