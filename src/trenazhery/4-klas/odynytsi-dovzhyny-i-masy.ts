// Одиниці довжини і маси: у менші — множимо, у більші — ділимо; складені величини; порівняння.
import { ch, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const PARY = [
  { v: 'см', m: 'мм', k: 10 },
  { v: 'дм', m: 'см', k: 10 },
  { v: 'м', m: 'дм', k: 10 },
  { v: 'м', m: 'см', k: 100 },
  { v: 'км', m: 'м', k: 1000 },
  { v: 'кг', m: 'г', k: 1000 },
  { v: 'ц', m: 'кг', k: 100 },
  { v: 'т', m: 'ц', k: 10 },
  { v: 'т', m: 'кг', k: 1000 },
];

function vMenshi(r: Vypadok, pary: typeof PARY): TrenZavdannia {
  const p = r.vybir(pary);
  const a = r.chyslo(2, 99);
  return {
    pytannia: 'У менші одиниці — множимо.',
    vyraz: `${a} ${p.v} = □ ${p.m}`,
    vidpovid: a * p.k,
    odynytsi: p.m,
    pidkazka: `1 ${p.v} = ${ch(p.k)} ${p.m}.`,
    rozviazok: `${a} · ${ch(p.k)} = ${ch(a * p.k)} (${p.m})`,
  };
}

function vBilshi(r: Vypadok): TrenZavdannia {
  const p = r.vybir(PARY);
  const a = r.chyslo(2, 99);
  return {
    pytannia: 'У більші одиниці — ділимо.',
    vyraz: `${ch(a * p.k)} ${p.m} = □ ${p.v}`,
    vidpovid: a,
    odynytsi: p.v,
    pidkazka: `1 ${p.v} = ${ch(p.k)} ${p.m}. Скільки разів по ${ch(p.k)} вміщається в ${ch(a * p.k)}?`,
    rozviazok: `${ch(a * p.k)} : ${ch(p.k)} = ${a} (${p.v})`,
  };
}

function skladeni(r: Vypadok): TrenZavdannia {
  const p = r.vybir(PARY.filter((x) => x.k >= 100));
  const a = r.chyslo(1, 30);
  const b = r.chyslo(1, p.k - 1);
  return {
    pytannia: 'Вирази в менших одиницях.',
    vyraz: `${a} ${p.v} ${b} ${p.m} = □ ${p.m}`,
    vidpovid: a * p.k + b,
    odynytsi: p.m,
    pidkazka: `Спершу ${a} ${p.v} у ${p.m}: ${a} · ${ch(p.k)}, потім додай ${b}.`,
    rozviazok: `${a} · ${ch(p.k)} + ${b} = ${ch(a * p.k + b)} (${p.m})`,
  };
}

function porivniannia(r: Vypadok): TrenZavdannia {
  const p = r.vybir(PARY);
  const a = r.chyslo(2, 20);
  const pravylno = a * p.k;
  const sprava = r.vybir([pravylno, pravylno + r.chyslo(1, p.k), pravylno - r.chyslo(1, p.k), a * 10 === pravylno ? a * 100 : a * 10]);
  const znak = pravylno > sprava ? '>' : pravylno < sprava ? '<' : '=';
  return {
    pytannia: 'Порівняй.',
    vyraz: `${a} ${p.v} □ ${ch(sprava)} ${p.m}`,
    vidpovid: znak,
    varianty: ['>', '<', '='],
    pidkazka: `Вирази ${a} ${p.v} у ${p.m}.`,
    rozviazok: `${a} ${p.v} = ${ch(pravylno)} ${p.m}, а ${ch(pravylno)} ${znak} ${ch(sprava)}.`,
  };
}

export default {
  rivni: ['см, дм, м, кг', 'усі одиниці: у менші й більші', 'складені величини й порівняння'],
  zavdannia(r, riven) {
    if (riven === 1) return vMenshi(r, PARY.slice(0, 6));
    if (riven === 2) return r.shans() ? vMenshi(r, PARY) : vBilshi(r);
    return r.vybir([skladeni, skladeni, porivniannia, vBilshi])(r);
  },
} satisfies Henerator;
