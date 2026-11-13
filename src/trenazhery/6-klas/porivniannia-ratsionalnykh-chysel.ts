// Порівняння раціональних чисел (Істер § 30): від'ємне < 0 < додатне; з двох від'ємних більше те, у якого
// модуль менший (цілі, десяткові, звичайні дроби); упорядкування; найбільше ціле, менше за число;
// скільки цілих задовольняють подвійну нерівність.
import { ch, des, neskorotnyiChyselnyk, nsk, tdrib, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const tz = (n: number) => (n < 0 ? `-${-n}` : `${n}`);
const td = (n: number) => (n < 0 ? `-${des(-n, 1)}` : des(n, 1)).replace(',', '{,}');
const tx = (n: number) => (n < 0 ? `−${des(-n, 1)}` : des(n, 1));
const ZNAKY = ['>', '<', '='];

function zNulem(r: Vypadok): TrenZavdannia {
  for (;;) {
    const desiatkovi = r.shans(0.4);
    const max = desiatkovi ? 99 : 30;
    let a = -r.chyslo(1, max);
    let b = r.shans(0.25) ? 0 : r.chyslo(1, max);
    if (r.shans()) [a, b] = [b, a];
    if (a === b) continue;
    const z = (n: number) => (desiatkovi ? td(n) : tz(n));
    const t = (n: number) => (desiatkovi ? tx(n) : ch(n));
    const znak = a > b ? '>' : '<';
    return {
      pytannia: 'Порівняй.',
      vyraz: `$${z(a)}$ □ $${z(b)}$`,
      vidpovid: znak,
      varianty: ZNAKY,
      pidkazka: 'Будь-яке від’ємне число менше за нуль і за будь-яке додатне.',
      rozviazok: `${t(a)} ${znak} ${t(b)}: ${a === 0 || b === 0 ? 'від’ємне менше за нуль, а нуль менший за додатне' : 'від’ємне менше за додатне'}.`,
    };
  }
}

function dvaVidiemni(r: Vypadok, desiatkovi: boolean): TrenZavdannia {
  for (;;) {
    const max = desiatkovi ? 99 : 40;
    const [a, b] = [-r.chyslo(1, max), -r.chyslo(1, max)];
    if (a === b && r.shans(0.8)) continue;
    const z = (n: number) => (desiatkovi ? td(n) : tz(n));
    const t = (n: number) => (desiatkovi ? tx(n) : ch(n));
    const m = (n: number) => (desiatkovi ? des(-n, 1) : String(-n));
    const znak = a > b ? '>' : a < b ? '<' : '=';
    return {
      pytannia: 'Порівняй.',
      vyraz: `$${z(a)}$ □ $${z(b)}$`,
      vidpovid: znak,
      varianty: ZNAKY,
      pidkazka: 'З двох від’ємних більше те, що ближче до нуля, — з меншим модулем.',
      rozviazok:
        znak === '='
          ? `Числа однакові: ${t(a)} = ${t(b)}.`
          : `|${t(a)}| = ${m(a)}, |${t(b)}| = ${m(b)}; модуль ${-a < -b ? `${t(a)} менший` : `${t(b)} менший`}, тож ${t(a)} ${znak} ${t(b)}.`,
    };
  }
}

function droby(r: Vypadok): TrenZavdannia {
  for (;;) {
    const [q1, q2] = [r.chyslo(2, 9), r.chyslo(2, 9)];
    const [p1, p2] = [neskorotnyiChyselnyk(r, q1), neskorotnyiChyselnyk(r, q2)];
    if (p1 * q2 === p2 * q1) continue;
    const n = nsk(q1, q2);
    if (n > 40) continue;
    const [m1, m2] = [(p1 * n) / q1, (p2 * n) / q2];
    const znak = m1 < m2 ? '>' : '<'; // для від'ємних
    return {
      pytannia: 'Порівняй.',
      vyraz: `$-${tdrib(p1, q1)}$ □ $-${tdrib(p2, q2)}$`,
      vidpovid: znak,
      varianty: ZNAKY,
      pidkazka: `Порівняй модулі: зведи ${p1}/${q1} і ${p2}/${q2} до знаменника ${n}.`,
      rozviazok: `${p1}/${q1} = ${m1}/${n}, ${p2}/${q2} = ${m2}/${n}; модуль −${m1 < m2 ? `${p1}/${q1}` : `${p2}/${q2}`} менший, тож −${p1}/${q1} ${znak} −${p2}/${q2}.`,
    };
  }
}

function vporiadkuvaty(r: Vypadok): TrenZavdannia {
  for (;;) {
    const chysla = r.rizni(5, -15, 15);
    if (chysla.filter((n) => n < 0).length < 2) continue;
    const spadannia = r.shans(0.35);
    const poriadok = [...chysla].sort((x, y) => (spadannia ? y - x : x - y));
    return {
      pytannia: `Запиши числа ${chysla.map((n) => `$${tz(n)}$`).join(', ')} у порядку ${spadannia ? 'спадання' : 'зростання'} (через кому).`,
      vidpovid: poriadok.map(ch).join(', '),
      pidkazka: spadannia ? 'Спершу додатні від найбільшого, потім нуль, потім від’ємні — від найближчого до нуля.' : 'Спершу від’ємні: з них менше те, що далі від нуля.',
      rozviazok: poriadok.map(ch).join(spadannia ? ' > ' : ' < '),
    };
  }
}

/** Найбільше ціле, менше за дане, чи найменше ціле, більше за дане. */
function tsileBilia(r: Vypadok): TrenZavdannia {
  const n = r.chyslo(1, 99);
  if (n % 10 === 0) return tsileBilia(r);
  const v = -n; // у десятих, від'ємне
  const menshe = r.shans();
  const vidp = menshe ? Math.floor(v / 10) : Math.ceil(v / 10);
  return {
    pytannia: menshe ? `Яке найбільше ціле число менше за $${td(v)}$?` : `Яке найменше ціле число більше за $${td(v)}$?`,
    vidpovid: ch(vidp === 0 ? 0 : vidp),
    pidkazka: menshe ? `Шукай найближче ціле ліворуч від ${tx(v)}.` : `Шукай найближче ціле праворуч від ${tx(v)}.`,
    rozviazok: `${tx(v)} лежить між ${ch(Math.floor(v / 10))} і ${ch(Math.ceil(v / 10) || 0)}; ${menshe ? 'ліворуч' : 'праворуч'} — ${ch(vidp || 0)}.`,
  };
}

function skilkyTsilykh(r: Vypadok): TrenZavdannia {
  const a = -r.chyslo(1, 10);
  const b = r.chyslo(-3, 10);
  if (b - a < 2) return skilkyTsilykh(r);
  const strohi = r.shans();
  const vidp = strohi ? b - a - 1 : b - a + 1;
  return {
    pytannia: `Скільки цілих чисел $x$ задовольняють нерівність $${tz(a)} ${strohi ? '<' : '\\le'} x ${strohi ? '<' : '\\le'} ${tz(b)}$?`,
    vidpovid: vidp,
    pidkazka: strohi ? 'Самі межі не входять — знак «<».' : 'Межі входять — знак «≤».',
    rozviazok: `Від ${ch(strohi ? a + 1 : a)} до ${ch(strohi ? b - 1 : b)}: ${vidp} ${vidp < 5 ? 'числа' : 'чисел'}.`,
  };
}

export default {
  rivni: ['з нулем і з додатним', 'два від’ємні: цілі й десяткові', 'дроби, упорядкування, цілі поруч'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([zNulem, zNulem, (rr: Vypadok) => dvaVidiemni(rr, false)])(r);
    if (riven === 2) return r.vybir([(rr: Vypadok) => dvaVidiemni(rr, false), (rr: Vypadok) => dvaVidiemni(rr, true), zNulem])(r);
    return r.vybir([droby, droby, vporiadkuvaty, tsileBilia, skilkyTsilykh])(r);
  },
} satisfies Henerator;
