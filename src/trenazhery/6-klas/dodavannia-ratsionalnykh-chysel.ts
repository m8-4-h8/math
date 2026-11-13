// Додавання від'ємних чисел (Істер § 31): сума двох від'ємних — модулі додаємо, знак «−»; цілі, десяткові,
// звичайні дроби з однаковими й різними знаменниками; додавання нуля; три від'ємні доданки; задачі про
// борги й температуру.
import { ch, des, neskorotnyiChyselnyk, nsk, skorotyty, tdrib, tvidpovidDrib, vidpovidDrib, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

function tsili(r: Vypadok, max: number): TrenZavdannia {
  const [a, b] = [r.chyslo(1, max), r.chyslo(1, max)];
  const nul = r.shans(0.1);
  if (nul) {
    return {
      pytannia: 'Обчисли.',
      vyraz: r.shans() ? `$-${a} + 0 =$` : `$0 + (-${a}) =$`,
      vidpovid: ch(-a),
      pidkazka: 'Додати нуль — нічого не змінити.',
      rozviazok: `${ch(-a)} + 0 = ${ch(-a)}`,
    };
  }
  return {
    pytannia: 'Обчисли.',
    vyraz: `$-${a} + (-${b}) =$`,
    vidpovid: ch(-(a + b)),
    pidkazka: 'Обидва числа від’ємні: додай модулі й постав «−».',
    rozviazok: `${a} + ${b} = ${a + b}, знак «−»: ${ch(-(a + b))}`,
  };
}

function desiatkovi(r: Vypadok): TrenZavdannia {
  const [a, b] = [r.chyslo(1, 99), r.chyslo(1, 99)];
  const s = a + b;
  return {
    pytannia: 'Обчисли.',
    vyraz: `$-${des(a, 1).replace(',', '{,}')} + (-${des(b, 1).replace(',', '{,}')}) =$`,
    vidpovid: `−${des(s, 1)}`,
    pidkazka: 'Додай модулі як десяткові дроби — кома під комою — і постав «−».',
    rozviazok: `${des(a, 1)} + ${des(b, 1)} = ${des(s, 1)}, знак «−»: −${des(s, 1)}`,
  };
}

function droby(r: Vypadok): TrenZavdannia {
  for (;;) {
    const [q1, q2] = r.shans(0.4) ? [r.chyslo(3, 12), 0] : [r.chyslo(2, 10), r.chyslo(2, 10)];
    const q2r = q2 || q1;
    const [p1, p2] = [neskorotnyiChyselnyk(r, q1), neskorotnyiChyselnyk(r, q2r)];
    const n = nsk(q1, q2r);
    if (n > 36) continue;
    const s = (p1 * n) / q1 + (p2 * n) / q2r;
    const [sp, sq] = skorotyty(s, n);
    return {
      pytannia: 'Обчисли.',
      vyraz: `$-${tdrib(p1, q1)} + \\left(-${tdrib(p2, q2r)}\\right) =$`,
      vidpovid: vidpovidDrib(-s, n),
      pokaz: `$-${tvidpovidDrib(s, n)}$`,
      pidkazka: q1 === q2r ? 'Знаменники однакові: додай чисельники модулів, постав «−».' : `Додай модулі, звівши до знаменника ${n}, і постав «−».`,
      rozviazok: `${p1}/${q1} + ${p2}/${q2r} = ${q1 === q2r ? '' : `${(p1 * n) / q1}/${n} + ${(p2 * n) / q2r}/${n} = `}${s}/${n}${sq !== n ? ` = ${sq === 1 ? sp : `${sp}/${sq}`}` : ''}; відповідь зі знаком «−».`,
    };
  }
}

function try_(r: Vypadok): TrenZavdannia {
  const [a, b, c] = [r.chyslo(1, 30), r.chyslo(1, 30), r.chyslo(1, 30)];
  return {
    pytannia: 'Обчисли.',
    vyraz: `$-${a} + (-${b}) + (-${c}) =$`,
    vidpovid: ch(-(a + b + c)),
    pidkazka: 'Усі доданки від’ємні: додай усі модулі й постав «−».',
    rozviazok: `${a} + ${b} + ${c} = ${a + b + c}, знак «−»: ${ch(-(a + b + c))}`,
  };
}

function zadacha(r: Vypadok): TrenZavdannia {
  const [a, b] = [r.chyslo(2, 15), r.chyslo(2, 15)];
  const typ = r.chyslo(0, 2);
  if (typ === 0) {
    return {
      pytannia: `Уночі було ${ch(-a)} °C, а до ранку похолоднішало ще на ${b}°. Якою стала температура?`,
      vidpovid: ch(-(a + b)),
      odynytsi: '°C',
      pidkazka: `Похолодання — додаємо від’ємне число: ${ch(-a)} + (${ch(-b)}).`,
      rozviazok: `${ch(-a)} + (${ch(-b)}) = ${ch(-(a + b))} (°C)`,
    };
  }
  if (typ === 1) {
    const [x, y] = [10 * a, 10 * b];
    return {
      pytannia: `На рахунку в телефоні було ${ch(-x)} грн (борг). Після ще одного дзвінка списали ${y} грн. Скільки тепер на рахунку?`,
      vidpovid: ch(-(x + y)),
      odynytsi: 'грн',
      pidkazka: 'Борг збільшився — додаємо від’ємне число.',
      rozviazok: `${ch(-x)} + (${ch(-y)}) = ${ch(-(x + y))} (грн)`,
    };
  }
  return {
    pytannia: `Водолаз опустився на ${a} м нижче рівня моря, а потім ще на ${b} м. На якій висоті відносно рівня моря він тепер?`,
    vidpovid: ch(-(a + b)),
    odynytsi: 'м',
    pidkazka: `Нижче рівня моря — від’ємні числа: ${ch(-a)} + (${ch(-b)}).`,
    rozviazok: `${ch(-a)} + (${ch(-b)}) = ${ch(-(a + b))} (м)`,
  };
}

export default {
  rivni: ['цілі від’ємні числа', 'десяткові дроби, три доданки, задачі', 'звичайні дроби'],
  zavdannia(r, riven) {
    if (riven === 1) return r.shans(0.75) ? tsili(r, 20) : zadacha(r);
    if (riven === 2) return r.vybir([desiatkovi, desiatkovi, try_, zadacha, (rr: Vypadok) => tsili(rr, 99)])(r);
    return r.vybir([droby, droby, droby, desiatkovi])(r);
  },
} satisfies Henerator;
