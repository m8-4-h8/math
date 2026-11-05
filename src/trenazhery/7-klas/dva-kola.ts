// Взаємне розміщення двох кіл: як розміщені кола (за R, r і d, пастка з діаметрами), скільки спільних точок,
// відстань між центрами при дотику зовні й зсередини, радіус за відстанню, три кола, що попарно дотикаються,
// цілі значення d, при яких кола перетинаються.
import type { Henerator, Vypadok, TrenZavdannia } from '../dopomoha.ts';
import { dvaKola } from '../kolo.ts';

const VYDY = ['одне поза одним', 'дотикаються зовні', 'перетинаються', 'дотикаються зсередини', 'одне всередині іншого'];
const TOCHOK = [0, 1, 2, 1, 0];

/** Радіуси R > r і відстань d для потрібного випадку. */
function vypadok(r: Vypadok, typ: number) {
  const rr = r.chyslo(1, 9);
  const R = r.chyslo(rr + 2, rr + 10);
  const d =
    typ === 0 ? R + rr + r.chyslo(1, 8)
    : typ === 1 ? R + rr
    : typ === 2 ? r.chyslo(R - rr + 1, R + rr - 1)
    : typ === 3 ? R - rr
    : r.chyslo(0, R - rr - 1);
  return { R, rr, d };
}

const poyasnennia = (typ: number, R: number, rr: number, d: number) => {
  const s = `R + r = ${R} + ${rr} = ${R + rr}`;
  const z = `R − r = ${R} − ${rr} = ${R - rr}`;
  return [
    `${s}, а d = ${d} — більше за суму: кола лежать одне поза одним.`,
    `${s} — це і є d: кола дотикаються зовні.`,
    `${z}, ${s}, і d = ${d} лежить між ними: кола перетинаються у двох точках.`,
    `${z} — це і є d: кола дотикаються зсередини.`,
    `${z}, а d = ${d} — менше за різницю: менше коло лежить усередині більшого.`,
  ][typ];
};

function yakRozmishcheni(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(0, 4);
  const { R, rr, d } = vypadok(r, typ);
  const zDiametramy = r.shans(0.25);
  const zMalunkom = r.shans(0.3);
  return {
    pytannia: zDiametramy
      ? `Діаметри кіл — ${2 * R} см і ${2 * rr} см, відстань між центрами — ${d} см. Як розміщені кола?`
      : `Радіуси кіл — ${R} см і ${rr} см, відстань між центрами — ${d} см. Як розміщені кола?`,
    malunok: zMalunkom && !zDiametramy ? dvaKola(R, rr, d, `R = ${R}, r = ${rr}, d = ${d}`) : undefined,
    vidpovid: VYDY[typ],
    varianty: VYDY,
    pidkazka: zDiametramy ? 'Спершу знайди радіуси. Потім порівняй d із сумою і різницею радіусів.' : 'Порівняй d із сумою R + r і різницею R − r.',
    rozviazok: `${zDiametramy ? `Радіуси: ${2 * R} : 2 = ${R} см і ${2 * rr} : 2 = ${rr} см. ` : ''}${poyasnennia(typ, R, rr, d)}`,
  };
}

function skilkyTochok(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(0, 4);
  const { R, rr, d } = vypadok(r, typ);
  return {
    pytannia: `Радіуси кіл — ${R} см і ${rr} см, відстань між центрами — ${d} см. Скільки спільних точок мають кола?`,
    vidpovid: TOCHOK[typ],
    pidkazka: 'Порівняй d із сумою R + r і різницею R − r.',
    rozviazok: `${poyasnennia(typ, R, rr, d)} Спільних точок: ${TOCHOK[typ]}.`,
  };
}

function dotykZovni(r: Vypadok): TrenZavdannia {
  const rr = r.chyslo(1, 15);
  const R = r.chyslo(1, 20);
  const d = R + rr;
  if (r.shans()) {
    return {
      pytannia: `Кола з радіусами ${R} см і ${rr} см дотикаються зовні. Знайди відстань між їхніми центрами.`,
      vidpovid: d,
      odynytsi: 'см',
      pidkazka: 'При дотику зовні точка дотику лежить між центрами.',
      rozviazok: `При дотику зовні d = R + r: ${R} + ${rr} = ${d} см.`,
    };
  }
  return {
    pytannia: `Два кола дотикаються зовні, відстань між центрами — ${d} см, радіус одного кола — ${R} см. Знайди радіус другого.`,
    vidpovid: rr,
    odynytsi: 'см',
    pidkazka: 'При дотику зовні d = R + r.',
    rozviazok: `d = R + r, тож другий радіус дорівнює ${d} − ${R} = ${rr} см.`,
  };
}

function dotykZseredyny(r: Vypadok): TrenZavdannia {
  const rr = r.chyslo(1, 15);
  const R = r.chyslo(rr + 1, rr + 15);
  const d = R - rr;
  const typ = r.chyslo(0, 2);
  const umova = 'Кола дотикаються зсередини';
  if (typ === 0) {
    return {
      pytannia: `${umova}, їхні радіуси — ${R} см і ${rr} см. Знайди відстань між центрами.`,
      vidpovid: d,
      odynytsi: 'см',
      pidkazka: 'При дотику зсередини d = R − r.',
      rozviazok: `d = R − r: ${R} − ${rr} = ${d} см.`,
    };
  }
  if (typ === 1) {
    return {
      pytannia: `${umova}. Радіус більшого — ${R} см, відстань між центрами — ${d} см. Знайди радіус меншого кола.`,
      vidpovid: rr,
      odynytsi: 'см',
      pidkazka: 'При дотику зсередини d = R − r.',
      rozviazok: `d = R − r, тож менший радіус дорівнює ${R} − ${d} = ${rr} см.`,
    };
  }
  return {
    pytannia: `${umova}. Радіус меншого — ${rr} см, відстань між центрами — ${d} см. Знайди радіус більшого кола.`,
    vidpovid: R,
    odynytsi: 'см',
    pidkazka: 'При дотику зсередини d = R − r.',
    rozviazok: `d = R − r, тож більший радіус дорівнює ${d} + ${rr} = ${R} см.`,
  };
}

function tryKola(r: Vypadok): TrenZavdannia {
  const [a, b, c] = [r.chyslo(1, 12), r.chyslo(1, 12), r.chyslo(1, 12)];
  if (r.shans()) {
    return {
      pytannia: `Три кола з радіусами ${a} см, ${b} см і ${c} см попарно дотикаються зовні. Знайди периметр трикутника з вершинами в їхніх центрах.`,
      vidpovid: 2 * (a + b + c),
      odynytsi: 'см',
      pidkazka: 'Кожна сторона трикутника — сума двох радіусів.',
      rozviazok: `Сторони: ${a} + ${b} = ${a + b}, ${b} + ${c} = ${b + c}, ${a} + ${c} = ${a + c} см. Периметр: ${a + b} + ${b + c} + ${a + c} = ${2 * (a + b + c)} см.`,
    };
  }
  return {
    pytannia: `Три кола з центрами O₁, O₂, O₃ попарно дотикаються зовні. O₁O₂ = ${a + b} см, O₂O₃ = ${b + c} см, O₁O₃ = ${a + c} см. Знайди радіус кола з центром O₁.`,
    vidpovid: a,
    odynytsi: 'см',
    pidkazka: 'Кожна відстань — сума двох радіусів. Склади всі три відстані.',
    rozviazok:
      `Сума трьох відстаней — це два рази сума радіусів: ${a + b} + ${b + c} + ${a + c} = ${2 * (a + b + c)}, тож усі радіуси разом — ${2 * (a + b + c)} : 2 = ${a + b + c} см. ` +
      `Радіус з центром O₁ дорівнює ${a + b + c} − ${b + c} = ${a} см.`,
  };
}

function tsiliD(r: Vypadok): TrenZavdannia {
  const rr = r.chyslo(1, 9);
  const R = r.chyslo(rr + 1, rr + 12);
  const typ = r.chyslo(0, 2);
  const mezhi = `Кола перетинаються, коли ${R} − ${rr} < d < ${R} + ${rr}, тобто ${R - rr} < d < ${R + rr}.`;
  return {
    pytannia:
      typ === 0
        ? `Радіуси кіл — ${R} см і ${rr} см. Яка найбільша ціла відстань між центрами (у см), при якій кола перетинаються?`
        : typ === 1
          ? `Радіуси кіл — ${R} см і ${rr} см. Яка найменша ціла відстань між центрами (у см), при якій кола перетинаються?`
          : `Радіуси кіл — ${R} см і ${rr} см. Скільки є цілих значень відстані між центрами (у см), при яких кола перетинаються?`,
    vidpovid: typ === 0 ? R + rr - 1 : typ === 1 ? R - rr + 1 : 2 * rr - 1,
    pidkazka: 'Кола перетинаються, коли R − r < d < R + r.',
    rozviazok:
      typ === 0
        ? `${mezhi} Найбільше ціле — ${R + rr - 1}.`
        : typ === 1
          ? `${mezhi} Найменше ціле — ${R - rr + 1}.`
          : `${mezhi} Цілі значення від ${R - rr + 1} до ${R + rr - 1}: їх ${R + rr - 1} − ${R - rr} = ${2 * rr - 1}.`,
  };
}

export default {
  rivni: ['як розміщені кола', 'дотик зовні й зсередини', 'задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([yakRozmishcheni, yakRozmishcheni, skilkyTochok])(r);
    if (riven === 2) return r.vybir([dotykZovni, dotykZseredyny, yakRozmishcheni])(r);
    return r.vybir([tryKola, tsiliD, tsiliD, dotykZseredyny, skilkyTochok])(r);
  },
} satisfies Henerator;
