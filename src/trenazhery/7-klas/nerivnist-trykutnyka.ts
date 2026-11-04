// Нерівність трикутника: чи існує трикутник із трьох сторін (і пастка «сума дорівнює найбільшій»), найбільше й найменше
// ціле значення третьої сторони, яка сторона можлива, скільки цілих значень, периметр рівнобедреного трикутника.
import type { Henerator, Vypadok, TrenZavdannia } from '../dopomoha.ts';

const TN = ['Так', 'Ні'];

function chyIsnuie(r: Vypadok): TrenZavdannia {
  // 0 — існує, 1 — сума дорівнює найбільшій (пастка), 2 — сума менша.
  const typ = r.vybir([0, 0, 1, 2]);
  const a = r.chyslo(2, 12);
  const b = r.krim(2, 14, [a]);
  const s = a + b;
  const c = typ === 0 ? r.chyslo(Math.max(a, b) + 1, s - 1) : typ === 1 ? s : s + r.chyslo(1, 6);
  const storony = r.peremishaty([a, b, c]);
  const palychky = r.shans();
  const vidp = typ === 0 ? 'Так' : 'Ні';
  const vysnovok =
    typ === 0
      ? `${c} < ${s} — трикутник існує.`
      : typ === 1
        ? `Сума дорівнює найбільшій стороні — сторони лягли б на одну пряму, трикутника немає.`
        : `${c} > ${s} — дві менші сторони не дістануть одна до одної, трикутника немає.`;
  return {
    pytannia: palychky
      ? `Чи можна скласти трикутник з паличок завдовжки ${storony[0]} см, ${storony[1]} см і ${storony[2]} см?`
      : `Чи існує трикутник зі сторонами ${storony[0]} см, ${storony[1]} см і ${storony[2]} см?`,
    vidpovid: vidp,
    varianty: TN,
    pidkazka: 'Порівняй найбільшу сторону із сумою двох інших.',
    rozviazok: `Найбільша сторона ${c} см, сума двох інших ${a} + ${b} = ${s} см. ${vysnovok}`,
  };
}

/** Дві різні сторони. */
function dviStorony(r: Vypadok) {
  const a = r.chyslo(2, 15);
  const b = r.krim(3, 20, [a]);
  return [Math.min(a, b), Math.max(a, b)];
}

function naibilsha(r: Vypadok): TrenZavdannia {
  const [a, b] = dviStorony(r);
  return {
    pytannia: `Дві сторони трикутника — ${a} см і ${b} см. Яке найбільше ціле число сантиметрів може мати третя сторона?`,
    vidpovid: a + b - 1,
    odynytsi: 'см',
    pidkazka: `Третя сторона менша від суми ${a} + ${b}.`,
    rozviazok: `Третя сторона менша від ${a} + ${b} = ${a + b} см, тож найбільше ціле значення — ${a + b - 1} см.`,
  };
}

function naimensha(r: Vypadok): TrenZavdannia {
  const [a, b] = dviStorony(r);
  return {
    pytannia: `Дві сторони трикутника — ${a} см і ${b} см. Яке найменше ціле число сантиметрів може мати третя сторона?`,
    vidpovid: b - a + 1,
    odynytsi: 'см',
    pidkazka: `Сторона ${b} см має бути меншою від суми ${a} см і третьої сторони.`,
    rozviazok: `Потрібно ${b} < ${a} + x, тобто третя сторона більша за ${b} − ${a} = ${b - a} см. Найменше ціле значення — ${b - a + 1} см.`,
  };
}

function yakaMozhe(r: Vypadok): TrenZavdannia {
  let a: number;
  let b: number;
  do [a, b] = dviStorony(r);
  while (b - a < 2 || a < 3);
  const [d, s] = [b - a, a + b];
  const dobra = r.chyslo(d + 1, s - 1);
  // Погані варіанти: різниця, сума, менше за різницю, більше за суму.
  const pohani = r.peremishaty([d, s, ...(d > 1 ? [r.chyslo(1, d - 1)] : []), s + r.chyslo(1, 5)]).slice(0, 3);
  const varianty = [dobra, ...pohani].sort((x, y) => x - y).map((x) => `${x} см`);
  return {
    pytannia: `Дві сторони трикутника — ${a} см і ${b} см. Якою може бути третя сторона?`,
    vidpovid: `${dobra} см`,
    varianty,
    pidkazka: `Третя сторона більша за ${b} − ${a} і менша від ${b} + ${a}.`,
    rozviazok: `Третя сторона більша за ${b} − ${a} = ${d} см і менша від ${b} + ${a} = ${s} см. З варіантів підходить лише ${dobra} см.`,
  };
}

function skilkyTsilykh(r: Vypadok): TrenZavdannia {
  const [a, b] = dviStorony(r);
  const [d, s] = [b - a, a + b];
  return {
    pytannia: `Дві сторони трикутника — ${a} см і ${b} см. Скільки цілих значень (у сантиметрах) може мати третя сторона?`,
    vidpovid: s - d - 1,
    pidkazka: 'Знайди найменше й найбільше ціле значення третьої сторони.',
    rozviazok: `Третя сторона більша за ${b} − ${a} = ${d} і менша від ${a} + ${b} = ${s}. Цілі значення від ${d + 1} до ${s - 1}: їх ${s - 1} − ${d} = ${s - d - 1}.`,
  };
}

function rivnobedrenyi(r: Vypadok): TrenZavdannia {
  // Сторони p і q, 2p ≤ q: бічні можуть бути лише по q.
  const p = r.chyslo(2, 10);
  const q = r.chyslo(2 * p, 2 * p + 12);
  const [x, y] = r.shans() ? [p, q] : [q, p];
  return {
    pytannia: `Дві сторони рівнобедреного трикутника — ${x} см і ${y} см. Знайди його периметр.`,
    vidpovid: 2 * q + p,
    odynytsi: 'см',
    pidkazka: `Які сторони бічні: по ${p} чи по ${q}? Перевір нерівність трикутника.`,
    rozviazok: `Бічні по ${p} не можуть бути: ${p} + ${p} = ${2 * p} — не більше за ${q}. Отже, бічні по ${q}, основа ${p}: ${q} + ${q} + ${p} = ${2 * q + p} см.`,
  };
}

function perymetr(r: Vypadok): TrenZavdannia {
  const [a, b] = dviStorony(r);
  const naib = r.shans();
  const c = naib ? a + b - 1 : b - a + 1;
  return {
    pytannia: `Дві сторони трикутника — ${a} см і ${b} см, третя виражається цілим числом сантиметрів. Яким може бути ${naib ? 'найбільший' : 'найменший'} периметр трикутника?`,
    vidpovid: a + b + c,
    odynytsi: 'см',
    pidkazka: naib ? `Спершу знайди найбільшу можливу третю сторону: вона менша від ${a} + ${b}.` : `Спершу знайди найменшу можливу третю сторону: вона більша за ${b} − ${a}.`,
    rozviazok: naib
      ? `Третя сторона менша від ${a} + ${b} = ${a + b} см, найбільша ціла — ${c} см. Периметр ${a} + ${b} + ${c} = ${a + b + c} см.`
      : `Третя сторона більша за ${b} − ${a} = ${b - a} см, найменша ціла — ${c} см. Периметр ${a} + ${b} + ${c} = ${a + b + c} см.`,
  };
}

export default {
  rivni: ['чи існує трикутник', 'третя сторона', 'задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return chyIsnuie(r);
    if (riven === 2) return r.vybir([naibilsha, naimensha, yakaMozhe, chyIsnuie])(r);
    return r.vybir([rivnobedrenyi, rivnobedrenyi, skilkyTsilykh, perymetr, yakaMozhe])(r);
  },
} satisfies Henerator;
