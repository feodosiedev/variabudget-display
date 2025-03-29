
export const formatCurrency = (amount: number, includeSymbol = true): string => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: includeSymbol ? 'currency' : 'decimal',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  
  return formatter.format(amount);
};
