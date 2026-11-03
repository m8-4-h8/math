// Від'ємні числа: протилежні числа, модуль (відстань до нуля), порівняння (з двох від'ємних більше те,
// що ближче до нуля), рух координатною прямою, упорядкування, цілі числа між двома числами.
import { ch, des, mnozh, tdes, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const tz = (n: number) => (n < 0 ? `-${-n}` : `${n}`);

function protylezhne(r: Vypadok): TrenZavdannia {
  const n = r.krim(-30, 30, [0]);
  if (r.shans()) {
    return {
      pytannia: `Яке число протилежне до $${tz(n)}$?`,
      vidpovid: ch(-n),
      pidkazka: 'Протилежне — те саме число з іншим знаком.',
      rozviazok: `Протилежне до ${ch(n)} — ${ch(-n)}.`,
    };
  }
  return {
    pytannia: `Знайди $|${tz(n)}|$.`,
    vidpovid: Math.abs(n),
    pidkazka: 'Модуль — відстань до нуля, вона не буває від’ємною.',
    rozviazok: `|${ch(n)}| = ${Math.abs(n)}`,
  };
}

function porivniaty(r: Vypadok, dvaVidiemni: boolean, desiatkovi: boolean): TrenZavdannia {
  const m = desiatkovi ? 10 : 1;
  const max = desiatkovi ? 99 : 20;
  let [a, b] = dvaVidiemni ? [-r.chyslo(1, max), -r.chyslo(1, max)] : [-r.chyslo(1, max), r.chyslo(0, max)];
  if (!dvaVidiemni && r.shans()) [a, b] = [b, a];
  if (a === b) return porivniaty(r, dvaVidiemni, desiatkovi);
  const znak = a > b ? '>' : '<';
  const z = (n: number) => (desiatkovi ? tdes(n, 1) : tz(n));
  return {
    pytannia: 'Порівняй.',
    vyraz: `$${z(a)}$ □ $${z(b)}$`,
    vidpovid: znak,
    varianty: ['>', '<', '='],
    pidkazka: dvaVidiemni ? 'З двох від’ємних більше те, що ближче до нуля (з меншим модулем).' : 'Будь-яке від’ємне число менше за нуль і за додатне.',
    rozviazok: dvaVidiemni
      ? `|${desiatkovi ? des(a, 1) : ch(a)}| ${Math.abs(a) < Math.abs(b) ? '<' : '>'} |${desiatkovi ? des(b, 1) : ch(b)}|, тож ${desiatkovi ? des(a, 1) : ch(a)} ${znak} ${desiatkovi ? des(b, 1) : ch(b)}.`
      : `${desiatkovi ? des(a, 1) : ch(a)} ${znak} ${desiatkovi ? des(b, 1) : ch(b)}: від’ємне менше.`,
  };
}

function rukh(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(-9, 9);
  const k = r.chyslo(2, 12);
  const pravo = r.shans();
  const b = pravo ? a + k : a - k;
  return {
    pytannia: `На координатній прямій точка $A(${tz(a)})$. Точка $B$ лежить на ${k} ${mnozh(k, 'одиницю', 'одиниці', 'одиниць')} ${pravo ? 'правіше' : 'лівіше'}. Яка координата точки $B$?`,
    vidpovid: ch(b),
    pidkazka: pravo ? 'Праворуч — додаємо.' : 'Ліворуч — віднімаємо.',
    rozviazok: `${ch(a)} ${pravo ? '+' : '−'} ${k} = ${ch(b)}`,
  };
}

function vporiadkuvaty(r: Vypadok): TrenZavdannia {
  const chysla = r.rizni(4, -15, 15);
  if (!chysla.some((n) => n < 0) || chysla.filter((n) => n < 0).length < 2) return vporiadkuvaty(r);
  const poriadok = [...chysla].sort((x, y) => x - y);
  return {
    pytannia: `Запиши числа ${chysla.map((n) => `$${tz(n)}$`).join(', ')} у порядку зростання (через кому).`,
    vidpovid: poriadok.map(ch).join(', '),
    pidkazka: 'Спершу від’ємні: з них менше те, що далі від нуля.',
    rozviazok: poriadok.map(ch).join(' < '),
  };
}

function mizh(r: Vypadok): TrenZavdannia {
  const a = -r.chyslo(1, 12);
  const b = r.chyslo(1, 12);
  return {
    pytannia: `Скільки цілих чисел лежить між $${tz(a)}$ і $${b}$ (самі ці числа не рахуємо)?`,
    vidpovid: b - a - 1,
    pidkazka: `Від’ємних між ними: ${-a - 1}, ще нуль і додатні до ${b}.`,
    rozviazok: `Від’ємних — ${-a - 1}, нуль — 1, додатних — ${b - 1}: ${-a - 1} + 1 + ${b - 1} = ${b - a - 1}.`,
  };
}

export default {
  rivni: ['протилежні числа і модуль', 'порівняння і рух прямою', 'упорядкування і цілі між числами'],
  zavdannia(r, riven) {
    if (riven === 1) return r.shans(0.6) ? protylezhne(r) : porivniaty(r, false, false);
    if (riven === 2) return r.vybir([(rr: Vypadok) => porivniaty(rr, true, false), rukh, rukh, protylezhne])(r);
    return r.vybir([vporiadkuvaty, mizh, (rr: Vypadok) => porivniaty(rr, true, true)])(r);
  },
} satisfies Henerator;
