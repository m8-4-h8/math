// Властивості прямокутного трикутника: катет навпроти кута 30° — половина гіпотенузи, гіпотенуза — удвічі більша
// (з малюнком і без), кут 60° (спершу знайти 30°), обернена властивість, який катет — половина гіпотенузи, задачі:
// висота рівнобедреного трикутника з кутом 120°, зовнішній кут, сума чи різниця гіпотенузи й катета, висота до гіпотенузи.
import type { Henerator, Vypadok, TrenZavdannia } from '../dopomoha.ts';
import { kutyTrykutnyka, rivnobedrenyi } from '../trykutnyky.ts';

const LITERY = [['A', 'B', 'C'], ['K', 'M', 'N'], ['M', 'N', 'P'], ['D', 'E', 'F'], ['P', 'Q', 'R']];

/** Сторона між вершинами x і y — буквами в порядку назви трикутника. */
const storona = (l: string[], x: string, y: string) => l.filter((v) => v === x || v === y).join('');

/** Прямокутний трикутник з кутом 30°: P — прямий кут, T — кут 30°, S — кут 60°. */
function trykutnyk(r: Vypadok) {
  const l = r.vybir(LITERY);
  const [P, T, S] = r.peremishaty(l);
  return {
    l,
    P,
    T,
    S,
    nazva: l.join(''),
    hip: storona(l, T, S), // гіпотенуза
    korot: storona(l, P, S), // катет навпроти 30°
    dovh: storona(l, P, T), // катет навпроти 60°
  };
}
type Tr = ReturnType<typeof trykutnyk>;

/** Малюнок: вершина 0 — кут 60°, 1 — прямий, 2 — кут 30°; сторона 0 — короткий катет, 2 — гіпотенуза. */
const malunok = (t: Tr, kut: { T?: string; S?: string }, st: { korot?: string; hip?: string }) =>
  kutyTrykutnyka({ forma: 'priamokutnyi2', litery: [t.S, t.P, t.T], priamyi: true, pidpysy: [kut.S, undefined, kut.T], pidpysySt: [st.korot, undefined, st.hip] });

function katet(r: Vypadok): TrenZavdannia {
  const t = trykutnyk(r);
  const k = r.chyslo(2, 25);
  const zMalunkom = r.shans();
  return {
    pytannia: zMalunkom ? `За малюнком знайди ${t.korot}.` : `У трикутнику ${t.nazva} ∠${t.P} = 90°, ∠${t.T} = 30°, ${t.hip} = ${2 * k} см. Знайди ${t.korot}.`,
    malunok: zMalunkom ? malunok(t, { T: '30°' }, { korot: '?', hip: `${2 * k} см` }) : undefined,
    vidpovid: k,
    odynytsi: 'см',
    pidkazka: `Навпроти кута ${t.T} (30°) лежить катет, що вдвічі менший за гіпотенузу.`,
    rozviazok: `Катет ${t.korot} лежить навпроти кута ${t.T} (30°), тож він — половина гіпотенузи ${t.hip}: ${2 * k} : 2 = ${k} см.`,
  };
}

function hipotenuza(r: Vypadok): TrenZavdannia {
  const t = trykutnyk(r);
  const k = r.chyslo(2, 25);
  const zMalunkom = r.shans();
  return {
    pytannia: zMalunkom ? `За малюнком знайди ${t.hip}.` : `У трикутнику ${t.nazva} ∠${t.P} = 90°, ∠${t.T} = 30°, ${t.korot} = ${k} см. Знайди ${t.hip}.`,
    malunok: zMalunkom ? malunok(t, { T: '30°' }, { korot: `${k} см`, hip: '?' }) : undefined,
    vidpovid: 2 * k,
    odynytsi: 'см',
    pidkazka: `Катет ${t.korot} лежить навпроти кута 30°. Гіпотенуза більша за нього чи менша?`,
    rozviazok: `Катет ${t.korot} лежить навпроти кута ${t.T} (30°), тож гіпотенуза вдвічі більша: 2 · ${k} = ${2 * k} см.`,
  };
}

function z60(r: Vypadok): TrenZavdannia {
  const t = trykutnyk(r);
  const k = r.chyslo(2, 25);
  const shukaiemoHip = r.shans();
  const zMalunkom = r.shans();
  const krok = `Кут ${t.T} дорівнює 90° − 60° = 30°, навпроти нього катет ${t.korot}.`;
  return {
    pytannia: zMalunkom
      ? `За малюнком знайди ${shukaiemoHip ? t.hip : t.korot}.`
      : `У трикутнику ${t.nazva} ∠${t.P} = 90°, ∠${t.S} = 60°, ${shukaiemoHip ? `${t.korot} = ${k}` : `${t.hip} = ${2 * k}`} см. Знайди ${shukaiemoHip ? t.hip : t.korot}.`,
    malunok: zMalunkom ? malunok(t, { S: '60°' }, shukaiemoHip ? { korot: `${k} см`, hip: '?' } : { korot: '?', hip: `${2 * k} см` }) : undefined,
    vidpovid: shukaiemoHip ? 2 * k : k,
    odynytsi: 'см',
    pidkazka: `Спершу знайди кут ${t.T}: гострі кути разом дають 90°.`,
    rozviazok: shukaiemoHip ? `${krok} Гіпотенуза вдвічі більша: 2 · ${k} = ${2 * k} см.` : `${krok} Він — половина гіпотенузи: ${2 * k} : 2 = ${k} см.`,
  };
}

function obernene(r: Vypadok): TrenZavdannia {
  const t = trykutnyk(r);
  const k = r.chyslo(2, 25);
  const pro30 = r.shans();
  const krok = `Катет ${t.korot} дорівнює половині гіпотенузи: ${2 * k} : 2 = ${k}. Тому кут навпроти нього — кут ${t.T} — дорівнює 30°.`;
  return {
    pytannia: `У трикутнику ${t.nazva} ∠${t.P} = 90°, ${t.hip} = ${2 * k} см, ${t.korot} = ${k} см. Знайди ∠${pro30 ? t.T : t.S}.`,
    vidpovid: pro30 ? 30 : 60,
    odynytsi: '°',
    pidkazka: `Порівняй катет ${t.korot} з гіпотенузою ${t.hip}.`,
    rozviazok: pro30 ? krok : `${krok} Кут ${t.S} дорівнює 90° − 30° = 60°.`,
  };
}

function yakyiKatet(r: Vypadok): TrenZavdannia {
  const t = trykutnyk(r);
  const dano30 = r.shans();
  const varianty = [t.korot, t.dovh].sort();
  return {
    pytannia: `У трикутнику ${t.nazva} ∠${t.P} = 90°, ∠${dano30 ? t.T : t.S} = ${dano30 ? 30 : 60}°. Який катет дорівнює половині гіпотенузи?`,
    vidpovid: t.korot,
    varianty,
    pidkazka: dano30 ? `Який катет лежить навпроти кута ${t.T}?` : `Де кут 30°? Це другий гострий кут — ${t.T}.`,
    rozviazok: `${dano30 ? '' : `Кут ${t.T} дорівнює 90° − 60° = 30°. `}Навпроти кута ${t.T} (30°) лежить катет ${t.korot} — він і дорівнює половині гіпотенузи ${t.hip}.`,
  };
}

function vysota120(r: Vypadok): TrenZavdannia {
  const k = r.chyslo(2, 20);
  const shukaiemoVysotu = r.shans();
  return {
    pytannia: shukaiemoVysotu
      ? `У трикутнику ABC AB = BC = ${2 * k} см, ∠B = 120°, BD — висота. Знайди BD.`
      : `У трикутнику ABC AB = BC, ∠B = 120°, висота BD = ${k} см. Знайди AB.`,
    malunok: rivnobedrenyi({ vershyna: 120, kuty: false, vidrizok: { vysota: true }, pidpysySt: shukaiemoVysotu ? { bichna: `${2 * k} см` } : { bichna: '?' } }),
    vidpovid: shukaiemoVysotu ? k : 2 * k,
    odynytsi: 'см',
    pidkazka: 'Знайди кути при основі. У трикутнику ABD висота — катет навпроти одного з них.',
    rozviazok: `Кути при основі по (180° − 120°) : 2 = 30°. У прямокутному трикутнику ABD катет BD лежить навпроти кута A (30°), а AB — гіпотенуза. ${shukaiemoVysotu ? `BD дорівнює ${2 * k} : 2 = ${k} см.` : `AB дорівнює 2 · ${k} = ${2 * k} см.`}`,
  };
}

function zovnishnii(r: Vypadok): TrenZavdannia {
  const t = trykutnyk(r);
  const k = r.chyslo(2, 25);
  const pryT = r.shans(); // зовнішній кут при вершині 30° (150°) чи при вершині 60° (120°)
  const krok = pryT ? `Кут ${t.T} дорівнює 180° − 150° = 30°.` : `Кут ${t.S} дорівнює 180° − 120° = 60°, тоді кут ${t.T} дорівнює 90° − 60° = 30°.`;
  return {
    pytannia: `У трикутнику ${t.nazva} ∠${t.P} = 90°, зовнішній кут при вершині ${pryT ? t.T : t.S} дорівнює ${pryT ? 150 : 120}°, ${t.hip} = ${2 * k} см. Знайди ${t.korot}.`,
    vidpovid: k,
    odynytsi: 'см',
    pidkazka: 'Зовнішній кут і кут трикутника при тій самій вершині — суміжні. Де кут 30°?',
    rozviazok: `${krok} Навпроти нього катет ${t.korot}: ${2 * k} : 2 = ${k} см.`,
  };
}

function sumaRiznytsia(r: Vypadok): TrenZavdannia {
  const t = trykutnyk(r);
  const k = r.chyslo(2, 20);
  const suma = r.shans();
  const shukaiemoHip = suma ? r.shans() : true;
  const kinets = shukaiemoHip ? `${t.hip} дорівнює 2 · ${k} = ${2 * k} см.` : `Отже, ${t.korot} = ${k} см.`;
  return {
    pytannia: `У трикутнику ${t.nazva} ∠${t.P} = 90°, ∠${t.T} = 30°, ${suma ? `${t.hip} + ${t.korot} = ${3 * k}` : `${t.hip} − ${t.korot} = ${k}`} см. Знайди ${shukaiemoHip ? t.hip : t.korot}.`,
    vidpovid: shukaiemoHip ? 2 * k : k,
    odynytsi: 'см',
    pidkazka: `Гіпотенуза ${t.hip} — це два катети ${t.korot}.`,
    rozviazok: suma
      ? `Катет ${t.korot} лежить навпроти кута 30°, тож гіпотенуза — два такі катети, а сума — три: ${t.korot} дорівнює ${3 * k} : 3 = ${k} см. ${shukaiemoHip ? kinets : ''}`.trim()
      : `Катет ${t.korot} лежить навпроти кута 30°, тож гіпотенуза — два такі катети, а різниця — один: ${t.korot} = ${k} см. ${kinets}`,
  };
}

const Z_VYSOTOIU = [['A', 'B', 'C', 'D'], ['K', 'M', 'N', 'P'], ['M', 'N', 'P', 'K'], ['D', 'E', 'F', 'K'], ['P', 'Q', 'R', 'S']];

function vysotaDoHipotenuzy(r: Vypadok): TrenZavdannia {
  const [A, B, C, D] = r.vybir(Z_VYSOTOIU); // ∠C = 90°, ∠A = 30°, CD — висота
  const l = [A, B, C];
  const k = r.chyslo(1, 12);
  const shukaiemoBD = r.shans();
  const BC = storona(l, B, C);
  const BCD = `${B}${C}${D}`;
  return {
    pytannia: `У трикутнику ${A}${B}${C} ∠${C} = 90°, ∠${A} = 30°, ${C}${D} — висота, ${A}${B} = ${4 * k} см. Знайди ${shukaiemoBD ? `${B}${D}` : `${A}${D}`}.`,
    vidpovid: shukaiemoBD ? k : 3 * k,
    odynytsi: 'см',
    pidkazka: `Спершу знайди катет ${BC}. Потім розглянь трикутник ${BCD}: який у ньому кут при вершині ${C}?`,
    rozviazok:
      `Катет ${BC} лежить навпроти кута ${A} (30°): ${BC} дорівнює ${4 * k} : 2 = ${2 * k} см. ` +
      `Кут ${B} дорівнює 90° − 30° = 60°, тож у прямокутному трикутнику ${BCD} кут ${BCD} дорівнює 90° − 60° = 30°. ` +
      `Навпроти нього катет ${B}${D}: ${2 * k} : 2 = ${k} см.` +
      (shukaiemoBD ? '' : ` Тоді ${A}${D} дорівнює ${4 * k} − ${k} = ${3 * k} см.`),
  };
}

function oberneneZovnishnii(r: Vypadok): TrenZavdannia {
  const t = trykutnyk(r);
  const k = r.chyslo(2, 25);
  const pryT = r.shans();
  return {
    pytannia: `У трикутнику ${t.nazva} ∠${t.P} = 90°, ${t.hip} = ${2 * k} см, ${t.korot} = ${k} см. Знайди зовнішній кут при вершині ${pryT ? t.T : t.S}.`,
    vidpovid: pryT ? 150 : 120,
    odynytsi: '°',
    pidkazka: `Катет ${t.korot} — половина гіпотенузи. Який кут лежить навпроти нього?`,
    rozviazok:
      `Катет ${t.korot} — половина гіпотенузи ${t.hip}, тож кут ${t.T} дорівнює 30°. ` +
      (pryT ? `Зовнішній кут при вершині ${t.T} дорівнює 180° − 30° = 150°.` : `Кут ${t.S} дорівнює 90° − 30° = 60°, а зовнішній кут при ньому — 180° − 60° = 120°.`),
  };
}

export default {
  rivni: ['катет навпроти кута 30°', 'кут 60° і обернене твердження', 'задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([katet, katet, hipotenuza])(r);
    if (riven === 2) return r.vybir([z60, obernene, yakyiKatet, hipotenuza])(r);
    return r.vybir([vysota120, zovnishnii, sumaRiznytsia, vysotaDoHipotenuzy, oberneneZovnishnii])(r);
  },
} satisfies Henerator;
