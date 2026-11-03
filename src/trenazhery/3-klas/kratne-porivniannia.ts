// У скільки разів більше чи менше; збільшити / зменшити в кілька разів; «на скільки» проти «у скільки разів».
import { dviOsoby, mnozh, rid, zVelykoi, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const razy = (n: number) => `${n} ${mnozh(n, 'раз', 'рази', 'разів')}`;

function uSkilkyRaziv(r: Vypadok): TrenZavdannia {
  const m = r.chyslo(2, 9);
  const k = r.chyslo(2, 9);
  const v = m * k;
  return r.shans()
    ? { pytannia: `У скільки разів ${v} більше за ${m}?`, vidpovid: k, pidkazka: 'Більше число ділимо на менше.', rozviazok: `${v} : ${m} = ${k} — у ${razy(k)}.` }
    : { pytannia: `У скільки разів ${m} менше від ${v}?`, vidpovid: k, pidkazka: 'Більше число ділимо на менше.', rozviazok: `${v} : ${m} = ${k} — у ${razy(k)}.` };
}

function zminyty(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(2, 9);
  const k = r.chyslo(2, 9);
  return r.shans()
    ? { pytannia: `Збільш ${a} у ${razy(k)}.`, vidpovid: a * k, pidkazka: 'Збільшити в кілька разів — помножити.', rozviazok: `${a} · ${k} = ${a * k}` }
    : { pytannia: `Зменш ${a * k} у ${razy(k)}.`, vidpovid: a, pidkazka: 'Зменшити в кілька разів — поділити.', rozviazok: `${a * k} : ${k} = ${a}` };
}

function naChyU(r: Vypadok): TrenZavdannia {
  const m = r.chyslo(2, 9);
  const k = r.chyslo(2, 6);
  const v = m * k;
  return r.shans()
    ? { pytannia: `На скільки ${v} більше за ${m}?`, vidpovid: v - m, pidkazka: '«На скільки» — віднімаємо.', rozviazok: `${v} − ${m} = ${v - m}` }
    : { pytannia: `У скільки разів ${v} більше за ${m}?`, vidpovid: k, pidkazka: '«У скільки разів» — ділимо.', rozviazok: `${v} : ${m} = ${k}` };
}

function yakaDiia(r: Vypadok): TrenZavdannia {
  const k = r.chyslo(2, 9);
  const [shcho, pravylna] = r.vybir([
    [`збільшити число у ${razy(k)}`, `помножити на ${k}`],
    [`зменшити число у ${razy(k)}`, `поділити на ${k}`],
    [`збільшити число на ${k}`, `додати ${k}`],
    [`зменшити число на ${k}`, `відняти ${k}`],
  ]);
  return {
    pytannia: `Щоб ${shcho}, треба…`,
    vidpovid: pravylna,
    varianty: [`помножити на ${k}`, `поділити на ${k}`, `додати ${k}`, `відняти ${k}`],
    pidkazka: '«У … разів» — множення чи ділення, «на …» — додавання чи віднімання.',
    rozviazok: `${zVelykoi(shcho)} — ${pravylna}.`,
  };
}

function zadacha(r: Vypadok): TrenZavdannia {
  const [a, b] = dviOsoby(r);
  const m = r.chyslo(2, 9);
  const k = r.chyslo(2, 5);
  return r.vybir<() => TrenZavdannia>([
    () => ({
      pytannia: `${a.imia} має ${m} ${mnozh(m, 'наліпку', 'наліпки', 'наліпок')}, а ${b.imia} — у ${razy(k)} більше. Скільки наліпок має ${b.imia}?`,
      vidpovid: m * k,
      pidkazka: 'У … разів більше — множимо.',
      rozviazok: `${m} · ${k} = ${m * k}`,
    }),
    () => ({
      pytannia: `Мотузка завдовжки ${m * k} м, а стрічка — у ${razy(k)} коротша. Яка довжина стрічки?`,
      vidpovid: m,
      odynytsi: 'м',
      pidkazka: 'У … разів менше — ділимо.',
      rozviazok: `${m * k} : ${k} = ${m} (м)`,
    }),
    () => ({
      pytannia: `${a.imia} ${rid(a, 'прочитав', 'прочитала')} ${m * k} ${mnozh(m * k, 'сторінку', 'сторінки', 'сторінок')}, а ${b.imia} — ${m}. У скільки разів більше сторінок прочитано першою дитиною?`,
      vidpovid: k,
      pidkazka: 'Більше число ділимо на менше.',
      rozviazok: `${m * k} : ${m} = ${k}`,
    }),
  ])();
}

export default {
  rivni: ['у скільки разів більше', 'збільшити й зменшити', '«на» чи «у … разів» і задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return uSkilkyRaziv(r);
    if (riven === 2) return r.shans() ? zminyty(r) : uSkilkyRaziv(r);
    return r.vybir([naChyU, yakaDiia, zadacha, zadacha])(r);
  },
} satisfies Henerator;
