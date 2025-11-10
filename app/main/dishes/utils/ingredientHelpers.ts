export interface Ingredient {
    name: string;
    amount: string;
    icon: string;
}

/**
 * Comprehensive ingredient icon mapping (100+ ingredients)
 * Organized by category for easy maintenance
 */
const ingredientIcons: { [key: string]: string } = {
    // Vegetables
    tomato: "🍅", tomatoes: "🍅",
    onion: "🧅", onions: "🧅",
    garlic: "🧄", 
    pepper: "🌶️", peppers: "🌶️",
    "bell pepper": "🫑", "bell peppers": "🫑",
    carrot: "🥕", carrots: "🥕",
    potato: "🥔", potatoes: "🥔",
    "sweet potato": "🍠",
    broccoli: "🥦",
    cucumber: "🥒", cucumbers: "🥒",
    lettuce: "🥬",
    spinach: "🥬",
    cabbage: "🥬",
    corn: "🌽",
    eggplant: "🍆", aubergine: "🍆",
    avocado: "🥑",
    celery: "🌱",
    peas: "🫛",
    zucchini: "🥒",
    squash: "🎃",
    pumpkin: "🎃",
    
    // Proteins
    chicken: "🐔", "chicken breast": "🐔",
    beef: "🥩", steak: "🥩",
    pork: "🥓", bacon: "🥓",
    lamb: "🍖",
    fish: "🐟", salmon: "🐟", tuna: "🐟", cod: "🐟",
    shrimp: "🦐", prawns: "🦐",
    lobster: "🦞",
    crab: "🦀",
    egg: "🥚", eggs: "🥚",
    tofu: "🧈",
    
    // Dairy
    milk: "🥛",
    cheese: "🧀", cheddar: "🧀", parmesan: "🧀", mozzarella: "🧀",
    butter: "🧈",
    cream: "🥛", "heavy cream": "🥛", "whipped cream": "🥛",
    yogurt: "🥛",
    "sour cream": "🥛",
    
    // Grains & Carbs
    rice: "🍚", "white rice": "🍚", "brown rice": "🍚",
    pasta: "🍝", spaghetti: "🍝", penne: "🍝", linguine: "🍝",
    noodles: "🍜", ramen: "🍜",
    bread: "🍞", "white bread": "🍞", "wheat bread": "🍞",
    flour: "🌾", "all-purpose flour": "🌾",
    quinoa: "🌾",
    oats: "🌾", oatmeal: "🌾",
    couscous: "🌾",
    
    // Fruits
    lemon: "🍋", lemons: "🍋",
    lime: "🍋", limes: "🍋",
    orange: "🍊", oranges: "🍊",
    apple: "🍎", apples: "🍎",
    banana: "🍌", bananas: "🍌",
    strawberry: "🍓", strawberries: "🍓",
    blueberry: "🫐", blueberries: "🫐",
    grape: "🍇", grapes: "🍇",
    watermelon: "🍉",
    pineapple: "🍍",
    mango: "🥭",
    peach: "🍑",
    cherry: "🍒", cherries: "🍒",
    pear: "🍐",
    coconut: "🥥",
    
    // Nuts & Seeds
    peanut: "🥜", peanuts: "🥜", "peanut butter": "🥜",
    almond: "🌰", almonds: "🌰",
    walnut: "🌰", walnuts: "🌰",
    cashew: "🌰", cashews: "🌰",
    pistachio: "🌰",
    sesame: "🌾", "sesame seeds": "🌾",
    
    // Oils & Fats
    oil: "🫒", "olive oil": "🫒", "vegetable oil": "🫒",
    "coconut oil": "🥥",
    
    // Seasonings & Spices
    salt: "🧂", "sea salt": "🧂",
    "black pepper": "🌶️", "white pepper": "🌶️",
    paprika: "🌶️",
    cumin: "🧄",
    cinnamon: "🌰",
    ginger: "🧄",
    turmeric: "🧄",
    curry: "🍛", "curry powder": "🍛",
    chili: "🌶️", "chili powder": "🌶️",
    basil: "🌿",
    oregano: "🌿",
    thyme: "🌿",
    rosemary: "🌿",
    parsley: "🌿",
    cilantro: "🌿", coriander: "🌿",
    mint: "🌿",
    dill: "🌿",
    sage: "🌿",
    bay: "🌿", "bay leaf": "🌿", "bay leaves": "🌿",
    
    // Condiments & Sauces
    "soy sauce": "🥢",
    vinegar: "🍯", "balsamic vinegar": "🍯",
    honey: "🍯",
    syrup: "🍯", "maple syrup": "🍯",
    ketchup: "🍅",
    mustard: "💛",
    mayonnaise: "🥚",
    "hot sauce": "🌶️",
    "worcestershire sauce": "🥢",
    "fish sauce": "🐟",
    
    // Beans & Legumes
    beans: "🫘", "black beans": "🫘", "kidney beans": "🫘",
    lentils: "🫘",
    chickpeas: "🫘", garbanzo: "🫘",
    
    // Mushrooms
    mushroom: "🍄", mushrooms: "🍄",
    "shiitake mushroom": "🍄",
    "portobello mushroom": "🍄",
    
    // Sweets & Baking
    sugar: "🍯", "brown sugar": "🍯", "white sugar": "🍯",
    chocolate: "🍫", "dark chocolate": "🍫", cocoa: "🍫",
    vanilla: "🌸", "vanilla extract": "🌸",
    "baking powder": "🌾",
    "baking soda": "🌾",
    yeast: "🌾",
    
    // Drinks & Liquids
    water: "💧",
    broth: "🍲", "chicken broth": "🍲", "beef broth": "🍲", "vegetable broth": "🍲",
    stock: "🍲",
    wine: "🍷", "red wine": "🍷", "white wine": "🍷",
    beer: "🍺",
    
    // Misc
    nori: "🌊", seaweed: "🌊",
    wasabi: "🌶️",
};

/**
 * Smart icon matcher - finds best matching icon even for partial matches
 * Examples: "fresh tomatoes" → 🍅, "grilled chicken breast" → 🐔
 */
const findBestIconMatch = (ingredientName: string): string => {
    const lowerName = ingredientName.toLowerCase();
    
    // 1. Try exact match first
    if (ingredientIcons[lowerName]) {
        return ingredientIcons[lowerName];
    }
    
    // 2. Try to find any keyword that matches
    for (const [key, icon] of Object.entries(ingredientIcons)) {
        // Check if the ingredient name contains the key
        if (lowerName.includes(key)) {
            return icon;
        }
    }
    
    // 3. Check word by word (handles "fresh tomatoes", "diced chicken", etc.)
    const words = lowerName.split(/\s+/);
    for (const word of words) {
        if (ingredientIcons[word]) {
            return ingredientIcons[word];
        }
    }
    
    // 4. Default fallback
    return "🥘";
};

export const convertSearchedToIngredients = (
    searchedIngredients: string[]
): Ingredient[] => {
    return searchedIngredients
        .filter((i) => typeof i === "string" && i.trim() !== "")
        .map((ingredient) => ({
            name: ingredient,
            amount: "as needed",
            icon: findBestIconMatch(ingredient),
        }));
};

export const generateIngredientsFromSteps = (steps: string[]): Ingredient[] => {
    const stepsText = steps.join(" ").toLowerCase();
    const foundIngredients: Ingredient[] = [];
    const foundKeys = new Set<string>(); // Prevent duplicates

    // Scan through all available ingredients in our dictionary
    for (const [key, icon] of Object.entries(ingredientIcons)) {
        if (stepsText.includes(key) && !foundKeys.has(icon)) {
            foundIngredients.push({
                name: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize first letter
                amount: "as needed",
                icon: icon,
            });
            foundKeys.add(icon); // Prevent duplicate icons
        }
    }

    // If no ingredients found, add generic ones
    if (foundIngredients.length === 0) {
        foundIngredients.push(
            { name: "Main ingredients", amount: "as needed", icon: "🥘" },
            { name: "Seasonings", amount: "to taste", icon: "🧂" },
            { name: "Fresh herbs", amount: "optional", icon: "🌿" }
        );
    }

    return foundIngredients;
};