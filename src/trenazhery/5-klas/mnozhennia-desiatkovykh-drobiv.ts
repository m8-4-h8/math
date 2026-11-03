// Множення десяткових дробів: на 10, 100, 1000 (кома вправо), на 0,1 і 0,01 (кома вліво), на натуральне,
// дріб на дріб (множимо як цілі, знаків після коми — скільки в обох множниках разом).
import { des, desZNuliamy, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const znakivU = (c: number, z: number) => {
  // Скільки знаків після коми в записі (без нулів у кінці).
  let k = z;
  while (k > 0 && c % 10 === 0) {
    c /= 10;
    k--;
  }
  return k;
};

// 2430 при двох знаках → «24,30 = 24,3»: показуємо, що нуль у кінці відкидаємо.
const zNulem = (c: number, z: number) => (c % 10 === 0 ? `${desZNuliamy(c, z)} = ${des(c, z)}` : des(c, z));

function naRozriadnu(r: Vypadok): TrenZavdannia {
  const z = r.chyslo(1, 3);
  let c = r.chyslo(10 ** z + 1, 99 * 10 ** z);
  if (c % 10 === 0) c += 1;
  const vpravo = r.shans(0.6);
  const k = r.chyslo(1, vpravo ? 3 : 2);
  const mnozhnyk = vpravo ? String(10 ** k) : des(1, k);
  // c · 10^k при z знаках = c при (z − k) знаках; c · 0,01 = c при (z + k) знаках.
  const rez = vpravo ? (k >= z ? des(c * 10 ** (k - z), 0) : des(c, z - k)) : des(c, z + k);
  return {
    pytannia: 'Обчисли: перенеси кому.',
    vyraz: `${des(c, z)} · ${mnozhnyk} =`,
    vidpovid: rez,
    pidkazka: vpravo
      ? `Множимо на ${10 ** k} — кома переходить на ${k} ${k === 1 ? 'знак' : 'знаки'} вправо.`
      : `Множимо на ${mnozhnyk} — кома переходить на ${k} ${k === 1 ? 'знак' : 'знаки'} вліво.`,
    rozviazok: `${des(c, z)} · ${mnozhnyk} = ${rez}`,
  };
}

function naNaturalne(r: Vypadok): TrenZavdannia {
  const z = r.chyslo(1, 2);
  let c = r.chyslo(2, 30 * 10 ** z);
  if (c % 10 === 0) c += 1;
  const n = r.chyslo(2, 9);
  return {
    pytannia: 'Обчисли.',
    vyraz: `${des(c, z)} · ${n} =`,
    vidpovid: des(c * n, z),
    pidkazka: `Помнож ${c} · ${n}, не дивлячись на кому. Потім відокрем ${z} ${z === 1 ? 'знак' : 'знаки'} справа.`,
    rozviazok: `${c} · ${n} = ${c * n}, після коми ${z} ${z === 1 ? 'знак' : 'знаки'}: ${des(c, z)} · ${n} = ${zNulem(c * n, z)}`,
  };
}

function dribNaDrib(r: Vypadok, maxA: number): TrenZavdannia {
  const za = r.chyslo(1, 2);
  const zb = 1;
  let a = r.chyslo(2, maxA);
  let b = r.chyslo(2, 30);
  if (a % 10 === 0) a += 1;
  if (b % 10 === 0) b += 1;
  const z = za + zb;
  const zapysA = des(a, za);
  const zapysB = des(b, zb);
  return {
    pytannia: 'Обчисли.',
    vyraz: `${zapysA} · ${zapysB} =`,
    vidpovid: des(a * b, z),
    pidkazka: `Помнож ${a} · ${b} як цілі. Після коми в множниках разом ${znakivU(a, za) + znakivU(b, zb)} знаки — стільки ж відокрем у добутку.`,
    rozviazok: `${a} · ${b} = ${a * b}; знаків після коми ${za} + ${zb} = ${z}, тож ${zapysA} · ${zapysB} = ${zNulem(a * b, z)}`,
  };
}

function zadacha(r: Vypadok): TrenZavdannia {
  const tsina = r.chyslo(105, 895);
  const k = r.chyslo(2, 9);
  const velychyna = r.vybir([
    { shcho: 'тканини', odyn: 'м' },
    { shcho: 'сиру', odyn: 'кг' },
    { shcho: 'стрічки', odyn: 'м' },
  ]);
  return {
    pytannia: `1 ${velychyna.odyn} ${velychyna.shcho} коштує ${des(tsina, 1)} грн. Скільки гривень коштують ${k} ${velychyna.odyn}?`,
    vidpovid: des(tsina * k, 1),
    odynytsi: 'грн',
    pidkazka: 'Вартість = ціна · кількість.',
    rozviazok: `${des(tsina, 1)} · ${k} = ${des(tsina * k, 1)} (грн)`,
  };
}

export default {
  rivni: ['на 10, 100, 1000 і на 0,1', 'на натуральне число', 'дріб на дріб і задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return naRozriadnu(r);
    if (riven === 2) return r.shans(0.7) ? naNaturalne(r) : naRozriadnu(r);
    return r.vybir([() => dribNaDrib(r, 99), () => dribNaDrib(r, 99), () => zadacha(r), () => naNaturalne(r)])();
  },
} satisfies Henerator;
