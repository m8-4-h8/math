// Додавання і віднімання мішаних чисел (Істер § 6): цілі окремо, дробові окремо через спільний знаменник;
// дробова частина переповнилась — виділяємо цілу; замала — позичаємо одну цілу; ціле мінус мішане; задачі.
import { neskorotnyiChyselnyk, nsk, tdrib, tvidpovidDrib, vidpovidDrib, rivnyiDrib, ZRAZKY, zrazok, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const mishane = (t: number, o: number, d: number) => (o ? `${t}${tdrib(o, d)}` : `${t}`);

/** Що треба в задачі: 'prosto' — без переповнення і позичання, 'skladno' — з ними. */
type Vyd = 'prosto' | 'skladno';

function obchyslyty(r: Vypadok, vyd: Vyd, plius: boolean) {
  for (;;) {
    const [b, d] = vyd === 'prosto' && r.shans(0.5) ? (() => { const m = r.chyslo(2, 6); return r.peremishaty([m, m * r.chyslo(2, 3)]); })() : r.rizni(2, 2, 10);
    const [a, c] = [neskorotnyiChyselnyk(r, b), neskorotnyiChyselnyk(r, d)];
    const [t1, t2] = [r.chyslo(2, 9), r.chyslo(1, 5)];
    if (!plius && t1 <= t2) continue;
    const s = nsk(b, d);
    if (s > 30) continue;
    const [x, y] = [(a * s) / b, (c * s) / d];
    const skladno = plius ? x + y >= s : x < y;
    if ((vyd === 'skladno') !== skladno) continue;
    if (!plius && x === y) continue;
    return { a, b, c, d, t1, t2, s, x, y };
  }
}

function zadachaVyrazu(r: Vypadok, vyd: Vyd): TrenZavdannia {
  const plius = r.shans();
  const { a, b, c, d, t1, t2, s, x, y } = obchyslyty(r, vyd, plius);
  const vsoho = plius ? (t1 + t2) * s + x + y : (t1 - t2) * s + x - y;
  const zn = plius ? '+' : '-';
  const pozychaiemo = !plius && x < y;
  const perepovnylos = plius && x + y >= s;
  return {
    pytannia: `Обчисли. Відповідь запиши мішаним числом, наприклад «${zrazok(ZRAZKY.mishane, vidpovidDrib(vsoho, s), rivnyiDrib(vsoho, s))}».`,
    vyraz: `$${mishane(t1, a, b)} ${zn} ${mishane(t2, c, d)} =$`,
    vidpovid: vidpovidDrib(vsoho, s).slice(-1),
    pokaz: `$${tvidpovidDrib(vsoho, s)}$`,
    perevirka: rivnyiDrib(vsoho, s),
    pidkazka: pozychaiemo
      ? `Від $${tdrib(x, s)}$ не відняти $${tdrib(y, s)}$ — позич одну цілу: $${mishane(t1, x, s)} = ${t1 - 1}${tdrib(x + s, s)}$.`
      : `Цілі ${plius ? 'додай' : 'відніми'} окремо, дробові — окремо, спершу звівши їх до знаменника ${s}.`,
    rozviazok: `$${mishane(t1, a, b)} ${zn} ${mishane(t2, c, d)} = ${mishane(t1, x, s)} ${zn} ${mishane(t2, y, s)}${
      pozychaiemo ? ` = ${t1 - 1}${tdrib(x + s, s)} - ${mishane(t2, y, s)}` : ''
    }${perepovnylos ? ` = ${t1 + t2}${tdrib(x + y, s)}` : ''} = ${tvidpovidDrib(vsoho, s)}$`,
  };
}

function vidTsiloho(r: Vypadok): TrenZavdannia {
  const t1 = r.chyslo(2, 10);
  const t2 = r.chyslo(0, t1 - 1);
  const d = r.chyslo(2, 12);
  const c = neskorotnyiChyselnyk(r, d);
  const vsoho = (t1 - t2) * d - c;
  return {
    pytannia: `Обчисли. Відповідь запиши мішаним числом, наприклад «${zrazok(ZRAZKY.mishane, vidpovidDrib(vsoho, d), rivnyiDrib(vsoho, d))}».`,
    vyraz: `$${t1} - ${mishane(t2, c, d)} =$`,
    vidpovid: vidpovidDrib(vsoho, d).slice(-1),
    pokaz: `$${tvidpovidDrib(vsoho, d)}$`,
    perevirka: rivnyiDrib(vsoho, d),
    pidkazka: `Позич одну цілу: $${t1} = ${t1 - 1}${tdrib(d, d)}$.`,
    rozviazok: `$${t1} - ${mishane(t2, c, d)} = ${t1 - 1}${tdrib(d, d)} - ${mishane(t2, c, d)} = ${tvidpovidDrib(vsoho, d)}$`,
  };
}

const ZADACHI: { tekst: (a: string, c: string) => string; plius: boolean; odynytsi: string }[] = [
  { tekst: (a, c) => `Від мотузки завдовжки ${a} м відрізали ${c} м. Скільки метрів мотузки залишилось?`, plius: false, odynytsi: 'м' },
  { tekst: (a, c) => `У бідоні було ${a} л молока, у глечик відлили ${c} л. Скільки літрів молока лишилось у бідоні?`, plius: false, odynytsi: 'л' },
  { tekst: (a, c) => `У першому кошику ${a} кг грибів, у другому — ${c} кг. Скільки кілограмів грибів у двох кошиках?`, plius: true, odynytsi: 'кг' },
  { tekst: (a, c) => `Мама купила ${a} кг яблук і ${c} кг слив. Скільки кілограмів фруктів купила мама?`, plius: true, odynytsi: 'кг' },
];

function zadacha(r: Vypadok): TrenZavdannia {
  const z = r.vybir(ZADACHI);
  const { a, b, c, d, t1, t2, s, x, y } = obchyslyty(r, r.vybir(['prosto', 'skladno'] as const), z.plius);
  const vsoho = z.plius ? (t1 + t2) * s + x + y : (t1 - t2) * s + x - y;
  const zn = z.plius ? '+' : '-';
  return {
    pytannia: z.tekst(`$${mishane(t1, a, b)}$`, `$${mishane(t2, c, d)}$`),
    vidpovid: vidpovidDrib(vsoho, s).slice(-1),
    pokaz: `$${tvidpovidDrib(vsoho, s)}$`,
    perevirka: rivnyiDrib(vsoho, s),
    odynytsi: z.odynytsi,
    pidkazka: `Запиши дію: $${mishane(t1, a, b)} ${zn} ${mishane(t2, c, d)}$. Спільний знаменник — ${s}.`,
    rozviazok: `$${mishane(t1, a, b)} ${zn} ${mishane(t2, c, d)} = ${mishane(t1, x, s)} ${zn} ${mishane(t2, y, s)} = ${tvidpovidDrib(vsoho, s)}$ (${z.odynytsi})`,
  };
}

function vikno(r: Vypadok): TrenZavdannia {
  // □ + c = suma: шукаємо невідомий доданок відніманням.
  const { a, b, c, d, t1, t2, s, x, y } = obchyslyty(r, 'skladno', true);
  const suma = (t1 + t2) * s + x + y;
  return {
    pytannia: `Знайди невідомий доданок. Відповідь запиши мішаним числом, наприклад «${zrazok(ZRAZKY.mishane, vidpovidDrib(t1 * s + x, s), rivnyiDrib(t1 * s + x, s))}».`,
    vyraz: `$\\square + ${mishane(t2, c, d)} = ${tvidpovidDrib(suma, s)}$`,
    vidpovid: vidpovidDrib(t1 * b + a, b).slice(-1),
    pokaz: `$${mishane(t1, a, b)}$`,
    perevirka: rivnyiDrib(t1 * b + a, b),
    pidkazka: 'Невідомий доданок = сума − відомий доданок.',
    rozviazok: `$${tvidpovidDrib(suma, s)} - ${mishane(t2, c, d)} = ${mishane(t1, a, b)}$`,
  };
}

export default {
  rivni: ['без позичання', 'переповнення і позичання', 'задачі і невідомий доданок'],
  zavdannia(r, riven) {
    if (riven === 1) return zadachaVyrazu(r, 'prosto');
    if (riven === 2) return r.vybir([(v: Vypadok) => zadachaVyrazu(v, 'skladno'), (v: Vypadok) => zadachaVyrazu(v, 'skladno'), vidTsiloho])(r);
    return r.vybir([zadacha, zadacha, vikno, (v: Vypadok) => zadachaVyrazu(v, 'skladno')])(r);
  },
} satisfies Henerator;
