// Розкриття дужок (Істер § 35): «+» перед дужками — знаки не змінюються; «−» перед дужками — змінюємо знак
// кожного доданка; зручні обчислення з розкриттям дужок (протилежні доданки); значення виразу, у якому
// після розкриття дужок одна буква зникає.
import { ch, des, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const BUKVY = ['x', 'y', 'a', 'b', 'm', 'n'];
const tekst = (s: string) => s.replace(/-/g, '−');

/** Два доданки в дужках: буква і число, у випадковому порядку й зі знаками. */
function dvaDodanky(r: Vypadok) {
  const b = r.vybir(BUKVY);
  const c = r.chyslo(1, 12);
  const [zb, zc] = [r.shans() ? 1 : -1, r.shans() ? 1 : -1];
  const bukvaPersha = r.shans();
  const chleny: [number, string][] = bukvaPersha ? [[zb, b], [zc, String(c)]] : [[zc, String(c)], [zb, b]];
  const zapys = (ch_: [number, string][]) => ch_.map(([z, t], i) => (i === 0 ? (z < 0 ? `-${t}` : t) : `${z < 0 ? '-' : '+'} ${t}`)).join(' ');
  return { chleny, zapys };
}

function minus(r: Vypadok): TrenZavdannia {
  const { chleny, zapys } = dvaDodanky(r);
  const pravylno = zapys(chleny.map(([z, t]) => [-z, t]));
  const lyshePershyi = zapys(chleny.map(([z, t], i) => [i === 0 ? -z : z, t]));
  const bezZminy = zapys(chleny);
  return {
    pytannia: `Розкрий дужки: $-(${zapys(chleny)})$`,
    vidpovid: tekst(pravylno),
    varianty: r.peremishaty([...new Set([pravylno, lyshePershyi, bezZminy])].map(tekst)),
    pidkazka: 'Мінус перед дужками змінює знак КОЖНОГО доданка.',
    rozviazok: `Кожен знак змінюємо на протилежний: ${tekst(pravylno)}.`,
  };
}

function plus(r: Vypadok): TrenZavdannia {
  const { chleny, zapys } = dvaDodanky(r);
  const insha = r.vybir(['p', 'k', 'c']);
  const pravylno = `${insha} ${chleny.map(([z, t]) => `${z < 0 ? '-' : '+'} ${t}`).join(' ')}`;
  const zminene = `${insha} ${chleny.map(([z, t]) => `${z < 0 ? '+' : '-'} ${t}`).join(' ')}`;
  const lysheDruhyi = `${insha} ${chleny.map(([z, t], i) => `${(i === 1 ? -z : z) < 0 ? '-' : '+'} ${t}`).join(' ')}`;
  return {
    pytannia: `Розкрий дужки: $${insha} + (${zapys(chleny)})$`,
    vidpovid: tekst(pravylno),
    varianty: r.peremishaty([...new Set([pravylno, zminene, lysheDruhyi])].map(tekst)),
    pidkazka: 'Плюс перед дужками — знаки доданків не змінюються.',
    rozviazok: `Знаки залишаються: ${tekst(pravylno)}.`,
  };
}

/** a − (b − a) чи a − (b + a): зручне обчислення з протилежними доданками. */
function zruchno(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(11, 99);
  const b = r.chyslo(2, 60);
  const typ = r.chyslo(0, 2);
  if (typ === 0) {
    // −a − (b − a) = −b
    return {
      pytannia: 'Обчисли зручно.',
      vyraz: `$-${a} - (${b} - ${a}) =$`,
      vidpovid: ch(-b),
      pidkazka: 'Розкрий дужки, змінивши знаки, і знайди протилежні доданки.',
      rozviazok: `−${a} − ${b} + ${a} = −${b} (−${a} і ${a} — протилежні).`,
    };
  }
  if (typ === 1) {
    // a − (a + b) = −b
    return {
      pytannia: 'Обчисли зручно.',
      vyraz: `$${a} - (${a} + ${b}) =$`,
      vidpovid: ch(-b),
      pidkazka: 'Розкрий дужки: обидва доданки в дужках змінять знак.',
      rozviazok: `${a} − ${a} − ${b} = −${b}`,
    };
  }
  // (a + b) − (a − c) = b + c, десяткові
  const [x, y, z] = [r.chyslo(11, 99), r.chyslo(1, 50), r.chyslo(1, 50)];
  const d = (n: number) => des(n, 1).replace(',', '{,}');
  return {
    pytannia: 'Обчисли зручно.',
    vyraz: `$(${d(x)} + ${d(y)}) - (${d(x)} - ${d(z)}) =$`,
    vidpovid: des(y + z, 1),
    pidkazka: 'Розкрий обидві дужки: перед другими стоїть «−».',
    rozviazok: `${des(x, 1)} + ${des(y, 1)} − ${des(x, 1)} + ${des(z, 1)} = ${des(y, 1)} + ${des(z, 1)} = ${des(y + z, 1)}`,
  };
}

/** Значення виразу, у якому після розкриття дужок одна буква зникає. */
function znachennia(r: Vypadok): TrenZavdannia {
  const [b1, b2] = r.vybir([['a', 'b'], ['x', 'y'], ['m', 'n']]);
  const c = r.krim(-15, 15, [0]);
  const v = r.krim(-20, 20, [0]);
  const typ = r.shans();
  // typ: b1 − (b2 + c + b1) = −b2 − c;  інакше: (b1 − b2) − (b1 + c) = −b2 − c
  const vnutr = c < 0 ? `- ${-c}` : `+ ${c}`;
  const vyraz = typ ? `${b1} - (${b2} ${vnutr} + ${b1})` : `(${b1} - ${b2}) - (${b1} ${vnutr})`;
  const zn = -v - c;
  return {
    pytannia: `Знайди значення виразу $${vyraz}$, якщо $${b2} = ${v < 0 ? `-${-v}` : v}$.`,
    vidpovid: ch(zn),
    pidkazka: `Розкрий дужки — ${b1} зникне.`,
    rozviazok: `${tekst(typ ? `${b1} - ${b2} ${c < 0 ? `+ ${-c}` : `- ${c}`} - ${b1}` : `${b1} - ${b2} - ${b1} ${c < 0 ? `+ ${-c}` : `- ${c}`}`)} = −${b2} ${c < 0 ? `+ ${-c}` : `− ${c}`}; −(${ch(v)}) ${c < 0 ? `+ ${-c}` : `− ${c}`} = ${ch(zn)}.`,
  };
}

export default {
  rivni: ['мінус перед дужками', 'плюс і мінус перед дужками, зручні обчислення', 'значення виразу після розкриття дужок'],
  zavdannia(r, riven) {
    if (riven === 1) return r.shans(0.75) ? minus(r) : plus(r);
    if (riven === 2) return r.vybir([minus, plus, zruchno, zruchno])(r);
    return r.vybir([znachennia, znachennia, zruchno, minus])(r);
  },
} satisfies Henerator;
