// Координатна площина: точка (x; y) — спершу по горизонталі, потім по вертикалі; чверті за знаками
// координат; точки на осях; абсциса й ордината; симетричні точки.
import { ch, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';
import { ploshchyna } from '../malunky.ts';

const NAZVY = ['A', 'B', 'C', 'D', 'K', 'M', 'N', 'P'];
const tz = (n: number) => (n < 0 ? `-${-n}` : `${n}`);
const para = (x: number, y: number) => `${ch(x)}; ${ch(y)}`;
const nenul = (r: Vypadok, m: number) => r.krim(-m, m, [0]);

function chvert(r: Vypadok): TrenZavdannia {
  const [x, y] = [nenul(r, 12), nenul(r, 12)];
  const ch_ = x > 0 ? (y > 0 ? 'I' : 'IV') : y > 0 ? 'II' : 'III';
  return {
    pytannia: `У якій чверті лежить точка $(${tz(x)};\\, ${tz(y)})$?`,
    vidpovid: ch_,
    varianty: ['I', 'II', 'III', 'IV'],
    pidkazka: 'x додатний — права половина, y додатний — верхня.',
    rozviazok: `x ${x > 0 ? '> 0 — праворуч' : '< 0 — ліворуч'}, y ${y > 0 ? '> 0 — угорі' : '< 0 — унизу'}: ${ch_} чверть.`,
  };
}

function abstsysa(r: Vypadok): TrenZavdannia {
  const [x, y] = [r.chyslo(-9, 9), r.chyslo(-9, 9)];
  const nazva = r.vybir(NAZVY);
  const absc = r.shans();
  if (x === y) return abstsysa(r);
  return {
    pytannia: `Яка ${absc ? 'абсциса' : 'ордината'} точки $${nazva}(${tz(x)};\\, ${tz(y)})$?`,
    vidpovid: ch(absc ? x : y),
    pidkazka: 'Абсциса — перше число в дужках (x), ордината — друге (y).',
    rozviazok: `${absc ? 'Абсциса — перше число' : 'Ордината — друге число'}: ${ch(absc ? x : y)}.`,
  };
}

function zaMalunkom(r: Vypadok): TrenZavdannia {
  const [x, y] = [r.chyslo(-5, 5), r.chyslo(-5, 5)];
  if (x === 0 && y === 0) return zaMalunkom(r);
  const nazva = r.vybir(NAZVY);
  return {
    pytannia: `Які координати точки ${nazva}? Запиши через крапку з комою, наприклад «−3; 2».`,
    malunok: ploshchyna([{ nazva, x, y }]),
    vidpovid: para(x, y),
    pidkazka: 'Спершу порахуй клітинки по горизонталі від нуля (x), потім — по вертикалі (y).',
    rozviazok: `По горизонталі — ${x === 0 ? 'на осі y, x = 0' : `${Math.abs(x)} ${x > 0 ? 'праворуч' : 'ліворуч'}`}, по вертикалі — ${y === 0 ? 'на осі x, y = 0' : `${Math.abs(y)} ${y > 0 ? 'вгору' : 'вниз'}`}: (${para(x, y)}).`,
  };
}

function zaOpysom(r: Vypadok): TrenZavdannia {
  const [x, y] = [nenul(r, 9), nenul(r, 9)];
  const kl = (n: number) => `${Math.abs(n)} ${Math.abs(n) === 1 ? 'клітинку' : Math.abs(n) < 5 ? 'клітинки' : 'клітинок'}`;
  return {
    pytannia: `Точка лежить на ${kl(x)} ${x > 0 ? 'праворуч' : 'ліворуч'} від осі y і на ${kl(y)} ${y > 0 ? 'вище' : 'нижче'} від осі x. Які її координати? Запиши через крапку з комою.`,
    vidpovid: para(x, y),
    pidkazka: 'Ліворуч — мінус у x, вниз — мінус у y.',
    rozviazok: `x = ${ch(x)}, y = ${ch(y)}: (${para(x, y)}).`,
  };
}

function symetrychna(r: Vypadok): TrenZavdannia {
  const [x, y] = [nenul(r, 9), nenul(r, 9)];
  const nazva = r.vybir(NAZVY);
  const vyd = r.chyslo(0, 2);
  const [sx, sy] = vyd === 0 ? [x, -y] : vyd === 1 ? [-x, y] : [-x, -y];
  const shcho = ['осі x', 'осі y', 'початку координат'][vyd];
  return {
    pytannia: `Яка точка симетрична точці $${nazva}(${tz(x)};\\, ${tz(y)})$ відносно ${shcho}? Запиши координати через крапку з комою.`,
    vidpovid: para(sx, sy),
    pidkazka: vyd === 0 ? 'Відносно осі x змінюється знак y.' : vyd === 1 ? 'Відносно осі y змінюється знак x.' : 'Відносно початку координат змінюються обидва знаки.',
    rozviazok: `(${para(sx, sy)})`,
  };
}

export default {
  rivni: ['чверті, абсциса й ордината', 'координати за малюнком', 'за описом і симетрія'],
  zavdannia(r, riven) {
    if (riven === 1) return r.shans(0.6) ? chvert(r) : abstsysa(r);
    if (riven === 2) return r.shans(0.75) ? zaMalunkom(r) : chvert(r);
    return r.vybir([zaOpysom, symetrychna, zaMalunkom])(r);
  },
} satisfies Henerator;
