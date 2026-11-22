// Коло і круг (2 клас, Скворцова с. 81–82): діаметр — два радіуси (d = r + r), радіус за діаметром (яке число,
// додане саме до себе, дає діаметр), поняття коло, круг, центр, радіус, діаметр; які точки належать колу і кругу;
// задачі з кількома колами — лише додаванням, без множення.
import { mnozh, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

function radiusDiametr(r: Vypadok, max: number): TrenZavdannia {
  const rad = r.chyslo(2, max);
  return r.shans()
    ? {
        pytannia: `Радіус кола ${rad} см. Знайди його діаметр.`,
        vidpovid: 2 * rad,
        odynytsi: 'см',
        pidkazka: 'Діаметр — це два радіуси.',
        rozviazok: `${rad} + ${rad} = ${2 * rad} (см)`,
      }
    : {
        pytannia: `Діаметр кола ${2 * rad} см. Знайди його радіус.`,
        vidpovid: rad,
        odynytsi: 'см',
        pidkazka: `Діаметр — два однакові радіуси. Яке число, додане саме до себе, дає ${2 * rad}?`,
        rozviazok: `${rad} + ${rad} = ${2 * rad}, тому радіус ${rad} см.`,
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

const DE = [
  { opys: 'лежить на колі', kolu: true, kruhu: true },
  { opys: 'лежить усередині круга, але не на колі', kolu: false, kruhu: true },
  { opys: 'лежить поза кругом', kolu: false, kruhu: false },
];

// Чи належить точка колу / кругу.
function nalezhnist(r: Vypadok): TrenZavdannia {
  const t = r.vybir(DE);
  const bukva = r.vybir(['A', 'B', 'C', 'K', 'M', 'N', 'P', 'T']);
  const shcho = r.shans() ? 'колу' : 'кругу';
  const tak = shcho === 'колу' ? t.kolu : t.kruhu;
  return {
    pytannia: `Точка ${bukva} ${t.opys}. Чи належить вона ${shcho}?`,
    vidpovid: tak ? 'Так' : 'Ні',
    varianty: ['Так', 'Ні'],
    pidkazka: 'Колу належать лише точки на лінії. Кругу — точки на лінії і всередині.',
    rozviazok: tak
      ? `Так: ${shcho === 'колу' ? 'точка на лінії кола' : 'кругу належать точки на колі й усередині'}.`
      : `Ні: ${t.kruhu ? 'усередині — це круг, а коло — лише лінія' : 'точка поза кругом не належить ні колу, ні кругу'}.`,
  };
}

function kilkaKil(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(0, 2);
  if (typ === 0) {
    const rad = r.chyslo(2, 9);
    const n = r.chyslo(2, 4);
    const d = 2 * rad;
    return {
      pytannia: `${n} однакові кола радіусом ${rad} см поклали в ряд, щоб вони торкалися. Яка довжина цього ряду?`,
      vidpovid: d * n,
      odynytsi: 'см',
      pidkazka: `Спершу знайди діаметр. Довжина ряду — ${n} ${mnozh(n, 'діаметр', 'діаметри', 'діаметрів')}.`,
      rozviazok: `${rad} + ${rad} = ${d} (см) — діаметр; ${Array(n).fill(d).join(' + ')} = ${d * n} (см).`,
    };
  }
  if (typ === 1) {
    const a = r.chyslo(4, 15);
    return {
      pytannia: `Найбільший круг вирізали з квадрата зі стороною ${2 * a} см. Який радіус круга?`,
      vidpovid: a,
      odynytsi: 'см',
      pidkazka: 'Діаметр такого круга дорівнює стороні квадрата.',
      rozviazok: `Діаметр ${2 * a} см, ${a} + ${a} = ${2 * a}, тому радіус ${a} см.`,
    };
  }
  const rad = r.chyslo(3, 12);
  return {
    pytannia: `Ніжки циркуля розставили на ${rad} см і накреслили коло. Який діаметр цього кола?`,
    vidpovid: 2 * rad,
    odynytsi: 'см',
    pidkazka: 'Ніжки циркуля — це радіус. Діаметр — два радіуси.',
    rozviazok: `${rad} + ${rad} = ${2 * rad} (см)`,
  };
}

export default {
  rivni: ['радіус і діаметр', 'коло, круг, центр і точки', 'задачі з кількома колами'],
  zavdannia(r, riven) {
    if (riven === 1) return radiusDiametr(r, 12);
    if (riven === 2) return r.vybir([poniattia, nalezhnist, (x: Vypadok) => radiusDiametr(x, 25)])(r);
    return r.vybir([kilkaKil, kilkaKil, (x: Vypadok) => radiusDiametr(x, 45), nalezhnist])(r);
  },
} satisfies Henerator;
