// Віднімання раціональних чисел (Істер § 34): a − b = a + (−b); цілі, десяткові, звичайні дроби; відстань
// між точками координатної прямої |a − b|; різниця температур і висот; кілька дій зліва направо.
import { ch, des, neskorotnyiChyselnyk, nsk, skorotyty, tdrib, tvidpovidDrib, vidpovidDrib, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const tz = (n: number) => (n < 0 ? `-${-n}` : `${n}`);
const vDuzhkakh = (n: number) => (n < 0 ? `(${tz(n)})` : `${n}`);
const zd = (n: number) => (n < 0 ? `(${ch(n)})` : `${n}`);

function tsili(r: Vypadok, max: number): TrenZavdannia {
  for (;;) {
    const [a, b] = [r.chyslo(-max, max), r.krim(-max, max, [0])];
    if (a >= 0 && b > 0 && a >= b) continue; // звичайне віднімання з 5 класу — пропускаємо
    const s = a - b;
    return {
      pytannia: 'Обчисли.',
      vyraz: `$${tz(a)} - ${vDuzhkakh(b)} =$`,
      vidpovid: ch(s),
      pidkazka: `Відняти ${ch(b)} — те саме, що додати ${ch(-b)}.`,
      rozviazok: `${ch(a)} − ${zd(b)} = ${ch(a)} + ${zd(-b)} = ${ch(s)}`,
    };
  }
}

function desiatkovi(r: Vypadok): TrenZavdannia {
  const [a, b] = [r.krim(-99, 99, [0]), r.krim(-99, 99, [0])];
  const s = a - b;
  const t = (n: number) => (n < 0 ? `-${des(-n, 1)}` : des(n, 1)).replace(',', '{,}');
  const x = (n: number) => (n < 0 ? `−${des(-n, 1)}` : des(n, 1));
  return {
    pytannia: 'Обчисли.',
    vyraz: `$${t(a)} - ${b < 0 ? `(${t(b)})` : t(b)} =$`,
    vidpovid: x(s),
    pidkazka: 'Заміни віднімання додаванням протилежного числа.',
    rozviazok: `${x(a)} − ${b < 0 ? `(${x(b)})` : x(b)} = ${x(a)} + ${-b < 0 ? `(${x(-b)})` : x(-b)} = ${x(s)}`,
  };
}

function droby(r: Vypadok): TrenZavdannia {
  for (;;) {
    const [q1, q2] = [r.chyslo(2, 10), r.chyslo(2, 10)];
    const [p1, p2] = [neskorotnyiChyselnyk(r, q1), neskorotnyiChyselnyk(r, q2)];
    const n = nsk(q1, q2);
    if (n > 36) continue;
    const [z1, z2] = [r.shans(0.4) ? -1 : 1, r.shans(0.4) ? -1 : 1];
    const [m1, m2] = [(z1 * p1 * n) / q1, (z2 * p2 * n) / q2];
    const s = m1 - m2;
    if (z1 > 0 && z2 > 0 && s >= 0) continue;
    const [sp, sq] = skorotyty(Math.abs(s), n);
    const druhyi = z2 < 0 ? `\\left(-${tdrib(p2, q2)}\\right)` : tdrib(p2, q2);
    return {
      pytannia: 'Обчисли.',
      vyraz: `$${z1 < 0 ? '-' : ''}${tdrib(p1, q1)} - ${druhyi} =$`,
      vidpovid: vidpovidDrib(s, n),
      pokaz: `$${s < 0 ? '-' : ''}${tvidpovidDrib(Math.abs(s), n)}$`,
      pidkazka: `Заміни віднімання додаванням протилежного і зведи дроби до знаменника ${n}.`,
      rozviazok: `${ch(m1)}/${n} + ${-m2 < 0 ? `(${ch(-m2)}/${n})` : `${-m2}/${n}`} = ${ch(s)}/${n}${sq !== n && s !== 0 ? ` = ${s < 0 ? '−' : ''}${sq === 1 ? sp : `${sp}/${sq}`}` : ''}`,
    };
  }
}

function vidstan(r: Vypadok): TrenZavdannia {
  const [a, b] = r.rizni(2, -20, 20);
  const [n1, n2] = r.vybir([['A', 'B'], ['M', 'N'], ['C', 'D']]);
  return {
    pytannia: `Яка відстань між точками $${n1}(${tz(a)})$ і $${n2}(${tz(b)})$?`,
    vidpovid: Math.abs(a - b),
    pidkazka: `Відстань — модуль різниці: |${ch(a)} − ${zd(b)}|.`,
    rozviazok: `|${ch(a)} − ${zd(b)}| = |${ch(a - b)}| = ${Math.abs(a - b)}`,
  };
}

function zadacha(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(0, 1);
  if (typ === 0) {
    const [t1, t2] = [r.chyslo(-20, -1), r.chyslo(0, 15)];
    return {
      pytannia: `Уночі було ${ch(t1)} °C, а вдень ${t2 > 0 ? '+' : ''}${t2} °C. На скільки градусів удень тепліше?`,
      vidpovid: t2 - t1,
      odynytsi: '°',
      pidkazka: `Знайди різницю: ${t2} − (${ch(t1)}).`,
      rozviazok: `${t2} − (${ch(t1)}) = ${t2} + ${-t1} = ${t2 - t1}`,
    };
  }
  const [h1, h2] = [10 * r.chyslo(1, 50), 10 * r.chyslo(1, 30)];
  return {
    pytannia: `Літак летить на висоті ${ch(h1 * 10)} м, а підводний човен — на глибині ${h2} м (висота ${ch(-h2)} м). Яка відстань по вертикалі між ними?`,
    vidpovid: h1 * 10 + h2,
    odynytsi: 'м',
    pidkazka: `Різниця висот: ${ch(h1 * 10)} − (${ch(-h2)}).`,
    rozviazok: `${ch(h1 * 10)} − (${ch(-h2)}) = ${ch(h1 * 10)} + ${h2} = ${ch(h1 * 10 + h2)} (м)`,
  };
}

function try_(r: Vypadok): TrenZavdannia {
  const [a, b, c] = [r.krim(-20, 20, [0]), r.krim(-20, 20, [0]), r.krim(-20, 20, [0])];
  const plus = r.shans();
  const ab = a - b;
  const s = plus ? ab + c : ab - c;
  return {
    pytannia: 'Обчисли.',
    vyraz: `$${tz(a)} - ${vDuzhkakh(b)} ${plus ? '+' : '-'} ${vDuzhkakh(c)} =$`,
    vidpovid: ch(s),
    pidkazka: 'Рахуй зліва направо, кожне віднімання заміни додаванням протилежного.',
    rozviazok: `${ch(a)} − ${zd(b)} = ${ch(ab)}; ${ch(ab)} ${plus ? '+' : '−'} ${zd(c)} = ${ch(s)}`,
  };
}

export default {
  rivni: ['цілі числа', 'десяткові дроби, відстань, задачі', 'звичайні дроби, кілька дій'],
  zavdannia(r, riven) {
    if (riven === 1) return r.shans(0.8) ? tsili(r, 20) : zadacha(r);
    if (riven === 2) return r.vybir([desiatkovi, desiatkovi, vidstan, zadacha, (rr: Vypadok) => tsili(rr, 99)])(r);
    return r.vybir([droby, droby, try_, desiatkovi])(r);
  },
} satisfies Henerator;
