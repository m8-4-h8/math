// Дріб від числа: ділимо на знаменник (одна частина), множимо на чисельник. Задачі «скільки лишилося».
import { mnozh, nsd, osoba, rid, tdrib, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

function drib(r: Vypadok, maxD: number, odynychnyi = false) {
  const d = r.chyslo(2, maxD);
  let n = odynychnyi ? 1 : r.chyslo(1, d - 1);
  while (nsd(n, d) !== 1) n = r.chyslo(1, d - 1);
  return { n, d };
}

function vidChysla(r: Vypadok, maxD: number, maxChastyna: number, odynychnyi = false): TrenZavdannia {
  const { n, d } = drib(r, maxD, odynychnyi);
  const chastyna = r.chyslo(2, maxChastyna);
  const chyslo = d * chastyna;
  return {
    pytannia: `Знайди $${tdrib(n, d)}$ від ${chyslo}.`,
    vidpovid: n * chastyna,
    pidkazka: n === 1 ? `Поділи ${chyslo} на ${d}.` : `Спершу одна частина: ${chyslo} : ${d}. Потім візьми ${n} таких частин.`,
    rozviazok: n === 1 ? `${chyslo} : ${d} = ${chastyna}` : `${chyslo} : ${d} · ${n} = ${chastyna} · ${n} = ${n * chastyna}`,
  };
}

const SIUZHETY = [
  { tsile: (x: number) => `У книжці ${x} ${mnozh(x, 'сторінка', 'сторінки', 'сторінок')}.`, diia: (o: ReturnType<typeof osoba>, dr: string) => `${o.imia} ${rid(o, 'прочитав', 'прочитала')} ${dr} книжки.`, pytannia: 'Скільки сторінок', lyshylos: 'Скільки сторінок лишилося прочитати?' },
  { tsile: (x: number) => `На полиці ${x} ${mnozh(x, 'книжка', 'книжки', 'книжок')}.`, diia: (_: ReturnType<typeof osoba>, dr: string) => `${dr} з них — казки.`, pytannia: 'Скільки на полиці казок?', lyshylos: 'Скільки на полиці інших книжок?' },
  { tsile: (x: number) => `Шлях від дому до табору — ${x} км.`, diia: (_: ReturnType<typeof osoba>, dr: string) => `Автобус уже проїхав ${dr} шляху.`, pytannia: 'Скільки кілометрів проїхав автобус?', lyshylos: 'Скільки кілометрів ще лишилося їхати?' },
  { tsile: (x: number) => `У класі ${x} ${mnozh(x, 'учень', 'учні', 'учнів')}.`, diia: (_: ReturnType<typeof osoba>, dr: string) => `${dr} з них — дівчата.`, pytannia: 'Скільки в класі дівчат?', lyshylos: 'Скільки в класі хлопців?' },
];

function zadacha(r: Vypadok, lyshylos: boolean): TrenZavdannia {
  const s = r.vybir(SIUZHETY);
  const { n, d } = drib(r, 6);
  const chastyna = r.chyslo(s === SIUZHETY[3] ? 3 : 4, s === SIUZHETY[3] ? 6 : 30);
  const tsile = d * chastyna;
  const o = osoba(r);
  const vziato = n * chastyna;
  const diia = s.diia(o, `$${tdrib(n, d)}$`);
  const pytannia = lyshylos ? s.lyshylos : s.pytannia.endsWith('?') ? s.pytannia : `${s.pytannia} ${rid(o, 'прочитав', 'прочитала')} ${o.imia}?`;
  return {
    pytannia: `${s.tsile(tsile)} ${diia} ${pytannia}`,
    vidpovid: lyshylos ? tsile - vziato : vziato,
    pidkazka: lyshylos ? `Спершу знайди $${tdrib(n, d)}$ від ${tsile}, а потім відніми від усього.` : `Одна частина: ${tsile} : ${d}.`,
    rozviazok: lyshylos
      ? `1) ${tsile} : ${d} · ${n} = ${vziato}; 2) ${tsile} − ${vziato} = ${tsile - vziato}.`
      : `${tsile} : ${d} · ${n} = ${vziato}`,
  };
}

export default {
  rivni: ['одна частина: 1/3 від числа', 'кілька частин: 3/7 від числа', 'задачі: скільки взяли і скільки лишилося'],
  zavdannia(r, riven) {
    if (riven === 1) return vidChysla(r, 10, 12, true);
    if (riven === 2) return r.shans(0.7) ? vidChysla(r, 10, 15) : zadacha(r, false);
    return r.vybir([() => zadacha(r, true), () => zadacha(r, true), () => zadacha(r, false), () => vidChysla(r, 12, 25)])();
  },
} satisfies Henerator;
