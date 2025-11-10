import { fetchWithAuth } from "@/utils/auth";
import { ENV } from "@/config/env";
import { useEffect, useState } from "react";

export interface AnalyticsStats {
    recipeViews: {
        count: number;
        change: number;
    };
    favoritesAdded: {
        count: number;
        change: number;
    };
    recipesCooked: {
        count: number;
        change: number;
    };
    moneySaved: {
        amount: number;
        change: number;
    };
}

export interface WeeklyActivity {
    day: string;
    value: number;
    dayName: string;
}

export interface PopularCuisine {
    name: string;
    rank: number;
    emoji: string;
    change: number;
    searches: number;
    percentage: number;
}

export interface AnalyticsData {
    period: string;
    lastUpdated: string;
    stats: AnalyticsStats;
    weeklyActivity?: WeeklyActivity[];  // ✅ Make optional
    monthlyActivity?: WeeklyActivity[]; // ✅ Add monthly
    yearlyActivity?: WeeklyActivity[];  // ✅ Add yearly
    popularCuisines: PopularCuisine[];
}

export const useAnalytics = (period: string = "week") => {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchAnalytics();
    }, [period]);

    const fetchAnalytics = async () => {
        setLoading(true);
        setError(null);

        try {
            const url = `${ENV.API_URL}/analytics/dashboard?period=${period}`;

            // ✅ Log the request
            console.log("📊 Fetching analytics:", url);

            const response = await fetchWithAuth(url, {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            // ✅ Log the full response
            console.log("📊 Analytics Response:", JSON.stringify(result, null, 2));

            if (result.success && result.data) {
                setData(result.data);
            } else {
                throw new Error("Invalid response structure");
            }
        } catch (err) {
            console.error("❌ Error fetching analytics:", err);
            setError(err instanceof Error ? err.message : "Failed to fetch analytics");
        } finally {
            setLoading(false);
        }
    };

    const refetch = () => {
        fetchAnalytics();
    };

    return { data, loading, error, refetch };
};