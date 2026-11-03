// Множення многочленів: одночлен на многочлен — на кожен член; многочлен на многочлен — кожен член
// першого на кожен член другого, потім зводимо подібні; кількість добутків до зведення.
import { ch, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';
import { dobutok, tex, tvd, tz, znachennia, type Mnohochlen } from '../alhebra.ts';

const BUKVY = ['x', 'y', 'a', 'b'];

const pytannia = (st: number, x: string) =>
  st === 0 ? 'Яке число (вільний член) вийде у відповіді?' : `Який коефіцієнт при $${st === 1 ? x : `${x}^2`}$ у відповіді?`;

function odnochlenNaMn(r: Vypadok): TrenZavdannia {
  const x = r.vybir(BUKVY);
  const k = r.krim(-6, 6, [0, 1]);
  const zIksom = r.shans();
  const [a, b] = [r.krim(-7, 7, [0]), r.krim(-9, 9, [0])];
  const p: Mnohochlen = [b, a];
  const m: Mnohochlen = zIksom ? [0, k] : [k];
  const rez = dobutok(m, p);
  const st = zIksom ? r.vybir([1, 2]) : r.vybir([0, 1]);
  const [dzherelo] = zIksom ? [st === 2 ? a : b] : [st === 1 ? a : b];
  return {
    pytannia: `Розкрий дужки: $${tex(m, x)}(${tex(p, x)})$. ${pytannia(st, x)}`,
    vidpovid: ch(rez[st]),
    pidkazka: `Помнож ${tex(m, x).replace('-', '−')} на кожен член у дужках.`,
    rozviazok: `${ch(k)} · ${tvd(dzherelo)} = ${ch(rez[st])}; уся відповідь: $${tex(rez, x)}$.`,
  };
}

function dvaDvochleny(r: Vypadok, zKoef: boolean): TrenZavdannia {
  const x = r.vybir(BUKVY);
  const [a, c] = zKoef ? [r.krim(-4, 5, [0]), r.krim(-4, 5, [0])] : [1, 1];
  const [b, d] = [r.krim(-9, 9, [0]), r.krim(-9, 9, [0])];
  const [p, q]: Mnohochlen[] = [
    [b, a],
    [d, c],
  ];
  const rez = dobutok(p, q);
  const st = r.vybir(rez[1] === 0 ? [0, 2] : zKoef ? [0, 1, 1, 2] : [0, 1, 1]);
  const ch_ =
    st === 1
      ? `Середні добутки: ${tvd(a)}${x} · ${tvd(d)} і ${tvd(b)} · ${tvd(c)}${x}; ${ch(a * d)} + ${tvd(b * c)} = ${ch(rez[1])}`
      : st === 0
        ? `Вільний член — добуток чисел: ${tvd(b)} · ${tvd(d)} = ${ch(rez[0])}`
        : `Перші члени: ${tvd(a)} · ${tvd(c)} = ${ch(rez[2])}`;
  return {
    pytannia: `Перемнож: $(${tex(p, x)})(${tex(q, x)})$. ${pytannia(st, x)}`,
    vidpovid: ch(rez[st]),
    pidkazka: st === 1 ? 'Знайди два «середні» добутки і додай їх.' : st === 0 ? 'Вільний член — добуток двох чисел.' : 'Перемнож перші члени.',
    rozviazok: `${ch_}. Уся відповідь: $${tex(rez, x)}$.`,
  };
}

function kilkistDobutkiv(r: Vypadok): TrenZavdannia {
  const [m, n] = [r.chyslo(2, 4), r.chyslo(2, 4)];
  const BUK = ['a', 'b', 'c', 'd'];
  const ZM = ['x', 'y', 'z', 'k'];
  return {
    pytannia: `Скільки добутків вийде (до зведення подібних) у $(${BUK.slice(0, m).join(' + ')})(${ZM.slice(0, n).join(' + ')})$?`,
    vidpovid: m * n,
    pidkazka: `Кожен з ${m} членів множимо на кожен з ${n}.`,
    rozviazok: `${m} · ${n} = ${m * n}`,
  };
}

function znachenniaDobutku(r: Vypadok): TrenZavdannia {
  const x = r.vybir(BUKVY);
  const [b, d] = [r.krim(-6, 6, [0]), r.krim(-6, 6, [0])];
  const p: Mnohochlen = [b, 1];
  const q: Mnohochlen = [d, 1];
  const rez = dobutok(p, q);
  // (x + b)(x + d) − x² = (b + d)x + bd
  const bezKv: Mnohochlen = [rez[0], rez[1]];
  const n = r.krim(-5, 5, [0]);
  const v = znachennia(bezKv, n);
  return {
    pytannia: `Спрости вираз $(${tex(p, x)})(${tex(q, x)}) - ${x}^2$ і знайди його значення при $${x} = ${tz(n)}$.`,
    vidpovid: ch(v),
    pidkazka: `Спершу розкрий дужки: $${tex(rez, x)}$. Тоді ${x}² скоротиться.`,
    rozviazok: `$${tex(rez, x)} - ${x}^2 = ${tex(bezKv, x)}$; ${ch(bezKv[1])} · ${tvd(n)} + ${tvd(bezKv[0])} = ${ch(v)}`,
  };
}

export default {
  rivni: ['одночлен на многочлен', 'двочлен на двочлен', 'з коефіцієнтами і значення виразу'],
  zavdannia(r, riven) {
    if (riven === 1) return odnochlenNaMn(r);
    if (riven === 2) return r.vybir([(rr: Vypadok) => dvaDvochleny(rr, false), (rr: Vypadok) => dvaDvochleny(rr, false), kilkistDobutkiv])(r);
    return r.vybir([(rr: Vypadok) => dvaDvochleny(rr, true), (rr: Vypadok) => dvaDvochleny(rr, true), znachenniaDobutku])(r);
  },
} satisfies Henerator;
