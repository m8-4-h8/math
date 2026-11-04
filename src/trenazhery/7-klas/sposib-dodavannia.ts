// Спосіб додавання: коефіцієнти при одній змінній протилежні — додаємо рівняння, однакові — віднімаємо;
// якщо ні — множимо одне (або обидва) рівняння на число, і праву частину теж.
import { ch, nsk, ZRAZKY, zrazok, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';
import { tvd } from '../alhebra.ts';
import { cherez, para, systema, type Rivniannia } from '../systemy.ts';

function protylezhni(r: Vypadok): TrenZavdannia {
  const [x, y] = [r.krim(-6, 8, [0]), r.krim(-6, 8, [0])];
  const zaY = r.shans();
  const k = r.chyslo(1, 4);
  const [a1, a2] = [r.krim(-5, 5, [0]), r.krim(-5, 5, [0])];
  let r1: Rivniannia, r2: Rivniannia;
  if (zaY) {
    r1 = { a: a1, b: k, c: a1 * x + k * y };
    r2 = { a: a2, b: -k, c: a2 * x - k * y };
    if (a1 + a2 === 0) return protylezhni(r);
  } else {
    r1 = { a: k, b: a1, c: k * x + a1 * y };
    r2 = { a: -k, b: a2, c: -k * x + a2 * y };
    if (a1 + a2 === 0) return protylezhni(r);
  }
  const shukane = zaY ? 'x' : 'y';
  const sumaK = a1 + a2;
  return {
    pytannia: `Знайди $${shukane}$: $${systema(r1, r2)}$`,
    vidpovid: ch(zaY ? x : y),
    nevidome: `$${shukane}$`,
    pidkazka: `Коефіцієнти при ${zaY ? 'y' : 'x'} протилежні — просто додай рівняння.`,
    rozviazok: `${ch(sumaK)}${shukane} = ${ch(r1.c)} + ${tvd(r2.c)} = ${ch(r1.c + r2.c)}; ${shukane} = ${ch(r1.c + r2.c)} : ${tvd(sumaK)} = ${ch(zaY ? x : y)}`,
  };
}

function dodatyChyVidniaty(r: Vypadok): TrenZavdannia {
  const [x, y] = [r.chyslo(-5, 6), r.chyslo(-5, 6)];
  const k = r.krim(-5, 5, [0]);
  const dodaty = r.shans();
  const [a1, a2] = r.rizni(2, 1, 6);
  const r1 = { a: a1, b: k, c: a1 * x + k * y };
  const r2 = { a: a2, b: dodaty ? -k : k, c: a2 * x + (dodaty ? -k : k) * y };
  return {
    pytannia: `Щоб у системі $${systema(r1, r2)}$ зник $y$, рівняння треба…`,
    vidpovid: dodaty ? 'додати' : 'відняти',
    varianty: ['додати', 'відняти'],
    pidkazka: 'Порівняй коефіцієнти при y: вони протилежні чи однакові?',
    rozviazok: dodaty ? `${ch(k)}y і ${ch(-k)}y протилежні — додаємо.` : `Коефіцієнти при y однакові (${ch(k)}) — віднімаємо.`,
  };
}

function zMnozhenniam(r: Vypadok): TrenZavdannia {
  const [x, y] = [r.krim(-5, 6, [0]), r.krim(-5, 6, [0])];
  for (;;) {
    const r1 = cherez(r, x, y, 5, 5);
    const r2 = cherez(r, x, y, 5, 5);
    if (r1.a * r2.b - r1.b * r2.a === 0) continue;
    if (Math.abs(r1.b) === Math.abs(r2.b)) continue; // це вже попередній рівень
    const s = nsk(Math.abs(r1.b), Math.abs(r2.b));
    if (s > 20) continue;
    const m1 = s / Math.abs(r1.b);
    const m2 = s / Math.abs(r2.b);
    const pidkazka =
      m1 === 1
        ? `Помнож друге рівняння на ${m2} — і праву частину теж: коефіцієнти при y стануть ±${s}.`
        : m2 === 1
          ? `Помнож перше рівняння на ${m1} — і праву частину теж: коефіцієнти при y стануть ±${s}.`
          : `Помнож перше на ${m1}, друге на ${m2} — при y стануть ±${s}.`;
    return {
      pytannia: `Розв’яжи систему $${systema(r1, r2)}$. Відповідь запиши парою, наприклад ${zrazok(ZRAZKY.para, para(x, y))}.`,
      vidpovid: para(x, y),
      pidkazka,
      rozviazok: `${pidkazka} Потім додай або відніми рівняння: x = ${ch(x)}; підстав у перше: y = ${ch(y)}. Перевірка: ${ch(r2.a)} · ${tvd(x)} + ${tvd(r2.b)} · ${tvd(y)} = ${ch(r2.c)} ✓`,
    };
  }
}

export default {
  rivni: ['протилежні коефіцієнти', 'додати чи відняти', 'спершу множимо рівняння'],
  zavdannia(r, riven) {
    if (riven === 1) return protylezhni(r);
    if (riven === 2) return r.shans(0.6) ? protylezhni(r) : dodatyChyVidniaty(r);
    return r.shans(0.75) ? zMnozhenniam(r) : protylezhni(r);
  },
} satisfies Henerator;
