// Вимірювання кутів: градусна міра; промінь всередині кута ділить його на два (кути додаються);
// дві шкали транспортира; вершина кута за назвою; кут між стрілками годинника.
import { mnozh, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const BUKVY = ['A', 'B', 'C', 'D', 'K', 'M', 'N', 'P'];

function nazvy(r: Vypadok) {
  const [a, c, b] = r.rizni(3, 0, BUKVY.length - 1).map((i) => BUKVY[i]);
  return { a, b, c, o: 'O' };
}

function suma(r: Vypadok, max: number): TrenZavdannia {
  const { a, b, c, o } = nazvy(r);
  const x = r.chyslo(10, max / 2);
  const y = r.chyslo(10, max - x);
  if (r.shans()) {
    return {
      pytannia: `Промінь ${o}${c} ділить кут ${a}${o}${b} на два кути: ∠${a}${o}${c} = ${x}°, ∠${c}${o}${b} = ${y}°. Знайди ∠${a}${o}${b}.`,
      vidpovid: x + y,
      odynytsi: '°',
      pidkazka: 'Весь кут — сума його частин.',
      rozviazok: `${x}° + ${y}° = ${x + y}°`,
    };
  }
  return {
    pytannia: `∠${a}${o}${b} = ${x + y}°, промінь ${o}${c} — всередині кута, ∠${a}${o}${c} = ${x}°. Знайди ∠${c}${o}${b}.`,
    vidpovid: y,
    odynytsi: '°',
    pidkazka: 'Від усього кута відніми відому частину.',
    rozviazok: `${x + y}° − ${x}° = ${y}°`,
  };
}

function vershyna(r: Vypadok): TrenZavdannia {
  const [p, v, q] = r.rizni(3, 0, BUKVY.length - 1).map((i) => BUKVY[i]);
  return {
    pytannia: `Яка точка — вершина кута ${p}${v}${q}?`,
    vidpovid: v,
    varianty: [p, v, q],
    pidkazka: 'У назві кута вершину пишуть посередині.',
    rozviazok: `Середня буква — ${v}.`,
  };
}

function dviShkaly(r: Vypadok): TrenZavdannia {
  const g = r.chyslo(1, 17) * 5 + r.vybir([0, 0, 1, 2, 3, 4]);
  if (g === 90) return dviShkaly(r);
  return {
    pytannia: `Петрик виміряв кут ${g}°, але прочитав не ту шкалу транспортира. Яке число він міг побачити на другій шкалі?`,
    vidpovid: 180 - g,
    odynytsi: '°',
    pidkazka: 'Числа на двох шкалах у сумі дають 180°.',
    rozviazok: `180° − ${g}° = ${180 - g}°. Тому завжди дивись, гострий кут чи тупий, і обирай шкалу, що починається з 0 на твоїй стороні кута.`,
  };
}

function hodynnyk(r: Vypadok): TrenZavdannia {
  const h = r.chyslo(1, 11);
  const kut = Math.min(h, 12 - h) * 30;
  return {
    pytannia: `Який кут утворюють стрілки годинника рівно о ${h}:00? Візьми менший з двох кутів.`,
    vidpovid: kut,
    odynytsi: '°',
    pidkazka: 'Між сусідніми числами на циферблаті 360° : 12 = 30°.',
    rozviazok: `Між стрілками ${Math.min(h, 12 - h)} ${mnozh(Math.min(h, 12 - h), 'проміжок', 'проміжки', 'проміжків')} по 30°: ${Math.min(h, 12 - h)} · 30° = ${kut}°.`,
  };
}

export default {
  rivni: ['вершина і частини кута', 'складаємо й віднімаємо кути', 'дві шкали і годинник'],
  zavdannia(r, riven) {
    if (riven === 1) return r.shans(0.7) ? suma(r, 90) : vershyna(r);
    if (riven === 2) return suma(r, 180);
    return r.vybir([dviShkaly, hodynnyk, (rr: Vypadok) => suma(rr, 180)])(r);
  },
} satisfies Henerator;
