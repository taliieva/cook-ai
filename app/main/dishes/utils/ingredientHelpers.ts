export interface Ingredient {
    name: string;
    amount: string;
    icon: string;
}

const ingredientIcons: { [key: string]: string } = {
    tomato: "🍅",
    tomatoes: "🍅",
    egg: "🥚",
    eggs: "🥚",
    cheese: "🧀",
    onion: "🧅",
    onions: "🧅",
    garlic: "🧄",
    pepper: "🌶️",
    "bell pepper": "🫑",
    salt: "🧂",
    oil: "🫒",
    "olive oil": "🫒",
    butter: "🧈",
    pasta: "🍝",
    spaghetti: "🍝",
    rice: "🍚",
    chicken: "🐔",
    beef: "🥩",
    fish: "🐟",
    milk: "🥛",
    flour: "🌾",
    sugar: "🍯",
    lemon: "🍋",
    carrot: "🥕",
    carrots: "🥕",
    potato: "🥔",
    potatoes: "🥔",
    mushroom: "🍄",
    mushrooms: "🍄",
};

export const convertSearchedToIngredients = (
    searchedIngredients: string[]
): Ingredient[] => {
    return searchedIngredients
        .filter((i) => typeof i === "string" && i.trim() !== "")
        .map((ingredient) => ({
            name: ingredient,
            amount: "as needed",
            icon: ingredientIcons[ingredient.toLowerCase()] || "🥘",
        }));
};

export const generateIngredientsFromSteps = (steps: string[]): Ingredient[] => {
    const commonIngredients = [
        { keywords: ["tomato", "tomatoes"], icon: "🍅" },
        { keywords: ["egg", "eggs"], icon: "🥚" },
        { keywords: ["cheese"], icon: "🧀" },
        { keywords: ["onion", "onions"], icon: "🧅" },
        { keywords: ["garlic"], icon: "🧄" },
        { keywords: ["pepper", "black pepper"], icon: "🌶️" },
        { keywords: ["salt"], icon: "🧂" },
        { keywords: ["oil", "olive oil"], icon: "🫒" },
        { keywords: ["butter"], icon: "🧈" },
        { keywords: ["pasta", "spaghetti"], icon: "🍝" },
        { keywords: ["rice"], icon: "🍚" },
        { keywords: ["chicken"], icon: "🐔" },
        { keywords: ["beef"], icon: "🥩" },
        { keywords: ["fish"], icon: "🐟" },
        { keywords: ["milk"], icon: "🥛" },
        { keywords: ["flour"], icon: "🌾" },
        { keywords: ["sugar"], icon: "🍯" },
        { keywords: ["lemon"], icon: "🍋" },
        { keywords: ["herb", "herbs", "parsley", "basil"], icon: "🌿" },
        { keywords: ["spice", "spices"], icon: "🧄" },
    ];

    const stepsText = steps.join(" ").toLowerCase();
    const foundIngredients: Ingredient[] = [];

    commonIngredients.forEach((ingredient) => {
        const found = ingredient.keywords.some(
            (keyword) => keyword && stepsText.includes(keyword.toLowerCase())
        );

        if (found) {
            const matchedKeyword =
                ingredient.keywords.find(
                    (keyword) => keyword && stepsText.includes(keyword.toLowerCase())
                ) || ingredient.keywords[0];

            foundIngredients.push({
                name: matchedKeyword,
                amount: "as needed",
                icon: ingredient.icon,
            });
        }
    });

    if (foundIngredients.length === 0) {
        foundIngredients.push(
            { name: "Main ingredients", amount: "as needed", icon: "🥘" },
            { name: "Seasonings", amount: "to taste", icon: "🧂" },
            { name: "Fresh herbs", amount: "optional", icon: "🌿" }
        );
    }

    return foundIngredients;
};