// Прості і складені числа: розпізнати, розкласти на прості множники (деревом), скільки простих у проміжку.
import { proste, rozklad, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const VARIANTY = ['просте', 'складене', 'ні те, ні те'];

function yakeChyslo(r: Vypadok, max: number): TrenZavdannia {
  // Половина — прості, решта — складені-«пастки» (непарні: 51, 57, 91) і зрідка 1.
  let n: number;
  const typ = r.chyslo(0, 9);
  if (typ === 0) n = 1;
  else if (typ <= 4) {
    n = r.chyslo(2, max);
    while (!proste(n)) n = r.chyslo(2, max);
  } else {
    n = r.chyslo(9, max);
    while (proste(n) || n % 2 === 0) n = r.chyslo(9, max);
  }
  const vidpovid = n === 1 ? 'ні те, ні те' : proste(n) ? 'просте' : 'складене';
  const dilnyk = rozklad(n)[0];
  return {
    pytannia: `Яке число ${n}?`,
    vidpovid,
    varianty: VARIANTY,
    pidkazka: 'Просте має рівно два дільники: 1 і саме себе. Пошукай дільник серед 3, 7, 11, 13…',
    rozviazok:
      n === 1 ? '1 має лише один дільник — ні просте, ні складене.' : proste(n) ? `${n} ділиться лише на 1 і на ${n}.` : `${n} = ${dilnyk} · ${n / dilnyk} — складене.`,
  };
}

function rozklasty(r: Vypadok, max: number): TrenZavdannia {
  let n = r.chyslo(12, max);
  while (rozklad(n).length < 3) n = r.chyslo(12, max);
  const m = rozklad(n);
  // Ланцюжок ділення: 60 : 2 = 30, 30 : 2 = 15, 15 : 3 = 5.
  let x = n;
  const kroky = m.slice(0, -1).map((p) => {
    const krok = `${x} : ${p} = ${x / p}`;
    x /= p;
    return krok;
  });
  return {
    pytannia: `Розклади на прості множники число ${n}. Запиши від меншого через «·» або пробіл.`,
    vidpovid: m.join(' · '),
    perevirka: (vvid) => {
      const chysla = (vvid.match(/\d+/g) || []).map(Number);
      return chysla.length > 1 && chysla.every(proste) && chysla.reduce((a, b) => a * b, 1) === n;
    },
    pidkazka: 'Діли на найменше просте число, доки ділиться: 2, потім 3, 5, 7…',
    rozviazok: `${kroky.join('; ')}. Отже, ${n} = ${m.join(' · ')}.`,
  };
}

function skilkyProstyh(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(10, 80);
  const b = a + r.chyslo(8, 20);
  const prosti = Array.from({ length: b - a + 1 }, (_, i) => a + i).filter(proste);
  return {
    pytannia: `Скільки простих чисел від ${a} до ${b} (включно)?`,
    vidpovid: prosti.length,
    pidkazka: 'Парні (крім 2) і ті, що закінчуються на 5, відкидай одразу. Решту перевір на 3, 7, 11.',
    rozviazok: prosti.length ? `Прості: ${prosti.join(', ')} — ${prosti.length}.` : 'Простих немає.',
  };
}

export default {
  rivni: ['просте чи складене до 50', 'розклад на прості множники', 'до 100 і скільки простих'],
  zavdannia(r, riven) {
    if (riven === 1) return yakeChyslo(r, 50);
    if (riven === 2) return r.shans(0.7) ? rozklasty(r, 100) : yakeChyslo(r, 100);
    return r.vybir([() => rozklasty(r, 400), () => skilkyProstyh(r), () => yakeChyslo(r, 100)])();
  },
} satisfies Henerator;
