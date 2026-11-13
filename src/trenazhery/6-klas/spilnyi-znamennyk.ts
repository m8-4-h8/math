// Найменший спільний знаменник (Істер § 4): додатковий множник; чотири способи знайти НСЗ (більший ділиться на
// менший, взаємно прості — добуток, перебір кратних більшого, розклад); зведення двох дробів; три дроби;
// чи може число бути спільним знаменником.
import { neskorotnyiChyselnyk, nsd, nsk, rozklad, tdrib, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

/** Кратні більшого знаменника до першого, що ділиться на інші: «8, 16, 24». */
function kratni(znamennyky: number[]) {
  const b = Math.max(...znamennyky);
  const out: number[] = [];
  for (let k = b; ; k += b) {
    out.push(k);
    if (znamennyky.every((z) => k % z === 0)) return out;
  }
}

function dodatkovyi(r: Vypadok): TrenZavdannia {
  const b = r.chyslo(2, 12);
  const a = neskorotnyiChyselnyk(r, b);
  const k = r.chyslo(2, 8);
  const chyselnyk = r.shans(0.6);
  return chyselnyk
    ? {
        pytannia: `Зведи дріб $${tdrib(a, b)}$ до знаменника ${b * k}. Який вийде чисельник?`,
        vyraz: `$${tdrib(a, b)} = \\frac{\\square}{${b * k}}$`,
        vidpovid: a * k,
        pidkazka: `Додатковий множник: ${b * k} : ${b}.`,
        rozviazok: `${b * k} : ${b} = ${k} — додатковий множник; ${a} · ${k} = ${a * k}.`,
      }
    : {
        pytannia: `Дріб $${tdrib(a, b)}$ зводять до знаменника ${b * k}. Який додатковий множник?`,
        vidpovid: k,
        pidkazka: 'Додатковий множник = новий знаменник : старий.',
        rozviazok: `${b * k} : ${b} = ${k}; $${tdrib(a, b)} = ${tdrib(a * k, b * k)}$`,
      };
}

function sposib(b: number, d: number) {
  const [m, v] = b < d ? [b, d] : [d, b];
  if (v % m === 0) return `${v} ділиться на ${m}, тож спільний знаменник — ${v}.`;
  if (nsd(b, d) === 1) return `У ${b} і ${d} немає спільних дільників, тож ${b} · ${d} = ${b * d}.`;
  return `Кратні ${v}: ${kratni([b, d]).join(', ')} — перше, що ділиться на ${m}, це ${nsk(b, d)}.`;
}

/** Пари знаменників певного виду: 'dilytsia' — більший ділиться на менший, 'prosti' — взаємно прості, 'pereber' — інші. */
function para(r: Vypadok, vyd: 'dilytsia' | 'prosti' | 'pereber', maks: number): [number, number] {
  for (;;) {
    const [b, d] = r.rizni(2, 2, maks);
    const [m, v] = b < d ? [b, d] : [d, b];
    const tsei = v % m === 0 ? 'dilytsia' : nsd(b, d) === 1 ? 'prosti' : 'pereber';
    if (tsei !== vyd) continue;
    if (vyd === 'prosti' && b * d > 120) continue;
    if (vyd === 'pereber' && nsk(b, d) > 120) continue;
    return [b, d];
  }
}

function naimenshyi(r: Vypadok, vyd: 'dilytsia' | 'prosti' | 'pereber'): TrenZavdannia {
  const [b, d] = para(r, vyd, vyd === 'pereber' ? 30 : 16);
  const [a, c] = [neskorotnyiChyselnyk(r, b), neskorotnyiChyselnyk(r, d)];
  const s = nsk(b, d);
  return {
    pytannia: `Знайди найменший спільний знаменник дробів $${tdrib(a, b)}$ і $${tdrib(c, d)}$.`,
    vidpovid: s,
    pidkazka:
      vyd === 'dilytsia'
        ? `Чи ділиться ${Math.max(b, d)} на ${Math.min(b, d)}?`
        : vyd === 'prosti'
          ? `Чи є в ${b} і ${d} спільні дільники, крім 1?`
          : `Перебирай кратні ${Math.max(b, d)}, доки не трапиться число, що ділиться на ${Math.min(b, d)}.`,
    rozviazok: sposib(b, d),
  };
}

function zvesty(r: Vypadok): TrenZavdannia {
  const [b, d] = para(r, r.vybir(['pereber', 'pereber', 'prosti'] as const), 20);
  const [a, c] = [neskorotnyiChyselnyk(r, b), neskorotnyiChyselnyk(r, d)];
  const s = nsk(b, d);
  const pershyi = r.shans();
  const [n, z] = pershyi ? [a, b] : [c, d];
  return {
    pytannia: `Зведи дроби $${tdrib(a, b)}$ і $${tdrib(c, d)}$ до найменшого спільного знаменника. Який чисельник буде в ${pershyi ? 'першого' : 'другого'} дробу?`,
    vyraz: `$${tdrib(n, z)} = \\frac{\\square}{${s}}$`,
    vidpovid: (n * s) / z,
    pidkazka: `Найменший спільний знаменник — ${s}. Додатковий множник: ${s} : ${z}.`,
    rozviazok: `Спільний знаменник ${s}; ${s} : ${z} = ${s / z}; ${n} · ${s / z} = ${(n * s) / z}.`,
  };
}

function tryDroby(r: Vypadok): TrenZavdannia {
  for (;;) {
    const zn = r.rizni(3, 2, 12).sort((x, y) => x - y);
    const s = nsk(nsk(zn[0], zn[1]), zn[2]);
    if (s > 72 || s === zn[2]) continue;
    const droby = zn.map((b) => `$${tdrib(neskorotnyiChyselnyk(r, b), b)}$`);
    return {
      pytannia: `Знайди найменший спільний знаменник дробів ${droby[0]}, ${droby[1]} і ${droby[2]}.`,
      vidpovid: s,
      pidkazka: `Перебирай кратні ${zn[2]}: шукай число, що ділиться і на ${zn[0]}, і на ${zn[1]}.`,
      rozviazok: `Кратні ${zn[2]}: ${kratni(zn).join(', ')} — ${s} ділиться на ${zn[0]}, ${zn[1]} і ${zn[2]}.`,
    };
  }
}

/** Прості множники НСК: усі множники a і ті множники b, яких бракує. */
function rozkladNsk(a: number, b: number) {
  const zapas = rozklad(a);
  const out = [...zapas];
  for (const m of rozklad(b)) {
    const i = zapas.indexOf(m);
    if (i >= 0) zapas.splice(i, 1);
    else out.push(m);
  }
  return out.sort((x, y) => x - y);
}

function velyki(r: Vypadok): TrenZavdannia {
  for (;;) {
    const [b, d] = r.rizni(2, 12, 45);
    const s = nsk(b, d);
    if (nsd(b, d) < 3 || s > 360 || s === Math.max(b, d)) continue;
    return {
      pytannia: `Знайди найменший спільний знаменник дробів $${tdrib(neskorotnyiChyselnyk(r, b), b)}$ і $${tdrib(neskorotnyiChyselnyk(r, d), d)}$.`,
      vidpovid: s,
      pidkazka: `Розклади ${b} і ${d} на прості множники або перебирай кратні ${Math.max(b, d)}.`,
      rozviazok: `${b} = ${rozklad(b).join(' · ')}, ${d} = ${rozklad(d).join(' · ')}; беремо множники ${b} і доклеюємо, яких бракує з ${d}: ${rozkladNsk(b, d).join(' · ')} = ${s}.`,
    };
  }
}

function chyMozhe(r: Vypadok): TrenZavdannia {
  for (;;) {
    const [b, d] = r.rizni(2, 3, 15);
    const s = nsk(b, d);
    const tak = r.shans();
    // «так»: кратне НСК (можливо, не найменше); «ні»: ділиться лише на один зі знаменників
    const n = tak ? s * r.chyslo(1, 3) : Math.max(b, d) * r.chyslo(2, 6);
    if (n > 150 || (!tak && n % s === 0)) continue;
    const pravda = n % b === 0 && n % d === 0;
    return {
      pytannia: `Чи може число ${n} бути спільним знаменником дробів $${tdrib(1, b)}$ і $${tdrib(1, d)}$?`,
      vidpovid: pravda ? 'Так' : 'Ні',
      varianty: ['Так', 'Ні'],
      pidkazka: `Спільний знаменник має ділитися і на ${b}, і на ${d}.`,
      rozviazok: pravda
        ? `Так: ${n} : ${b} = ${n / b} і ${n} : ${d} = ${n / d}.${n !== s ? ` Але найменший спільний знаменник — ${s}.` : ''}`
        : `Ні: ${n} не ділиться на ${n % b ? b : d}.`,
    };
  }
}

export default {
  rivni: ['додатковий множник, прості випадки', 'найменший спільний знаменник, зведення', 'три дроби, великі знаменники'],
  zavdannia(r, riven) {
    if (riven === 1)
      return r.vybir([dodatkovyi, dodatkovyi, (v: Vypadok) => naimenshyi(v, 'dilytsia'), (v: Vypadok) => naimenshyi(v, 'prosti')])(r);
    if (riven === 2) return r.vybir([(v: Vypadok) => naimenshyi(v, 'pereber'), (v: Vypadok) => naimenshyi(v, 'pereber'), zvesty, chyMozhe])(r);
    return r.vybir([tryDroby, velyki, zvesty, chyMozhe])(r);
  },
} satisfies Henerator;
