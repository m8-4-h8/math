// Властивості степеня з натуральним показником: aᵐ · aⁿ = aᵐ⁺ⁿ, aᵐ : aⁿ = aᵐ⁻ⁿ, (aᵐ)ⁿ = aᵐⁿ, (ab)ⁿ = aⁿbⁿ;
// степінь від’ємного числа (парний показник — плюс); обчислення зручним способом.
import { ch, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';
import { tz } from '../alhebra.ts';

const BUKVY = ['a', 'b', 'c', 'x', 'y', 'm'];

function pokaznyk(r: Vypadok): TrenZavdannia {
  const b = r.vybir(BUKVY);
  const [m, n] = [r.chyslo(2, 12), r.chyslo(2, 9)];
  const typ = r.chyslo(0, 2);
  if (typ === 0) {
    return {
      pytannia: 'Впиши показник.',
      vyraz: `$${b}^{${m}} \\cdot ${b}^{${n}} = ${b}^{\\square}$`,
      vidpovid: m + n,
      pidkazka: 'Основи однакові, множимо — показники додаємо.',
      rozviazok: `${m} + ${n} = ${m + n}`,
    };
  }
  if (typ === 1) {
    return {
      pytannia: 'Впиши показник.',
      vyraz: `$${b}^{${m + n}} : ${b}^{${n}} = ${b}^{\\square}$`,
      vidpovid: m,
      pidkazka: 'Ділимо — показники віднімаємо.',
      rozviazok: `${m + n} − ${n} = ${m}`,
    };
  }
  const [p, q] = [r.chyslo(2, 6), r.chyslo(2, 5)];
  return {
    pytannia: 'Впиши показник.',
    vyraz: `$(${b}^{${p}})^{${q}} = ${b}^{\\square}$`,
    vidpovid: p * q,
    pidkazka: 'Степінь степеня — показники множимо.',
    rozviazok: `${p} · ${q} = ${p * q}`,
  };
}

function obchyslyty(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(0, 2);
  if (typ === 0) {
    const a = r.vybir([2, 2, 3, 5, 10]);
    const n = a === 2 ? r.chyslo(3, 8) : a === 10 ? r.chyslo(2, 6) : r.chyslo(2, 4);
    return {
      pytannia: 'Обчисли.',
      vyraz: `$${a}^{${n}} =$`,
      vidpovid: a ** n,
      pidkazka: `Перемнож ${a} саме на себе ${n} разів.`,
      rozviazok: `${Array(n).fill(a).join(' · ')} = ${ch(a ** n)}`,
    };
  }
  if (typ === 1) {
    const a = r.vybir([2, 3, 5]);
    const rez = a === 2 ? r.chyslo(1, 5) : r.chyslo(1, 3);
    const m = r.chyslo(2, 6);
    const n = r.chyslo(2, 6);
    const k = m + n - rez;
    if (k < 1) return obchyslyty(r);
    return {
      pytannia: 'Обчисли.',
      vyraz: `$\\dfrac{${a}^{${m}} \\cdot ${a}^{${n}}}{${a}^{${k}}} =$`,
      vidpovid: a ** rez,
      pidkazka: `Чисельник: ${a}^(${m} + ${n}). Потім відніми показник знаменника.`,
      rozviazok: `Показник: ${m} + ${n} − ${k} = ${rez}; ${a}^${rez} = ${a ** rez}`,
    };
  }
  const a = -r.chyslo(1, 3);
  const n = a === -1 ? r.chyslo(2, 15) : r.chyslo(2, a === -2 ? 6 : 4);
  return {
    pytannia: 'Обчисли.',
    vyraz: `$(${tz(a)})^{${n}} =$`,
    vidpovid: ch(a ** n),
    pidkazka: n % 2 ? 'Показник непарний — знак мінус залишається.' : 'Показник парний — відповідь додатна.',
    rozviazok: `${Math.abs(a) ** n}, показник ${n % 2 ? 'непарний — мінус' : 'парний — плюс'}: ${ch(a ** n)}`,
  };
}

function skladeni(r: Vypadok): TrenZavdannia {
  const b = r.vybir(BUKVY);
  const typ = r.chyslo(0, 2);
  if (typ === 0) {
    const [p, q, m, n] = [r.chyslo(2, 4), r.chyslo(2, 3), r.chyslo(1, 6), r.chyslo(1, 5)];
    const st = p * q + m - n;
    if (st < 1) return skladeni(r);
    return {
      pytannia: 'Спрости і впиши показник.',
      vyraz: `$(${b}^{${p}})^{${q}} \\cdot ${b}${m > 1 ? `^{${m}}` : ''} : ${b}${n > 1 ? `^{${n}}` : ''} = ${b}^{\\square}$`,
      vidpovid: st,
      pidkazka: 'По черзі: степінь степеня — множимо, множення — додаємо, ділення — віднімаємо.',
      rozviazok: `${p} · ${q} + ${m} − ${n} = ${st}`,
    };
  }
  if (typ === 1) {
    const k = r.chyslo(2, 5);
    const n = k > 3 ? r.chyslo(2, 3) : r.chyslo(2, 4);
    return {
      pytannia: 'Піднеси до степеня. Який коефіцієнт вийде?',
      vyraz: `$(${k}${b})^{${n}} = \\square\\,${b}^{${n}}$`,
      vidpovid: k ** n,
      pidkazka: `У степінь підносимо кожен множник: і ${k}, і ${b}.`,
      rozviazok: `${k}^${n} = ${Array(n).fill(k).join(' · ')} = ${k ** n}`,
    };
  }
  // 2⁵ · 5⁵ = 10⁵ та подібне: (ab)ⁿ навпаки
  const [a, c] = r.vybir([
    [2, 5],
    [4, 25],
    [5, 2],
    [25, 4],
  ]);
  const n = a * c === 10 ? r.chyslo(2, 6) : r.chyslo(2, 3);
  return {
    pytannia: 'Обчисли зручним способом.',
    vyraz: `$${a}^{${n}} \\cdot ${c}^{${n}} =$`,
    vidpovid: (a * c) ** n,
    pidkazka: `Однакові показники: aⁿ · bⁿ = (a · b)ⁿ. ${a} · ${c} = ${a * c}.`,
    rozviazok: `(${a} · ${c})^${n} = ${a * c}^${n} = ${ch((a * c) ** n)}`,
  };
}

export default {
  rivni: ['показник після множення і ділення', 'обчисли степінь', 'кілька властивостей разом'],
  zavdannia(r, riven) {
    if (riven === 1) return pokaznyk(r);
    if (riven === 2) return r.shans(0.7) ? obchyslyty(r) : pokaznyk(r);
    return r.shans(0.75) ? skladeni(r) : obchyslyty(r);
  },
} satisfies Henerator;
