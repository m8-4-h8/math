// Звичайні дроби в десяткові (Істер § 7): ділимо чисельник на знаменник; скінченний дріб, якщо в знаменнику
// нескоротного дробу лише 2 і 5; інакше — нескінченний періодичний, період у дужках: 0,(3), 0,1(6).
import { nsd, rozklad, skorotyty, tdrib, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';
import { desiatkovyi } from '../desiatkovyi-zapys.ts';

const tilky25 = (b: number) => rozklad(b).every((m) => m === 2 || m === 5);
const tex = (zapys: string) => zapys.replace(',', '{,}');

function neskorotnyi(r: Vypadok, b: number) {
  for (;;) {
    const a = r.chyslo(1, b - 1);
    if (nsd(a, b) === 1) return a;
  }
}

function skinchennyi(r: Vypadok, mishane: boolean): TrenZavdannia {
  const b = r.vybir([2, 4, 5, 8, 10, 16, 20, 25, 40, 50, 80, 125, 200]);
  const a = neskorotnyi(r, b);
  const t = mishane ? r.chyslo(1, 9) : 0;
  const { zapys } = desiatkovyi(t * b + a, b);
  const k = [10, 100, 1000, 10000].find((s) => s % b === 0)!;
  return {
    pytannia: mishane ? `Запиши мішане число $${t}${tdrib(a, b)}$ десятковим дробом.` : `Запиши дріб $${tdrib(a, b)}$ десятковим.`,
    vidpovid: zapys,
    pidkazka: `Поділи ${a} на ${b} або домнож дріб до знаменника ${k}.`,
    rozviazok: mishane
      ? `$${tdrib(a, b)} = ${tdrib((a * k) / b, k)}$ = ${desiatkovyi(a, b).zapys}, тож $${t}${tdrib(a, b)}$ = ${zapys}`
      : `$${tdrib(a, b)} = ${tdrib((a * k) / b, k)}$ = ${zapys}`,
  };
}

function chySkinchennyi(r: Vypadok): TrenZavdannia {
  for (;;) {
    const b0 = r.vybir([6, 12, 14, 15, 18, 20, 21, 24, 25, 30, 35, 40, 45, 48, 50, 60, 75, 80]);
    const a0 = r.chyslo(1, b0 - 1);
    const [a, b] = skorotyty(a0, b0);
    if (b === 1) continue;
    const tak = tilky25(b);
    const skorochenyi = a !== a0;
    return {
      pytannia: `Чи можна записати дріб $${tdrib(a0, b0)}$ скінченним десятковим дробом?`,
      vidpovid: tak ? 'Так' : 'Ні',
      varianty: ['Так', 'Ні'],
      pidkazka: skorochenyi ? 'Спершу скороти дріб, а потім розклади знаменник на прості множники.' : 'Розклади знаменник на прості множники: чи є там щось, крім 2 і 5?',
      rozviazok: `${skorochenyi ? `$${tdrib(a0, b0)} = ${tdrib(a, b)}$; ` : ''}${b} = ${rozklad(b).join(' · ')} — ${
        tak ? 'лише 2 і 5, тож так' : `є множник ${rozklad(b).find((m) => m !== 2 && m !== 5)}, тож ні`
      }.`,
    };
  }
}

function yakyiSkinchennyi(r: Vypadok): TrenZavdannia {
  for (;;) {
    const tak = r.vybir([8, 16, 20, 25, 40, 50, 80]);
    const ni = r.rizni(2, 0, 7).map((i) => [3, 6, 7, 9, 12, 15, 30, 45][i]);
    const droby = [tak, ...ni].map((b) => `${neskorotnyi(r, b)}/${b}`);
    if (new Set(droby).size < 3) continue;
    const pravylnyi = droby[0];
    return {
      pytannia: 'Який із дробів можна записати скінченним десятковим дробом?',
      vidpovid: pravylnyi,
      varianty: r.peremishaty(droby),
      pidkazka: 'Розклади знаменники на прості множники: потрібні лише 2 і 5.',
      rozviazok: `${tak} = ${rozklad(tak).join(' · ')} — лише 2 і 5: ${pravylnyi} → ${desiatkovyi(...(pravylnyi.split('/').map(Number) as [number, number])).zapys}. В інших знаменниках є прості множники, крім 2 і 5.`,
    };
  }
}

const PERIODYCHNI = [3, 6, 7, 9, 11, 12, 15, 18, 22, 27, 30, 33, 36, 37, 45];

function period(r: Vypadok): TrenZavdannia {
  for (;;) {
    const b = r.vybir(PERIODYCHNI);
    const a = neskorotnyi(r, b);
    const d = desiatkovyi(a, b);
    if (d.period.length > 6) continue;
    return {
      pytannia: `Запиши дріб $${tdrib(a, b)}$ десятковим. Які цифри стоять у періоді? Впиши лише період.`,
      vidpovid: d.period,
      pidkazka: `Ділимо ${a} на ${b}: дивись, коли остача повториться.`,
      rozviazok: `Остачі: ${d.ostachi.join(', ')} — остача ${d.ostachi.at(-1)} повторилась. $${tdrib(a, b)} \\to ${tex(d.zapys)}$, період ${d.period}.`,
    };
  }
}

function zPeriodom(r: Vypadok, mishane: boolean): TrenZavdannia {
  for (;;) {
    const b = r.vybir(PERIODYCHNI);
    const a = neskorotnyi(r, b);
    const t = mishane ? r.chyslo(1, 5) : 0;
    const d = desiatkovyi(t * b + a, b);
    if (d.period.length > 4 || d.zapys.length > 9) continue;
    return {
      pytannia: mishane
        ? `Запиши мішане число $${t}${tdrib(a, b)}$ десятковим дробом, період — у дужках.`
        : `Запиши дріб $${tdrib(a, b)}$ десятковим, період — у дужках.`,
      vidpovid: d.zapys,
      pokaz: `$${tex(d.zapys)}$`,
      pidkazka: `Ділимо ${a} на ${b} і стежимо за остачами: ${d.ostachi.slice(0, 2).join(', ')}…`,
      rozviazok: `Остачі: ${d.ostachi.join(', ')} — остача ${d.ostachi.at(-1)} повторилась, далі цифри йдуть по колу: $${mishane ? `${t}${tdrib(a, b)}` : tdrib(a, b)} \\to ${tex(d.zapys)}$.`,
    };
  }
}

export default {
  rivni: ['скінченні дроби', 'скінченний чи періодичний, період', 'запиши з періодом'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([(v: Vypadok) => skinchennyi(v, false), (v: Vypadok) => skinchennyi(v, false), (v: Vypadok) => skinchennyi(v, true)])(r);
    if (riven === 2) return r.vybir([chySkinchennyi, yakyiSkinchennyi, period])(r);
    return r.vybir([(v: Vypadok) => zPeriodom(v, false), (v: Vypadok) => zPeriodom(v, false), (v: Vypadok) => zPeriodom(v, true), chySkinchennyi])(r);
  },
} satisfies Henerator;
