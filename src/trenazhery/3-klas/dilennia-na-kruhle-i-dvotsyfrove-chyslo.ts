// Ділення на кругле і двоцифрове число (3 клас): 840 : 4 = 84 д. : 4 = 21 д.; 720 : 30 = 720 : 10 : 3;
// добір частки з прикидкою за останньою цифрою (64 : 16 = 4, бо 4 · 16 = 64) і ділення частинами (96 : 12 = 96 : 6 : 2).
import { mnozh, osoba, rid, skilky, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const desiatkiv = (n: number) => skilky(n, 'десяток', 'десятки', 'десятків');

/** Числа від 2 до 9, які з одиницями дільника дають останню цифру діленого. */
const kandydaty = (dilnyk: number, dilene: number) =>
  [2, 3, 4, 5, 6, 7, 8, 9].filter((c) => (c * (dilnyk % 10)) % 10 === dilene % 10);

/** Розв'язок добором: кандидати за прикидкою, проби по черзі до правильного. */
function dobir(D: number, b: number, q: number) {
  const k = kandydaty(b, D);
  const proby = k.filter((c) => c < q).map((c) => `${c} · ${b} = ${c * b} — мало; `);
  const dlia = k.length === 1 ? `тільки для ${k[0]}` : `для ${k.slice(0, -1).join(', ')} і ${k[k.length - 1]} — пробуємо по черзі`;
  return `Прикидка: ${b % 10} · ? закінчується на ${D % 10} ${dlia}. ${proby.join('')}${q} · ${b} = ${D} ✓`;
}

// Кругле трицифрове на одноцифрове, частка — позатабличні десятки: 840 : 4 = 210.
function kruhleNaOdnotsyfrove(r: Vypadok): TrenZavdannia {
  for (;;) {
    const t = r.chyslo(11, 49);
    const b = r.chyslo(2, 9);
    if (t % 10 === 0 || t * b > 99) continue;
    const D = t * b * 10;
    return {
      pytannia: 'Обчисли.',
      vyraz: `${D} : ${b} =`,
      vidpovid: t * 10,
      pidkazka: `${D} — це ${desiatkiv(t * b)}.`,
      rozviazok: `${t * b} д. : ${b} = ${t} д. = ${t * 10}. Перевірка: ${t * 10} · ${b} = ${D}`,
    };
  }
}

// На кругле число, частка двоцифрова: 720 : 30 = 24.
function naKruhle(r: Vypadok): TrenZavdannia {
  for (;;) {
    const t = r.chyslo(11, 49);
    const k = r.chyslo(2, 9);
    if (t % 10 === 0 || t * k > 99) continue;
    const D = t * k * 10;
    return {
      pytannia: 'Обчисли.',
      vyraz: `${D} : ${k * 10} =`,
      vidpovid: t,
      pidkazka: r.shans() ? `Поділи спершу на 10, а потім на ${k}.` : `Десятки на десятки: ${t * k} д. : ${k} д.`,
      rozviazok: `${D} : 10 : ${k} = ${t * k} : ${k} = ${t}. Перевірка: ${t} · ${k * 10} = ${D}`,
    };
  }
}

// Сотні на сотні — добором: 900 : 300 = 3, бо 3 · 300 = 900.
function sotni(r: Vypadok): TrenZavdannia {
  for (;;) {
    const q = r.chyslo(2, 9);
    const s = r.chyslo(1, 4);
    if (s * q > 9) continue;
    const D = s * q * 100;
    return {
      pytannia: 'Обчисли.',
      vyraz: `${D} : ${s * 100} =`,
      vidpovid: q,
      pidkazka: `Яке число в добутку з ${s * 100} дає ${D}?`,
      rozviazok: `${q}, бо ${q} · ${s * 100} = ${D}`,
    };
  }
}

// Кругле трицифрове на кругле трицифрове — десятки на десятки й добір: 780 : 130 = 78 : 13 = 6.
function kruhleTrytsyfrove(r: Vypadok): TrenZavdannia {
  for (;;) {
    const q = r.chyslo(2, 9);
    const k = r.chyslo(11, 49);
    if (k % 10 === 0 || k * q > 99) continue;
    const D = k * q * 10;
    return {
      pytannia: 'Обчисли.',
      vyraz: `${D} : ${k * 10} =`,
      vidpovid: q,
      pidkazka: `Десятки на десятки: ${k * q} д. : ${k} д. Добери частку.`,
      rozviazok: `${k * q} д. : ${k} д. = ${k * q} : ${k}. ${dobir(k * q, k, q)}`,
    };
  }
}

// Добір із прикидкою: 64 : 16.
function naDvotsyfroveDobir(r: Vypadok): TrenZavdannia {
  for (;;) {
    const b = r.chyslo(11, 49);
    const q = r.chyslo(2, 9);
    const D = q * b;
    if (b % 10 < 2 || D > 200) continue;
    return {
      pytannia: 'Обчисли.',
      vyraz: `${D} : ${b} =`,
      vidpovid: q,
      pidkazka: `Яке число з ${b % 10} дає останню цифру ${D % 10}? Перевір його множенням на ${b}.`,
      rozviazok: dobir(D, b, q),
    };
  }
}

/** Дільник із таблиці множення: b = m1 · m2, m1 ≥ m2, обидва від 2 до 9. */
function rozkladDilnyka(r: Vypadok): [number, number, number] {
  for (;;) {
    const m1 = r.chyslo(3, 9);
    const m2 = r.chyslo(2, Math.min(m1, 6));
    const b = m1 * m2;
    if (b < 12 || b % 10 === 0) continue;
    return [b, m1, m2];
  }
}

// Частинами: 96 : 12 = 96 : 6 : 2.
function naDvotsyfroveChastynamy(r: Vypadok): TrenZavdannia {
  for (;;) {
    const [b, m1, m2] = rozkladDilnyka(r);
    const q = r.chyslo(2, 9);
    const D = q * b;
    if (D > 200) continue;
    return {
      pytannia: 'Обчисли.',
      vyraz: `${D} : ${b} =`,
      vidpovid: q,
      pidkazka: `${b} = ${m1} · ${m2}. Поділи спершу на ${m1}.`,
      rozviazok: `${D} : ${m1} : ${m2} = ${D / m1} : ${m2} = ${q}. Перевірка: ${q} · ${b} = ${D}`,
    };
  }
}

// Яким добутком замінити дільник (пастка — розклад сумою на десятки й одиниці).
function yakymDobutkom(r: Vypadok): TrenZavdannia {
  for (;;) {
    const [b, m1, m2] = rozkladDilnyka(r);
    if (b % 10 < 2) continue;
    const q = r.chyslo(2, 9);
    const D = q * b;
    if (D > 200) continue;
    const pravylno = `${D} : ${m1} : ${m2}`;
    const sumoiu = `${D} : ${b - (b % 10)} : ${b % 10}`;
    const zaivyi = `${D} : ${m1} : ${b}`;
    return {
      pytannia: `Як правильно поділити ${D} на ${b} частинами?`,
      vidpovid: pravylno,
      varianty: r.peremishaty([pravylno, sumoiu, zaivyi]),
      pidkazka: 'Добуток двох чисел, на які ділимо по черзі, має дорівнювати дільнику.',
      rozviazok: `${b} = ${m1} · ${m2}, тож ${D} : ${m1} : ${m2} = ${D / m1} : ${m2} = ${q}. А ${b - (b % 10)} + ${b % 10} = ${b} — це сума, а не добуток.`,
    };
  }
}

// ——— Текстові задачі ———

function zadachaLotky(r: Vypadok): TrenZavdannia {
  for (;;) {
    const t = r.chyslo(11, 33);
    if (t % 10 === 0) continue;
    const D = 30 * t;
    return {
      pytannia: `Яйця розкладають у лотки по 30 штук. Скільки лотків потрібно для ${D} яєць?`,
      vidpovid: t,
      pidkazka: `${D} — це ${desiatkiv(D / 10)}, а 30 — це 3 десятки.`,
      rozviazok: `${D} : 30 = ${D} : 10 : 3 = ${D / 10} : 3 = ${t} (${mnozh(t, 'лоток', 'лотки', 'лотків')})`,
    };
  }
}

function zadachaZoshyty(r: Vypadok): TrenZavdannia {
  for (;;) {
    const p = r.chyslo(11, 29);
    const q = r.chyslo(2, 9);
    const D = p * q;
    if (p % 10 < 2 || D > 200) continue;
    return {
      pytannia: `На ${D} грн купили альбоми по ${p} грн. Скільки альбомів купили?`,
      vidpovid: q,
      pidkazka: `Яке число в добутку з ${p} дає ${D}? Почни з прикидки за останньою цифрою.`,
      rozviazok: `${D} : ${p} = ${q}. ${dobir(D, p, q)}`,
    };
  }
}

// Три дії: гроші, купюри по 50 грн і покупка на всі гроші.
function zadachaKnyzhky(r: Vypadok): TrenZavdannia {
  for (;;) {
    const P = r.vybir([40, 60, 70, 80, 90]);
    const q = r.chyslo(2, 9);
    const T = P * q;
    const n = r.chyslo(2, 4);
    const A = T - 50 * n;
    if (T > 1000 || A < 20) continue;
    const o = osoba(r);
    return {
      pytannia:
        `${o.imia} ${rid(o, 'мав', 'мала')} ${A} грн. Мама дала ${rid(o, 'йому', 'їй')} ще ${skilky(n, 'купюру', 'купюри', 'купюр')} по 50 грн. ` +
        `На всі гроші ${o.imia} хоче купити книжки по ${P} грн. Скільки книжок можна купити?`,
      vidpovid: q,
      pidkazka: `Спершу дізнайся, скільки грошей стало: 50 · ${n} + ${A}.`,
      rozviazok: `50 · ${n} = ${50 * n} (грн), ${A} + ${50 * n} = ${T} (грн), ${T} : ${P} = ${T / 10} : ${P / 10} = ${q} (${mnozh(q, 'книжка', 'книжки', 'книжок')}).`,
    };
  }
}

export default {
  rivni: ['на кругле число', 'на двоцифрове число', 'задачі й усе разом'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([kruhleNaOdnotsyfrove, naKruhle, naKruhle, sotni])(r);
    if (riven === 2) return r.vybir([naDvotsyfroveDobir, naDvotsyfroveDobir, naDvotsyfroveChastynamy, yakymDobutkom])(r);
    return r.vybir([zadachaLotky, zadachaZoshyty, zadachaKnyzhky, naDvotsyfroveChastynamy, kruhleTrytsyfrove])(r);
  },
} satisfies Henerator;
