export const formatPrice = (price) => {
  if (!price || typeof price !== 'number' || isNaN(price)) {
    return '0.00';
  }
  
  // Для цен меньше 1 доллара используем 4 знака после запятой
  const decimals = price < 1 ? 4 : 2;
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(price);
};

export const formatChange = (change) => {
  if (!change || typeof change !== 'number' || isNaN(change)) {
    return '0.00';
  }
  return change.toFixed(2);
};
