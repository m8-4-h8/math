// Дільники і кратні: чи є дільником, усі дільники, перші кратні, найменше кратне більше за число.
import { tiSamiChysla, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const dilnyky = (n: number) => Array.from({ length: n }, (_, i) => i + 1).filter((d) => n % d === 0);

function chyDilnyk(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(2, 12);
  const tak = r.shans();
  const b = tak ? a * r.chyslo(2, 12) : a * r.chyslo(2, 11) + r.chyslo(1, a - 1);
  if (r.shans()) {
    return {
      pytannia: `Чи є ${a} дільником числа ${b}?`,
      vidpovid: tak ? 'Так' : 'Ні',
      varianty: ['Так', 'Ні'],
      pidkazka: `Чи ділиться ${b} на ${a} без остачі?`,
      rozviazok: tak ? `${b} : ${a} = ${b / a} — без остачі, тож так.` : `${b} : ${a} = ${Math.floor(b / a)} (ост. ${b % a}) — є остача, тож ні.`,
    };
  }
  return {
    pytannia: `Чи є ${b} кратним числа ${a}?`,
    vidpovid: tak ? 'Так' : 'Ні',
    varianty: ['Так', 'Ні'],
    pidkazka: `Кратне ${a} ділиться на ${a} без остачі.`,
    rozviazok: tak ? `${b} : ${a} = ${b / a} — без остачі, тож так.` : `${b} : ${a} = ${Math.floor(b / a)} (ост. ${b % a}) — є остача, тож ні.`,
  };
}

function usiDilnyky(r: Vypadok, max: number): TrenZavdannia {
  const n = r.vybir(Array.from({ length: max - 5 }, (_, i) => i + 6).filter((x) => dilnyky(x).length >= 4));
  const d = dilnyky(n);
  const pary = d.filter((x) => x * x <= n).map((x) => `${x} · ${n / x}`);
  return {
    pytannia: `Запиши всі дільники числа ${n} через кому.`,
    vidpovid: d.join(', '),
    perevirka: tiSamiChysla(d),
    pidkazka: 'Шукай парами: 1 і саме число, далі 2 і …, 3 і … — доки множники не зустрінуться.',
    rozviazok: `Пари: ${pary.join(', ')}. Дільники: ${d.join(', ')}.`,
  };
}

function skilkyDilnykiv(r: Vypadok): TrenZavdannia {
  const n = r.chyslo(10, 60);
  const d = dilnyky(n);
  return {
    pytannia: `Скільки дільників має число ${n}?`,
    vidpovid: d.length,
    pidkazka: 'Не забудь 1 і саме число.',
    rozviazok: `${d.join(', ')} — це ${d.length}.`,
  };
}

function kratni(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(3, 15);
  const k = r.chyslo(3, 5);
  const spysok = Array.from({ length: k }, (_, i) => a * (i + 1));
  return {
    pytannia: `Запиши перші ${k} кратних числа ${a} через кому.`,
    vidpovid: spysok.join(', '),
    pidkazka: `Множ ${a} на 1, 2, 3, …`,
    rozviazok: spysok.map((x, i) => `${a} · ${i + 1} = ${x}`).join('; '),
  };
}

function najmensheKratne(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(6, 25);
  const mezha = r.chyslo(40, 300);
  const rez = (Math.floor(mezha / a) + 1) * a;
  const bilshe = r.shans();
  const rez2 = Math.floor((mezha - 1) / a) * a;
  return bilshe
    ? {
        pytannia: `Яке найменше число, кратне ${a}, більше за ${mezha}?`,
        vidpovid: rez,
        pidkazka: `Поділи ${mezha} на ${a} з остачею.`,
        rozviazok: `${mezha} : ${a} = ${Math.floor(mezha / a)} (ост. ${mezha % a}); ${a} · ${Math.floor(mezha / a) + 1} = ${rez}`,
      }
    : {
        pytannia: `Яке найбільше число, кратне ${a}, менше за ${mezha}?`,
        vidpovid: rez2,
        pidkazka: `Поділи ${mezha - 1} на ${a} з остачею.`,
        rozviazok: `${mezha - 1} : ${a} = ${Math.floor((mezha - 1) / a)} (ост. ${(mezha - 1) % a}); ${a} · ${Math.floor((mezha - 1) / a)} = ${rez2}`,
      };
}

export default {
  rivni: ['чи є дільником, чи є кратним', 'усі дільники і перші кратні', 'кількість дільників і межі'],
  zavdannia(r, riven) {
    if (riven === 1) return chyDilnyk(r);
    if (riven === 2) return r.vybir([() => usiDilnyky(r, 40), () => kratni(r), () => chyDilnyk(r)])();
    return r.vybir([() => skilkyDilnykiv(r), () => najmensheKratne(r), () => usiDilnyky(r, 100)])();
  },
} satisfies Henerator;
