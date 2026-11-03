// Позатабличне множення і ділення (в межах 100): розклад на десятки й одиниці, зручні доданки.
import { mnozh, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

function kruhli(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(0, 2);
  if (typ === 0) {
    const d = r.chyslo(1, 4);
    const b = r.chyslo(2, Math.floor(10 / d));
    return { vyraz: `${d * 10} · ${b} =`, vidpovid: d * 10 * b, pidkazka: `${d} дес. · ${b} = ${d * b} дес.`, rozviazok: `${d} · ${b} = ${d * b}, отже ${d * 10} · ${b} = ${d * b * 10}.` };
  }
  if (typ === 1) {
    const b = r.chyslo(2, 5);
    const k = r.chyslo(1, Math.floor(10 / b));
    return { vyraz: `${b * k * 10} : ${b} =`, vidpovid: k * 10, pidkazka: `${b * k} дес. : ${b}`, rozviazok: `${b * k} дес. : ${b} = ${k} дес., тобто ${k * 10}.` };
  }
  const a = r.chyslo(2, 4);
  const b = r.chyslo(2, Math.floor(9 / a));
  return { vyraz: `${a * b * 10} : ${a * 10} =`, vidpovid: b, pidkazka: `${a * b} дес. : ${a} дес.`, rozviazok: `${a * b} : ${a} = ${b}` };
}

function mnozhennia(r: Vypadok, maxProduct: number): TrenZavdannia {
  let a: number;
  let b: number;
  do {
    a = r.chyslo(11, 49);
    b = r.chyslo(2, 9);
  } while (a * b > maxProduct || a % 10 === 0);
  const d = a - (a % 10);
  const o = a % 10;
  const [x, y] = r.shans(0.75) ? [a, b] : [b, a];
  return {
    vyraz: `${x} · ${y} =`,
    vidpovid: a * b,
    pidkazka: `Розклади ${a} = ${d} + ${o}. Помнож кожен доданок на ${b}.`,
    rozviazok: `${d} · ${b} + ${o} · ${b} = ${d * b} + ${o * b} = ${a * b}`,
  };
}

// Ділене розкладаємо на два доданки, що діляться на дільник: 96 : 4 = (80 + 16) : 4.
function rozklad(dilene: number, dilnyk: number): [number, number] {
  for (let k = Math.floor(dilene / 10); k >= 1; k--) {
    const persh = k * 10;
    if (persh % dilnyk === 0 && (dilene - persh) % dilnyk === 0 && dilene - persh >= 0) return [persh, dilene - persh];
  }
  return [dilene, 0];
}

function dilennia(r: Vypadok, lehke: boolean): TrenZavdannia {
  let dilnyk: number;
  let chastka: number;
  do {
    dilnyk = r.chyslo(2, lehke ? 4 : 9);
    chastka = r.chyslo(11, 49);
  } while (
    dilnyk * chastka > 99 ||
    chastka % 10 === 0 ||
    (lehke && (Math.floor((dilnyk * chastka) / 10) % dilnyk !== 0 || ((dilnyk * chastka) % 10) % dilnyk !== 0))
  );
  const dilene = dilnyk * chastka;
  const [p1, p2] = rozklad(dilene, dilnyk);
  return {
    vyraz: `${dilene} : ${dilnyk} =`,
    vidpovid: chastka,
    pidkazka: `Розклади ${dilene} на доданки, що діляться на ${dilnyk}: ${p1} + ${p2}.`,
    rozviazok: `${p1} : ${dilnyk} + ${p2} : ${dilnyk} = ${p1 / dilnyk} + ${p2 / dilnyk} = ${chastka}`,
  };
}

function vikontse(r: Vypadok): TrenZavdannia {
  const b = r.chyslo(2, 6);
  const a = r.chyslo(11, Math.floor(99 / b));
  return r.shans()
    ? { pytannia: 'Яке число у віконці?', vyraz: `□ · ${b} = ${a * b}`, vidpovid: a, pidkazka: `Невідомий множник: ${a * b} : ${b}.`, rozviazok: `${a * b} : ${b} = ${a}` }
    : { pytannia: 'Яке число у віконці?', vyraz: `□ : ${b} = ${a}`, vidpovid: a * b, pidkazka: `Невідоме ділене: ${a} · ${b}.`, rozviazok: `${a} · ${b} = ${a * b}` };
}

function zadacha(r: Vypadok): TrenZavdannia {
  const b = r.chyslo(3, 6);
  const a = r.chyslo(12, Math.floor(99 / b));
  return r.shans()
    ? {
        pytannia: `В одній коробці ${a} ${mnozh(a, 'олівець', 'олівці', 'олівців')}. Скільки олівців у ${b} таких коробках?`,
        vidpovid: a * b,
        pidkazka: `По ${a} взяли ${b} рази (разів) — множимо.`,
        rozviazok: `${a} · ${b} = ${a * b}`,
      }
    : {
        pytannia: `${a * b} ${mnozh(a * b, 'книжку', 'книжки', 'книжок')} поставили порівну на ${b} полиці. Скільки книжок на кожній полиці?`,
        vidpovid: a,
        pidkazka: 'Порівну — ділимо.',
        rozviazok: `${a * b} : ${b} = ${a}`,
      };
}

export default {
  rivni: ['круглі числа', 'двоцифрове на одноцифрове', 'складніше ділення, віконця й задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return kruhli(r);
    if (riven === 2) return r.vybir([() => mnozhennia(r, 99), () => dilennia(r, true), () => kruhli(r)])();
    return r.vybir([() => mnozhennia(r, 99), () => dilennia(r, false), () => dilennia(r, false), () => vikontse(r), () => zadacha(r)])();
  },
} satisfies Henerator;
