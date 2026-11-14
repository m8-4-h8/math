// Усі дії з раціональними числами (Істер § 43): підсумкова тема. Перемішані завдання з попередніх тем розділу
// (додавання, віднімання, множення, ділення) і вирази на порядок дій з від'ємними числами та десятковими дробами.
import { ch, des, tdes, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';
import dodavannia from './dodavannia-ratsionalnykh-chysel.ts';
import riznymyZnakamy from './dodavannia-z-riznymy-znakamy.ts';
import vidnimannia from './vidnimannia-ratsionalnykh-chysel.ts';
import mnozhennia from './mnozhennia-ratsionalnykh-chysel.ts';
import dilennia from './dilennia-ratsionalnykh-chysel.ts';

const tz = (n: number) => (n < 0 ? `-${-n}` : `${n}`);
const vd = (n: number) => (n < 0 ? `(${tz(n)})` : `${n}`);
const td = (n: number) => (n < 0 ? `(${ch(n)})` : `${n}`);

/** Дві дії з цілими числами: множення/ділення і додавання/віднімання, або дужки. */
function dviDii(r: Vypadok): TrenZavdannia {
  for (;;) {
    const typ = r.chyslo(0, 3);
    const [a, b, c] = [r.krim(-15, 15, [0]), r.krim(-9, 9, [0, 1]), r.krim(-9, 9, [0, 1])];
    if (typ === 0) {
      // a − b · c
      const bc = b * c;
      const s = a - bc;
      return {
        pytannia: 'Обчисли.',
        vyraz: `$${tz(a)} - ${vd(b)} \\cdot ${vd(c)} =$`,
        vidpovid: ch(s),
        pidkazka: 'Спершу множення, потім віднімання.',
        rozviazok: `${ch(b)} · ${td(c)} = ${ch(bc)}; ${ch(a)} − ${td(bc)} = ${ch(s)}`,
      };
    }
    if (typ === 1) {
      // b · c : d + a, ділення націло
      const d = r.krim(-6, 6, [0, 1, -1]);
      const dobutok = b * d; // b·d : d = b
      const s = (dobutok / d) * c + a;
      return {
        pytannia: 'Обчисли.',
        vyraz: `$${tz(dobutok)} : ${vd(d)} \\cdot ${vd(c)} + ${vd(a)} =$`,
        vidpovid: ch(s),
        pidkazka: 'Ділення й множення — зліва направо, потім додавання.',
        rozviazok: `${ch(dobutok)} : ${td(d)} = ${ch(b)}; ${ch(b)} · ${td(c)} = ${ch(b * c)}; ${ch(b * c)} + ${td(a)} = ${ch(s)}`,
      };
    }
    if (typ === 2) {
      // c · (a + b)
      const sum = a + b;
      if (sum === 0) continue;
      const s = c * sum;
      return {
        pytannia: 'Обчисли.',
        vyraz: `$${tz(c)} \\cdot (${tz(a)} + ${vd(b)}) =$`,
        vidpovid: ch(s),
        pidkazka: 'Спершу дужки.',
        rozviazok: `${ch(a)} + ${td(b)} = ${ch(sum)}; ${ch(c)} · ${td(sum)} = ${ch(s)}`,
      };
    }
    // (a − b) : c, ділення націло
    const riz = c * r.krim(-8, 8, [0]);
    const a2 = riz + b;
    if (Math.abs(a2) > 30) continue;
    const s = riz / c;
    return {
      pytannia: 'Обчисли.',
      vyraz: `$(${tz(a2)} - ${vd(b)}) : ${vd(c)} =$`,
      vidpovid: ch(s),
      pidkazka: 'Спершу дужки, потім ділення.',
      rozviazok: `${ch(a2)} − ${td(b)} = ${ch(riz)}; ${ch(riz)} : ${td(c)} = ${ch(s)}`,
    };
  }
}

/** (p + q) : r − s · t з десятковими дробами (у десятих). */
function desiatkovi(r: Vypadok): TrenZavdannia {
  for (;;) {
    const d = r.krim(-9, 9, [0, 1, -1, 5, -5]); // дільник у десятих
    const chastka = r.krim(-9, 9, [0]); // ціла частка
    const suma = chastka * d; // у десятих
    const p = r.krim(-60, 60, [0]);
    const q = suma - p;
    if (q === 0 || Math.abs(q) > 60) continue;
    const s = r.krim(-5, 5, [0, 1, -1]);
    const t = r.krim(-15, 15, [0, 10, -10]); // у десятих
    const st = s * t; // у десятих
    const vidpovid = chastka * 10 - st; // у десятих
    const dt = (n: number) => (n < 0 ? `(${tdes(n, 1)})` : tdes(n, 1));
    const dx = (n: number) => (n < 0 ? `(${des(n, 1)})` : des(n, 1));
    return {
      pytannia: 'Обчисли.',
      vyraz: `$(${tdes(p, 1)} + ${dt(q)}) : ${dt(d)} - ${vd(s)} \\cdot ${dt(t)} =$`,
      vidpovid: des(vidpovid, 1),
      pidkazka: 'Пронумеруй дії: дужки, ділення, множення, віднімання.',
      rozviazok: `1) ${des(p, 1)} + ${dx(q)} = ${des(suma, 1)}; 2) ${des(suma, 1)} : ${dx(d)} = ${ch(chastka)}; 3) ${ch(s)} · ${dx(t)} = ${des(st, 1)}; 4) ${ch(chastka)} − ${dx(st)} = ${des(vidpovid, 1)}`,
    };
  }
}

/** Значення виразу з буквами при від'ємних значеннях. */
function znachennia(r: Vypadok): TrenZavdannia {
  const [x, y] = [r.krim(-6, 6, [0]), r.krim(-6, 6, [0])];
  const [a, c] = [r.krim(-5, 5, [0, 1, -1]), r.krim(-5, 5, [0, 1, -1])];
  const [ax, cy] = [a * x, Math.abs(c) * y];
  const s = a * x + c * y;
  const z = c < 0 ? '−' : '+';
  return {
    pytannia: `Знайди значення виразу $${tz(a)}x ${c < 0 ? '-' : '+'} ${Math.abs(c)}y$, якщо $x = ${tz(x)}$, $y = ${tz(y)}$.`,
    vidpovid: ch(s),
    pidkazka: 'Підстав від’ємні числа в дужках і пам’ятай про порядок дій.',
    rozviazok: `${ch(a)} · ${td(x)} ${z} ${Math.abs(c)} · ${td(y)} = ${ch(ax)} ${z} ${td(cy)} = ${ch(s)}`,
  };
}

const pidsumok = (h: Henerator, riven: 1 | 2 | 3) => (r: Vypadok) => h.zavdannia(r, riven);

export default {
  rivni: ['чотири дії вперемішку', 'дві дії, порядок дій', 'кілька дій з десятковими, звичайні дроби'],
  zavdannia(r, riven) {
    if (riven === 1) {
      return r.vybir([pidsumok(dodavannia, 1), pidsumok(riznymyZnakamy, 1), pidsumok(vidnimannia, 1), pidsumok(mnozhennia, 1), pidsumok(dilennia, 1)])(r);
    }
    if (riven === 2) return r.vybir([dviDii, dviDii, dviDii, znachennia, pidsumok(vidnimannia, 2), pidsumok(dilennia, 2)])(r);
    return r.vybir([desiatkovi, desiatkovi, dviDii, pidsumok(dodavannia, 3), pidsumok(mnozhennia, 3), pidsumok(dilennia, 3)])(r);
  },
} satisfies Henerator;
