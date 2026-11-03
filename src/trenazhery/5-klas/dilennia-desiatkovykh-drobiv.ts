// Ділення десяткових дробів: на 10, 100 (кома вліво), на натуральне (кома в частці — коли закінчилась ціла
// частина), натуральне на натуральне з дробом у відповіді, на десятковий дріб (переносимо кому в обох).
import { des, desZNuliamy, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

function naRozriadnu(r: Vypadok): TrenZavdannia {
  const z = r.chyslo(0, 2);
  let c = r.chyslo(11, 999 * 10 ** z);
  if (c % 10 === 0) c += 1;
  const k = r.chyslo(1, 3);
  return {
    pytannia: 'Обчисли: перенеси кому.',
    vyraz: `${des(c, z)} : ${10 ** k} =`,
    vidpovid: des(c, z + k),
    pidkazka: `Ділимо на ${10 ** k} — кома переходить на ${k} ${k === 1 ? 'знак' : 'знаки'} вліво. Бракує цифр — допиши нулі.`,
    rozviazok: `${des(c, z)} : ${10 ** k} = ${des(c, z + k)}`,
  };
}

function naNaturalne(r: Vypadok): TrenZavdannia {
  const n = r.chyslo(2, 9);
  const z = r.chyslo(1, 2);
  const chastka = r.chyslo(2, 15 * 10 ** z);
  const c = chastka * n;
  return {
    pytannia: 'Обчисли.',
    vyraz: `${des(c, z)} : ${n} =`,
    vidpovid: des(chastka, z),
    pidkazka: 'Ділимо, як натуральні числа. Кому в частці ставимо, щойно закінчилась ціла частина діленого.',
    rozviazok: `${des(c, z)} : ${n} = ${des(chastka, z)}. Перевірка: ${des(chastka, z)} · ${n} = ${des(c, z)}`,
  };
}

// 3 : 4 = 0,75 — ділене меншe або не ділиться націло: дописуємо кому й нулі.
function zNuliamy(r: Vypadok): TrenZavdannia {
  const n = r.vybir([2, 4, 5, 8, 20, 25]);
  const z = n === 8 ? 3 : n === 2 || n === 5 ? 1 : 2;
  let a = r.chyslo(1, 3 * n);
  while (a % n === 0) a = r.chyslo(1, 3 * n);
  const chastka = (a * 10 ** z) / n;
  return {
    pytannia: 'Обчисли. Допиши до діленого кому й нулі.',
    vyraz: `${a} : ${n} =`,
    vidpovid: des(chastka, z),
    pidkazka: `${a} = ${desZNuliamy(a * 10 ** z, z)}. Діли далі, зносячи нулі.`,
    rozviazok: `${desZNuliamy(a * 10 ** z, z)} : ${n} = ${des(chastka, z)}`,
  };
}

function naDrib(r: Vypadok): TrenZavdannia {
  const zd = r.chyslo(1, 2);
  let dilnyk = r.chyslo(2, 9 * 10 ** zd);
  if (dilnyk % 10 === 0) dilnyk += 1;
  const chastka = r.chyslo(2, 40);
  const dilene = dilnyk * chastka; // у тих самих знаках, що й дільник
  return {
    pytannia: 'Обчисли: зроби дільник натуральним.',
    vyraz: `${des(dilene, zd)} : ${des(dilnyk, zd)} =`,
    vidpovid: chastka,
    pidkazka: `Перенеси кому в обох числах на ${zd} ${zd === 1 ? 'знак' : 'знаки'} вправо: ${dilene} : ${dilnyk}.`,
    rozviazok: `${des(dilene, zd)} : ${des(dilnyk, zd)} = ${dilene} : ${dilnyk} = ${chastka}`,
  };
}

function zadacha(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(0, 1);
  if (typ === 0) {
    const obiem = r.vybir([25, 50, 75, 125, 150, 200, 250]);
    const n = r.chyslo(2, 16);
    return {
      pytannia: `Скільки пляшок по ${des(obiem, 2)} л можна наповнити з ${des(obiem * n, 2)} л соку?`,
      vidpovid: n,
      odynytsi: 'шт.',
      pidkazka: 'Скільки разів одна пляшка вміщається в усьому соку? Ділимо.',
      rozviazok: `${des(obiem * n, 2)} : ${des(obiem, 2)} = ${obiem * n} : ${obiem} = ${n}`,
    };
  }
  const n = r.chyslo(2, 8);
  const odna = r.chyslo(15, 250);
  return {
    pytannia: `${n} однакових пакунків важать ${des(odna * n, 1)} кг. Скільки кілограмів важить один пакунок?`,
    vidpovid: des(odna, 1),
    odynytsi: 'кг',
    pidkazka: `Поділи на ${n}.`,
    rozviazok: `${des(odna * n, 1)} : ${n} = ${des(odna, 1)} (кг)`,
  };
}

export default {
  rivni: ['на 10, 100, 1000', 'на натуральне число, дописуємо нулі', 'на десятковий дріб і задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return naRozriadnu(r);
    if (riven === 2) return r.vybir([naNaturalne, naNaturalne, zNuliamy, naRozriadnu])(r);
    return r.vybir([naDrib, naDrib, zadacha, zNuliamy])(r);
  },
} satisfies Henerator;
