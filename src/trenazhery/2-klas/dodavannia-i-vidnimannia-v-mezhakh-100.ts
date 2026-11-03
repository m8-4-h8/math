// Додавання і віднімання в межах 100: десятки з десятками, одиниці з одиницями, перехід через десяток.
import { mnozh, osoba, rid, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

function kruhli(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(0, 3);
  if (typ === 0) {
    const a = r.chyslo(1, 8);
    const b = r.chyslo(1, 9 - a);
    return { vyraz: `${a * 10} + ${b * 10} =`, vidpovid: (a + b) * 10, pidkazka: `${a} дес. + ${b} дес.`, rozviazok: `${a} + ${b} = ${a + b} дес., тобто ${(a + b) * 10}.` };
  }
  if (typ === 1) {
    const a = r.chyslo(2, 9);
    const b = r.chyslo(1, a);
    return { vyraz: `${a * 10} − ${b * 10} =`, vidpovid: (a - b) * 10, pidkazka: `${a} дес. − ${b} дес.`, rozviazok: `${a} − ${b} = ${a - b} дес., тобто ${(a - b) * 10}.` };
  }
  const d = r.chyslo(1, 9);
  const o = r.chyslo(0, 8);
  const b = r.chyslo(1, 9 - o);
  if (typ === 2) {
    return { vyraz: `${10 * d + o} + ${b} =`, vidpovid: 10 * d + o + b, pidkazka: 'Одиниці додаємо до одиниць, десятки не змінюються.', rozviazok: `${o} + ${b} = ${o + b}, отже ${10 * d + o + b}.` };
  }
  return { vyraz: `${10 * d + o + b} − ${b} =`, vidpovid: 10 * d + o, pidkazka: 'Від одиниць віднімаємо одиниці.', rozviazok: `${o + b} − ${b} = ${o}, отже ${10 * d + o}.` };
}

function bezPerekhodu(r: Vypadok): TrenZavdannia {
  const d1 = r.chyslo(1, 7);
  const d2 = r.chyslo(1, 8 - d1);
  const o1 = r.chyslo(0, 8);
  const o2 = r.chyslo(0, 9 - o1);
  const a = 10 * d1 + o1;
  const b = 10 * d2 + o2;
  if (r.shans()) {
    return {
      vyraz: `${a} + ${b} =`,
      vidpovid: a + b,
      pidkazka: `Десятки: ${d1 * 10} + ${d2 * 10}. Одиниці: ${o1} + ${o2}.`,
      rozviazok: `${d1 * 10} + ${d2 * 10} = ${(d1 + d2) * 10}, ${o1} + ${o2} = ${o1 + o2}; разом ${a + b}.`,
    };
  }
  const s = a + b;
  return {
    vyraz: `${s} − ${b} =`,
    vidpovid: a,
    pidkazka: `Десятки: ${(d1 + d2) * 10} − ${d2 * 10}. Одиниці: ${o1 + o2} − ${o2}.`,
    rozviazok: `${(d1 + d2) * 10} − ${d2 * 10} = ${d1 * 10}, ${o1 + o2} − ${o2} = ${o1}; разом ${a}.`,
  };
}

function zPerekhodom(r: Vypadok): TrenZavdannia {
  if (r.shans()) {
    const o1 = r.chyslo(2, 9);
    const o2 = r.chyslo(10 - o1 + (o1 === 1 ? 1 : 0), 9);
    const d1 = r.chyslo(1, 7);
    const d2 = r.chyslo(r.shans(0.3) ? 0 : 1, 8 - d1);
    const a = 10 * d1 + o1;
    const b = 10 * d2 + o2;
    const doKruhloho = 10 - o1;
    return {
      vyraz: `${a} + ${b} =`,
      vidpovid: a + b,
      pidkazka: `Доповни ${a} до круглого: ${a} + ${doKruhloho} = ${a + doKruhloho}. Скільки ще лишилось додати?`,
      rozviazok: `${a} + ${doKruhloho} = ${a + doKruhloho}, ${a + doKruhloho} + ${b - doKruhloho} = ${a + b}.`,
    };
  }
  const d1 = r.chyslo(2, 9);
  const o1 = r.chyslo(0, 8);
  const o2 = r.chyslo(o1 + 1, 9);
  const d2 = r.chyslo(0, d1 - 1);
  const a = 10 * d1 + o1;
  const b = 10 * d2 + o2;
  const kruhle = a - o1;
  return {
    vyraz: `${a} − ${b} =`,
    vidpovid: a - b,
    pidkazka: o1 ? `Одиниць у ${a} лише ${o1}. Спершу ${a} − ${o1} = ${kruhle}.` : `Від ${a} відніми спершу ${d2 ? d2 * 10 + ', потім ' + o2 : o2}.`,
    rozviazok: o1
      ? `${a} − ${o1} = ${kruhle}, ${kruhle} − ${b - o1} = ${a - b}.`
      : `${a} − ${b} = ${a - b}, перевірка: ${a - b} + ${b} = ${a} ✓`,
  };
}

function zadacha(r: Vypadok): TrenZavdannia {
  if (r.shans()) {
    const vsi = r.chyslo(40, 99);
    const prochytano = r.chyslo(15, vsi - 10);
    const o = osoba(r);
    return {
      pytannia: `У книжці ${vsi} ${mnozh(vsi, 'сторінка', 'сторінки', 'сторінок')}. ${o.imia} вже ${rid(o, 'прочитав', 'прочитала')} ${prochytano}. Скільки сторінок лишилось прочитати?`,
      vidpovid: vsi - prochytano,
      pidkazka: 'Уся книжка — ціле, прочитані — частина. Шукаємо іншу частину.',
      rozviazok: `${vsi} − ${prochytano} = ${vsi - prochytano}`,
    };
  }
  const a = r.chyslo(15, 60);
  const b = r.chyslo(10, 99 - a);
  return {
    pytannia: `Зранку в саду зібрали ${a} кг яблук, а ввечері — ще ${b} кг. Скільки кілограмів яблук зібрали за день?`,
    vidpovid: a + b,
    odynytsi: 'кг',
    pidkazka: 'За день — це разом: додаємо.',
    rozviazok: `${a} + ${b} = ${a + b} (кг)`,
  };
}

export default {
  rivni: ['круглі числа й одиниці', 'двоцифрові без переходу', 'з переходом через десяток і задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return kruhli(r);
    if (riven === 2) return r.shans(0.7) ? bezPerekhodu(r) : kruhli(r);
    return r.vybir([zPerekhodom, zPerekhodom, zPerekhodom, zadacha])(r);
  },
} satisfies Henerator;
