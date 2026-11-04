// Додавання і віднімання дробів з однаковими знаменниками та мішаних чисел; 1 − дріб; позичаємо ціле.
import { nsd, tdrib, tvidpovidDrib, vidpovidDrib, rivnyiDrib, ZRAZKY, zrazok, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const mishane = (t: number, o: number, d: number) => (o ? `${t}${tdrib(o, d)}` : `${t}`);

function prosti(r: Vypadok): TrenZavdannia {
  const d = r.chyslo(5, 15);
  const plius = r.shans();
  let a = r.chyslo(1, d - 2);
  let b = r.chyslo(1, d - 1 - a);
  if (!plius) [a, b] = [a + b, a];
  const rez = plius ? a + b : a - b;
  return {
    pytannia: 'Обчисли. Знаменник не змінюється.',
    vyraz: `$${tdrib(a, d)} ${plius ? '+' : '-'} ${tdrib(b, d)} =$`,
    vidpovid: vidpovidDrib(rez, d),
    perevirka: rivnyiDrib(rez, d),
    pidkazka: `Чисельники ${plius ? 'додаємо' : 'віднімаємо'}: ${a} ${plius ? '+' : '−'} ${b}. Знаменник ${d} лишається.`,
    rozviazok: `$\\frac{${a} ${plius ? '+' : '-'} ${b}}{${d}} = ${tdrib(rez, d)}$${nsd(rez, d) > 1 ? ` $= ${tvidpovidDrib(rez, d)}$` : ''}`,
  };
}

function vidOdnoho(r: Vypadok): TrenZavdannia {
  const d = r.chyslo(3, 12);
  const n = r.chyslo(1, d - 1);
  const tsile = r.chyslo(1, 4);
  return {
    pytannia: 'Обчисли.',
    vyraz: `$${tsile} - ${tdrib(n, d)} =$`,
    vidpovid: vidpovidDrib(tsile * d - n, d),
    perevirka: rivnyiDrib(tsile * d - n, d),
    pidkazka: `Одна одиниця — це $${tdrib(d, d)}$.`,
    rozviazok:
      tsile === 1
        ? `$${tdrib(d, d)} - ${tdrib(n, d)} = ${tdrib(d - n, d)}$${nsd(d - n, d) > 1 ? ` $= ${tvidpovidDrib(d - n, d)}$` : ''}`
        : `$${tsile} - ${tdrib(n, d)} = ${tsile - 1}${tdrib(d, d)} - ${tdrib(n, d)} = ${mishane(tsile - 1, d - n, d)}$`,
  };
}

function mishaniPlius(r: Vypadok): TrenZavdannia {
  const d = r.chyslo(3, 11);
  const [t1, t2] = [r.chyslo(1, 6), r.chyslo(1, 5)];
  const o1 = r.chyslo(1, d - 1);
  const o2 = r.krim(1, d - 1, [d - o1]); // без «рівно ціле» — тоді вийшло б не мішане число
  const sumaO = o1 + o2;
  const vsoho = (t1 + t2) * d + sumaO;
  return {
    pytannia: `Обчисли. Відповідь запиши мішаним числом, наприклад «${zrazok(ZRAZKY.mishane, vidpovidDrib(vsoho, d), rivnyiDrib(vsoho, d))}».`,
    vyraz: `$${mishane(t1, o1, d)} + ${mishane(t2, o2, d)} =$`,
    vidpovid: vidpovidDrib(vsoho, d).slice(-1),
    perevirka: rivnyiDrib(vsoho, d),
    pidkazka: 'Цілі додай до цілих, дробові — до дробових. Якщо дробова частина вийшла неправильною, виділи з неї ціле.',
    rozviazok:
      sumaO < d
        ? `$${t1} + ${t2} = ${t1 + t2}$, $${tdrib(o1, d)} + ${tdrib(o2, d)} = ${tdrib(sumaO, d)}$; разом $${tvidpovidDrib(vsoho, d)}$`
        : `$${t1} + ${t2} = ${t1 + t2}$, $${tdrib(o1, d)} + ${tdrib(o2, d)} = ${tdrib(sumaO, d)} = ${mishane(1, sumaO - d, d)}$; разом $${tvidpovidDrib(vsoho, d)}$`,
  };
}

function mishaniMinus(r: Vypadok): TrenZavdannia {
  const d = r.chyslo(3, 11);
  const t2 = r.chyslo(1, 4);
  const t1 = t2 + r.chyslo(1, 4);
  const o1 = r.chyslo(1, d - 1);
  const o2 = r.krim(1, d - 1, [o1]);
  const rez = t1 * d + o1 - (t2 * d + o2);
  const pozychaty = o1 < o2;
  return {
    pytannia: 'Обчисли. Відповідь запиши дробом або мішаним числом.',
    vyraz: `$${mishane(t1, o1, d)} - ${mishane(t2, o2, d)} =$`,
    vidpovid: vidpovidDrib(rez, d).slice(-1),
    perevirka: rivnyiDrib(rez, d),
    pidkazka: pozychaty ? `${o1}/${d} менше за ${o2}/${d} — позич одну одиницю: $${t1}${tdrib(o1, d)} = ${t1 - 1}${tdrib(o1 + d, d)}$.` : 'Цілі віднімай від цілих, дробові — від дробових.',
    rozviazok: pozychaty
      ? `$${mishane(t1, o1, d)} - ${mishane(t2, o2, d)} = ${t1 - 1}${tdrib(o1 + d, d)} - ${mishane(t2, o2, d)} = ${tvidpovidDrib(rez, d)}$`
      : `$${t1} - ${t2} = ${t1 - t2}$, $${tdrib(o1, d)} - ${tdrib(o2, d)} = ${tdrib(o1 - o2, d)}$; разом $${tvidpovidDrib(rez, d)}$`,
  };
}

function zadacha(r: Vypadok): TrenZavdannia {
  const d = r.vybir([5, 6, 7, 8, 9, 10, 12]);
  const a = r.chyslo(1, d - 2);
  const b = r.chyslo(1, d - 1 - a);
  const s = r.vybir([
    { umova: `У перший день прочитали $${tdrib(a, d)}$ книжки, у другий — $${tdrib(b, d)}$. Яку частину книжки ще не прочитали?` },
    { umova: `Першого дня пофарбували $${tdrib(a, d)}$ паркану, другого — $${tdrib(b, d)}$. Яку частину паркану лишилося пофарбувати?` },
  ]);
  const rez = d - a - b;
  return {
    pytannia: `${s.umova} Запиши дріб через риску.`,
    vidpovid: vidpovidDrib(rez, d),
    perevirka: rivnyiDrib(rez, d),
    pidkazka: 'Уся книжка (весь паркан) — це 1, тобто $\\frac{' + d + '}{' + d + '}$.',
    rozviazok: `$${tdrib(a, d)} + ${tdrib(b, d)} = ${tdrib(a + b, d)}$; $1 - ${tdrib(a + b, d)} = ${tdrib(rez, d)}$${nsd(rez, d) > 1 ? ` $= ${tvidpovidDrib(rez, d)}$` : ''}`,
  };
}

export default {
  rivni: ['однакові знаменники', 'мішані числа і 1 − дріб', 'позичаємо ціле і задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return prosti(r);
    if (riven === 2) return r.vybir([mishaniPlius, vidOdnoho, prosti])(r);
    return r.vybir([mishaniMinus, mishaniMinus, mishaniPlius, zadacha])(r);
  },
} satisfies Henerator;
