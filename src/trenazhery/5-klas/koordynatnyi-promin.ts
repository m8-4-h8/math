// Координатний промінь і шкала: координата точки за малюнком (ціна поділки 1, 2, 5, 10, 0,1, 1/n),
// ціна поділки, відстань між точками, яка точка правіше.
import { des, nsd, rivnyiDrib, tdrib, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';
import { promin } from '../malunky.ts';

const NAZVY = ['A', 'B', 'C', 'D', 'K', 'M', 'P'];

function koordynata(r: Vypadok, kroky: number[]): TrenZavdannia {
  const krok = r.vybir(kroky);
  const dovzhyna = krok === 1 ? 10 : 12;
  // Підписи не під кожною поділкою — ціну поділки треба знайти, а точка ніколи не стоїть на підписаній рисці
  // (інакше відповідь видно на малюнку).
  const pidpysy = krok === 1 ? 5 : r.vybir([2, 5]);
  const podilka = r.krim(1, dovzhyna, Array.from({ length: dovzhyna + 1 }, (_, i) => i).filter((i) => i % pidpysy === 0));
  const nazva = r.vybir(NAZVY);
  return {
    pytannia: `Яка координата точки ${nazva}?`,
    malunok: promin(dovzhyna, pidpysy, (i) => String(i * krok), [{ nazva, podilka }]),
    vidpovid: podilka * krok,
    pidkazka: krok === 1 ? 'Порахуй поділки від найближчого підпису.' : `Сусідні підписи відрізняються на ${pidpysy * krok}, а між ними ${pidpysy} ${pidpysy < 5 ? 'поділки' : 'поділок'}. Скільки припадає на одну поділку?`,
    rozviazok: `Одна поділка — ${krok}. Точка на ${podilka}-й поділці: ${podilka} · ${krok} = ${podilka * krok}.`,
  };
}

function desiatkova(r: Vypadok): TrenZavdannia {
  const dovzhyna = 20;
  const podilka = r.krim(1, dovzhyna, [10, 20]);
  const nazva = r.vybir(NAZVY);
  return {
    pytannia: `Яка координата точки ${nazva}? Запиши десятковим дробом.`,
    malunok: promin(dovzhyna, 10, (i) => String(i / 10), [{ nazva, podilka }]),
    vidpovid: des(podilka, 1),
    pidkazka: 'Одиничний відрізок поділено на 10 поділок — кожна 0,1.',
    rozviazok: `${podilka} поділок по 0,1 — це ${des(podilka, 1)}.`,
  };
}

function drib(r: Vypadok): TrenZavdannia {
  const d = r.vybir([3, 4, 5, 6]);
  const dovzhyna = 2 * d;
  let n = r.chyslo(1, dovzhyna - 1);
  while (n % d === 0) n = r.chyslo(1, dovzhyna - 1);
  const nazva = r.vybir(NAZVY);
  const [a, b] = [n / nsd(n, d), d / nsd(n, d)];
  return {
    pytannia: `Яка координата точки ${nazva}? Запиши дробом через риску, наприклад 2/3.`,
    malunok: promin(dovzhyna, d, (i) => String(i / d), [{ nazva, podilka: n }]),
    vidpovid: `${a}/${b}`,
    perevirka: rivnyiDrib(n, d),
    pidkazka: `Одиничний відрізок поділено на ${d} рівних частин — кожна $${tdrib(1, d)}$.`,
    rozviazok: `${n} поділок по $${tdrib(1, d)}$ — це $${tdrib(n, d)}$.`,
  };
}

function tsinaPodilky(r: Vypadok): TrenZavdannia {
  const krok = r.vybir([2, 5, 10, 20, 25, 50]);
  const pod = r.vybir([2, 4, 5, 10].filter((p) => p * krok <= 200));
  const a = krok * pod * r.chyslo(0, 4);
  return {
    pytannia: `Між рисками ${a} і ${a + krok * pod} на шкалі ${pod} ${pod < 5 ? 'поділки' : 'поділок'}. Яка ціна поділки?`,
    vidpovid: krok,
    pidkazka: 'Різницю між підписами поділи на кількість поділок.',
    rozviazok: `(${a + krok * pod} − ${a}) : ${pod} = ${krok * pod} : ${pod} = ${krok}`,
  };
}

function vidstan(r: Vypadok): TrenZavdannia {
  const [a, b] = r.rizni(2, 0, 60).sort((x, y) => x - y);
  const [p, q] = r.rizni(2, 0, NAZVY.length - 1).map((i) => NAZVY[i]);
  if (r.shans()) {
    return {
      pytannia: `Скільки одиничних відрізків між точками ${p}(${a}) і ${q}(${b})?`,
      vidpovid: b - a,
      pidkazka: 'Від більшої координати відніми меншу.',
      rozviazok: `${b} − ${a} = ${b - a}`,
    };
  }
  const pravishe = r.shans();
  return {
    pytannia: `Точки ${p}(${a}) і ${q}(${b}). Яка з них лежить ${pravishe ? 'правіше' : 'лівіше'} на координатному промені?`,
    vidpovid: pravishe ? q : p,
    varianty: [p, q],
    pidkazka: 'Що більша координата, то далі вправо від O.',
    rozviazok: `${b} > ${a}, тож ${q} правіше, а ${p} лівіше.`,
  };
}

export default {
  rivni: ['поділка — одиниця', 'ціна поділки 2, 5, 10', 'десяті й дроби, відстань'],
  zavdannia(r, riven) {
    if (riven === 1) return r.shans(0.8) ? koordynata(r, [1]) : vidstan(r);
    if (riven === 2) return r.vybir([() => koordynata(r, [2, 5, 10]), () => koordynata(r, [2, 5, 10]), () => tsinaPodilky(r)])();
    return r.vybir([desiatkova, drib, vidstan, tsinaPodilky, (rr: Vypadok) => koordynata(rr, [5, 10, 20, 50])])(r);
  },
} satisfies Henerator;
