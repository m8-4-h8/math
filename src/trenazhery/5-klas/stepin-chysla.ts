// Степінь числа: квадрат і куб, степені 2 і 10, порядок дій зі степенем, порівняння, площа і об'єм.
import { ch, mnozh, tch, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

function obchyslyty(r: Vypadok, max: number): TrenZavdannia {
  const pokaznyk = r.vybir([2, 2, 3, 3, 4]);
  const osnova =
    pokaznyk === 2 ? r.chyslo(2, max) : pokaznyk === 3 ? r.chyslo(2, Math.min(10, max)) : r.vybir([2, 3, 10]);
  const rez = osnova ** pokaznyk;
  return {
    pytannia: 'Обчисли.',
    vyraz: `$${osnova}^${pokaznyk} =$`,
    vidpovid: rez,
    pidkazka: `Візьми ${osnova} множником ${pokaznyk} рази. Не плутай з ${osnova} · ${pokaznyk}!`,
    rozviazok: `${Array(pokaznyk).fill(osnova).join(' · ')} = ${ch(rez)}`,
  };
}

// 5 · 5 · 5 = 5^□ — що означає показник.
function pokaznyk(r: Vypadok): TrenZavdannia {
  const osnova = r.chyslo(2, 12);
  const n = r.chyslo(2, 6);
  return {
    pytannia: 'Запиши добуток степенем. Яке число у віконці?',
    vyraz: `$${Array(n).fill(osnova).join(' \\cdot ')} = ${osnova}^{\\square}$`,
    vidpovid: n,
    pidkazka: 'Показник — скільки разів число взято множником.',
    rozviazok: `${osnova} взято множником ${n} рази, тож показник ${n}.`,
  };
}

function desiat(r: Vypadok): TrenZavdannia {
  const n = r.chyslo(2, 7);
  return r.shans()
    ? {
        pytannia: 'Обчисли.',
        vyraz: `$10^${n} =$`,
        vidpovid: 10 ** n,
        pidkazka: `Одиниця і ${n} нулів.`,
        rozviazok: `$10^${n} = ${tch(10 ** n)}$ — одиниця і ${n} ${mnozh(n, 'нуль', 'нулі', 'нулів')}.`,
      }
    : {
        pytannia: 'Яке число у віконці?',
        vyraz: `$${tch(2 ** n)} = 2^{\\square}$`,
        vidpovid: n,
        pidkazka: 'Множ 2 на 2, доки не дійдеш до числа: 2, 4, 8, 16…',
        rozviazok: `${Array(n).fill(2).join(' · ')} = ${2 ** n}`,
      };
}

function poriadok(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(2, 20);
  const b = r.chyslo(2, 6);
  const c = r.chyslo(2, 5);
  const typ = r.chyslo(0, 2);
  if (typ === 0) {
    return {
      pytannia: 'Обчисли. Степінь — найперше.',
      vyraz: `$${a} + ${b} \\cdot ${c}^2 =$`,
      vidpovid: a + b * c * c,
      pidkazka: 'Порядок: степінь, потім множення, потім додавання.',
      rozviazok: `$${c}^2 = ${c * c}$; ${b} · ${c * c} = ${b * c * c}; ${a} + ${b * c * c} = ${a + b * c * c}`,
    };
  }
  if (typ === 1) {
    return {
      pytannia: 'Обчисли. Спершу дужки.',
      vyraz: `$(${b} + ${c})^2 =$`,
      vidpovid: (b + c) ** 2,
      pidkazka: `Дужки: ${b} + ${c}. Потім підніми до квадрата.`,
      rozviazok: `${b} + ${c} = ${b + c}; ${b + c} · ${b + c} = ${(b + c) ** 2}`,
    };
  }
  return {
    pytannia: 'Обчисли.',
    vyraz: `$${b}^2 + ${c}^3 =$`,
    vidpovid: b * b + c ** 3,
    pidkazka: 'Кожен степінь окремо, потім додай.',
    rozviazok: `$${b}^2 = ${b * b}$, $${c}^3 = ${c ** 3}$; ${b * b} + ${c ** 3} = ${b * b + c ** 3}`,
  };
}

function porivniannia(r: Vypadok): TrenZavdannia {
  const [a, m, b, n] = r.vybir([
    [2, 3, 3, 2],
    [2, 4, 4, 2],
    [2, 5, 5, 2],
    [3, 4, 4, 3],
    [2, 6, 6, 2],
    [3, 2, 2, 3],
    [10, 2, 2, 10],
    [5, 2, 2, 5],
  ]);
  const [x, y] = [a ** m, b ** n];
  const znak = x > y ? '>' : x < y ? '<' : '=';
  return {
    pytannia: 'Порівняй.',
    vyraz: `$${a}^${m}$ □ $${b}^${n}$`,
    vidpovid: znak,
    varianty: ['>', '<', '='],
    pidkazka: 'Обчисли обидва степені.',
    rozviazok: `$${a}^${m} = ${tch(x)}$, $${b}^${n} = ${tch(y)}$, тож $${a}^${m} ${znak} ${b}^${n}$.`,
  };
}

function heometriia(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(2, 15);
  return r.shans()
    ? {
        pytannia: `Сторона квадрата ${a} см. Яка його площа?`,
        vidpovid: a * a,
        odynytsi: 'см²',
        pidkazka: 'Площа квадрата — сторона в квадраті.',
        rozviazok: `$${a}^2 = ${a * a}$ (см²)`,
      }
    : {
        pytannia: `Ребро куба ${Math.min(a, 10)} см. Який його об'єм?`,
        vidpovid: Math.min(a, 10) ** 3,
        odynytsi: 'см³',
        pidkazka: "Об'єм куба — ребро в кубі.",
        rozviazok: `$${Math.min(a, 10)}^3 = ${tch(Math.min(a, 10) ** 3)}$ (см³)`,
      };
}

export default {
  rivni: ['квадрат і куб', 'степені 10 і 2, порівняння', 'порядок дій і задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.shans(0.7) ? obchyslyty(r, 15) : pokaznyk(r);
    if (riven === 2) return r.vybir([desiat, porivniannia, (rr: Vypadok) => obchyslyty(rr, 20)])(r);
    return r.vybir([poriadok, poriadok, heometriia, porivniannia])(r);
  },
} satisfies Henerator;
