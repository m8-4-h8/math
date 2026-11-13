// Взаємно обернені числа (Істер § 11): обернене до дробу, натурального, мішаного і десяткового числа;
// чи є пара взаємно оберненою; рівняння a · x = 1; зручні обчислення (обернені множники дають 1).
import {
  nsd,
  skorotyty,
  tdes,
  tdrib,
  tvidpovidDrib,
  vidpovidDrib,
  rivnyiDrib,
  neskorotnyiChyselnyk,
  type Henerator,
  type Vypadok,
  type TrenZavdannia,
} from '../dopomoha.ts';

/** Число для завдання: як записати в TeX, як дріб p/q, і як пояснити перехід до дробу. */
interface Chyslo {
  zapys: string;
  p: number;
  q: number;
  yak?: string; // «2\frac{1}{3} = \frac{7}{3}» — якщо число спершу треба записати дробом
}

function drib(r: Vypadok): Chyslo {
  const q = r.chyslo(2, 15);
  const p = r.shans(0.75) ? neskorotnyiChyselnyk(r, q) : q + neskorotnyiChyselnyk(r, q);
  return { zapys: tdrib(p, q), p, q };
}

function naturalne(r: Vypadok): Chyslo {
  const n = r.chyslo(2, 25);
  return { zapys: String(n), p: n, q: 1, yak: `${n} = ${tdrib(n, 1)}` };
}

function mishane(r: Vypadok): Chyslo {
  const q = r.chyslo(2, 9);
  const a = neskorotnyiChyselnyk(r, q);
  const t = r.chyslo(1, 5);
  const p = t * q + a;
  return { zapys: `${t}${tdrib(a, q)}`, p, q, yak: `${t}${tdrib(a, q)} = ${tdrib(p, q)}` };
}

function desiatkove(r: Vypadok): Chyslo {
  for (;;) {
    const znakiv = r.shans(0.55) ? 1 : 2;
    const st = 10 ** znakiv;
    const c = r.chyslo(1, znakiv === 1 ? 35 : 260);
    if (c % 10 === 0) continue;
    const [p, q] = skorotyty(c, st);
    if (p > 20 || p === q) continue;
    const yak = nsd(c, st) > 1 ? `${tdes(c, znakiv)} = ${tdrib(c, st)} = ${tdrib(p, q)}` : `${tdes(c, znakiv)} = ${tdrib(p, q)}`;
    return { zapys: tdes(c, znakiv), p, q, yak };
  }
}

/** Дріб для формули; знаменник 1 — просто ціле. */
const td = (p: number, q: number) => (q === 1 ? String(p) : tdrib(p, q));

const vidpovid = (x: Chyslo) => ({
  vidpovid: vidpovidDrib(x.q, x.p),
  pokaz: `$${tvidpovidDrib(x.q, x.p)}$`,
  perevirka: rivnyiDrib(x.q, x.p),
});

function obernene(r: Vypadok, x: Chyslo): TrenZavdannia {
  return {
    pytannia: `Яке число обернене до $${x.zapys}$?`,
    ...vidpovid(x),
    pidkazka: x.yak ? `Спершу запиши число звичайним дробом: $${x.yak}$.` : 'Поміняй місцями чисельник і знаменник.',
    rozviazok: `${x.yak ? `$${x.yak}$; ` : ''}$${tdrib(x.p, x.q)} \\cdot ${tdrib(x.q, x.p)} = 1$, тож обернене — $${tvidpovidDrib(x.q, x.p)}$.`,
  };
}

/** Десятковий дріб p/q, якщо знаменник має лише множники 2 і 5: [ціле, знаків]. */
function yakDesiatkovyi(p: number, q: number): [number, number] | undefined {
  for (let k = 0; k <= 3; k++) if ((p * 10 ** k) % q === 0) return [(p * 10 ** k) / q, k];
  return undefined;
}

function chyPara(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(0, 3);
  let [x, y, xp, xq, yp, yq] = ['', '', 0, 1, 0, 1];
  if (typ <= 1) {
    // десяткові: 0,4 і 2,5 — так; 0,4 і 4 (перевернули цифри) — ні
    for (;;) {
      const [p, q] = r.rizni(2, 1, 25);
      if (nsd(p, q) !== 1) continue;
      const a = yakDesiatkovyi(p, q);
      const b = yakDesiatkovyi(q, p);
      if (!a || !b || a[1] === 0 || a[1] > 2 || b[1] > 3 || (typ === 1 && p > q)) continue;
      x = tdes(a[0], a[1]);
      [xp, xq] = [p, q];
      if (typ === 0) {
        y = tdes(b[0], b[1]);
        [yp, yq] = [q, p];
      } else {
        const tsyfry = a[0];
        y = String(tsyfry);
        [yp, yq] = [tsyfry, 1];
        if (tsyfry * p === q) continue; // випадково виявилось оберненим
      }
      break;
    }
  } else {
    const q = r.chyslo(2, 7);
    const a = neskorotnyiChyselnyk(r, q);
    const t = r.chyslo(1, 4);
    const p = t * q + a;
    x = `${t}${tdrib(a, q)}`;
    [xp, xq] = [p, q];
    if (typ === 2) {
      y = tdrib(q, p);
      [yp, yq] = [q, p];
    } else {
      // перевернули лише дробову частину: 2 1/3 і 3 (або 3/1)
      y = td(q, a);
      [yp, yq] = [q, a];
    }
  }
  const [dp, dq] = skorotyty(xp * yp, xq * yq);
  const tak = dp === 1 && dq === 1;
  return {
    pytannia: `Чи є взаємно оберненими числа $${x}$ і $${y}$?`,
    vidpovid: tak ? 'так' : 'ні',
    varianty: ['так', 'ні'],
    pidkazka: 'Перемнож їх: взаємно обернені дають у добутку 1.',
    rozviazok: `$${x} \\cdot ${y} = ${td(xp, xq)} \\cdot ${td(yp, yq)} =${tvidpovidDrib(dp, dq)}$ — ${tak ? 'так, добуток 1' : 'ні, добуток не 1'}.`,
  };
}

function rivniannia(r: Vypadok): TrenZavdannia {
  const x = r.vybir([drib, drib, naturalne, mishane, desiatkove])(r);
  const zliva = r.shans();
  return {
    pytannia: 'Розв\'яжи рівняння.',
    vyraz: zliva ? `$${x.zapys} \\cdot x = 1$` : `$x \\cdot ${x.zapys} = 1$`,
    ...vidpovid(x),
    pidkazka: 'Добуток дорівнює 1 — отже, x обернене до відомого множника.',
    rozviazok: `${x.yak && x.q !== 1 ? `$${x.yak}$; ` : ''}$x = ${tvidpovidDrib(x.q, x.p)}$, бо $${td(x.p, x.q)} \\cdot ${tdrib(x.q, x.p)} = 1$.`,
  };
}

function zruchno(r: Vypadok): TrenZavdannia {
  for (;;) {
    const [b, d] = r.rizni(2, 3, 12);
    const a = neskorotnyiChyselnyk(r, b);
    const c = neskorotnyiChyselnyk(r, d);
    if (a === c || nsd(b, d) === 1) continue; // не надто легко «в лоб»
    const t = Math.floor(b / a);
    const obernenyi = a === 1 ? String(b) : b % a !== 0 && r.shans(0.6) ? `${t}${tdrib(b % a, a)}` : tdrib(b, a);
    const mnozhnyky = r.peremishaty([tdrib(a, b), tdrib(c, d), obernenyi]);
    if (mnozhnyky[1] !== tdrib(c, d) && r.shans(0.5)) continue; // частіше обернені стоять не поруч
    return {
      pytannia: 'Обчисли зручним способом.',
      vyraz: `$${mnozhnyky.join(' \\cdot ')} =$`,
      vidpovid: vidpovidDrib(c, d),
      pokaz: `$${tdrib(c, d)}$`,
      perevirka: rivnyiDrib(c, d),
      pidkazka: `Знайди два взаємно обернені множники: їхній добуток дорівнює 1.`,
      rozviazok: `$${tdrib(a, b)}$ і $${obernenyi}$ — взаємно обернені: $\\left(${tdrib(a, b)} \\cdot ${obernenyi}\\right) \\cdot ${tdrib(c, d)} = 1 \\cdot ${tdrib(c, d)} = ${tdrib(c, d)}$`,
    };
  }
}

function oberneneDoSumy(r: Vypadok): TrenZavdannia {
  for (;;) {
    const [b, d] = r.rizni(2, 2, 9);
    const [a, c] = [neskorotnyiChyselnyk(r, b), neskorotnyiChyselnyk(r, d)];
    const suma = r.shans(0.6);
    if (!suma && a * d <= c * b) continue;
    const [p, q] = skorotyty(suma ? a * d + c * b : a * d - c * b, b * d);
    if (p === 1 && q === 1) continue;
    const znak = suma ? '+' : '-';
    return {
      pytannia: `Знайди число, обернене до ${suma ? 'суми' : 'різниці'} $${tdrib(a, b)} ${znak} ${tdrib(c, d)}$.`,
      vidpovid: vidpovidDrib(q, p),
      pokaz: `$${tvidpovidDrib(q, p)}$`,
      perevirka: rivnyiDrib(q, p),
      pidkazka: `Спершу обчисли ${suma ? 'суму' : 'різницю'}, а потім переверни дріб.`,
      rozviazok: `$${tdrib(a, b)} ${znak} ${tdrib(c, d)} = ${tdrib(p, q)}$; обернене — $${tvidpovidDrib(q, p)}$.`,
    };
  }
}

export default {
  rivni: ['обернене до дробу і натурального числа', 'мішані й десяткові числа', 'рівняння і зручні обчислення'],
  zavdannia(r, riven) {
    if (riven === 1) return obernene(r, r.vybir([drib, drib, drib, naturalne])(r));
    if (riven === 2) return r.shans(0.35) ? chyPara(r) : obernene(r, r.vybir([mishane, desiatkove])(r));
    return r.vybir([rivniannia, rivniannia, zruchno, zruchno, oberneneDoSumy])(r);
  },
} satisfies Henerator;
