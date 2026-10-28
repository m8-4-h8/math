// Одиниці довжини, площі, маси і часу від найменшої до найбільшої.
// `dali` — у скільки разів наступна (більша) одиниця більша за цю.
export interface Odynytsia {
  nazva: string;
  povna: string;
  dali?: number;
}

export const dovzhyna: Odynytsia[] = [
  { nazva: 'мм', povna: 'міліметр', dali: 10 },
  { nazva: 'см', povna: 'сантиметр', dali: 10 },
  { nazva: 'дм', povna: 'дециметр', dali: 10 },
  { nazva: 'м', povna: 'метр', dali: 1000 },
  { nazva: 'км', povna: 'кілометр' },
];

export const ploshcha: Odynytsia[] = [
  { nazva: 'мм²', povna: 'квадратний міліметр', dali: 100 },
  { nazva: 'см²', povna: 'квадратний сантиметр', dali: 100 },
  { nazva: 'дм²', povna: 'квадратний дециметр', dali: 100 },
  { nazva: 'м²', povna: 'квадратний метр', dali: 100 },
  { nazva: 'а', povna: 'ар («сотка»)', dali: 100 },
  { nazva: 'га', povna: 'гектар', dali: 100 },
  { nazva: 'км²', povna: 'квадратний кілометр' },
];

export const masa: Odynytsia[] = [
  { nazva: 'г', povna: 'грам', dali: 1000 },
  { nazva: 'кг', povna: 'кілограм', dali: 100 },
  { nazva: 'ц', povna: 'центнер', dali: 10 },
  { nazva: 'т', povna: 'тонна' },
];

export const chas: Odynytsia[] = [
  { nazva: 'с', povna: 'секунда', dali: 60 },
  { nazva: 'хв', povna: 'хвилина', dali: 60 },
  { nazva: 'год', povna: 'година', dali: 24 },
  { nazva: 'доба', povna: 'доба' },
];

/** Число з пробілами між класами, як у підручнику: 10 000. */
export const chyslo = (x: number) => x.toLocaleString('uk-UA', { maximumFractionDigits: 6 });
