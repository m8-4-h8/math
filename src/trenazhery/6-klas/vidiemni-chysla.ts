// Додатні та від'ємні числа. Число 0 (Істер § 26): записати величину числом зі знаком (тепло/мороз, вище/нижче
// рівня моря, прибуток/борг, поверх над/під землею); протилежні зміни — протилежні знаки; додатне, від'ємне
// чи нуль; температура після зміни (рахуємо поділки до нуля і далі).
import { ch, des, mnozh, zVelykoi, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const tz = (n: number) => (n < 0 ? `-${-n}` : `${n}`);
const hrad = (n: number) => `${n} ${mnozh(n, 'градус', 'градуси', 'градусів')}`;

const KONTEKSTY: { plus: (n: number) => string; minus: (n: number) => string; od: string; max: number }[] = [
  { plus: (n) => `${hrad(n)} тепла`, minus: (n) => `${hrad(n)} морозу`, od: '°C', max: 30 },
  { plus: (n) => `вершина на ${ch(n)} м вище рівня моря`, minus: (n) => `западина на ${ch(n)} м нижче рівня моря`, od: 'м', max: 3000 },
  { plus: (n) => `прибуток ${ch(n)} грн`, minus: (n) => `борг ${ch(n)} грн`, od: 'грн', max: 900 },
  { plus: (n) => `${n}-й поверх над землею`, minus: (n) => `${n}-й поверх під землею (підвал)`, od: '', max: 4 },
  { plus: (n) => `рівень води піднявся на ${n} см`, minus: (n) => `рівень води опустився на ${n} см`, od: 'см', max: 90 },
];

function zapysaty(r: Vypadok): TrenZavdannia {
  const k = r.vybir(KONTEKSTY);
  const n = r.chyslo(1, k.max);
  const plus = r.shans(0.4);
  return {
    pytannia: `Запиши числом зі знаком: ${plus ? k.plus(n) : k.minus(n)}.`,
    vidpovid: plus ? [n, `+${n}`] : ch(-n),
    odynytsi: k.od || undefined,
    pidkazka: 'Вище нуля, тепло, «маю» — плюс; нижче нуля, мороз, «винен» — мінус.',
    rozviazok: plus ? `Знак «+»: +${ch(n)} (плюс можна не писати).` : `Протилежний бік від нуля — знак «−»: ${ch(-n)}.`,
  };
}

/** Протилежна зміна: одну записали зі знаком — запиши іншу. */
const PARY: [(n: number) => string, (n: number) => string][] = [
  [(n) => `потепління на ${n}°`, (n) => `похолодання на ${n}°`],
  [(n) => `прибуток ${n} грн`, (n) => `витрату ${n} грн`],
  [(n) => `рух праворуч на ${n} см`, (n) => `рух ліворуч на ${n} см`],
  [(n) => `підйом повітряної кулі на ${n} м`, (n) => `спуск кулі на ${n} м`],
];

function protylezhna(r: Vypadok): TrenZavdannia {
  const [a, b] = r.rizni(2, 2, 60);
  const [plus, minus] = r.vybir(PARY);
  const navpaky = r.shans(); // дано від'ємну зміну, питаємо додатну
  const dano = navpaky ? `${minus(a)} записали числом ${ch(-a)}` : `${plus(a)} записали числом +${a}`;
  const shukane = navpaky ? plus(b) : minus(b);
  return {
    pytannia: `${zVelykoi(dano)}. Як записати ${shukane}?`,
    vidpovid: navpaky ? [b, `+${b}`] : ch(-b),
    pidkazka: 'Протилежний напрямок — протилежний знак.',
    rozviazok: `Протилежний напрямок, тому знак «${navpaky ? '+' : '−'}»: ${navpaky ? `+${b}` : ch(-b)}.`,
  };
}

function vyd(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(0, 5);
  const n = typ === 0 ? 0 : r.chyslo(1, 99);
  const vidiemne = typ % 2 === 1;
  const desiatkove = typ >= 4;
  const zapys = desiatkove ? (vidiemne ? `-${des(n, 1).replace(',', '{,}')}` : `+${des(n, 1).replace(',', '{,}')}`) : n === 0 ? '0' : vidiemne ? `-${n}` : r.shans() ? `+${n}` : `${n}`;
  const vidp = n === 0 ? 'нуль' : vidiemne ? 'від’ємне' : 'додатне';
  return {
    pytannia: `Яке це число: додатне, від’ємне чи нуль?`,
    vyraz: `$${zapys}$`,
    vidpovid: vidp,
    varianty: ['додатне', 'від’ємне', 'нуль'],
    pidkazka: 'Зі знаком «−» — від’ємне; більше за нуль — додатне; нуль — ні те, ні те.',
    rozviazok: n === 0 ? 'Нуль — ні додатний, ні від’ємний.' : vidiemne ? 'Перед числом знак «−», тож воно від’ємне.' : 'Число більше за нуль — додатне.',
  };
}

function skilkyVidiemnykh(r: Vypadok): TrenZavdannia {
  for (;;) {
    const chysla = r.rizni(6, -20, 20);
    const vid = chysla.filter((n) => n < 0).length;
    if (vid === 0 || vid === 6) continue;
    const pytaty = r.vybir(['від’ємних', 'додатних', 'невід’ємних'] as const);
    const vidp = pytaty === 'від’ємних' ? vid : pytaty === 'додатних' ? chysla.filter((n) => n > 0).length : chysla.filter((n) => n >= 0).length;
    return {
      pytannia: `Скільки ${pytaty} чисел серед: ${chysla.map((n) => `$${tz(n)}$`).join('; ')}?`,
      vidpovid: vidp,
      pidkazka: pytaty === 'невід’ємних' ? 'Невід’ємні — це додатні і нуль.' : pytaty === 'додатних' ? 'Нуль — не додатне число.' : 'Від’ємні — зі знаком «−».',
      rozviazok: `${pytaty[0].toUpperCase()}${pytaty.slice(1)}: ${chysla.filter((n) => (pytaty === 'від’ємних' ? n < 0 : pytaty === 'додатних' ? n > 0 : n >= 0)).map(ch).join(', ')} — їх ${vidp}.`,
    };
  }
}

/** Зміна температури через нуль: рахуємо поділки до нуля і далі. */
function temperatura(r: Vypadok): TrenZavdannia {
  for (;;) {
    const t = r.chyslo(-12, 12);
    const k = r.chyslo(2, 15);
    const tepl = r.shans();
    const nova = tepl ? t + k : t - k;
    if (nova === 0 || Math.abs(nova) > 20 || Math.sign(nova) === Math.sign(t)) continue; // цікаво лише через нуль
    const doNulia = Math.abs(t);
    const zt = (n: number) => (n > 0 ? `+${n}` : ch(n));
    return {
      pytannia: `Термометр показував ${zt(t)} °C. ${tepl ? 'Потепліло' : 'Похолоднішало'} на ${hrad(k)}. Яку температуру він показує тепер?`,
      vidpovid: nova > 0 ? [nova, `+${nova}`] : ch(nova),
      odynytsi: '°C',
      pidkazka: `${t === 0 ? 'Від нуля' : `Від ${zt(t)} до нуля — ${doNulia} ${mnozh(doNulia, 'поділка', 'поділки', 'поділок')}, решта —`} ${tepl ? 'вище' : 'нижче'} нуля.`,
      rozviazok:
        t === 0
          ? `Від нуля на ${k} ${tepl ? 'вгору' : 'вниз'}: ${zt(nova)} °C.`
          : `До нуля — ${doNulia} ${mnozh(doNulia, 'поділка', 'поділки', 'поділок')}, ще ${k} − ${doNulia} = ${k - doNulia} ${tepl ? 'вище' : 'нижче'} нуля: ${zt(nova)} °C.`,
    };
  }
}

export default {
  rivni: ['запиши числом зі знаком', 'додатне, від’ємне чи нуль; протилежні зміни', 'температура через нуль'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([zapysaty, zapysaty, vyd])(r);
    if (riven === 2) return r.vybir([protylezhna, vyd, skilkyVidiemnykh, zapysaty])(r);
    return r.vybir([temperatura, temperatura, skilkyVidiemnykh, protylezhna])(r);
  },
} satisfies Henerator;
