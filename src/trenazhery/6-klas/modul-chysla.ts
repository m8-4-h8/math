// Модуль числа (Істер § 29): модуль цілого і десяткового числа; сума, різниця, добуток, частка модулів;
// рівняння |x| = a (два корені, один або жодного); у якого числа модуль більший; найменше значення |x| + c.
import { ch, des, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const tz = (n: number) => (n < 0 ? `-${-n}` : `${n}`);
/** Десяткове з одним знаком: n — у десятих. */
const td = (n: number) => (n < 0 ? `-${des(-n, 1)}` : des(n, 1)).replace(',', '{,}');
const tx = (n: number) => (n < 0 ? `−${des(-n, 1)}` : des(n, 1));

function modul(r: Vypadok): TrenZavdannia {
  const desiatkove = r.shans(0.35);
  const n = desiatkove ? r.chyslo(1, 199) : r.chyslo(0, 99);
  const vid = n !== 0 && r.shans(0.7);
  const v = vid ? -n : n;
  return {
    pytannia: 'Знайди модуль числа.',
    vyraz: `$|${desiatkove ? td(v) : tz(v)}| =$`,
    vidpovid: desiatkove ? des(n, 1) : n,
    pidkazka: 'Модуль — відстань до нуля, без знака.',
    rozviazok: `|${desiatkove ? tx(v) : ch(v)}| = ${desiatkove ? des(n, 1) : n}`,
  };
}

function dii(r: Vypadok): TrenZavdannia {
  for (;;) {
    const [a, b] = [r.krim(-30, 30, [0]), r.krim(-30, 30, [0])];
    const [ma, mb] = [Math.abs(a), Math.abs(b)];
    const dija = r.vybir(['+', '−', '·', ':'] as const);
    if (dija === '−' && ma < mb) continue;
    if (dija === ':' && (mb === 1 || ma % mb !== 0)) continue;
    if (dija === '·' && ma * mb > 200) continue;
    if (a > 0 && b > 0) continue; // хоч один модуль — від'ємного числа
    const vidp = dija === '+' ? ma + mb : dija === '−' ? ma - mb : dija === '·' ? ma * mb : ma / mb;
    const tdija = dija === '·' ? '\\cdot' : dija === ':' ? ':' : dija === '−' ? '-' : '+';
    return {
      pytannia: 'Обчисли.',
      vyraz: `$|${tz(a)}| ${tdija} |${tz(b)}| =$`,
      vidpovid: vidp,
      pidkazka: 'Спершу знайди кожен модуль, а потім виконай дію.',
      rozviazok: `|${ch(a)}| = ${ma}, |${ch(b)}| = ${mb}; ${ma} ${dija} ${mb} = ${vidp}`,
    };
  }
}

function desiatkovi(r: Vypadok): TrenZavdannia {
  const [a, b] = [r.chyslo(1, 99), r.chyslo(1, 99)];
  const [sa, sb] = [r.shans(0.7) ? -1 : 1, -1];
  const plus = r.shans() || a < b;
  const vidp = plus ? a + b : a - b;
  return {
    pytannia: 'Обчисли.',
    vyraz: `$|${td(sa * a)}| ${plus ? '+' : '-'} |${td(sb * b)}| =$`,
    vidpovid: des(vidp, 1),
    pidkazka: 'Спершу модулі — вони без мінуса.',
    rozviazok: `${des(a, 1)} ${plus ? '+' : '−'} ${des(b, 1)} = ${des(vidp, 1)}`,
  };
}

function rivniannia(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(0, 4);
  if (typ === 0) {
    const n = r.chyslo(1, 20);
    return {
      pytannia: `Скільки коренів має рівняння $|x| = -${n}$?`,
      vidpovid: 0,
      varianty: [0, 1, 2],
      pidkazka: 'Чи буває модуль від’ємним?',
      rozviazok: 'Жодного: модуль не буває від’ємним.',
    };
  }
  if (typ === 1) {
    return {
      pytannia: 'Скільки коренів має рівняння $|x| = 0$?',
      vidpovid: 1,
      varianty: [0, 1, 2],
      pidkazka: 'Яке число віддалене від нуля на 0?',
      rozviazok: 'Один: x = 0.',
    };
  }
  const n = r.chyslo(1, 40);
  const menshyi = r.shans();
  return {
    pytannia: `Розв’яжи рівняння $|x| = ${n}$. Запиши ${menshyi ? 'менший' : 'більший'} корінь.`,
    vidpovid: ch(menshyi ? -n : n),
    pidkazka: `На відстані ${n} від нуля — дві точки: праворуч і ліворуч.`,
    rozviazok: `x = ${n} або x = ${ch(-n)}; ${menshyi ? 'менший' : 'більший'} — ${ch(menshyi ? -n : n)}.`,
  };
}

function bilshyiModul(r: Vypadok): TrenZavdannia {
  for (;;) {
    const [a, b] = [r.krim(-40, 40, [0]), r.krim(-40, 40, [0])];
    if (Math.abs(a) === Math.abs(b)) continue;
    if (!(a < 0 && Math.abs(a) > Math.abs(b)) && r.shans(0.6)) continue; // частіше пастка: від'ємне з більшим модулем
    const vidp = Math.abs(a) > Math.abs(b) ? a : b;
    return {
      pytannia: `У якого числа модуль більший: $${tz(a)}$ чи $${tz(b)}$?`,
      vidpovid: ch(vidp),
      varianty: [ch(a), ch(b)],
      pidkazka: 'Порівняй відстані до нуля, знак не важливий.',
      rozviazok: `|${ch(a)}| = ${Math.abs(a)}, |${ch(b)}| = ${Math.abs(b)}; більший — у ${ch(vidp)}.`,
    };
  }
}

/** Знайди x: |x| = |a| — x може бути a або −a; рахуємо, скільки цілих x мають |x| < n. */
function tsiliZModulem(r: Vypadok): TrenZavdannia {
  const n = r.chyslo(2, 12);
  const strohe = r.shans();
  const vidp = strohe ? 2 * n - 1 : 2 * n + 1;
  return {
    pytannia: `Скільки цілих чисел мають модуль ${strohe ? 'менший за' : 'не більший за'} ${n}?`,
    vidpovid: vidp,
    pidkazka: 'Це цілі числа, що лежать на прямій не далі від нуля, ніж задано. Не забудь нуль і від’ємні.',
    rozviazok: strohe
      ? `Від ${ch(-(n - 1))} до ${n - 1}: ${n - 1} від’ємних, нуль і ${n - 1} додатних — ${n - 1} + 1 + ${n - 1} = ${vidp}.`
      : `Від ${ch(-n)} до ${n}: ${n} від’ємних, нуль і ${n} додатних — ${n} + 1 + ${n} = ${vidp}.`,
  };
}

export default {
  rivni: ['модуль числа', 'обчислення з модулями', 'рівняння |x| = a, порівняння модулів'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([modul, modul, bilshyiModul])(r);
    if (riven === 2) return r.vybir([dii, dii, desiatkovi, modul])(r);
    return r.vybir([rivniannia, rivniannia, bilshyiModul, tsiliZModulem, dii])(r);
  },
} satisfies Henerator;
