// Правильні й неправильні дроби, мішані числа: виділити цілу частину і записати неправильним дробом.
import { nsd, tdrib, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

// Нескоротний дріб n/d з n > d (n не ділиться на d).
function nepravylnyi(r: Vypadok, maxTsila: number) {
  const d = r.chyslo(2, 9);
  let ost = r.chyslo(1, d - 1);
  while (nsd(ost, d) !== 1) ost = r.chyslo(1, d - 1);
  const tsila = r.chyslo(1, maxTsila);
  return { d, ost, tsila, n: tsila * d + ost };
}

function vyd(r: Vypadok): TrenZavdannia {
  const d = r.chyslo(2, 12);
  const n = r.vybir([r.chyslo(1, d - 1), d, r.chyslo(d + 1, 3 * d)]);
  const vidpovid = n < d ? 'правильний' : 'неправильний';
  return {
    pytannia: `Який дріб $${tdrib(n, d)}$?`,
    vidpovid,
    varianty: ['правильний', 'неправильний'],
    pidkazka: 'Правильний — чисельник менший за знаменник (менше за ціле).',
    rozviazok: n < d ? `${n} < ${d}, тож дріб правильний.` : `${n} ≥ ${d}, тож дріб неправильний${n === d ? ' (він дорівнює 1)' : ''}.`,
  };
}

function tsilaChastyna(r: Vypadok, maxTsila: number): TrenZavdannia {
  const { d, ost, tsila, n } = nepravylnyi(r, maxTsila);
  return {
    pytannia: 'Виділи цілу частину. Запиши мішане число, наприклад «2 1/3».',
    vyraz: `$${tdrib(n, d)} =$`,
    vidpovid: `${tsila} ${ost}/${d}`,
    pidkazka: `Скільки разів ${d} вміщається в ${n}? Це ціла частина, а остача — новий чисельник.`,
    rozviazok: `${n} : ${d} = ${tsila} (ост. ${ost}), тож $${tdrib(n, d)} = ${tsila}${tdrib(ost, d)}$.`,
  };
}

function uNepravylnyi(r: Vypadok, maxTsila: number): TrenZavdannia {
  const { d, ost, tsila, n } = nepravylnyi(r, maxTsila);
  return r.shans()
    ? {
        pytannia: 'Запиши неправильним дробом. Яке число у віконці?',
        vyraz: `$${tsila}${tdrib(ost, d)} = \\frac{\\square}{${d}}$`,
        vidpovid: n,
        pidkazka: `Ціле — це ${d}/${d}. Помнож цілу частину на знаменник і додай чисельник.`,
        rozviazok: `${tsila} · ${d} + ${ost} = ${n}, тож $${tsila}${tdrib(ost, d)} = ${tdrib(n, d)}$.`,
      }
    : {
        pytannia: 'Запиши неправильним дробом через риску, наприклад «7/2».',
        vyraz: `$${tsila}${tdrib(ost, d)} =$`,
        vidpovid: `${n}/${d}`,
        pidkazka: `Ціла частина ${tsila} — це ${tsila * d}/${d}. Додай ще ${ost}/${d}.`,
        rozviazok: `${tsila} · ${d} + ${ost} = ${n}, тож $${tsila}${tdrib(ost, d)} = ${tdrib(n, d)}$.`,
      };
}

function porivniannia(r: Vypadok): TrenZavdannia {
  const d = r.chyslo(3, 9);
  const tsila = r.chyslo(1, 5);
  const a = { t: tsila, o: r.chyslo(1, d - 1) };
  const b = r.shans() ? { t: tsila - 1 >= 1 ? tsila - 1 : tsila + 1, o: r.chyslo(1, d - 1) } : { t: tsila, o: r.krim(1, d - 1, [a.o]) };
  const va = a.t * d + a.o;
  const vb = b.t * d + b.o;
  const zapA = `${a.t} ${a.o}/${d}`;
  const zapB = `${b.t} ${b.o}/${d}`;
  return {
    pytannia: `Яке число більше: $${a.t}${tdrib(a.o, d)}$ чи $${b.t}${tdrib(b.o, d)}$?`,
    vidpovid: va > vb ? zapA : zapB,
    varianty: [zapA, zapB],
    pidkazka: 'Спершу порівняй цілі частини. Якщо вони рівні — дробові.',
    rozviazok:
      a.t !== b.t
        ? `Ціла частина ${Math.max(a.t, b.t)} більша за ${Math.min(a.t, b.t)} — дробові вже не важливі.`
        : `Цілі однакові, а ${Math.max(a.o, b.o)}/${d} > ${Math.min(a.o, b.o)}/${d}.`,
  };
}

export default {
  rivni: ['правильний чи неправильний', 'виділяємо цілу частину', 'у неправильний дріб і порівняння'],
  zavdannia(r, riven) {
    if (riven === 1) return r.shans(0.6) ? vyd(r) : tsilaChastyna(r, 3);
    if (riven === 2) return r.shans(0.7) ? tsilaChastyna(r, 9) : uNepravylnyi(r, 4);
    return r.vybir([() => uNepravylnyi(r, 9), () => uNepravylnyi(r, 9), () => porivniannia(r), () => tsilaChastyna(r, 12)])();
  },
} satisfies Henerator;
