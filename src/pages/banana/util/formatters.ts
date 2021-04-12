const threeDecimals = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 3,
  minimumFractionDigits: 3
});

const threeIfNecessary = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 3
})

const wpmf = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
  maximumSignificantDigits: 3,
  minimumSignificantDigits: 3,
});

const integer = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
});

export function totalBananas(num: number) {
  const [base, exp] = sci(num);
  if (exp < 6) return threeDecimals.format(num);
  return threeDecimals.format(base) + 'e' + exp;
}

export function bps(num: number) {
  const [base, exp] = sci(num);
  if (exp < 6) return threeIfNecessary.format(num);
  return threeIfNecessary.format(base) + 'e' + exp;
}

export function price(num: number) {
  const [base, exp] = sci(num);
  if (exp < 6) return integer.format(num);
  return threeIfNecessary.format(base) + 'e' + exp;
}

export function wpm(num: number) {
  return wpmf.format(num);
}

function sci(num: number): [number, number] {
  const exp = Math.floor(Math.log10(num));
  return [num / 10 ** exp, exp];
}