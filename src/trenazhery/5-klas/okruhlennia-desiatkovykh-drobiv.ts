// Округлення десяткових дробів до цілих, десятих, сотих: те саме правило — перша відкинута цифра 0–4 чи 5–9.
// Пастки: 3,96 до десятих — 4,0 (нуль пишемо, бо округлили до десятих), 2,5 до цілих — 3.
import { des, desZNuliamy, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const DO = [
  { z: 0, nazva: 'цілих' },
  { z: 1, nazva: 'десятих' },
  { z: 2, nazva: 'сотих' },
];

function okruhlennia(r: Vypadok, rivni: typeof DO, zZnakamy: number): TrenZavdannia {
  const d = r.vybir(rivni.filter((x) => x.z < zZnakamy));
  const z = zZnakamy;
  const k = 10 ** (z - d.z); // скільки «останніх» одиниць відкидаємо
  const p = k / 10;
  const typ = r.chyslo(0, 3);
  let c: number;
  if (typ === 0) c = r.chyslo(1, 99) * k + r.vybir([4, 5]) * p + r.chyslo(0, p - 1);
  else if (typ === 1) c = (r.chyslo(1, 9) * 10 + 9) * k + r.chyslo(5, 9) * p + r.chyslo(0, p - 1); // перенос: 3,96 → 4,0
  else c = r.chyslo(1, 99) * k + r.chyslo(1, k - 1);
  if (c % 10 === 0) c += 1;
  const rez = Math.round(c / k);
  const vidkynuta = Math.floor((c % k) / p);
  const zapys = desZNuliamy(rez, d.z);
  return {
    pytannia: `Округли ${des(c, z)} до ${d.nazva}.`,
    vidpovid: zapys,
    pidkazka: 'Знайди розряд, до якого округлюєш, і подивись на першу цифру праворуч від нього.',
    rozviazok: `Перша відкинута цифра ${vidkynuta} — ${vidkynuta >= 5 ? 'збільшуємо на 1' : 'залишаємо як є'}: ${des(c, z)} ≈ ${zapys}${zapys !== des(rez, d.z) ? ` (нуль у кінці пишемо — округлили до ${d.nazva})` : ''}.`,
  };
}

function zhyttia(r: Vypadok): TrenZavdannia {
  const s = r.vybir([
    { tekst: (x: string) => `Ціна сиру — ${x} грн за кілограм. Округли до гривень.`, z: 2, doZ: 0, min: 15000, max: 45000 },
    { tekst: (x: string) => `Хлопчик пробіг 100 м за ${x} с. Округли до десятих.`, z: 2, doZ: 1, min: 1250, max: 1990 },
    { tekst: (x: string) => `Довжина кімнати ${x} м. Округли до десятих.`, z: 2, doZ: 1, min: 310, max: 690 },
  ]);
  let c = r.chyslo(s.min, s.max);
  if (c % 10 === 0) c += 1;
  const k = 10 ** (s.z - s.doZ);
  const rez = Math.round(c / k);
  return {
    pytannia: s.tekst(des(c, s.z)),
    vidpovid: desZNuliamy(rez, s.doZ),
    pidkazka: 'Подивись на першу цифру, яку відкидаємо.',
    rozviazok: `${des(c, s.z)} ≈ ${desZNuliamy(rez, s.doZ)}`,
  };
}

export default {
  rivni: ['до цілих', 'до десятих і сотих', 'перенос через 9 і задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return okruhlennia(r, DO.slice(0, 1), r.chyslo(1, 2));
    if (riven === 2) return okruhlennia(r, DO, r.chyslo(2, 3));
    return r.vybir([() => zhyttia(r), () => okruhlennia(r, DO, 3), () => okruhlennia(r, DO, 2)])();
  },
} satisfies Henerator;
