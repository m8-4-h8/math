// Додавання двох чисел з різними знаками (Істер § 32): від більшого модуля віднімаємо менший, знак — від
// числа з більшим модулем; сума протилежних чисел — нуль; цілі, десяткові, звичайні дроби; задачі про
// температуру, гроші й висоту.
import { ch, des, neskorotnyiChyselnyk, nsk, skorotyty, tdrib, tvidpovidDrib, vidpovidDrib, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const tz = (n: number) => (n < 0 ? `-${-n}` : `${n}`);
const vDuzhkakh = (n: number) => (n < 0 ? `(${tz(n)})` : `${n}`);

/** Два цілі числа з різними знаками; модулі до max, іноді протилежні. */
function para(r: Vypadok, max: number, protylezhni = 0.1): [number, number] {
  const m = r.chyslo(1, max);
  const n = r.shans(protylezhni) ? m : r.krim(1, max, [m]);
  const z = r.shans() ? 1 : -1;
  return [z * m, -z * n];
}

function tsili(r: Vypadok, max: number): TrenZavdannia {
  const [a, b] = para(r, max);
  const s = a + b;
  const [ma, mb] = [Math.abs(a), Math.abs(b)];
  return {
    pytannia: 'Обчисли.',
    vyraz: `$${tz(a)} + ${vDuzhkakh(b)} =$`,
    vidpovid: ch(s),
    pidkazka: s === 0 ? 'Це протилежні числа.' : 'Знаки різні: від більшого модуля відніми менший, знак — від числа з більшим модулем.',
    rozviazok:
      s === 0
        ? `${ch(a)} і ${ch(b)} — протилежні, їхня сума 0.`
        : `${Math.max(ma, mb)} − ${Math.min(ma, mb)} = ${Math.abs(s)}, знак від ${ch(ma > mb ? a : b)}: ${ch(s)}`,
  };
}

function desiatkovi(r: Vypadok): TrenZavdannia {
  const [a, b] = para(r, 99, 0.05);
  const s = a + b;
  const [ma, mb] = [Math.abs(a), Math.abs(b)];
  const t = (n: number) => (n < 0 ? `-${des(-n, 1)}` : des(n, 1)).replace(',', '{,}');
  const x = (n: number) => (n < 0 ? `−${des(-n, 1)}` : des(n, 1));
  return {
    pytannia: 'Обчисли.',
    vyraz: `$${t(a)} + ${b < 0 ? `(${t(b)})` : t(b)} =$`,
    vidpovid: x(s),
    pidkazka: 'Знаки різні: віднімай модулі (кома під комою), знак — від числа з більшим модулем.',
    rozviazok:
      s === 0
        ? `${x(a)} і ${x(b)} — протилежні, їхня сума 0.`
        : `${des(Math.max(ma, mb), 1)} − ${des(Math.min(ma, mb), 1)} = ${des(Math.abs(s), 1)}, знак від ${x(ma > mb ? a : b)}: ${x(s)}`,
  };
}

function droby(r: Vypadok): TrenZavdannia {
  for (;;) {
    const [q1, q2] = [r.chyslo(2, 10), r.chyslo(2, 10)];
    const [p1, p2] = [neskorotnyiChyselnyk(r, q1), neskorotnyiChyselnyk(r, q2)];
    const n = nsk(q1, q2);
    if (n > 36) continue;
    const [m1, m2] = [(p1 * n) / q1, (p2 * n) / q2];
    if (m1 === m2) continue;
    const pershyiVid = r.shans();
    const [s1, s2] = pershyiVid ? [-m1, m2] : [m1, -m2];
    const s = s1 + s2;
    const [sp, sq] = skorotyty(Math.abs(s), n);
    const zn = (z: boolean) => (z ? '-' : '');
    const druhyi = pershyiVid ? tdrib(p2, q2) : `\\left(-${tdrib(p2, q2)}\\right)`;
    return {
      pytannia: 'Обчисли.',
      vyraz: `$${zn(pershyiVid)}${tdrib(p1, q1)} + ${druhyi} =$`,
      vidpovid: vidpovidDrib(s, n),
      pokaz: `$${s < 0 ? '-' : ''}${tvidpovidDrib(Math.abs(s), n)}$`,
      pidkazka: `Зведи модулі до знаменника ${n}, від більшого відніми менший; знак — від числа з більшим модулем.`,
      rozviazok: `Модулі: ${p1}/${q1}${q1 === n ? '' : ` = ${m1}/${n}`} і ${p2}/${q2}${q2 === n ? '' : ` = ${m2}/${n}`}; ${Math.max(m1, m2)}/${n} − ${Math.min(m1, m2)}/${n} = ${Math.abs(s)}/${n}${sq !== n ? ` = ${sq === 1 ? sp : `${sp}/${sq}`}` : ''}; знак «${s < 0 ? '−' : '+'}».`,
    };
  }
}

function zadacha(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(0, 2);
  const [a, b] = [r.chyslo(2, 15), r.chyslo(2, 15)];
  if (typ === 0) {
    const tepl = r.shans();
    const t = tepl ? -a : a;
    const k = tepl ? b : -b;
    return {
      pytannia: `Уранці було ${t > 0 ? '+' : ''}${ch(t)} °C, до обіду ${tepl ? 'потепліло' : 'похолоднішало'} на ${b}°. Якою стала температура?`,
      vidpovid: t + k > 0 ? [t + k, `+${t + k}`] : ch(t + k),
      odynytsi: '°C',
      pidkazka: `${tepl ? 'Потепління — додаємо додатне' : 'Похолодання — додаємо від’ємне'}: ${ch(t)} + ${vDuzhkakh(k).replace('-', '−')}.`,
      rozviazok: `${ch(t)} + ${k < 0 ? `(${ch(k)})` : k} = ${ch(t + k)} (°C)`,
    };
  }
  if (typ === 1) {
    const [x, y] = [10 * a, 10 * b];
    return {
      pytannia: `На рахунку в телефоні було ${ch(-x)} грн (борг). Мама поповнила рахунок на ${y} грн. Скільки тепер на рахунку?`,
      vidpovid: ch(-x + y),
      odynytsi: 'грн',
      pidkazka: `Поповнення — додаємо додатне: ${ch(-x)} + ${y}.`,
      rozviazok: `${ch(-x)} + ${y} = ${ch(-x + y)} (грн)`,
    };
  }
  return {
    pytannia: `Підводний човен був на глибині ${10 * a} м (висота ${ch(-10 * a)} м) і піднявся на ${5 * b} м. На якій висоті відносно рівня моря він тепер?`,
    vidpovid: ch(-10 * a + 5 * b),
    odynytsi: 'м',
    pidkazka: `Підйом — додаємо додатне: ${ch(-10 * a)} + ${5 * b}.`,
    rozviazok: `${ch(-10 * a)} + ${5 * b} = ${ch(-10 * a + 5 * b)} (м)`,
  };
}

export default {
  rivni: ['цілі числа', 'десяткові дроби, задачі', 'звичайні дроби'],
  zavdannia(r, riven) {
    if (riven === 1) return r.shans(0.8) ? tsili(r, 20) : zadacha(r);
    if (riven === 2) return r.vybir([desiatkovi, desiatkovi, zadacha, (rr: Vypadok) => tsili(rr, 99)])(r);
    return r.vybir([droby, droby, droby, desiatkovi])(r);
  },
} satisfies Henerator;
