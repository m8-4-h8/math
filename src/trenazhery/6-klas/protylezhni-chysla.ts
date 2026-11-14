// Протилежні числа. Цілі числа. Раціональні числа (Істер § 28): протилежне до цілого, десяткового, звичайного
// дробу; −(−a) = a і кілька мінусів поспіль; −a при від'ємному a; протилежні точки на прямій; які числа цілі,
// натуральні, раціональні.
import { ch, des, tdrib, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

/** Число для показу в TeX і для відповіді (з довгим мінусом). */
interface Chyslo {
  tex: string;
  tekst: string;
}

function vypadkove(r: Vypadok, znak: number): Chyslo {
  const typ = r.chyslo(0, 2);
  const m = znak < 0 ? '-' : '';
  const mt = znak < 0 ? '−' : '';
  if (typ === 0) {
    const n = r.chyslo(1, 99);
    return { tex: `${m}${n}`, tekst: `${mt}${n}` };
  }
  if (typ === 1) {
    const n = r.chyslo(1, 99);
    const d = des(n, 1);
    return { tex: `${m}${d.replace(',', '{,}')}`, tekst: `${mt}${d}` };
  }
  const q = r.chyslo(2, 9);
  const p = r.chyslo(1, q - 1);
  return { tex: `${m}${tdrib(p, q)}`, tekst: `${mt}${p}/${q}` };
}

function protylezhne(r: Vypadok): TrenZavdannia {
  const znak = r.shans() ? 1 : -1;
  const a = vypadkove(r, znak);
  const vidp = znak > 0 ? `−${a.tekst}` : a.tekst.slice(1);
  return {
    pytannia: `Яке число протилежне до $${a.tex}$?`,
    vidpovid: vidp,
    pidkazka: 'Протилежне — те саме число з іншим знаком.',
    rozviazok: `Протилежне до ${a.tekst} — ${vidp}: однаково далеко від нуля, по різні боки.`,
  };
}

function minusy(r: Vypadok): TrenZavdannia {
  const k = r.chyslo(2, 5);
  const n = r.chyslo(1, 50);
  const vnutri = r.shans(0.3) ? -n : n; // іноді і саме число з мінусом
  let tex = vnutri < 0 ? `-${n}` : `${n}`;
  for (let i = 0; i < k; i++) tex = i === 0 && vnutri > 0 ? `-${tex}` : `-(${tex})`;
  const vsogo = k + (vnutri < 0 ? 1 : 0);
  const vidp = vsogo % 2 === 0 ? n : -n;
  return {
    pytannia: 'Спрости запис.',
    vyraz: `$${tex}$`,
    vidpovid: ch(vidp),
    pidkazka: 'Порахуй мінуси: парна кількість — плюс, непарна — мінус.',
    rozviazok: `Мінусів — ${vsogo}, це ${vsogo % 2 === 0 ? 'парне' : 'непарне'} число, тому ${ch(vidp)}.`,
  };
}

function minusA(r: Vypadok): TrenZavdannia {
  const n = r.chyslo(1, 60);
  const vid = r.shans(0.65);
  const a = vid ? -n : n;
  const bukva = r.vybir(['a', 'b', 'x', 'm']);
  return {
    pytannia: `Знайди $-${bukva}$, якщо $${bukva} = ${vid ? `-${n}` : n}$.`,
    vidpovid: ch(-a),
    pidkazka: `Підстав число разом зі знаком: −(${ch(a)}).`,
    rozviazok: `−${bukva} = −(${ch(a)}) = ${ch(-a)}`,
  };
}

function symetrychni(r: Vypadok): TrenZavdannia {
  const n = r.chyslo(1, 20);
  const prava = r.shans();
  return {
    pytannia: `Точки $A$ і $B$ мають протилежні координати, а відстань між ними ${2 * n}. Яка координата ${prava ? 'правої' : 'лівої'} точки?`,
    vidpovid: ch(prava ? n : -n),
    pidkazka: 'Протилежні точки однаково далеко від нуля — по половині відстані.',
    rozviazok: `${2 * n} : 2 = ${n} — від кожної точки до нуля; ${prava ? 'права' : 'ліва'} — ${ch(prava ? n : -n)}.`,
  };
}

/** Цілі, натуральні, раціональні. */
function mnozhyny(r: Vypadok): TrenZavdannia {
  for (;;) {
    const chysla: { tex: string; tsile: boolean; nat: boolean }[] = [];
    for (let i = 0; i < 6; i++) {
      const typ = r.chyslo(0, 4);
      if (typ <= 1) {
        const n = r.chyslo(-20, 20);
        chysla.push({ tex: n < 0 ? `-${-n}` : `${n}`, tsile: true, nat: n > 0 });
      } else if (typ === 2) {
        const n = r.chyslo(1, 99);
        if (n % 10 === 0) continue;
        chysla.push({ tex: `${r.shans() ? '-' : ''}${des(n, 1).replace(',', '{,}')}`, tsile: false, nat: false });
      } else {
        const q = r.chyslo(2, 9);
        const p = r.chyslo(1, q - 1);
        chysla.push({ tex: `${r.shans() ? '-' : ''}${tdrib(p, q)}`, tsile: false, nat: false });
      }
    }
    if (new Set(chysla.map((c) => c.tex)).size !== chysla.length) continue;
    const pytannia = r.vybir(['цілих', 'натуральних', 'від’ємних цілих'] as const);
    const vidp =
      pytannia === 'цілих'
        ? chysla.filter((c) => c.tsile)
        : pytannia === 'натуральних'
          ? chysla.filter((c) => c.nat)
          : chysla.filter((c) => c.tsile && c.tex.startsWith('-'));
    if (vidp.length === 0) continue;
    return {
      pytannia: `Скільки ${pytannia} чисел серед: ${chysla.map((c) => `$${c.tex}$`).join('; ')}?`,
      vidpovid: vidp.length,
      pidkazka:
        pytannia === 'натуральних'
          ? 'Натуральні — 1, 2, 3, … Нуль і від’ємні — не натуральні.'
          : 'Цілі — без дробової частини: натуральні, протилежні до них і нуль.',
      rozviazok: `Підходять: ${vidp.map((c) => `$${c.tex}$`).join(', ')} — ${vidp.length}.`,
    };
  }
}

function sobiProtylezhne(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(0, 2);
  if (typ === 0) {
    return {
      pytannia: 'Яке число дорівнює своєму протилежному?',
      vidpovid: 0,
      pidkazka: 'Протилежні числа — по різні боки від нуля. Яке число не має «боку»?',
      rozviazok: 'Лише нуль: −0 = 0.',
    };
  }
  const n = r.chyslo(1, 30);
  return {
    pytannia: `Чи може число $-a$ бути додатним? Наприклад, при $a = -${n}$ чому дорівнює $-a$?`,
    vidpovid: n,
    pidkazka: `Підстав: −(−${n}).`,
    rozviazok: `−a = −(−${n}) = ${n} — додатне. Тож −a буває додатним, коли a від’ємне.`,
  };
}

export default {
  rivni: ['протилежне число', 'кілька мінусів, −a при від’ємному a', 'цілі й раціональні числа, протилежні точки'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([protylezhne, protylezhne, minusA])(r);
    if (riven === 2) return r.vybir([minusy, minusy, minusA, sobiProtylezhne])(r);
    return r.vybir([mnozhyny, mnozhyny, symetrychni, minusy])(r);
  },
} satisfies Henerator;
