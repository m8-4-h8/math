// Квадрат суми й різниці: (a ± b)² = a² ± 2ab + b² — подвоєний добуток не можна загубити, квадрат другого
// завжди з плюсом; обчислення в умі (41² = (40 + 1)²); згортання тричлена в квадрат.
import { ch, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';
import { dobutok, suma, tex, tvd, type Mnohochlen } from '../alhebra.ts';

const BUKVY = ['x', 'y', 'a', 'b', 'm'];

function rozkryty(r: Vypadok, zKoef: boolean): TrenZavdannia {
  const x = r.vybir(BUKVY);
  const a = zKoef ? r.chyslo(2, 5) : 1;
  const b = r.krim(-9, 9, [0]);
  const p: Mnohochlen = [b, a];
  const rez = dobutok(p, p);
  const st = r.vybir([0, 1, 1, ...(zKoef ? [2] : [])]);
  const ch_ =
    st === 1
      ? `Подвоєний добуток: 2 · ${a === 1 ? x : `${a}${x}`} · ${tvd(b)} = ${ch(rez[1])}${x}`
      : st === 0
        ? `Квадрат другого: ${tvd(b)}² = ${rez[0]} — завжди з плюсом`
        : `Квадрат першого: (${a}${x})² = ${rez[2]}${x}²`;
  return {
    pytannia: `Піднеси до квадрата $(${tex(p, x)})^2$. ${st === 0 ? 'Яке число (вільний член) вийде?' : `Який коефіцієнт при $${st === 1 ? x : `${x}^2`}$?`}`,
    vidpovid: ch(rez[st]),
    pidkazka: st === 1 ? 'Середній член — подвоєний добуток першого на друге.' : st === 0 ? 'Квадрат другого числа.' : 'У квадрат підносимо і число, і букву.',
    rozviazok: `${ch_}. Уся відповідь: $${tex(rez, x)}$.`,
  };
}

function vUmi(r: Vypadok): TrenZavdannia {
  const okrugle = r.vybir([20, 30, 40, 50, 60, 70, 80, 90, 100]);
  const d = r.krim(-3, 3, [0]);
  const n = okrugle + d;
  return {
    pytannia: 'Обчисли в умі за формулою квадрата суми чи різниці.',
    vyraz: `$${n}^2 =$`,
    vidpovid: n * n,
    pidkazka: `${n} = ${okrugle} ${d < 0 ? '−' : '+'} ${Math.abs(d)}.`,
    rozviazok: `(${okrugle} ${d < 0 ? '−' : '+'} ${Math.abs(d)})² = ${ch(okrugle * okrugle)} ${d < 0 ? '−' : '+'} ${Math.abs(2 * okrugle * d)} + ${d * d} = ${ch(n * n)}`,
  };
}

function zhornuty(r: Vypadok): TrenZavdannia {
  const x = r.vybir(BUKVY);
  const b = r.chyslo(1, 12);
  const minus = r.shans();
  const p: Mnohochlen = [minus ? -b : b, 1];
  const rez = dobutok(p, p);
  return {
    pytannia: 'Впиши число.',
    vyraz: `$${tex(rez, x)} = (${x} ${minus ? '-' : '+'} \\square)^2$`,
    vidpovid: b,
    pidkazka: `${b * b} — квадрат якого числа? Перевір середній член: 2 · ${x} · ?`,
    rozviazok: `${b * b} = ${b}², а ${2 * b}${x} = 2 · ${x} · ${b}.`,
  };
}

function riznytsiaKvadrativSum(r: Vypadok): TrenZavdannia {
  const x = r.vybir(BUKVY);
  const b = r.chyslo(1, 9);
  const p: Mnohochlen = [b, 1];
  const q: Mnohochlen = [-b, 1];
  const rez = suma(dobutok(p, p), dobutok(q, q), -1);
  return {
    pytannia: `Спрости $(${tex(p, x)})^2 - (${tex(q, x)})^2$. Який коефіцієнт при $${x}$?`,
    vidpovid: rez[1],
    pidkazka: `Розпиши обидва квадрати: $${tex(dobutok(p, p), x)}$ і $${tex(dobutok(q, q), x)}$.`,
    rozviazok: `${2 * b} − (−${2 * b}) = ${4 * b}; усе інше скорочується: $${tex(rez, x)}$.`,
  };
}

export default {
  rivni: ['(x ± b)²: коефіцієнти', 'з коефіцієнтом і в умі', 'згортаємо в квадрат'],
  zavdannia(r, riven) {
    if (riven === 1) return rozkryty(r, false);
    if (riven === 2) return r.vybir([(rr: Vypadok) => rozkryty(rr, true), (rr: Vypadok) => rozkryty(rr, true), vUmi])(r);
    return r.vybir([zhornuty, zhornuty, riznytsiaKvadrativSum, vUmi])(r);
  },
} satisfies Henerator;
