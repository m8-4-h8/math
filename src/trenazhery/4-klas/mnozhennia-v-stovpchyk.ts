// Множення в стовпчик: на одноцифрове (із запам'ятовуванням), на двоцифрове (неповні добутки), нулі.
import { ch, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

function naOdnotsyfrove(r: Vypadok, vid: number, do_: number): TrenZavdannia {
  const a = r.chyslo(vid, do_);
  const b = r.chyslo(2, 9);
  const o = (a % 10) * b;
  return {
    vyraz: `${ch(a)} · ${b} =`,
    vidpovid: a * b,
    pidkazka: `Одиниці: ${a % 10} · ${b} = ${o}${o >= 10 ? ` — пиши ${o % 10}, запам'ятай ${Math.floor(o / 10)}` : ''}. Далі десятки, і додай запам'ятоване.`,
    rozviazok: `${ch(a)} · ${b} = ${ch(a * b)}`,
  };
}

function naDvotsyfrove(r: Vypadok, maxA: number): TrenZavdannia {
  const a = r.chyslo(12, maxA);
  const b = r.chyslo(11, 99);
  const [p1, p2] = [a * (b % 10), a * Math.floor(b / 10) * 10];
  return {
    vyraz: `${ch(a)} · ${b} =`,
    vidpovid: a * b,
    pidkazka: `Перший неповний добуток: ${ch(a)} · ${b % 10}. Другий: ${ch(a)} · ${Math.floor(b / 10)} десятки — пиши зі зсувом на один розряд.`,
    rozviazok: `${ch(a)} · ${b % 10} = ${ch(p1)}; ${ch(a)} · ${Math.floor(b / 10) * 10} = ${ch(p2)}; ${ch(p1)} + ${ch(p2)} = ${ch(a * b)}`,
  };
}

function zNuliamy(r: Vypadok): TrenZavdannia {
  if (r.shans()) {
    // Нуль усередині першого множника: 205 · 4.
    const a = r.chyslo(1, 9) * 100 + r.chyslo(1, 9);
    const b = r.chyslo(2, 9);
    return {
      vyraz: `${a} · ${b} =`,
      vidpovid: a * b,
      pidkazka: `Десятків 0: 0 · ${b} = 0, але не забудь додати запам'ятоване з одиниць.`,
      rozviazok: `${a} · ${b} = ${ch(a * b)}`,
    };
  }
  // Нулі в кінці: 340 · 60 — множимо 34 · 6 і дописуємо два нулі.
  const a = r.chyslo(12, 99);
  const b = r.chyslo(2, 9);
  return {
    vyraz: `${a * 10} · ${b * 10} =`,
    vidpovid: a * b * 100,
    pidkazka: `Помнож ${a} · ${b}, а потім допиши два нулі.`,
    rozviazok: `${a} · ${b} = ${ch(a * b)}, і два нулі: ${ch(a * b * 100)}`,
  };
}

export default {
  rivni: ['двоцифрове на одноцифрове', 'три- й чотирицифрове на одноцифрове, нулі', 'на двоцифрове число'],
  zavdannia(r, riven) {
    if (riven === 1) return naOdnotsyfrove(r, 12, 99);
    if (riven === 2) return r.vybir([() => naOdnotsyfrove(r, 102, 999), () => naOdnotsyfrove(r, 1002, 4999), () => zNuliamy(r)])();
    return r.vybir([() => naDvotsyfrove(r, 99), () => naDvotsyfrove(r, 999), () => zNuliamy(r)])();
  },
} satisfies Henerator;
