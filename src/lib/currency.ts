// Currency conversion utilities
// In production, you should get live rates from an API like:
// - https://api.exchangerate-api.com/
// - https://openexchangerates.org/
// - https://currencyapi.com/

export const EXCHANGE_RATES = {
  ZAR_TO_USD: 0.055, // Update this regularly or fetch from API
  USD_TO_ZAR: 18.18,
} as const;

export const convertZarToUsd = (zarAmount: number): number => {
  return zarAmount * EXCHANGE_RATES.ZAR_TO_USD;
};

export const convertUsdToZar = (usdAmount: number): number => {
  return usdAmount * EXCHANGE_RATES.USD_TO_ZAR;
};

export const formatCurrency = (amount: number, currency: 'ZAR' | 'USD'): string => {
  if (currency === 'ZAR') {
    return `R${amount.toFixed(2)}`;
  }
  return `$${amount.toFixed(2)}`;
};

// Function to get live exchange rates (implement in production)
export const getLiveExchangeRate = async (): Promise<number> => {
  // Example implementation - replace with your preferred API
  try {
    // const response = await fetch('https://api.exchangerate-api.com/v4/latest/ZAR');
    // const data = await response.json();
    // return data.rates.USD;
    
    // For now, return the static rate
    return EXCHANGE_RATES.ZAR_TO_USD;
  } catch (error) {
    console.error('Failed to fetch live exchange rate:', error);
    return EXCHANGE_RATES.ZAR_TO_USD; // Fallback to static rate
  }
};