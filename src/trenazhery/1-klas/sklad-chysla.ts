// Склад числа: з яких двох частин складається число, віконця, пари до десяти.
import type { Henerator, Vypadok, TrenZavdannia } from '../dopomoha.ts';

function vikontse(r: Vypadok, vid: number, do_: number): TrenZavdannia {
  const tsile = r.chyslo(vid, do_);
  const a = r.chyslo(0, tsile);
  const b = tsile - a;
  return r.vybir<() => TrenZavdannia>([
    () => ({
      pytannia: 'Яке число сховалось у віконці?',
      vyraz: `${tsile} = ${a} + □`,
      vidpovid: b,
      pidkazka: `${tsile} — ціле, ${a} — частина. Від ${a} рахуй далі до ${tsile}: скільки кроків?`,
      rozviazok: `${a} + ${b} = ${tsile}`,
    }),
    () => ({
      pytannia: 'Яке число сховалось у віконці?',
      vyraz: `□ + ${b} = ${tsile}`,
      vidpovid: a,
      pidkazka: `Яке число разом з ${b} дає ${tsile}?`,
      rozviazok: `${a} + ${b} = ${tsile}`,
    }),
    () => ({
      pytannia: `Число ${tsile} — це ${a} і ще скільки?`,
      vidpovid: b,
      pidkazka: `${tsile} = ${a} + ?`,
      rozviazok: `${tsile} = ${a} + ${b}`,
    }),
  ])();
}

function paraDoDesiaty(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(1, 9);
  return {
    pytannia: 'Пара до десяти: яке число разом з цим дає 10?',
    vyraz: `${a} + □ = 10`,
    vidpovid: 10 - a,
    pidkazka: 'Згадай десяткову рамку: скільки клітинок лишилось порожніми?',
    rozviazok: `${a} + ${10 - a} = 10`,
  };
}

function chyVirno(r: Vypadok): TrenZavdannia {
  const tsile = r.chyslo(3, 10);
  const a = r.chyslo(1, tsile - 1);
  const virno = r.shans();
  const b = virno ? tsile - a : r.vybir([tsile - a + 1, tsile - a - 1].filter((x) => x >= 0));
  return {
    pytannia: 'Чи правильний склад числа?',
    vyraz: `${tsile} = ${a} + ${b}`,
    vidpovid: virno ? 'Так' : 'Ні',
    varianty: ['Так', 'Ні'],
    pidkazka: 'Склади частини назад і порівняй з числом.',
    rozviazok: virno ? `${a} + ${b} = ${tsile} — правильно.` : `${a} + ${b} = ${a + b}, а не ${tsile}. Правильно: ${tsile} = ${a} + ${tsile - a}.`,
  };
}

export default {
  rivni: ['числа до 5', 'числа до 10', 'пари до десяти й перевірка'],
  zavdannia(r, riven) {
    if (riven === 1) return vikontse(r, 2, 5);
    if (riven === 2) return vikontse(r, 3, 10);
    return r.vybir([() => vikontse(r, 5, 10), () => paraDoDesiaty(r), () => chyVirno(r)])();
  },
} satisfies Henerator;
