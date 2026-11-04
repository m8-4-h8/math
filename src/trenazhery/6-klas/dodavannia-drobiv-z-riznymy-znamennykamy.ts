// Додавання і віднімання дробів з різними знаменниками: спільний знаменник (НСК), додаткові множники,
// скорочення відповіді; мішані числа (цілі окремо, дробові окремо; позичаємо одиницю).
import { nsd, nsk, tdrib, tvidpovidDrib, vidpovidDrib, rivnyiDrib, ZRAZKY, zrazok, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

function neskorotnyi(r: Vypadok, b: number) {
  for (;;) {
    const a = r.chyslo(1, b - 1);
    if (nsd(a, b) === 1) return a;
  }
}

/** Пара знаменників: на рівні 1 один ділиться на інший, далі — довільні. */
function znamennyky(r: Vypadok, kratni: boolean) {
  if (kratni) {
    const b = r.chyslo(2, 6);
    return r.peremishaty([b, b * r.chyslo(2, 3)]);
  }
  return r.rizni(2, 2, 12);
}

function drobi(r: Vypadok, kratni: boolean): TrenZavdannia {
  for (;;) {
    const [b, d] = znamennyky(r, kratni);
    const [a, c] = [neskorotnyi(r, b), neskorotnyi(r, d)];
    const plius = r.shans();
    const s = nsk(b, d);
    if (s > 36) continue; // без громіздких знаменників на кшталт 132
    const [x, y] = [(a * s) / b, (c * s) / d];
    if (!plius && x <= y) continue;
    const rez = plius ? x + y : x - y;
    const zn = plius ? '+' : '-';
    const skorochuietsia = nsd(rez, s) > 1;
    return {
      pytannia: 'Обчисли. Відповідь скороти; якщо дріб неправильний, можна виділити цілу частину.',
      vyraz: `$${tdrib(a, b)} ${zn} ${tdrib(c, d)} =$`,
      vidpovid: vidpovidDrib(rez, s),
      pokaz: `$${tvidpovidDrib(rez, s)}$`,
      perevirka: (v) => {
        // Нескоротний запис: «7/6», «1 1/6», ціле число — але не «4/6».
        const m = v.replace(/\s+/g, ' ').trim().match(/(\d+)\/(\d+)$/);
        return rivnyiDrib(rez, s)(v) && (!m || nsd(Number(m[1]), Number(m[2])) === 1);
      },
      pidkazka: `Спільний знаменник — НСК(${b}; ${d}) = ${s}. Додаткові множники: ${s / b} і ${s / d}.`,
      rozviazok: `$${tdrib(a, b)} ${zn} ${tdrib(c, d)} = ${tdrib(x, s)} ${zn} ${tdrib(y, s)} = ${tdrib(rez, s)}$${
        skorochuietsia || rez > s ? ` $= ${tvidpovidDrib(rez, s)}$` : ''
      }`,
    };
  }
}

const mishane = (t: number, o: number, d: number) => (o ? `${t}${tdrib(o, d)}` : `${t}`);

function mishani(r: Vypadok): TrenZavdannia {
  for (;;) {
    const [b, d] = r.rizni(2, 2, 8);
    const [a, c] = [neskorotnyi(r, b), neskorotnyi(r, d)];
    const [t1, t2] = [r.chyslo(2, 7), r.chyslo(1, 4)];
    const plius = r.shans();
    if (!plius && t1 <= t2) continue;
    const s = nsk(b, d);
    if (s > 30) continue;
    const [x, y] = [(a * s) / b, (c * s) / d];
    const vsoho = plius ? (t1 + t2) * s + x + y : (t1 - t2) * s + x - y;
    const zn = plius ? '+' : '-';
    const pozychaiemo = !plius && x < y;
    return {
      pytannia: `Обчисли. Відповідь запиши мішаним числом, наприклад «${zrazok(ZRAZKY.mishane, vidpovidDrib(vsoho, s), rivnyiDrib(vsoho, s))}».`,
      vyraz: `$${mishane(t1, a, b)} ${zn} ${mishane(t2, c, d)} =$`,
      vidpovid: vidpovidDrib(vsoho, s).slice(-1),
      pokaz: `$${tvidpovidDrib(vsoho, s)}$`,
      perevirka: rivnyiDrib(vsoho, s),
      pidkazka: pozychaiemo
        ? `Від $${tdrib(x, s)}$ не відняти $${tdrib(y, s)}$ — позич одиницю: $${mishane(t1, x, s)} = ${t1 - 1}${tdrib(x + s, s)}$.`
        : `Цілі ${plius ? 'додай' : 'відніми'} окремо, дробові — окремо, спершу звівши їх до знаменника ${s}.`,
      rozviazok: `$${mishane(t1, a, b)} ${zn} ${mishane(t2, c, d)} = ${mishane(t1, x, s)} ${zn} ${mishane(t2, y, s)}${
        pozychaiemo ? ` = ${t1 - 1}${tdrib(x + s, s)} - ${mishane(t2, y, s)}` : ''
      } = ${tvidpovidDrib(vsoho, s)}$`,
    };
  }
}

export default {
  rivni: ['один знаменник ділиться на інший', 'будь-які знаменники', 'мішані числа'],
  zavdannia(r, riven) {
    if (riven === 1) return drobi(r, true);
    if (riven === 2) return drobi(r, false);
    return r.shans(0.7) ? mishani(r) : drobi(r, false);
  },
} satisfies Henerator;
