export interface Stock {
    symbol: string;
    longName: string; // Ensure "N" is uppercase
    regularMarketPrice: number;
    regularMarketChangePercent: number;
    trendingScore: number;
    quoteType: string;
}
