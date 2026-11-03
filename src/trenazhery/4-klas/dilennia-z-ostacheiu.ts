// Ділення з остачею: частка й остача, можливі остачі, невідоме ділене, перевірка.
import type { Henerator, Vypadok, TrenZavdannia } from '../dopomoha.ts';

function dilennia(r: Vypadok, maxDilnyk: number, maxChastka: number): TrenZavdannia {
  const dilnyk = r.chyslo(2, maxDilnyk);
  const chastka = r.chyslo(1, maxChastka);
  const ostacha = r.chyslo(1, dilnyk - 1);
  const dilene = dilnyk * chastka + ostacha;
  return {
    pytannia: 'Поділи з остачею. Запиши так: 9 ост 2.',
    vyraz: `${dilene} : ${dilnyk} =`,
    vidpovid: [`${chastka} ост ${ostacha}`, `${chastka} (ост. ${ostacha})`],
    pokaz: `${chastka} (ост. ${ostacha})`,
    pidkazka: `Яке найбільше число, помножене на ${dilnyk}, не перевищує ${dilene}?`,
    rozviazok: `${dilnyk} · ${chastka} = ${dilnyk * chastka}, ${dilene} − ${dilnyk * chastka} = ${ostacha}. Перевірка: ${chastka} · ${dilnyk} + ${ostacha} = ${dilene} ✓`,
  };
}

function mozhlyviOstachi(r: Vypadok): TrenZavdannia {
  const dilnyk = r.chyslo(2, 9);
  return r.shans()
    ? {
        pytannia: `Яка найбільша можлива остача при діленні на ${dilnyk}?`,
        vidpovid: dilnyk - 1,
        pidkazka: 'Остача завжди менша за дільник.',
        rozviazok: `Остача менша за ${dilnyk}, тож найбільша — ${dilnyk - 1}.`,
      }
    : {
        pytannia: `Які остачі можуть бути при діленні на ${Math.min(dilnyk, 6)}? Запиши через кому від найменшої.`,
        vidpovid: Array.from({ length: Math.min(dilnyk, 6) }, (_, i) => i).join(', '),
        pidkazka: 'Від 0 до числа, на одиницю меншого за дільник.',
        rozviazok: `${Array.from({ length: Math.min(dilnyk, 6) }, (_, i) => i).join(', ')} — усі числа, менші за ${Math.min(dilnyk, 6)}.`,
      };
}

function nevidomeDilene(r: Vypadok): TrenZavdannia {
  const dilnyk = r.chyslo(3, 9);
  const chastka = r.chyslo(2, 12);
  const ostacha = r.chyslo(1, dilnyk - 1);
  return {
    pytannia: `Яке число при діленні на ${dilnyk} дає частку ${chastka} і остачу ${ostacha}?`,
    vidpovid: dilnyk * chastka + ostacha,
    pidkazka: 'Ділене = частка · дільник + остача.',
    rozviazok: `${chastka} · ${dilnyk} + ${ostacha} = ${dilnyk * chastka + ostacha}`,
  };
}

function chyPravylno(r: Vypadok): TrenZavdannia {
  const dilnyk = r.chyslo(3, 9);
  const chastka = r.chyslo(2, 9);
  const ostacha = r.chyslo(1, dilnyk - 1);
  const dilene = dilnyk * chastka + ostacha;
  const virno = r.shans();
  // Хибний запис: частку взяли на 1 меншою, і «остача» вийшла більшою за дільник.
  const [ch2, o2] = virno ? [chastka, ostacha] : [chastka - 1, ostacha + dilnyk];
  return {
    pytannia: 'Чи правильно поділено?',
    vyraz: `${dilene} : ${dilnyk} = ${ch2} (ост. ${o2})`,
    vidpovid: virno ? 'Так' : 'Ні',
    varianty: ['Так', 'Ні'],
    pidkazka: 'Порівняй остачу з дільником.',
    rozviazok: virno
      ? `Так: ${o2} < ${dilnyk} і ${ch2} · ${dilnyk} + ${o2} = ${dilene}.`
      : `Ні: остача ${o2} не менша за дільник ${dilnyk}. Правильно: ${chastka} (ост. ${ostacha}).`,
  };
}

function zadacha(r: Vypadok): TrenZavdannia {
  const mists = r.chyslo(3, 6);
  const chovniv = r.chyslo(3, 9);
  const zalyshok = r.chyslo(1, mists - 1);
  const dity = mists * chovniv + zalyshok;
  return {
    pytannia: `${dity} дітей пливуть на човнах, у кожен човен сідає ${mists}. Скільки човнів потрібно, щоб поплили всі?`,
    vidpovid: chovniv + 1,
    pidkazka: `${dity} : ${mists} — з остачею. Тим, хто лишився, теж потрібен човен!`,
    rozviazok: `${dity} : ${mists} = ${chovniv} (ост. ${zalyshok}), тому потрібен ще 1 човен: ${chovniv} + 1 = ${chovniv + 1}.`,
  };
}

export default {
  rivni: ['з остачею в межах таблиці', 'можливі остачі й невідоме ділене', 'перевірка й задачі з остачею'],
  zavdannia(r, riven) {
    if (riven === 1) return dilennia(r, 9, 9);
    if (riven === 2) return r.vybir([() => dilennia(r, 9, 9), () => mozhlyviOstachi(r), () => nevidomeDilene(r)])();
    return r.vybir([() => dilennia(r, 9, 12), () => chyPravylno(r), () => zadacha(r), () => nevidomeDilene(r)])();
  },
} satisfies Henerator;
