// Масштаб: 1 : n — усе зменшено в n разів; 1 см на карті — n см на місцевості (відкидаємо 2 нулі — метри,
// 5 нулів — кілометри); на місцевості = на карті · n, на карті = на місцевості : n; масштаб за двома
// відстанями; площа кімнати за планом.
import { ch, des, tch, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

/** Карти: скільки кілометрів в 1 см. */
const KARTY = [
  { n: 100_000, km: 1 },
  { n: 200_000, km: 2 },
  { n: 300_000, km: 3 },
  { n: 500_000, km: 5 },
  { n: 1_000_000, km: 10 },
  { n: 2_000_000, km: 20 },
];

/** Плани: скільки сантиметрів в 1 см. */
const PLANY = [
  { n: 50, sm: 50 },
  { n: 100, sm: 100 },
  { n: 200, sm: 200 },
  { n: 500, sm: 500 },
  { n: 1000, sm: 1000 },
];

const m = (n: number) => `$1 : ${tch(n)}$`;
const metry = (sm: number) => des(sm, 2); // сантиметри → метри десятковим дробом

function odyn(r: Vypadok): TrenZavdannia {
  if (r.shans()) {
    const k = r.vybir(KARTY);
    return {
      pytannia: `Масштаб карти ${m(k.n)}. Скільки кілометрів на місцевості відповідає 1 см на карті?`,
      vidpovid: k.km,
      odynytsi: 'км',
      pidkazka: '1 км = 100 000 см — відкинь п’ять нулів.',
      rozviazok: `1 см на карті — ${ch(k.n)} см на місцевості, тобто ${k.km} км.`,
    };
  }
  const p = r.vybir(PLANY);
  return {
    pytannia: `Масштаб плану ${m(p.n)}. Скільки метрів у дійсності відповідає 1 см на плані?`,
    vidpovid: metry(p.sm),
    odynytsi: 'м',
    pidkazka: '1 м = 100 см — відкинь два нулі.',
    rozviazok: `1 см на плані — ${ch(p.sm)} см у дійсності, тобто ${metry(p.sm)} м.`,
  };
}

function naMistsevosti(r: Vypadok): TrenZavdannia {
  if (r.shans(0.6)) {
    const k = r.vybir(KARTY);
    const a = r.chyslo(2, 12);
    return {
      pytannia: `Масштаб ${m(k.n)}. Відстань між містами на карті ${a} см. Яка справжня відстань у кілометрах?`,
      vidpovid: a * k.km,
      odynytsi: 'км',
      pidkazka: `Скільки кілометрів в 1 см? Помнож на ${a}.`,
      rozviazok: `1 см — ${k.km} км; ${a} · ${k.km} = ${a * k.km} (км).`,
    };
  }
  const p = r.vybir(PLANY.slice(0, 3));
  const a = r.chyslo(2, Math.floor(1000 / p.sm)); // кімнати до 10 м
  return {
    pytannia: `На плані квартири в масштабі ${m(p.n)} кімната має довжину ${a} см. Яка справжня довжина кімнати в метрах?`,
    vidpovid: metry(a * p.sm),
    odynytsi: 'м',
    pidkazka: 'Справжня кімната більша за малюнок — множимо.',
    rozviazok: `${a} · ${p.n} = ${ch(a * p.sm)} (см), тобто ${metry(a * p.sm)} м.`,
  };
}

function naKarti(r: Vypadok): TrenZavdannia {
  const k = r.vybir(KARTY);
  const a = r.chyslo(2, 12);
  return {
    pytannia: `Масштаб ${m(k.n)}. Відстань між селами ${a * k.km} км. Скільки сантиметрів буде між ними на карті?`,
    vidpovid: a,
    odynytsi: 'см',
    pidkazka: `1 см на карті — ${k.km} км. Скільки разів ${k.km} вміщується в ${a * k.km}?`,
    rozviazok: `1 см — ${k.km} км; ${a * k.km} : ${k.km} = ${a} (см). На карті відстань менша, ніж насправді ✓`,
  };
}

function znaityMasshtab(r: Vypadok): TrenZavdannia {
  const k = r.vybir(KARTY);
  const a = r.chyslo(2, 9);
  const tilkyChyslo = (v: string) => {
    const t = v.replace(/\s/g, '');
    return t === String(k.n) || t === `1:${k.n}`;
  };
  return {
    pytannia: `Відстань між містами ${a * k.km} км, а на карті — ${a} см. Який масштаб карти?`,
    vyraz: '1 : □',
    vidpovid: `1 : ${ch(k.n)}`,
    perevirka: tilkyChyslo,
    pidkazka: 'Спершу знайди, скільки кілометрів в 1 см, а потім переведи кілометри в сантиметри.',
    rozviazok: `${a * k.km} : ${a} = ${k.km} (км) в 1 см; ${k.km} км — це ${ch(k.n)} см, тож масштаб 1 : ${ch(k.n)}.`,
  };
}

function ploshcha(r: Vypadok): TrenZavdannia {
  const p = r.vybir([PLANY[1], PLANY[2]]);
  const k = p.sm / 100;
  const max = Math.floor(800 / p.sm); // кімнати до 8 м
  const [a, b] = [r.chyslo(2, max), r.chyslo(2, max)];
  return {
    pytannia: `На плані в масштабі ${m(p.n)} кімната — прямокутник ${a} см × ${b} см. Яка справжня площа кімнати?`,
    vidpovid: a * k * b * k,
    odynytsi: 'м²',
    pidkazka: 'Спершу знайди справжню довжину й ширину в метрах, а потім площу.',
    rozviazok: `Довжина: ${a} · ${k} = ${a * k} (м), ширина: ${b} · ${k} = ${b * k} (м); площа: ${a * k} · ${b * k} = ${a * k * b * k} (м²).`,
  };
}

export default {
  rivni: ['що означає масштаб', 'з карти на місцевість і назад', 'знайди масштаб і площу'],
  zavdannia(r, riven) {
    if (riven === 1) return r.shans(0.4) ? odyn(r) : naMistsevosti(r);
    if (riven === 2) return r.vybir([naMistsevosti, naKarti, naKarti])(r);
    return r.vybir([znaityMasshtab, znaityMasshtab, ploshcha, naKarti])(r);
  },
} satisfies Henerator;
