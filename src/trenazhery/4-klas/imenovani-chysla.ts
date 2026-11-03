// Дії з іменованими числами: метри й сантиметри, гривні й копійки — переведення, додавання, віднімання.
import { ch, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const PARY = [
  { v: 'м', m: 'см', k: 100 },
  { v: 'грн', m: 'коп.', k: 100 },
  { v: 'кг', m: 'г', k: 1000 },
  { v: 'км', m: 'м', k: 1000 },
];

function vMenshi(r: Vypadok): TrenZavdannia {
  const p = r.vybir(PARY);
  const a = r.chyslo(1, 120);
  const b = r.chyslo(p.k === 100 ? 1 : 5, p.k - 1);
  return {
    pytannia: 'Вирази в менших одиницях.',
    vyraz: `${a} ${p.v} ${b} ${p.m} = □ ${p.m}`,
    vidpovid: a * p.k + b,
    odynytsi: p.m,
    pidkazka: `1 ${p.v} = ${ch(p.k)} ${p.m}. Спершу ${a} ${p.v} у ${p.m}, потім додай ${b}.`,
    rozviazok: `${a} · ${p.k} + ${b} = ${ch(a * p.k + b)} (${p.m})`,
  };
}

function vBilshi(r: Vypadok): TrenZavdannia {
  const p = r.vybir(PARY);
  const a = r.chyslo(1, 60);
  const b = r.chyslo(1, p.k - 1);
  const vse = a * p.k + b;
  return {
    pytannia: `Вирази в ${p.v} і ${p.m}. Запиши так: 3 ${p.v} 5 ${p.m}`,
    vyraz: `${ch(vse)} ${p.m} =`,
    vidpovid: [`${a} ${p.v} ${b} ${p.m}`],
    pidkazka: `1 ${p.v} = ${ch(p.k)} ${p.m}. Скільки повних ${p.v} у ${ch(vse)} ${p.m}?`,
    rozviazok: `${ch(vse)} = ${a} · ${p.k} + ${b}, тобто ${a} ${p.v} ${b} ${p.m}`,
  };
}

function dii(r: Vypadok): TrenZavdannia {
  const p = r.vybir(PARY.slice(0, 2));
  // «6 м 15 см», але «84 см» і «7 м» — без нулів.
  const imen = (v: number, m: number) => [v && `${v} ${p.v}`, m && `${m} ${p.m}`].filter(Boolean).join(' ');
  const [a1, b1] = [r.chyslo(1, 50), r.chyslo(10, 99)];
  const [a2, b2] = [r.chyslo(1, 50), r.chyslo(10, 99)];
  if (r.shans()) {
    const s = (a1 + a2) * 100 + b1 + b2;
    const [v, m] = [Math.floor(s / 100), s % 100];
    return {
      pytannia: `Додай. Запиши так: 6 ${p.v} 15 ${p.m}`,
      vyraz: `${a1} ${p.v} ${b1} ${p.m} + ${a2} ${p.v} ${b2} ${p.m} =`,
      vidpovid: [imen(v, m), `${s} ${p.m}`],
      pidkazka: `${p.m === 'см' ? 'Сантиметри' : 'Копійки'}: ${b1} + ${b2} = ${b1 + b2}. Якщо вийшло 100 або більше — це ще 1 ${p.v}.`,
      rozviazok: `${a1 * 100 + b1} + ${a2 * 100 + b2} = ${s} (${p.m})${s >= 100 ? `, тобто ${imen(v, m)}` : ''}`,
    };
  }
  const zmensh = a1 * 100 + b1;
  let vidjem = Math.min(a2, a1) * 100 + b2;
  if (vidjem >= zmensh) vidjem = zmensh - r.chyslo(11, 99);
  const s = zmensh - vidjem;
  const [v, m] = [Math.floor(s / 100), s % 100];
  const [va, ma] = [Math.floor(vidjem / 100), vidjem % 100];
  return {
    pytannia: `Відніми. Запиши так: 2 ${p.v} 55 ${p.m}`,
    vyraz: `${a1} ${p.v} ${b1} ${p.m} − ${imen(va, ma)} =`,
    vidpovid: [imen(v, m), `${s} ${p.m}`],
    pidkazka: b1 < ma ? `Від ${b1} ${p.m} не відняти ${ma} ${p.m}: позич 1 ${p.v} = 100 ${p.m}.` : `${p.v} від ${p.v}, ${p.m} від ${p.m}.`,
    rozviazok: `${zmensh} − ${vidjem} = ${s} (${p.m})${s >= 100 ? `, тобто ${imen(v, m)}` : ''}`,
  };
}

function porivniannia(r: Vypadok): TrenZavdannia {
  const p = r.vybir(PARY);
  const a = r.chyslo(1, 9);
  const b = r.chyslo(1, p.k - 1);
  const zliva = a * p.k + b;
  const sprava = r.vybir([zliva, zliva + r.chyslo(1, 50), zliva - r.chyslo(1, 50), a * 10 + b]);
  const znak = zliva > sprava ? '>' : zliva < sprava ? '<' : '=';
  return {
    pytannia: 'Порівняй.',
    vyraz: `${a} ${p.v} ${b} ${p.m} □ ${ch(sprava)} ${p.m}`,
    vidpovid: znak,
    varianty: ['>', '<', '='],
    pidkazka: `Вирази ліве число в ${p.m}: 1 ${p.v} = ${ch(p.k)} ${p.m}.`,
    rozviazok: `${a} ${p.v} ${b} ${p.m} = ${ch(zliva)} ${p.m}, а ${ch(zliva)} ${znak} ${ch(sprava)}.`,
  };
}

export default {
  rivni: ['у менші одиниці', 'у більші одиниці й порівняння', 'додавання й віднімання'],
  zavdannia(r, riven) {
    if (riven === 1) return vMenshi(r);
    if (riven === 2) return r.vybir([vBilshi, porivniannia, vMenshi])(r);
    return r.vybir([dii, dii, vBilshi, porivniannia])(r);
  },
} satisfies Henerator;
