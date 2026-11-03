// Коло і круг: радіус і діаметр, центр, хорда; задачі з кількома колами.
import { mnozh, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

function radiusDiametr(r: Vypadok, max: number): TrenZavdannia {
  const rad = r.chyslo(2, max);
  return r.shans()
    ? {
        pytannia: `Радіус кола ${rad} см. Знайди його діаметр.`,
        vidpovid: 2 * rad,
        odynytsi: 'см',
        pidkazka: 'Діаметр — це два радіуси.',
        rozviazok: `${rad} · 2 = ${2 * rad} (см)`,
      }
    : {
        pytannia: `Діаметр кола ${2 * rad} см. Знайди його радіус.`,
        vidpovid: rad,
        odynytsi: 'см',
        pidkazka: 'Радіус — половина діаметра.',
        rozviazok: `${2 * rad} : 2 = ${rad} (см)`,
      };
}

const PONIATTIA = [
  { opys: 'Відрізок, що з’єднує центр кола з точкою на колі', vidpovid: 'радіус' },
  { opys: 'Відрізок, що проходить через центр і з’єднує дві точки кола', vidpovid: 'діаметр' },
  { opys: 'Точка, від якої всі точки кола на однаковій відстані', vidpovid: 'центр' },
  { opys: 'Лінія, усі точки якої однаково віддалені від центра', vidpovid: 'коло' },
  { opys: 'Частина площини, обмежена колом, разом із самим колом', vidpovid: 'круг' },
];

function poniattia(r: Vypadok): TrenZavdannia {
  const p = r.vybir(PONIATTIA);
  const varianty = p.vidpovid === 'коло' || p.vidpovid === 'круг' ? ['коло', 'круг', 'центр'] : ['радіус', 'діаметр', 'центр'];
  return {
    pytannia: `${p.opys} — це…`,
    vidpovid: p.vidpovid,
    varianty: r.peremishaty(varianty),
    pidkazka: 'Коло — лінія, круг — уся «тарілка». Радіус іде від центра, діаметр — через центр.',
    rozviazok: `${p.opys} — ${p.vidpovid}.`,
  };
}

function kilkaKil(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(0, 2);
  if (typ === 0) {
    const rad = r.chyslo(2, 9);
    const n = r.chyslo(2, 5);
    return {
      pytannia: `${n < 5 ? `${n} однакові кола` : `${n} однакових кіл`} радіусом ${rad} см поклали в ряд, щоб вони торкалися. Яка довжина цього ряду?`,
      vidpovid: 2 * rad * n,
      odynytsi: 'см',
      pidkazka: `Довжина ряду — ${n} ${mnozh(n, 'діаметр', 'діаметри', 'діаметрів')}.`,
      rozviazok: `${rad} · 2 = ${2 * rad} (см) — діаметр; ${2 * rad} · ${n} = ${2 * rad * n} (см).`,
    };
  }
  if (typ === 1) {
    const a = r.chyslo(4, 15);
    return {
      pytannia: `Найбільший круг вирізали з квадрата зі стороною ${2 * a} см. Який радіус круга?`,
      vidpovid: a,
      odynytsi: 'см',
      pidkazka: 'Діаметр такого круга дорівнює стороні квадрата.',
      rozviazok: `Діаметр ${2 * a} см, радіус ${2 * a} : 2 = ${a} (см).`,
    };
  }
  const rad = r.chyslo(2, 12);
  return {
    pytannia: 'Скільки радіусів можна провести в колі?',
    vidpovid: 'скільки завгодно',
    varianty: r.peremishaty(['один', 'два', 'скільки завгодно']),
    pidkazka: `З центра до будь-якої точки кола — теж радіус, наприклад, ${rad} см.`,
    rozviazok: 'Скільки завгодно: точок на колі безліч, і до кожної йде радіус.',
  };
}

export default {
  rivni: ['радіус і діаметр', 'поняття: коло, круг, центр', 'задачі з кількома колами'],
  zavdannia(r, riven) {
    if (riven === 1) return radiusDiametr(r, 12);
    if (riven === 2) return r.shans() ? poniattia(r) : radiusDiametr(r, 50);
    return r.vybir([kilkaKil, kilkaKil, () => radiusDiametr(r, 99), poniattia])(r);
  },
} satisfies Henerator;
