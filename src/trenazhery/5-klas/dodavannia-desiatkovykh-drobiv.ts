// Додавання і віднімання десяткових дробів: кома під комою, дописуємо нулі; віднімання від цілого; задачі.
import { des, desZNuliamy, osoba, rid, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

// Число як ціле в сотих (або тисячних): 3,25 → 325 при z = 2.
const vZnaky = (c: number, z: number, doZ: number) => c * 10 ** (doZ - z);

function pryklad(r: Vypadok, zA: number, zB: number, maxTsila: number, minus: boolean): TrenZavdannia {
  const z = Math.max(zA, zB);
  let a = r.chyslo(1, maxTsila * 10 ** zA);
  let b = r.chyslo(1, maxTsila * 10 ** zB);
  if (a % 10 === 0) a += 1;
  if (b % 10 === 0) b += 1;
  let A = vZnaky(a, zA, z);
  let B = vZnaky(b, zB, z);
  if (minus && A < B) {
    [A, B] = [B, A];
    [a, b] = [b, a];
    const t = zA;
    zA = zB;
    zB = t;
  }
  if (minus && A === B) return pryklad(r, zA, zB, maxTsila, minus);
  const rez = minus ? A - B : A + B;
  const rizni = zA !== zB;
  return {
    pytannia: 'Обчисли.',
    vyraz: `${des(a, zA)} ${minus ? '−' : '+'} ${des(b, zB)} =`,
    vidpovid: des(rez, z),
    pidkazka: rizni ? `Допиши нулі, щоб після коми було порівну цифр: ${desZNuliamy(A, z)} і ${desZNuliamy(B, z)}. Кома під комою.` : 'Кома під комою, рахуй як цілі числа.',
    rozviazok: `${des(a, zA)} ${minus ? '−' : '+'} ${des(b, zB)} = ${des(rez, z)}`,
  };
}

function vidTsiloho(r: Vypadok): TrenZavdannia {
  const tsile = r.chyslo(2, 20);
  const z = r.chyslo(1, 2);
  const b = r.chyslo(1, tsile * 10 ** z - 1);
  const rez = tsile * 10 ** z - b;
  const nuli = desZNuliamy(tsile * 10 ** z, z);
  return {
    pytannia: 'Обчисли. Допиши до цілого числа кому й нулі.',
    vyraz: `${tsile} − ${des(b, z)} =`,
    vidpovid: des(rez, z),
    pidkazka: `${tsile} = ${nuli}`,
    rozviazok: `${nuli} − ${des(b, z)} = ${des(rez, z)}`,
  };
}

function zadacha(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(0, 2);
  if (typ === 0) {
    const bulo = r.chyslo(3, 10);
    const a = r.chyslo(5, 25) * 10 + r.chyslo(0, 9); // сотні мілілітрів у сотих літра
    const b = r.chyslo(5, 25) * 10 + r.chyslo(1, 9);
    const rez = bulo * 100 - a - b;
    if (rez <= 0) return zadacha(r);
    return {
      pytannia: `У баці було ${bulo} л води. Спершу взяли ${des(a, 2)} л, потім ще ${des(b, 2)} л. Скільки літрів води лишилося?`,
      vidpovid: des(rez, 2),
      odynytsi: 'л',
      pidkazka: 'Спершу скільки взяли разом, потім відніми від того, що було.',
      rozviazok: `1) ${des(a, 2)} + ${des(b, 2)} = ${des(a + b, 2)} (л); 2) ${bulo} − ${des(a + b, 2)} = ${des(rez, 2)} (л).`,
    };
  }
  if (typ === 1) {
    const o = osoba(r);
    const a = r.chyslo(1510, 4590);
    const b = r.chyslo(810, 2990);
    return {
      pytannia: `${o.imia} ${rid(o, 'купив', 'купила')} зошит за ${des(a, 2)} грн і ручку за ${des(b, 2)} грн. Скільки гривень коштує покупка?`,
      vidpovid: des(a + b, 2),
      odynytsi: 'грн',
      pidkazka: 'Кома під комою, гривні під гривнями, копійки під копійками.',
      rozviazok: `${des(a, 2)} + ${des(b, 2)} = ${des(a + b, 2)} (грн)`,
    };
  }
  const a = r.chyslo(120, 480);
  const d = r.chyslo(15, 95);
  const vazha = r.shans();
  return {
    pytannia: vazha
      ? `Кавун важить ${des(a, 2)} кг, а диня — на ${des(d, 2)} кг менше. Скільки кілограмів важать кавун і диня разом?`
      : `Перший відрізок ${des(a, 1)} см, другий — на ${des(d, 1)} см довший. Яка довжина обох відрізків разом?`,
    vidpovid: des(vazha ? 2 * a - d : 2 * a + d, vazha ? 2 : 1),
    odynytsi: vazha ? 'кг' : 'см',
    pidkazka: vazha ? 'Спершу знайди масу дині.' : 'Спершу знайди довжину другого відрізка.',
    rozviazok: vazha
      ? `1) ${des(a, 2)} − ${des(d, 2)} = ${des(a - d, 2)} (кг); 2) ${des(a, 2)} + ${des(a - d, 2)} = ${des(2 * a - d, 2)} (кг).`
      : `1) ${des(a, 1)} + ${des(d, 1)} = ${des(a + d, 1)} (см); 2) ${des(a, 1)} + ${des(a + d, 1)} = ${des(2 * a + d, 1)} (см).`,
  };
}

export default {
  rivni: ['однаково знаків після коми', 'різна кількість знаків, від цілого', 'задачі в дві дії'],
  zavdannia(r, riven) {
    if (riven === 1) {
      const z = r.chyslo(1, 2);
      return pryklad(r, z, z, 20, r.shans());
    }
    if (riven === 2) return r.shans(0.75) ? pryklad(r, 1, 2, 30, r.shans()) : vidTsiloho(r);
    return r.vybir([zadacha, zadacha, vidTsiloho, (rr: Vypadok) => pryklad(rr, rr.chyslo(1, 3), rr.chyslo(1, 3), 99, rr.shans())])(r);
  },
} satisfies Henerator;
