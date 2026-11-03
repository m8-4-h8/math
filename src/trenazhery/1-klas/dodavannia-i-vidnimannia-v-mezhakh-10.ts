// Додавання і віднімання в межах 10: приклади, віконця, короткі задачі.
import { dviOsoby, mnozh, osoba, rid, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

function pryklad(r: Vypadok, mezha: number): TrenZavdannia {
  if (r.shans()) {
    const a = r.chyslo(0, mezha - 1);
    const b = r.chyslo(1, mezha - a);
    const [m, v] = a < b ? [a, b] : [b, a];
    return {
      vyraz: `${a} + ${b} =`,
      vidpovid: a + b,
      pidkazka: a < b ? `Перестав доданки: ${v} + ${m}. Від ${v} зроби ${m} ${m < 5 ? 'кроки' : 'кроків'}.` : `Від ${a} зроби ${b} ${b === 1 ? 'крок' : b < 5 ? 'кроки' : 'кроків'} вперед.`,
      rozviazok: `${a} + ${b} = ${a + b}`,
    };
  }
  const a = r.chyslo(1, mezha);
  const b = r.chyslo(0, a);
  return {
    vyraz: `${a} − ${b} =`,
    vidpovid: a - b,
    pidkazka: `Думай через додавання: ${b} + ? = ${a}.`,
    rozviazok: `${a} − ${b} = ${a - b}, бо ${b} + ${a - b} = ${a}.`,
  };
}

function vikontse(r: Vypadok): TrenZavdannia {
  const tsile = r.chyslo(2, 10);
  const a = r.chyslo(1, tsile - 1);
  const b = tsile - a;
  return r.vybir<() => TrenZavdannia>([
    () => ({ pytannia: 'Яке число в віконці?', vyraz: `${a} + □ = ${tsile}`, vidpovid: b, pidkazka: `Скільки треба додати до ${a}, щоб вийшло ${tsile}?`, rozviazok: `${tsile} − ${a} = ${b}` }),
    () => ({ pytannia: 'Яке число в віконці?', vyraz: `${tsile} − □ = ${a}`, vidpovid: b, pidkazka: `Скільки забрали від ${tsile}, якщо лишилось ${a}?`, rozviazok: `${tsile} − ${b} = ${a}` }),
    () => ({ pytannia: 'Яке число в віконці?', vyraz: `□ − ${a} = ${b}`, vidpovid: tsile, pidkazka: `Було невідомо скільки, забрали ${a}, лишилось ${b}. Склади частини.`, rozviazok: `${a} + ${b} = ${tsile}` }),
  ])();
}

const PTAKHY: [string, string, string, string][] = [
  ['пташка', 'пташки', 'пташок', 'На гілці'],
  ['горобець', 'горобці', 'горобців', 'На паркані'],
  ['метелик', 'метелики', 'метеликів', 'На квітці'],
];

function zadacha(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(0, 2);
  if (typ === 0) {
    const [odyn, dva, piat, de] = r.vybir(PTAKHY);
    const a = r.chyslo(2, 7);
    const b = r.chyslo(2, 10 - a);
    if (r.shans()) {
      return {
        pytannia: `${de} сиділи ${a} ${mnozh(a, odyn, dva, piat)}. Прилетіли ще ${b}. Скільки ${piat} стало?`,
        vidpovid: a + b,
        pidkazka: 'Прилетіли — стало більше. Шукаємо ціле: додаємо.',
        rozviazok: `${a} + ${b} = ${a + b}`,
      };
    }
    const vsi = a + b;
    return {
      pytannia: `${de} сиділи ${vsi} ${mnozh(vsi, odyn, dva, piat)}. Полетіли ${b}. Скільки ${piat} лишилось?`,
      vidpovid: a,
      pidkazka: 'Полетіли — стало менше. Шукаємо частину: віднімаємо.',
      rozviazok: `${vsi} − ${b} = ${a}`,
    };
  }
  if (typ === 1) {
    const o = osoba(r);
    const vsi = r.chyslo(4, 10);
    const b = r.chyslo(2, vsi - 2);
    return {
      pytannia: `${o.imia} ${rid(o, 'мав', 'мала')} ${vsi} ${mnozh(vsi, 'цукерку', 'цукерки', 'цукерок')}. ${rid(o, 'Він', 'Вона')} ${rid(o, "з'їв", "з'їла")} ${b}. Скільки цукерок лишилось?`,
      vidpovid: vsi - b,
      pidkazka: "З'їли — стало менше: віднімаємо.",
      rozviazok: `${vsi} − ${b} = ${vsi - b}`,
    };
  }
  const [o1, o2] = dviOsoby(r);
  const a = r.chyslo(2, 6);
  const b = r.chyslo(2, 10 - a);
  return {
    pytannia: `${o1.imia} ${rid(o1, 'зібрав', 'зібрала')} ${a} ${mnozh(a, 'грибок', 'грибки', 'грибків')}, а ${o2.imia} — ${b}. Скільки грибків вони зібрали разом?`,
    vidpovid: a + b,
    pidkazka: 'Разом — це ціле: додаємо частини.',
    rozviazok: `${a} + ${b} = ${a + b}`,
  };
}

export default {
  rivni: ['до 5', 'до 10', 'віконця й задачі до 10'],
  zavdannia(r, riven) {
    if (riven === 1) return pryklad(r, 5);
    if (riven === 2) return pryklad(r, 10);
    return r.vybir([() => pryklad(r, 10), () => vikontse(r), () => zadacha(r)])();
  },
} satisfies Henerator;
