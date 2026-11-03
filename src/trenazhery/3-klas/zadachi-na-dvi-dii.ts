// Задачі на дві дії: план «що відомо → що знайти спершу → відповідь», різні сюжети з випадковими числами.
import { dviOsoby, mnozh, osoba, rid, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

// Числа в задачах від 2, тож форма однини потрібна лише для 21, 31…
const sht = (n: number, odyn: string, dva: string, piat: string) => `${n} ${mnozh(n, odyn, dva, piat)}`;

function buloProdalyPryvezly(r: Vypadok): TrenZavdannia {
  const bulo = r.chyslo(25, 90);
  const prodaly = r.chyslo(8, bulo - 5);
  const pryvezly = r.chyslo(8, 40);
  return {
    pytannia: `У магазині було ${sht(bulo, 'кавун', 'кавуни', 'кавунів')}. Продали ${prodaly}, а потім привезли ще ${pryvezly}. Скільки кавунів стало?`,
    vidpovid: bulo - prodaly + pryvezly,
    pidkazka: 'Спершу знайди, скільки лишилося після продажу.',
    rozviazok: `1) ${bulo} − ${prodaly} = ${bulo - prodaly}; 2) ${bulo - prodaly} + ${pryvezly} = ${bulo - prodaly + pryvezly}.`,
  };
}

function naBilshe(r: Vypadok): TrenZavdannia {
  const [a, b] = dviOsoby(r);
  const x = r.chyslo(8, 30);
  const bilshe = r.shans();
  const d = r.chyslo(3, bilshe ? 15 : x - 3);
  const y = bilshe ? x + d : x - d;
  return {
    pytannia: `${a.imia} має ${sht(x, 'наліпку', 'наліпки', 'наліпок')}, а ${b.imia} — на ${d} ${bilshe ? 'більше' : 'менше'}. Скільки наліпок у двох дітей разом?`,
    vidpovid: x + y,
    pidkazka: `Одразу «разом» не знайти: спершу — скільки наліпок має ${b.imia}.`,
    rozviazok: `1) ${x} ${bilshe ? '+' : '−'} ${d} = ${y}; 2) ${x} + ${y} = ${x + y}.`,
  };
}

function uRaziv(r: Vypadok): TrenZavdannia {
  const [a, b] = dviOsoby(r);
  const x = r.chyslo(3, 12);
  const k = r.chyslo(2, 5);
  return {
    pytannia: `${a.imia} ${rid(a, 'зібрав', 'зібрала')} ${x} кг яблук, а ${b.imia} — у ${k} ${mnozh(k, 'раз', 'рази', 'разів')} більше. Скільки кілограмів яблук вони зібрали разом?`,
    vidpovid: x + x * k,
    odynytsi: 'кг',
    pidkazka: `Спершу знайди, скільки ${rid(b, 'зібрав', 'зібрала')} ${b.imia}: ${x} · ${k}.`,
    rozviazok: `1) ${x} · ${k} = ${x * k} (кг); 2) ${x} + ${x * k} = ${x + x * k} (кг).`,
  };
}

function korobkyIShche(r: Vypadok): TrenZavdannia {
  const k = r.chyslo(2, 6);
  const po = r.chyslo(3, 9);
  const shche = r.chyslo(2, 9);
  return {
    pytannia: `У ${k} коробках по ${sht(po, 'олівець', 'олівці', 'олівців')} і ще ${shche} ${mnozh(shche, 'олівець', 'олівці', 'олівців')} лежать окремо. Скільки всього олівців?`,
    vidpovid: k * po + shche,
    pidkazka: 'Спершу — скільки олівців у коробках.',
    rozviazok: `1) ${po} · ${k} = ${k * po}; 2) ${k * po} + ${shche} = ${k * po + shche}.`,
  };
}

function reshta(r: Vypadok): TrenZavdannia {
  const o = osoba(r);
  const k = r.chyslo(2, 6);
  const tsina = r.chyslo(3, 15);
  const hroshi = 10 * Math.ceil((k * tsina + r.chyslo(1, 30)) / 10);
  return {
    pytannia: `${o.imia} ${rid(o, 'купив', 'купила')} ${k} ${mnozh(k, 'зошит', 'зошити', 'зошитів')} по ${tsina} грн і ${rid(o, 'дав', 'дала')} продавцю ${hroshi} грн. Скільки решти ${rid(o, 'він отримав', 'вона отримала')}?`,
    vidpovid: hroshi - k * tsina,
    odynytsi: 'грн',
    pidkazka: 'Спершу знайди, скільки коштують усі зошити.',
    rozviazok: `1) ${tsina} · ${k} = ${k * tsina} (грн); 2) ${hroshi} − ${k * tsina} = ${hroshi - k * tsina} (грн).`,
  };
}

function podilyly(r: Vypadok): TrenZavdannia {
  const dity = r.chyslo(2, 5);
  const kozhen = r.chyslo(4, 12);
  const ziily = r.chyslo(1, kozhen - 1);
  const vsi = dity * kozhen;
  return {
    pytannia: `${sht(vsi, 'горіх', 'горіхи', 'горіхів')} поділили порівну між ${dity} дітьми. Кожна дитина з'їла ${ziily}. Скільки горіхів лишилося в кожної?`,
    vidpovid: kozhen - ziily,
    pidkazka: 'Спершу — скільки горіхів отримала кожна дитина.',
    rozviazok: `1) ${vsi} : ${dity} = ${kozhen}; 2) ${kozhen} − ${ziily} = ${kozhen - ziily}.`,
  };
}

export default {
  rivni: ['додавання й віднімання', 'з множенням', 'з діленням, решта з покупки'],
  zavdannia(r, riven) {
    if (riven === 1) return r.shans() ? buloProdalyPryvezly(r) : naBilshe(r);
    if (riven === 2) return r.vybir([uRaziv, korobkyIShche, naBilshe])(r);
    return r.vybir([reshta, podilyly, uRaziv, korobkyIShche])(r);
  },
} satisfies Henerator;
