// Спосіб підстановки: з одного рівняння виражаємо змінну (зручно там, де коефіцієнт 1 або −1) і
// підставляємо в друге — у дужках; знаходимо одну змінну, потім другу.
import { ch, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';
import { tex, tvd } from '../alhebra.ts';
import { cherez, para, rivniannia, systema } from '../systemy.ts';

function vyrazheno(r: Vypadok): TrenZavdannia {
  const [x, y] = [r.krim(-6, 8, [0]), r.krim(-6, 8, [0])];
  const k = r.krim(-4, 4, [0]);
  const m = y - k * x; // y = kx + m
  let r2 = cherez(r, x, y, 5, 4);
  while (r2.a + r2.b * k === 0) r2 = cherez(r, x, y, 5, 4);
  const pershe = `y = ${tex([m, k])}`;
  const shukaiemoX = r.shans(0.6);
  return {
    pytannia: `Знайди $${shukaiemoX ? 'x' : 'y'}$: $\\begin{cases} ${pershe} \\\\ ${rivniannia(r2)} \\end{cases}$`,
    vidpovid: ch(shukaiemoX ? x : y),
    pidkazka: `y уже виражено: підстав (${tex([m, k]).replace(/-/g, '−')}) замість y у друге рівняння.`,
    rozviazok: `${ch(r2.a)}x + ${tvd(r2.b)} · (${tex([m, k]).replace(/-/g, '−')}) = ${ch(r2.c)}; ${ch(r2.a + r2.b * k)}x = ${ch(r2.c - r2.b * m)}; x = ${ch(x)}${
      shukaiemoX ? '' : `; y = ${ch(k)} · ${tvd(x)} + ${tvd(m)} = ${ch(y)}`
    }.`,
  };
}

function vyrazyty(r: Vypadok, paroiu: boolean): TrenZavdannia {
  const [x, y] = [r.krim(-6, 8, [0]), r.krim(-6, 8, [0])];
  // Перше рівняння: x + by = c або ax + y = c (одиничний коефіцієнт), друге — довільне.
  const odynychnyiX = r.shans();
  const r1 = odynychnyiX ? { a: r.vybir([1, -1]), b: r.krim(-4, 4, [0]), c: 0 } : { a: r.krim(-4, 4, [0]), b: r.vybir([1, -1]), c: 0 };
  r1.c = r1.a * x + r1.b * y;
  let r2 = cherez(r, x, y, 5, 5);
  while (r1.a * r2.b - r1.b * r2.a === 0) r2 = cherez(r, x, y, 5, 5);
  const shukaiemoX = r.shans();
  const yak = odynychnyiX
    ? `З першого: x = ${r1.a === 1 ? '' : '−('}${ch(r1.c)} ${r1.b < 0 ? '+' : '−'} ${Math.abs(r1.b) === 1 ? '' : Math.abs(r1.b)}y${r1.a === 1 ? '' : ')'}`
    : `З першого: y = ${r1.b === 1 ? '' : '−('}${ch(r1.c)} ${r1.a < 0 ? '+' : '−'} ${Math.abs(r1.a) === 1 ? '' : Math.abs(r1.a)}x${r1.b === 1 ? '' : ')'}`;
  return {
    pytannia: paroiu
      ? `Розв’яжи систему $${systema(r1, r2)}$. Відповідь запиши парою, наприклад (5; 1).`
      : `Знайди $${shukaiemoX ? 'x' : 'y'}$: $${systema(r1, r2)}$`,
    vidpovid: paroiu ? para(x, y) : ch(shukaiemoX ? x : y),
    pidkazka: `${yak} — і підстав у друге рівняння.`,
    rozviazok: `${yak}. Після підстановки: ${odynychnyiX ? `y = ${ch(y)}, тоді x = ${ch(x)}` : `x = ${ch(x)}, тоді y = ${ch(y)}`}. Перевірка в другому: ${ch(r2.a)} · ${tvd(x)} + ${tvd(r2.b)} · ${tvd(y)} = ${ch(r2.c)} ✓`,
  };
}

export default {
  rivni: ['y уже виражено', 'вирази й підстав', 'розв’яжи систему повністю'],
  zavdannia(r, riven) {
    if (riven === 1) return vyrazheno(r);
    if (riven === 2) return r.shans(0.7) ? vyrazyty(r, false) : vyrazheno(r);
    return vyrazyty(r, r.shans(0.7));
  },
} satisfies Henerator;
