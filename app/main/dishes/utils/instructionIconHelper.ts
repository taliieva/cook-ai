/**
 * Dynamic Icon Helper for Cooking Instructions
 * Analyzes instruction text and assigns contextually relevant Ionicons
 */

export interface InstructionIcon {
    name: string;
    color: string;
}

/**
 * Cooking action patterns and their corresponding icons
 */
const actionPatterns: Array<{ keywords: string[]; icon: string; color: string }> = [
    // Cutting & Prep
    { keywords: ['chop', 'dice', 'slice', 'cut', 'mince', 'julienne'], icon: 'cut', color: '#FF6B6B' },
    { keywords: ['peel', 'skin'], icon: 'remove-circle', color: '#FFA07A' },
    { keywords: ['grate', 'shred'], icon: 'grid', color: '#FF8C69' },
    { keywords: ['wash', 'rinse', 'clean'], icon: 'water', color: '#4ECDC4' },
    
    // Mixing & Combining
    { keywords: ['mix', 'combine', 'blend', 'whisk', 'stir', 'fold'], icon: 'shuffle', color: '#95E1D3' },
    { keywords: ['beat', 'whip'], icon: 'pulse', color: '#A8E6CF' },
    
    // Cooking Methods - Heat
    { keywords: ['bake', 'roast', 'oven'], icon: 'cube', color: '#FF6B9D' },
    { keywords: ['boil', 'simmer'], icon: 'water', color: '#4ECDC4' },
    { keywords: ['fry', 'sauté', 'pan-fry', 'stir-fry'], icon: 'flame', color: '#FF8C42' },
    { keywords: ['grill', 'barbecue', 'bbq'], icon: 'bonfire', color: '#FF6347' },
    { keywords: ['steam'], icon: 'cloud', color: '#B0E0E6' },
    { keywords: ['microwave'], icon: 'radio', color: '#DDA0DD' },
    
    // Temperature & Time
    { keywords: ['heat', 'warm', 'preheat'], icon: 'thermometer', color: '#FF7F50' },
    { keywords: ['cool', 'chill', 'refrigerate', 'freeze'], icon: 'snow', color: '#87CEEB' },
    { keywords: ['wait', 'rest', 'sit', 'stand'], icon: 'time', color: '#FFD700' },
    { keywords: ['cook', 'cooking'], icon: 'flame', color: '#FF6347' },
    
    // Measuring & Adding
    { keywords: ['measure', 'weigh'], icon: 'scale', color: '#9370DB' },
    { keywords: ['add', 'pour', 'drizzle', 'sprinkle'], icon: 'add-circle', color: '#7B68EE' },
    { keywords: ['season', 'salt', 'pepper'], icon: 'sparkles', color: '#FFD700' },
    
    // Containers & Tools
    { keywords: ['bowl', 'container'], icon: 'ellipse', color: '#DEB887' },
    { keywords: ['pot', 'pan', 'skillet', 'wok'], icon: 'ellipse', color: '#CD853F' },
    { keywords: ['plate', 'dish', 'platter'], icon: 'disc', color: '#F0E68C' },
    { keywords: ['cover', 'lid'], icon: 'ellipse-outline', color: '#BC8F8F' },
    
    // Final Steps
    { keywords: ['serve', 'serving', 'plate'], icon: 'restaurant', color: '#32CD32' },
    { keywords: ['garnish', 'decorate', 'top'], icon: 'leaf', color: '#90EE90' },
    { keywords: ['drain', 'strain'], icon: 'funnel', color: '#6495ED' },
    { keywords: ['remove', 'discard', 'throw'], icon: 'close-circle', color: '#FA8072' },
    
    // Special Techniques
    { keywords: ['marinate', 'soak'], icon: 'hourglass', color: '#DAA520' },
    { keywords: ['knead', 'massage'], icon: 'hand-right', color: '#D2691E' },
    { keywords: ['roll', 'shape', 'form'], icon: 'git-commit', color: '#CD5C5C' },
    { keywords: ['spread', 'brush'], icon: 'brush', color: '#F4A460' },
];

/**
 * Find the best matching icon for an instruction based on keywords
 */
export const getInstructionIcon = (instruction: string): InstructionIcon => {
    const lowerInstruction = instruction.toLowerCase();
    
    // Try to find the first matching pattern
    for (const pattern of actionPatterns) {
        for (const keyword of pattern.keywords) {
            if (lowerInstruction.includes(keyword)) {
                return {
                    name: pattern.icon,
                    color: pattern.color,
                };
            }
        }
    }
    
    // Default icon if no match found
    return {
        name: 'checkmark-circle',
        color: '#4CAF50',
    };
};

/**
 * Get icons for all instructions in a recipe
 */
export const getInstructionIcons = (steps: string[]): InstructionIcon[] => {
    return steps.map(step => getInstructionIcon(step));
};

