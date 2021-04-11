export const threeDecimals = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 3,
  minimumFractionDigits: 3
});

export const wpm = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
  maximumSignificantDigits: 3,
  minimumSignificantDigits: 3,
});

export const integer = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
});

export function sixDigits(num: number) {
  const zeros = Math.log10(num);
  if (zeros <= 6) return integer.format(num);
  const exp = Math.floor(zeros / 3) * 3
  const base = num / 10 ** exp;
  return threeDecimals.format(base) + 'e' + exp
}