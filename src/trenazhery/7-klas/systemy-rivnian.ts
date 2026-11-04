// Системи лінійних рівнянь: розв’язок системи — пара, що задовольняє ОБИДВА рівняння; кількість розв’язків
// (прямі перетинаються — один, паралельні — жодного, збігаються — безліч); найпростіші системи x ± y.
import { ch, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';
import { tvd, tz } from '../alhebra.ts';
import { cherez, odyn, rivniannia, systema, type Rivniannia } from '../systemy.ts';

function chyRozviazok(r: Vypadok): TrenZavdannia {
  const [x, y] = [r.chyslo(-5, 6), r.chyslo(-5, 6)];
  const r1 = cherez(r, x, y, 3, 3);
  let r2 = cherez(r, x, y, 4, 4);
  while (!odyn(r1, r2)) r2 = cherez(r, x, y, 4, 4);
  const tak = r.shans();
  // «Ні»: пара задовольняє перше рівняння, але не друге.
  const [px, py] = tak ? [x, y] : [x + r1.b, y - r1.a];
  const liva2 = r2.a * px + r2.b * py;
  if (!tak && liva2 === r2.c) return chyRozviazok(r);
  return {
    pytannia: `Чи є пара $(${tz(px)};\\, ${tz(py)})$ розв’язком системи $${systema(r1, r2)}$?`,
    vidpovid: tak ? 'так' : 'ні',
    varianty: ['так', 'ні'],
    pidkazka: 'Підстав у КОЖНЕ рівняння.',
    rozviazok: `Перше: ${ch(r1.a)} · ${tvd(px)} + ${tvd(r1.b)} · ${tvd(py)} = ${ch(r1.c)} ✓. Друге: ${ch(r2.a)} · ${tvd(px)} + ${tvd(r2.b)} · ${tvd(py)} = ${ch(liva2)}${
      tak ? ' ✓ — розв’язок.' : ` ≠ ${ch(r2.c)} — не розв’язок системи.`
    }`,
  };
}

function kilkist(r: Vypadok): TrenZavdannia {
  const r1 = cherez(r, r.chyslo(-4, 4), r.chyslo(-4, 4), 4, 4);
  const typ = r.chyslo(0, 2);
  const k = r.krim(-3, 3, [0, 1]);
  let r2: Rivniannia;
  if (typ === 0) {
    r2 = cherez(r, 1, 1, 5, 5);
    while (!odyn(r1, r2)) r2 = cherez(r, 1, 1, 5, 5);
  } else if (typ === 1) r2 = { a: r1.a * k, b: r1.b * k, c: r1.c * k };
  else r2 = { a: r1.a * k, b: r1.b * k, c: r1.c * k + r.krim(-5, 5, [0]) };
  const v = ['один', 'безліч', 'жодного'][typ];
  return {
    pytannia: `Скільки розв’язків має система $${systema(r1, r2)}$?`,
    vidpovid: v,
    varianty: ['один', 'жодного', 'безліч'],
    pidkazka: 'Чи пропорційні коефіцієнти при x і при y? А вільні члени?',
    rozviazok:
      typ === 0
        ? 'Коефіцієнти при x і y не пропорційні — прямі перетинаються в одній точці: один розв’язок.'
        : typ === 1
          ? `Друге рівняння — це перше, помножене на ${ch(k)}: прямі збігаються, розв’язків безліч.`
          : `Ліві частини пропорційні (множник ${ch(k)}), а праві — ні: прямі паралельні, розв’язків немає.`,
  };
}

function sumaRiznytsia(r: Vypadok): TrenZavdannia {
  const [x, y] = [r.chyslo(-6, 12), r.chyslo(-6, 9)];
  const shukaiemoX = r.shans();
  return {
    pytannia: `Знайди $${shukaiemoX ? 'x' : 'y'}$ у розв’язку системи $${systema({ a: 1, b: -1, c: x - y }, { a: 1, b: 1, c: x + y })}$.`,
    vidpovid: ch(shukaiemoX ? x : y),
    nevidome: shukaiemoX ? '$x$' : '$y$',
    pidkazka: shukaiemoX ? 'Додай рівняння: y зникне.' : 'Відніми перше рівняння від другого: x зникне.',
    rozviazok: shukaiemoX
      ? `2x = ${tvd(x - y)} + ${tvd(x + y)} = ${ch(2 * x)}; x = ${ch(x)}`
      : `2y = ${tvd(x + y)} − ${tvd(x - y)} = ${ch(2 * y)}; y = ${ch(y)}`,
  };
}

export default {
  rivni: ['чи є пара розв’язком', 'скільки розв’язків', 'знайди розв’язок'],
  zavdannia(r, riven) {
    if (riven === 1) return chyRozviazok(r);
    if (riven === 2) return r.shans(0.7) ? kilkist(r) : chyRozviazok(r);
    return r.vybir([sumaRiznytsia, sumaRiznytsia, kilkist])(r);
  },
} satisfies Henerator;
