export interface DishData {
    id: string;
    name: string;
    culture: string;
    country: string;
    dishType: string;
    prepTime: string;
    calories: number;
    outdoorCost: number;
    homeCost: number;
    moneySaved: number;
    image: string;
    isLiked: boolean;
    isSaved: boolean;
    shortDescription: string;
    steps: string[];
  }
  
  export interface ApiDish {
    id: string,
    DishName: string;
    CuisineType: string;
    DishType: string;
    EstimatedPortionSize: string;
    EstimatedCalories: number;
    EstimatedOutsideCost: number;
    EstimatedHomeCost: number;
    MoneySaved: number;
    PictureURL: string;
    ShortDescription: string;
    Steps: string[];
    VideoURL: string;
  }