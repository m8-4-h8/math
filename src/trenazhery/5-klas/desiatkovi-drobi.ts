// Десяткові дроби: запис зі знаменником 10, 100, 1000; розряди після коми; порівняння; величини.
import { des, tdes, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const ROZRIADY = ['десятих', 'сотих', 'тисячних'];

function zapysaty(r: Vypadok, maxZnakiv: number, zTsiloiu: boolean): TrenZavdannia {
  const z = r.chyslo(1, maxZnakiv);
  const zn = 10 ** z;
  const tsila = zTsiloiu ? r.chyslo(1, 20) : 0;
  // Чисельник з потрібною кількістю знаків; іноді з нулями попереду (35/1000 → 0,035) — на них помиляються.
  const chys = r.shans(0.35) && z > 1 ? r.chyslo(1, 10 ** (z - 1) - 1) : r.chyslo(1, zn - 1);
  const tsile = tsila * zn + chys;
  const tdrobu = tsila ? `${tsila}\\frac{${chys}}{${zn}}` : `\\frac{${chys}}{${zn}}`;
  return {
    pytannia: 'Запиши десятковим дробом.',
    vyraz: `$${tdrobu} =$`,
    vidpovid: des(tsile, z),
    pidkazka: `Після коми стільки цифр, скільки нулів у знаменнику ${zn} — ${z}.`,
    rozviazok: `У знаменнику ${z} ${z === 1 ? 'нуль' : 'нулі'} — після коми ${z} ${z === 1 ? 'цифра' : 'цифри'}: ${des(tsile, z)}`,
  };
}

function uDrib(r: Vypadok): TrenZavdannia {
  const z = r.chyslo(1, 3);
  const zn = 10 ** z;
  const chys = r.chyslo(1, zn - 1);
  return {
    pytannia: 'Яке число у віконці?',
    vyraz: `$${tdes(chys, z)} = \\frac{\\square}{${zn}}$`,
    vidpovid: chys,
    pidkazka: `${z === 1 ? 'Десяті' : z === 2 ? 'Соті' : 'Тисячні'} — знаменник ${zn}. Чисельник — число після коми без нулів попереду.`,
    rozviazok: `$${tdes(chys, z)} = \\frac{${chys}}{${zn}}$`,
  };
}

function rozriad(r: Vypadok): TrenZavdannia {
  const tsila = r.chyslo(0, 99);
  const drob = r.chyslo(100, 999);
  const tsile = tsila * 1000 + drob;
  const i = r.chyslo(0, 2);
  const tsyfra = Number(String(drob)[i]);
  return {
    pytannia: `Яка цифра стоїть у розряді ${ROZRIADY[i]} у числі ${des(tsile, 3)}?`,
    vidpovid: tsyfra,
    pidkazka: 'Після коми: перша цифра — десяті, друга — соті, третя — тисячні.',
    rozviazok: `${des(tsile, 3)}: ${[...String(drob)].map((c, j) => `${c} — ${ROZRIADY[j]}`).join(', ')}.`,
  };
}

// Дробова частина без нуля в кінці: інакше 6,60 виглядає дивно.
const bezNulia = (r: Vypadok, vid: number, do_: number) => {
  let x = r.chyslo(vid, do_);
  while (x % 10 === 0) x = r.chyslo(vid, do_);
  return x;
};

// Запис з нулями в кінці, як задано: [340, 2] → «3{,}40» (des їх відкидає).
const zNuliamy = ([c, z]: [number, number]) => `${Math.floor(c / 10 ** z)}{,}${String(c % 10 ** z).padStart(z, '0')}`;

function porivniaty(r: Vypadok): TrenZavdannia {
  // Пастка «довший — більший»: 0,5 і 0,25; 6,1 і 6,09.
  const tsila = r.chyslo(0, 9);
  const typ = r.chyslo(0, 2);
  let a: [number, number];
  let b: [number, number];
  if (typ === 0) {
    a = [tsila * 10 + r.chyslo(1, 9), 1];
    b = [tsila * 100 + bezNulia(r, 10, 99), 2];
  } else if (typ === 1) {
    const d = r.chyslo(1, 9);
    a = [tsila * 10 + d, 1];
    b = [tsila * 100 + d * 10, 2]; // 3,4 і 3,40 — рівні
  } else {
    a = [tsila * 100 + bezNulia(r, 1, 99), 2];
    b = [tsila * 1000 + bezNulia(r, 1, 999), 3];
  }
  if (r.shans()) [a, b] = [b, a];
  const va = a[0] * 10 ** (3 - a[1]);
  const vb = b[0] * 10 ** (3 - b[1]);
  const znak = va > vb ? '>' : va < vb ? '<' : '=';
  // З трьома знаками після коми: 6,1 → «6,100».
  const tryZnaky = (v: number) => `${Math.floor(v / 1000)},${String(v % 1000).padStart(3, '0')}`;
  return {
    pytannia: 'Порівняй.',
    vyraz: `$${zNuliamy(a)}$ □ $${zNuliamy(b)}$`,
    vidpovid: znak,
    varianty: ['>', '<', '='],
    pidkazka: 'Зрівняй кількість цифр після коми, дописавши нулі, і порівнюй як звичайні числа.',
    rozviazok: `Дописуємо нулі: ${tryZnaky(va)} і ${tryZnaky(vb)}, тож ${zNuliamy(a).replace('{,}', ',')} ${znak} ${zNuliamy(b).replace('{,}', ',')}.`,
  };
}

function velychyny(r: Vypadok): TrenZavdannia {
  const v = r.vybir([
    { velyka: 'м', mala: 'см', k: 100 },
    { velyka: 'кг', mala: 'г', k: 1000 },
    { velyka: 'км', mala: 'м', k: 1000 },
    { velyka: 'грн', mala: 'коп.', k: 100 },
    { velyka: 'т', mala: 'кг', k: 1000 },
  ]);
  const z = Math.log10(v.k);
  const a = r.chyslo(1, 15);
  const b = r.shans(0.4) ? r.chyslo(1, 9) : r.chyslo(1, v.k - 1);
  return {
    pytannia: `Вирази в ${v.velyka === 'грн' ? 'гривнях' : 'більших одиницях'} десятковим дробом.`,
    vyraz: `${a} ${v.velyka} ${b} ${v.mala} = □ ${v.velyka}`,
    vidpovid: des(a * v.k + b, z),
    pidkazka: `1 ${v.mala} = $\\frac{1}{${v.k}}$ ${v.velyka}, тож після коми ${z} цифри.`,
    rozviazok: `${b} ${v.mala} = $\\frac{${b}}{${v.k}}$ ${v.velyka}, тож ${a} ${v.velyka} ${b} ${v.mala} = ${des(a * v.k + b, z)} ${v.velyka}`,
  };
}

export default {
  rivni: ['запис десятих і сотих', 'розряди, тисячні, порівняння', 'величини і пастки з нулями'],
  zavdannia(r, riven) {
    if (riven === 1) return r.shans(0.7) ? zapysaty(r, 2, r.shans()) : uDrib(r);
    if (riven === 2) return r.vybir([() => porivniaty(r), () => rozriad(r), () => zapysaty(r, 3, true), () => porivniaty(r)])();
    return r.vybir([velychyny, velychyny, porivniaty, (rr: Vypadok) => zapysaty(rr, 3, true)])(r);
  },
} satisfies Henerator;
