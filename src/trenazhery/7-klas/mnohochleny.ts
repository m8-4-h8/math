// Многочлени: степінь многочлена — найбільший степінь його членів; зведення подібних; додавання й віднімання
// (мінус перед дужками змінює знаки всіх членів); значення многочлена.
import { ch, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';
import { suma, tex, tvd, tz, znachennia, type Mnohochlen } from '../alhebra.ts';

const BUKVY = ['x', 'y', 'a', 'b', 'm'];

function vypadkovyi(r: Vypadok, stepin: number, max = 9): Mnohochlen {
  const p = Array.from({ length: stepin + 1 }, () => (r.shans(0.8) ? r.krim(-max, max, [0]) : 0));
  if (!p[stepin]) p[stepin] = r.krim(-max, max, [0]);
  if (p.filter(Boolean).length < 2) p[0] = r.krim(-max, max, [0]);
  return p;
}

function stepinMn(r: Vypadok): TrenZavdannia {
  const x = r.vybir(BUKVY);
  const n = r.chyslo(2, 6);
  const p = vypadkovyi(r, n);
  // Члени не за порядком, щоб степінь треба було шукати.
  const chleny = r.peremishaty(p.map((k, i) => [k, i] as const).filter(([k]) => k));
  const zapys = chleny
    .map(([k, i], j) => {
      const t = tex([...Array(i).fill(0), Math.abs(k)], x);
      return j === 0 ? (k < 0 ? `-${t}` : t) : k < 0 ? `- ${t}` : `+ ${t}`;
    })
    .join(' ');
  return {
    pytannia: `Який степінь многочлена $${zapys}$?`,
    vidpovid: n,
    pidkazka: 'Знайди член з найбільшим показником.',
    rozviazok: `Найбільший показник — ${n}.`,
  };
}

function podibni(r: Vypadok): TrenZavdannia {
  const [a, b] = r.rizni(2, 0, BUKVY.length - 1).map((i) => BUKVY[i]);
  const [k1, k2, k3, k4] = [r.chyslo(1, 9), r.krim(-9, 9, [0]), r.krim(-9, 9, [0]), r.krim(-9, 9, [0])];
  const znak = (k: number, t: string) => (k < 0 ? ` - ${Math.abs(k) === 1 ? '' : -k}${t}` : ` + ${k === 1 ? '' : k}${t}`);
  const zapys = `${k1 === 1 ? '' : k1}${a}${znak(k2, b)}${znak(k3, a)}${znak(k4, b)}`;
  const zaA = r.shans();
  const s = zaA ? k1 + k3 : k2 + k4;
  return {
    pytannia: `Спрости $${zapys}$. Який коефіцієнт при $${zaA ? a : b}$?`,
    vidpovid: ch(s),
    pidkazka: `Подібні до ${zaA ? a : b} — члени з тією самою буквою. Додай їхні коефіцієнти зі знаками.`,
    rozviazok: zaA ? `${k1} + ${tvd(k3)} = ${ch(s)}` : `${ch(k2)} + ${tvd(k4)} = ${ch(s)}`,
  };
}

function sumaRiznytsia(r: Vypadok): TrenZavdannia {
  const x = r.vybir(BUKVY);
  const [p, q] = [vypadkovyi(r, 2), vypadkovyi(r, 2)];
  p[2] = p[2] || 1;
  q[2] = q[2] || 1;
  const minus = r.shans();
  const rez = suma(p, q, minus ? -1 : 1);
  const st = r.vybir([0, 1, 2].filter((i) => rez[i] !== 0).length ? [0, 1, 2] : [0]);
  const nazva = st === 0 ? 'Яке число (вільний член)' : `Який коефіцієнт при $${st === 1 ? x : `${x}^2`}$`;
  return {
    pytannia: `$(${tex(p, x)}) ${minus ? '-' : '+'} (${tex(q, x)})$. ${nazva} вийде у відповіді?`,
    vidpovid: ch(rez[st]),
    pidkazka: minus ? 'Мінус перед дужками змінює знаки всіх членів другого многочлена.' : 'Додай коефіцієнти подібних членів.',
    rozviazok: `${ch(p[st])} ${minus ? '−' : '+'} ${tvd(q[st])} = ${ch(rez[st])}; уся відповідь: $${tex(rez, x)}$.`,
  };
}

function znachenniaMn(r: Vypadok): TrenZavdannia {
  const x = r.vybir(BUKVY);
  const p = vypadkovyi(r, 2, 6);
  const q = vypadkovyi(r, 2, 6);
  const n = r.krim(-4, 4, [0]);
  const rez = suma(p, q, -1);
  const v = znachennia(rez, n);
  return {
    pytannia: `Спрости вираз $(${tex(p, x)}) - (${tex(q, x)})$ і знайди його значення при $${x} = ${tz(n)}$.`,
    vidpovid: ch(v),
    pidkazka: `Спершу спрости: вийде $${tex(rez, x)}$.`,
    rozviazok: `$${tex(rez, x)}$; при ${x} = ${ch(n)}: ${ch(rez[2])} · ${tvd(n * n)} + ${tvd(rez[1])} · ${tvd(n)} + ${tvd(rez[0])} = ${ch(v)}`,
  };
}

export default {
  rivni: ['степінь многочлена і подібні члени', 'додаємо й віднімаємо многочлени', 'спрости і знайди значення'],
  zavdannia(r, riven) {
    if (riven === 1) return r.shans() ? stepinMn(r) : podibni(r);
    if (riven === 2) return r.shans(0.75) ? sumaRiznytsia(r) : podibni(r);
    return r.shans(0.7) ? znachenniaMn(r) : sumaRiznytsia(r);
  },
} satisfies Henerator;
