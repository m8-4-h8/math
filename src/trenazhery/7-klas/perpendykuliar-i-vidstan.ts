// Відстань від точки до прямої — довжина перпендикуляра, він коротший за будь-яку похилу.
// Відстань до осей координат і до прямих y = c, x = c; пастки (похила, від'ємна координата); задачі.
import { ch, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

function doOsi(r: Vypadok, zMinusom: boolean): TrenZavdannia {
  const znak = () => (zMinusom ? r.vybir([-1, 1]) : 1);
  const x = r.chyslo(1, 12) * znak();
  const y = r.chyslo(1, 12) * znak();
  const visX = r.shans();
  const vidp = visX ? Math.abs(y) : Math.abs(x);
  const osnova = visX ? `(${ch(x)}; 0)` : `(0; ${ch(y)})`;
  return {
    pytannia: `Знайди відстань від точки A(${ch(x)}; ${ch(y)}) до осі ${visX ? 'x' : 'y'}.`,
    vidpovid: vidp,
    pidkazka: `Перпендикуляр до осі ${visX ? 'x — вертикальний' : 'y — горизонтальний'} відрізок до точки ${osnova}.`,
    rozviazok: `Перпендикуляр з A до осі ${visX ? 'x' : 'y'} закінчується в точці ${osnova}, його довжина ${vidp}${
      (visX ? y : x) < 0 ? ' (відстань не буває від\'ємною)' : ''
    }.`,
  };
}

function pokhyla(r: Vypadok): TrenZavdannia {
  const h = r.chyslo(3, 15);
  const bilsha = h + r.chyslo(1, 6);
  const mensha = h - r.chyslo(1, Math.min(2, h - 1));
  return {
    pytannia: `З точки до прямої провели перпендикуляр завдовжки ${h} см і похилу. Якою може бути довжина похилої?`,
    vidpovid: `${bilsha} см`,
    varianty: r.peremishaty([`${mensha} см`, `${h} см`, `${bilsha} см`]),
    pidkazka: 'Перпендикуляр коротший за будь-яку похилу.',
    rozviazok: `Похила довша за перпендикуляр, тож лише ${bilsha} см.`,
  };
}

function yakyiVidrizok(r: Vypadok): TrenZavdannia {
  // Перпендикуляр і похилі задано числами: відстань — це довжина перпендикуляра, а не найбільше чи перше число.
  const h = r.chyslo(3, 20);
  const p1 = h + r.chyslo(1, 9);
  const p2 = p1 + r.chyslo(1, 9);
  const [n1, n2] = r.peremishaty(['AB', 'AC']);
  const vidrizky = r.peremishaty([`${n1} = ${p1} см`, `${n2} = ${p2} см`, `AH = ${h} см`]);
  return {
    pytannia: `З точки A до прямої a провели перпендикуляр AH і похилі AB та AC: ${vidrizky.join(', ')}. Чому дорівнює відстань від точки A до прямої a?`,
    vidpovid: h,
    odynytsi: 'см',
    pidkazka: 'Відстань від точки до прямої — довжина перпендикуляра.',
    rozviazok: `Перпендикуляр — AH, тож відстань ${h} см. Похилі ${p1} см і ${p2} см довші.`,
  };
}

function doPriamoi(r: Vypadok): TrenZavdannia {
  // Відстань до прямої y = c (горизонтальної) або x = c (вертикальної).
  const horyz = r.shans();
  const x = r.krim(-9, 9, [0]);
  const y = r.krim(-9, 9, [0]);
  const c = r.krim(-6, 6, [0, horyz ? y : x]);
  const v = horyz ? y : x;
  const d = Math.abs(v - c);
  const [b, m] = v > c ? [v, c] : [c, v];
  return {
    pytannia: `Знайди відстань від точки A(${ch(x)}; ${ch(y)}) до прямої ${horyz ? 'y' : 'x'} = ${ch(c)}.`,
    vidpovid: d,
    pidkazka: `Пряма ${horyz ? 'y' : 'x'} = ${ch(c)} ${horyz ? 'горизонтальна, перпендикуляр до неї вертикальний' : 'вертикальна, перпендикуляр до неї горизонтальний'}.`,
    rozviazok: `Перпендикуляр іде від A до точки ${horyz ? `(${ch(x)}; ${ch(c)})` : `(${ch(c)}; ${ch(y)})`}, його довжина ${ch(b)} − ${m < 0 ? `(${ch(m)})` : ch(m)} = ${d}`,
  };
}

function dvaBoky(r: Vypadok): TrenZavdannia {
  const p = r.chyslo(2, 15);
  const q = r.krim(1, 15, [p]);
  const rizni = r.shans();
  const vidp = rizni ? p + q : Math.abs(p - q);
  return {
    pytannia: `Відрізок AB перпендикулярний до прямої a${rizni ? ' і перетинає її' : ', точки A і B лежать по один бік від неї'}. Відстань від A до a — ${p} см, від B до a — ${q} см. Знайди довжину AB.`,
    vidpovid: vidp,
    odynytsi: 'см',
    pidkazka: rizni ? 'Пряма ділить AB на два перпендикуляри.' : 'A і B лежать на одному перпендикулярі по один бік від прямої.',
    rozviazok: rizni ? `${p} + ${q} = ${vidp} см` : `${Math.max(p, q)} − ${Math.min(p, q)} = ${vidp} см`,
  };
}

function koordynaty(r: Vypadok): TrenZavdannia {
  // Точку задано відстанями до осей і чвертю — знайти координати.
  const dx = r.chyslo(1, 9);
  const dy = r.chyslo(1, 9);
  const pravoruch = r.shans();
  const vyshche = r.shans();
  const x = pravoruch ? dx : -dx;
  const y = vyshche ? dy : -dy;
  const para = `(${ch(x)}; ${ch(y)})`;
  return {
    pytannia: `Точка A лежить ${vyshche ? 'вище' : 'нижче'} осі x на відстані ${dy} від неї і ${pravoruch ? 'праворуч' : 'ліворуч'} від осі y на відстані ${dx}. Запиши координати точки A.`,
    vidpovid: para,
    pidkazka: `Відстань до осі y — це |x|, до осі x — |y|. ${pravoruch ? 'Праворуч' : 'Ліворуч'} від осі y — x ${pravoruch ? 'додатний' : 'від\'ємний'}.`,
    rozviazok: `x = ${ch(x)}, y = ${ch(y)}, тобто A${para}.`,
  };
}

export default {
  rivni: ['відстань до осей', 'з підступом', 'задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([(v: Vypadok) => doOsi(v, false), yakyiVidrizok])(r);
    if (riven === 2) return r.vybir([(v: Vypadok) => doOsi(v, true), pokhyla, yakyiVidrizok])(r);
    return r.vybir([doPriamoi, dvaBoky, koordynaty])(r);
  },
} satisfies Henerator;
