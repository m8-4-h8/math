// Ділення кутом на одноцифрове число: скільки цифр у частці, нуль у частці, остача.
import { ch, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

function dilennia(r: Vypadok, tsyfrChastky: number, zNulem: boolean, zOstacheiu: boolean): TrenZavdannia {
  let chastka: number;
  let dilnyk: number;
  do {
    dilnyk = r.chyslo(2, 9);
    chastka = r.chyslo(10 ** (tsyfrChastky - 1), 10 ** tsyfrChastky - 1);
    if (zNulem) {
      // Нуль усередині частки: 603, 2045…
      const s = String(chastka).split('');
      s[r.chyslo(1, s.length - 2 >= 1 ? s.length - 2 : 1)] = '0';
      chastka = Number(s.join(''));
    }
  } while (dilnyk * chastka > 9999 || (zNulem && !String(chastka).slice(1).includes('0')));
  const ostacha = zOstacheiu ? r.chyslo(1, dilnyk - 1) : 0;
  const dilene = dilnyk * chastka + ostacha;
  const vidpovid = ostacha ? [`${chastka} ост ${ostacha}`, `${chastka} (ост. ${ostacha})`] : chastka;
  return {
    vyraz: `${ch(dilene)} : ${dilnyk} =`,
    vidpovid,
    pokaz: ostacha ? `${chastka} (ост. ${ostacha})` : undefined,
    pidkazka: zNulem
      ? 'Якщо знесена цифра менша за дільник, у частку пиши 0 і зноси наступну.'
      : `Перше неповне ділене — найменше число з перших цифр, яке ≥ ${dilnyk}. Далі: ділимо → множимо → віднімаємо → зносимо.`,
    rozviazok: ostacha
      ? `Перевірка: ${chastka} · ${dilnyk} + ${ostacha} = ${dilene} ✓`
      : `Перевірка: ${chastka} · ${dilnyk} = ${dilene} ✓`,
  };
}

function skilkyTsyfr(r: Vypadok): TrenZavdannia {
  const dilnyk = r.chyslo(2, 9);
  const chastka = r.chyslo(12, 999);
  const dilene = dilnyk * chastka;
  const tsyfr = String(chastka).length;
  return {
    pytannia: `Скільки цифр буде в частці ${ch(dilene)} : ${dilnyk}? Не діли до кінця — знайди перше неповне ділене.`,
    vidpovid: tsyfr,
    varianty: [2, 3, 4],
    pidkazka: 'Після першого неповного діленого кожна цифра діленого дає одну цифру частки.',
    rozviazok: `${ch(dilene)} : ${dilnyk} = ${chastka} — ${tsyfr} цифри.`,
  };
}

export default {
  rivni: ['двоцифрова частка', 'трицифрова частка і нуль у частці', 'з остачею і скільки цифр у частці'],
  zavdannia(r, riven) {
    if (riven === 1) return dilennia(r, 2, false, false);
    if (riven === 2) return r.shans(0.65) ? dilennia(r, 3, false, false) : dilennia(r, 3, true, false);
    return r.vybir([
      () => dilennia(r, r.chyslo(2, 3), false, true),
      () => dilennia(r, 3, true, r.shans()),
      () => dilennia(r, 4, false, false),
      () => skilkyTsyfr(r),
    ])();
  },
} satisfies Henerator;
