/**
 * Alt Text Style presets for different use cases
 * Each style has specific prompts optimized for that context
 */

export interface AltTextStyle {
  id: string;
  name: string;
  description: string;
  icon: string;
  promptInstruction: string;
  examples: string[];
}

export const ALT_TEXT_STYLES: Record<string, AltTextStyle> = {
  default: {
    id: "default",
    name: "Standard",
    description: "Balanced, general-purpose descriptions suitable for most contexts",
    icon: "FileText",
    promptInstruction: `Create a clear, descriptive alt text that:
- Describes the main subject and important details of the image
- Uses objective, straightforward language
- Avoids redundant phrases like "image of" or "picture of"
- Focuses on what's visually important for understanding the content
- Is appropriate for screen reader users`,
    examples: [
      "A golden retriever puppy sitting on a green lawn, looking at the camera with its tongue out",
      "Bar chart showing quarterly sales growth from Q1 to Q4, with Q4 being the highest at 45%",
    ],
  },
  ecommerce: {
    id: "ecommerce",
    name: "E-commerce",
    description: "Product-focused, SEO-optimized descriptions for online stores",
    icon: "ShoppingCart",
    promptInstruction: `Create SEO-optimized alt text for product images that:
- Includes the product name/type as the primary focus
- Mentions key attributes: color, material, size, pattern, style
- Highlights distinguishing features and selling points
- Uses keywords buyers would search for naturally
- Includes brand name if visible on the product
- Notes product condition/state (e.g., "worn by model", "flat lay")
- Keeps description concise but informative for search engines
- Avoids promotional language - focus on factual description`,
    examples: [
      "Women's red leather crossbody bag with adjustable gold chain strap and front zipper pocket",
      "Nike Air Max 90 running shoes in white and navy blue, side profile view showing air cushion sole",
      "Organic cotton striped throw pillow, 18x18 inches, in sage green and cream on beige sofa",
    ],
  },
  editorial: {
    id: "editorial",
    name: "Editorial",
    description: "Journalistic, objective descriptions for news and media",
    icon: "Newspaper",
    promptInstruction: `Create journalistic alt text suitable for news and editorial content that:
- Answers who, what, where, when if applicable
- Remains objective and factual without interpretation
- Describes visible emotions, expressions, and body language
- Includes relevant context clues (signage, uniforms, setting)
- Notes significant background elements that add context
- Identifies recognizable public figures if present
- Describes the action or moment being captured
- Avoids speculation or assumptions about intent`,
    examples: [
      "Mayor Johnson speaking at a podium during a press conference at City Hall, reporters visible in foreground",
      "Rescue workers in orange vests searching through debris after the earthquake, dust visible in the air",
      "Protesters holding signs reading 'Climate Action Now' marching down a city street, police officers visible on sidewalk",
    ],
  },
  technical: {
    id: "technical",
    name: "Technical",
    description: "Detailed, precise specifications for diagrams and documentation",
    icon: "Settings",
    promptInstruction: `Create technical alt text with precise specifications that:
- Uses exact terminology relevant to the domain
- Describes components, parts, and their relationships
- Includes measurements, dimensions, or scale if visible
- Notes orientation (left/right, top/bottom, front/back view)
- Describes data visualizations with key values and trends
- Identifies labels, annotations, and callouts
- Explains the purpose or function of technical elements
- Uses consistent naming conventions
- Suitable for technical documentation and scientific contexts`,
    examples: [
      "Circuit diagram showing a 555 timer IC connected to LED through 330 ohm resistor, powered by 9V DC supply",
      "Cross-section diagram of human heart showing left and right atria, ventricles, and major blood vessels labeled",
      "Line graph comparing CPU temperature over time for three processors, x-axis 0-60 minutes, y-axis 30-90 degrees Celsius",
    ],
  },
  social: {
    id: "social",
    name: "Social Media",
    description: "Engaging, accessible descriptions for social platforms",
    icon: "Heart",
    promptInstruction: `Create engaging alt text for social media that:
- Captures the mood, emotion, and vibe of the image
- Uses conversational but inclusive language
- Describes relatable moments and expressions
- Notes aesthetic elements (lighting, filters, composition)
- Includes relevant hashtag-worthy details
- Keeps description concise for mobile reading
- Makes content accessible without losing personality
- Describes the scene in a way that helps users feel included
- Avoids overly formal or stiff language`,
    examples: [
      "Friends laughing together at a rooftop party during sunset, city skyline in warm golden light behind them",
      "Cozy flat lay of coffee cup, open book, and autumn leaves on a wooden table, soft morning light",
      "Person doing a yoga pose on a beach at sunrise, silhouetted against pink and orange sky",
    ],
  },
  artistic: {
    id: "artistic",
    name: "Artistic",
    description: "Expressive descriptions for art, photography, and creative work",
    icon: "Palette",
    promptInstruction: `Create expressive alt text for artistic and creative images that:
- Describes the artistic medium, style, and technique
- Notes color palette, composition, and visual elements
- Captures the mood, atmosphere, and emotional tone
- Mentions artistic influences or style references if apparent
- Describes texture, brushwork, or photographic techniques
- Includes the subject matter and symbolic elements
- Notes lighting, contrast, and visual effects
- Appropriate for galleries, portfolios, and creative platforms`,
    examples: [
      "Abstract oil painting with bold strokes of cobalt blue and burnt orange swirling across the canvas, textured impasto technique",
      "Black and white portrait photograph with dramatic side lighting, subject's face half in shadow, high contrast",
      "Watercolor landscape of misty mountains at dawn, soft gradients of lavender and pale blue, minimalist composition",
    ],
  },
} as const;

/**
 * Get style configuration by ID
 */
export function getStyleConfig(id: string): AltTextStyle | undefined {
  return ALT_TEXT_STYLES[id];
}

/**
 * Get all style IDs
 */
export function getSupportedStyleIds(): string[] {
  return Object.keys(ALT_TEXT_STYLES);
}

/**
 * Get styles as array for Select component
 */
export function getStylesForSelect(): { value: string; label: string; description: string; icon: string }[] {
  return Object.values(ALT_TEXT_STYLES).map((style) => ({
    value: style.id,
    label: style.name,
    description: style.description,
    icon: style.icon,
  }));
}
