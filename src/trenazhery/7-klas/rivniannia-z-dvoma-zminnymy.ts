// Рівняння з двома змінними: розв’язок — пара (x; y), що перетворює рівняння на правильну рівність;
// розв’язків безліч (графік — пряма); знаходимо одну змінну, коли відома друга.
import { ch, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';
import { tvd, tz } from '../alhebra.ts';
import { cherez, rivniannia } from '../systemy.ts';

function chyRozviazok(r: Vypadok): TrenZavdannia {
  const [x, y] = [r.chyslo(-6, 6), r.chyslo(-6, 6)];
  const rv = cherez(r, x, y);
  const tak = r.shans();
  const [px, py] = tak ? [x, y] : r.shans() ? [x + r.vybir([-1, 1]), y] : [x, y + r.vybir([-1, 1, 2])];
  const liva = rv.a * px + rv.b * py;
  if (!tak && liva === rv.c) return chyRozviazok(r);
  return {
    pytannia: `Чи є пара $(${tz(px)};\\, ${tz(py)})$ розв’язком рівняння $${rivniannia(rv)}$?`,
    vidpovid: tak ? 'так' : 'ні',
    varianty: ['так', 'ні'],
    pidkazka: `Підстав x = ${ch(px)}, y = ${ch(py)} і порівняй з ${ch(rv.c)}.`,
    rozviazok: `${ch(rv.a)} · ${tvd(px)} + ${tvd(rv.b)} · ${tvd(py)} = ${ch(liva)}${tak ? ' — правильна рівність.' : ` ≠ ${ch(rv.c)} — не розв’язок.`}`,
  };
}

function znaityY(r: Vypadok, shukaiemoY: boolean): TrenZavdannia {
  const [x, y] = [r.krim(-6, 6, [0]), r.krim(-6, 6, [0])];
  const rv = cherez(r, x, y);
  const [vidome, vidomeZn, shukane, shukaneZn, kVid, kShuk] = shukaiemoY ? ['x', x, 'y', y, rv.a, rv.b] : ['y', y, 'x', x, rv.b, rv.a];
  return {
    pytannia: `$${rivniannia(rv)}$. Знайди $${shukane}$, якщо $${vidome} = ${tz(vidomeZn)}$.`,
    vidpovid: ch(shukaneZn),
    pidkazka: `Підстав ${vidome} = ${ch(vidomeZn)}: ${ch(kVid)} · ${tvd(vidomeZn)} + ${tvd(kShuk)}${shukane} = ${ch(rv.c)}.`,
    rozviazok: `${ch(kShuk)}${shukane} = ${ch(rv.c)} − ${tvd(kVid * vidomeZn)} = ${ch(rv.c - kVid * vidomeZn)}; ${shukane} = ${ch(rv.c - kVid * vidomeZn)} : ${tvd(kShuk)} = ${ch(shukaneZn)}`,
  };
}

function skilky(r: Vypadok): TrenZavdannia {
  const rv = cherez(r, r.chyslo(-5, 5), r.chyslo(-5, 5));
  return {
    pytannia: `Скільки розв’язків має рівняння $${rivniannia(rv)}$?`,
    vidpovid: 'безліч',
    varianty: ['один', 'два', 'безліч'],
    pidkazka: 'Візьми будь-яке x — чи знайдеться для нього y?',
    rozviazok: 'Для кожного x знаходиться своє y, тож розв’язків безліч — графік рівняння є прямою.',
  };
}

export default {
  rivni: ['чи є пара розв’язком', 'знайди y за x', 'знайди x за y'],
  zavdannia(r, riven) {
    if (riven === 1) return chyRozviazok(r);
    if (riven === 2) return r.shans(0.7) ? znaityY(r, true) : chyRozviazok(r);
    return r.vybir([(rr: Vypadok) => znaityY(rr, false), (rr: Vypadok) => znaityY(rr, false), (rr: Vypadok) => znaityY(rr, true), skilky])(r);
  },
} satisfies Henerator;
