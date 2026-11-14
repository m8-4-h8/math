// Додавання і віднімання дробів з різними знаменниками: спільний знаменник (НСК), додаткові множники,
// скорочення відповіді; три дроби; задачі. Мішані числа — окрема тема mishani-chysla.
import { nsd, nsk, tdrib, tvidpovidDrib, vidpovidDrib, rivnyiDrib, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

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

function tryDroby(r: Vypadok): TrenZavdannia {
  for (;;) {
    const zn = r.rizni(3, 2, 12);
    const s = nsk(nsk(zn[0], zn[1]), zn[2]);
    if (s > 36) continue;
    const ch = zn.map((b) => neskorotnyi(r, b));
    const v = ch.map((a, i) => (a * s) / zn[i]);
    const rez = v[0] + v[1] - v[2];
    if (rez <= 0) continue;
    return {
      pytannia: 'Обчисли. Відповідь скороти; якщо дріб неправильний, можна виділити цілу частину.',
      vyraz: `$${tdrib(ch[0], zn[0])} + ${tdrib(ch[1], zn[1])} - ${tdrib(ch[2], zn[2])} =$`,
      vidpovid: vidpovidDrib(rez, s),
      pokaz: `$${tvidpovidDrib(rez, s)}$`,
      perevirka: (vv) => {
        const m = vv.replace(/\s+/g, ' ').trim().match(/(\d+)\/(\d+)$/);
        return rivnyiDrib(rez, s)(vv) && (!m || nsd(Number(m[1]), Number(m[2])) === 1);
      },
      pidkazka: `Спільний знаменник усіх трьох дробів — ${s}.`,
      rozviazok: `$${tdrib(v[0], s)} + ${tdrib(v[1], s)} - ${tdrib(v[2], s)} = ${tdrib(rez, s)}$${
        nsd(rez, s) > 1 || rez > s ? ` $= ${tvidpovidDrib(rez, s)}$` : ''
      }`,
    };
  }
}

const ZADACHI: [string, (a: string, c: string) => string, boolean][] = [
  ['л', (a, c) => `У пляшці було ${a} л соку, Оля випила ${c} л. Скільки літрів соку лишилось?`, false],
  ['кг', (a, c) => `Марко купив ${a} кг яблук і ${c} кг груш. Скільки кілограмів фруктів він купив?`, true],
  ['км', (a, c) => `Туристи пройшли ${a} км до обіду і ${c} км після обіду. Скільки кілометрів вони пройшли?`, true],
  ['м', (a, c) => `Від стрічки завдовжки ${a} м відрізали ${c} м. Скільки метрів стрічки лишилось?`, false],
];

function zadacha(r: Vypadok): TrenZavdannia {
  for (;;) {
    const [b, d] = r.rizni(2, 2, 12);
    const [a, c] = [neskorotnyi(r, b), neskorotnyi(r, d)];
    const s = nsk(b, d);
    if (s > 36) continue;
    const [odynytsi, tekst, plius] = r.vybir(ZADACHI);
    const [x, y] = [(a * s) / b, (c * s) / d];
    if (!plius && x <= y) continue;
    const rez = plius ? x + y : x - y;
    const zn = plius ? '+' : '-';
    return {
      pytannia: tekst(`$${tdrib(a, b)}$`, `$${tdrib(c, d)}$`),
      vidpovid: vidpovidDrib(rez, s),
      pokaz: `$${tvidpovidDrib(rez, s)}$`,
      perevirka: rivnyiDrib(rez, s),
      odynytsi,
      pidkazka: `Спільний знаменник — ${s}.`,
      rozviazok: `$${tdrib(a, b)} ${zn} ${tdrib(c, d)} = ${tdrib(x, s)} ${zn} ${tdrib(y, s)} = ${tdrib(rez, s)}$${
        nsd(rez, s) > 1 || rez > s ? ` $= ${tvidpovidDrib(rez, s)}$` : ''
      } (${odynytsi})`,
    };
  }
}

export default {
  rivni: ['один знаменник ділиться на інший', 'будь-які знаменники', 'три дроби і задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return drobi(r, true);
    if (riven === 2) return drobi(r, false);
    return r.vybir([tryDroby, zadacha, (v: Vypadok) => drobi(v, false)])(r);
  },
} satisfies Henerator;
