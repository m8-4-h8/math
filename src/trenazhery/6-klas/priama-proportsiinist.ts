// Пряма пропорційна залежність (Істер § 17): чи прямо пропорційні величини; як змінюється друга величина;
// стале відношення y : x; задачі пропорцією — з натуральними і з десятковими значеннями.
import { ch, des, mnozh, skilky, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const PARY: { p: string; tak: boolean; ch: string }[] = [
  { p: 'кількість однакових зошитів і їхня вартість', tak: true, ch: 'Ціна стала: удвічі більше зошитів — удвічі більша вартість.' },
  { p: 'час руху і пройдений шлях за сталої швидкості', tak: true, ch: 'Удвічі довше їдеш — удвічі більший шлях.' },
  { p: 'сторона квадрата і його периметр', tak: true, ch: 'Периметр — це 4 сторони: сторона вдвічі більша — периметр теж.' },
  { p: 'маса однакових цукерок і їхня вартість', tak: true, ch: 'Удвічі більше кілограмів — удвічі більше гривень.' },
  { p: 'кількість порцій і кількість борошна за тим самим рецептом', tak: true, ch: 'Удвічі більше порцій — удвічі більше борошна.' },
  { p: 'об\'єм води і її маса', tak: true, ch: 'Кожен літр води важить 1 кг: літрів удвічі більше — маса вдвічі більша.' },
  { p: 'сторона квадрата і його площа', tak: false, ch: 'Сторона вдвічі більша — площа вчетверо більша, а не вдвічі.' },
  { p: 'вік дитини і її зріст', tak: false, ch: 'Обидва ростуть, але не «у стільки ж разів».' },
  { p: 'швидкість і час руху на тому самому шляху', tak: false, ch: 'Швидкість більша — часу менше: величини змінюються в різні боки.' },
  { p: 'кількість робітників і час, за який вони виконають ту саму роботу', tak: false, ch: 'Робітників більше — часу менше: це не пряма пропорційність.' },
  { p: 'номер дня місяця і температура повітря', tak: false, ch: 'Температура не залежить від номера дня «у стільки ж разів».' },
  { p: 'кількість сторінок у книжці і її ціна', tak: false, ch: 'Ціна залежить і від багато чого іншого: товща книжка не обов\'язково дорожча у стільки ж разів.' },
];

function chyPriama(r: Vypadok): TrenZavdannia {
  const z = r.vybir(PARY);
  return {
    pytannia: `Чи прямо пропорційні ${z.p}?`,
    vidpovid: z.tak ? 'так' : 'ні',
    varianty: ['так', 'ні'],
    pidkazka: 'Збільш одну величину вдвічі. Чи стане друга теж рівно вдвічі більшою?',
    rozviazok: `${z.ch} Тож ${z.tak ? 'так, прямо пропорційні' : 'ні, не прямо пропорційні'}.`,
  };
}

function yakZminylas(r: Vypadok): TrenZavdannia {
  const k = r.chyslo(2, 9);
  const razy = mnozh(k, 'раз', 'рази', 'разів');
  const zbilsh = r.shans();
  const [tak, navpaky] = zbilsh ? ['збільшилося', 'зменшилося'] : ['зменшилося', 'збільшилося'];
  return {
    pytannia: `Значення однієї з двох прямо пропорційних величин ${tak} в ${k} ${razy}. Як змінилося значення другої?`,
    vidpovid: `${tak} в ${k} ${razy}`,
    varianty: r.peremishaty([`${tak} в ${k} ${razy}`, `${navpaky} в ${k} ${razy}`, `${tak} на ${k}`]),
    pidkazka: 'Прямо пропорційні величини змінюються в один бік і у стільки ж разів.',
    rozviazok: `Друга величина теж ${tak} в ${k} ${razy}.`,
  };
}

function stale(r: Vypadok): TrenZavdannia {
  const k = r.chyslo(2, 12);
  const [a, c] = r.rizni(2, 2, 15);
  return {
    pytannia: `Величини x і y прямо пропорційні. Коли x = ${a}, y = ${k * a}. Знайди y, коли x = ${c}.`,
    vidpovid: k * c,
    pidkazka: `Відношення y : x стале: ${k * a} : ${a}.`,
    rozviazok: `y : x = ${k * a} : ${a} = ${k}; y = ${k} · ${c} = ${k * c}.`,
  };
}

/** Задача на пряму пропорційність: u — скільки на одиницю, a і c — значення першої величини. */
const ZADACHI: { u: [number, number]; umova: (a: number, b: number, c: number) => string; od?: string }[] = [
  { u: [20, 90], umova: (a, b, c) => `${a} кг яблук коштують ${ch(b)} грн. Скільки гривень коштують ${c} кг таких яблук?`, od: 'грн' },
  { u: [40, 90], umova: (a, b, c) => `За ${a} год поїзд пройшов ${ch(b)} км. Скільки кілометрів він пройде за ${c} год з тією самою швидкістю?`, od: 'км' },
  { u: [8, 20], umova: (a, b, c) => `Велосипедист за ${a} год проїхав ${ch(b)} км. Скільки кілометрів він проїде за ${c} год з тією самою швидкістю?`, od: 'км' },
  { u: [12, 30], umova: (a, b, c) => `У ${a} однакових коробках ${skilky(b, 'олівець', 'олівці', 'олівців')}. Скільки олівців у ${c} таких коробках?` },
  { u: [2, 4], umova: (a, b, c) => `Принтер за ${a} хв друкує ${skilky(b, 'сторінку', 'сторінки', 'сторінок')}. Скільки сторінок він надрукує за ${c} хв?` },
];

const ZADACHI_DES: { u: [number, number]; umova: (a: string, b: string, c: string) => string; od: string }[] = [
  { u: [30, 90], umova: (a, b, c) => `${a} кг груш коштують ${b} грн. Скільки гривень коштують ${c} кг таких груш?`, od: 'грн' },
  { u: [50, 90], umova: (a, b, c) => `За ${a} год автомобіль проїхав ${b} км. Скільки кілометрів він проїде за ${c} год з тією самою швидкістю?`, od: 'км' },
  { u: [3, 6], umova: (a, b, c) => `Турист за ${a} год пройшов ${b} км. Скільки кілометрів він пройде за ${c} год з тією самою швидкістю?`, od: 'км' },
  { u: [6, 9], umova: (a, b, c) => `Двигун за ${a} год витрачає ${b} л пального. Скільки літрів пального він витратить за ${c} год?`, od: 'л' },
];

function zadacha(r: Vypadok): TrenZavdannia {
  const z = r.vybir(ZADACHI);
  const u = r.chyslo(z.u[0], z.u[1]);
  const [a, c] = r.rizni(2, 2, 9);
  const b = u * a;
  return {
    pytannia: z.umova(a, b, c),
    vidpovid: u * c,
    odynytsi: z.od,
    pidkazka: `Залежність пряма: ${a} : ${c} = ${ch(b)} : x.`,
    rozviazok: `Пряма пропорційність: ${a} : ${c} = ${ch(b)} : x; x = ${ch(b)} · ${c} : ${a} = ${ch(u * c)}.`,
  };
}

function zadachaDes(r: Vypadok): TrenZavdannia {
  for (;;) {
    const z = r.vybir(ZADACHI_DES);
    const u = r.chyslo(z.u[0], z.u[1]);
    // a і c — у десятих: 1,5 год, 2,5 кг…, зрідка 1,2 чи 3,6
    const ZNACHENNIA = [5, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 70, 75, 80, 12, 18, 24, 32, 36, 48];
    const [a10, c10] = r.rizni(2, 0, ZNACHENNIA.length - 1).map((i) => ZNACHENNIA[i]);
    if (a10 === c10 || (a10 % 10 === 0 && c10 % 10 === 0)) continue;
    const b10 = u * a10; // b у десятих
    const x10 = u * c10;
    const [a, c, b, x] = [des(a10, 1), des(c10, 1), des(b10, 1), des(x10, 1)];
    return {
      pytannia: z.umova(a, b, c),
      vidpovid: x,
      odynytsi: z.od,
      pidkazka: `Залежність пряма: ${a} : ${c} = ${b} : x.`,
      rozviazok: `Пряма пропорційність: ${a} : ${c} = ${b} : x; x = ${b} · ${c} : ${a} = ${x}.`,
    };
  }
}

export default {
  rivni: ['чи пряма пропорційність', 'задачі з натуральними числами', 'задачі з десятковими дробами'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([chyPriama, chyPriama, yakZminylas, stale])(r);
    if (riven === 2) return r.vybir([zadacha, zadacha, zadacha, stale, chyPriama])(r);
    return r.vybir([zadachaDes, zadachaDes, zadachaDes, zadacha])(r);
  },
} satisfies Henerator;
