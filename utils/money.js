/** Whole roubles for display: 45000 → "45 000 ₽". */
export const roubles = (amount) => `${amount.toLocaleString('ru-RU')} ₽`;
