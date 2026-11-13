// Об'єм прямокутного паралелепіпеда і куба. Одиниці об'єму (Істер § 49): V = abc = S · h, V = a³; десяткові виміри;
// невідомий вимір h = V : S; 1 дм³ = 1000 см³, 1 м³ = 1000 дм³, 1 л = 1 дм³; акваріуми й кубики.
import { ch, des, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const ODYNYTSI = ['см', 'дм', 'м'];

function obiem(r: Vypadok): TrenZavdannia {
  const o = r.vybir(ODYNYTSI);
  if (r.shans(0.3)) {
    const a = r.chyslo(2, 10);
    return {
      pytannia: `Знайди об’єм куба з ребром ${a} ${o}.`,
      vidpovid: a ** 3,
      odynytsi: `${o}³`,
      pidkazka: `V = ${a} · ${a} · ${a}.`,
      rozviazok: `${a} · ${a} · ${a} = ${a * a} · ${a} = ${ch(a ** 3)} (${o}³)`,
    };
  }
  const [a, b, c] = [r.chyslo(2, 15), r.chyslo(2, 10), r.chyslo(2, 9)];
  return {
    pytannia: `Знайди об’єм прямокутного паралелепіпеда з вимірами ${a} ${o}, ${b} ${o} і ${c} ${o}.`,
    vidpovid: a * b * c,
    odynytsi: `${o}³`,
    pidkazka: 'V = a · b · c.',
    rozviazok: `${a} · ${b} · ${c} = ${a * b} · ${c} = ${ch(a * b * c)} (${o}³)`,
  };
}

function desiatkovi(r: Vypadok): TrenZavdannia {
  // один вимір — десятковий (у десятих), два інші — цілі
  const a = r.krim(2, 39, [10, 20, 30]);
  const [b, c] = [r.chyslo(2, 8), r.chyslo(2, 6)];
  const V = a * b * c; // десяті
  return {
    pytannia: `Знайди об’єм прямокутного паралелепіпеда з вимірами ${des(a, 1)} м, ${b} м і ${c} м.`,
    vidpovid: des(V, 1),
    odynytsi: 'м³',
    pidkazka: 'Перемнож усі три виміри.',
    rozviazok: `${des(a, 1)} · ${b} = ${des(a * b, 1)}; ${des(a * b, 1)} · ${c} = ${des(V, 1)} (м³)`,
  };
}

function nevidomyi(r: Vypadok): TrenZavdannia {
  const o = r.vybir(ODYNYTSI);
  const [a, b, h] = [r.chyslo(2, 12), r.chyslo(2, 10), r.chyslo(2, 12)];
  const S = a * b;
  const V = S * h;
  const typ = r.chyslo(0, 2);
  if (typ === 0) {
    return {
      pytannia: `Площа основи паралелепіпеда — ${S} ${o}², висота — ${h} ${o}. Знайди об’єм.`,
      vidpovid: V,
      odynytsi: `${o}³`,
      pidkazka: 'V = S · h.',
      rozviazok: `${S} · ${h} = ${ch(V)} (${o}³)`,
    };
  }
  if (typ === 1) {
    return {
      pytannia: `Об’єм паралелепіпеда — ${ch(V)} ${o}³, площа основи — ${S} ${o}². Знайди висоту.`,
      vidpovid: h,
      odynytsi: o,
      pidkazka: 'h = V : S.',
      rozviazok: `${ch(V)} : ${S} = ${h} (${o})`,
    };
  }
  return {
    pytannia: `Об’єм паралелепіпеда — ${ch(V)} ${o}³, довжина — ${a} ${o}, ширина — ${b} ${o}. Знайди висоту.`,
    vidpovid: h,
    odynytsi: o,
    pidkazka: 'Спершу площа основи: довжина · ширина. Потім поділи об’єм на неї.',
    rozviazok: `S = ${a} · ${b} = ${S}; h = ${ch(V)} : ${S} = ${h} (${o})`,
  };
}

function odynytsi(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(0, 4);
  const n = r.chyslo(2, 9);
  if (typ === 0) {
    return { pytannia: `Скільки кубічних сантиметрів у ${n} дм³?`, vidpovid: ch(n * 1000), odynytsi: 'см³', pidkazka: '1 дм³ = 1000 см³.', rozviazok: `${n} · 1000 = ${ch(n * 1000)} (см³)` };
  }
  if (typ === 1) {
    return { pytannia: `Скільки кубічних дециметрів у ${n} м³?`, vidpovid: ch(n * 1000), odynytsi: 'дм³', pidkazka: '1 м³ = 1000 дм³.', rozviazok: `${n} · 1000 = ${ch(n * 1000)} (дм³)` };
  }
  if (typ === 2) {
    const k = r.krim(11, 99, [20, 30, 40, 50, 60, 70, 80, 90]); // десяті
    return { pytannia: `Скільки літрів у ${des(k, 1)} м³?`, vidpovid: ch(k * 100), odynytsi: 'л', pidkazka: '1 м³ = 1000 дм³, а 1 дм³ = 1 л.', rozviazok: `${des(k, 1)} · 1000 = ${ch(k * 100)} (дм³) = ${ch(k * 100)} л` };
  }
  if (typ === 3) {
    const k = r.chyslo(2, 9) * 1000 + r.vybir([0, 500, 250]);
    return { pytannia: `Скільки кубічних дециметрів у ${ch(k)} см³?`, vidpovid: des(k, 3), odynytsi: 'дм³', pidkazka: '1000 см³ = 1 дм³: поділи на 1000.', rozviazok: `${ch(k)} : 1000 = ${des(k, 3)} (дм³)` };
  }
  return { pytannia: `Скільки кубічних сантиметрів в 1 м³?`, vidpovid: ch(1_000_000), odynytsi: 'см³', pidkazka: '1 м = 100 см, тож 100 · 100 · 100.', rozviazok: '100 · 100 · 100 = 1 000 000 (см³)' };
}

function akvarium(r: Vypadok): TrenZavdannia {
  if (r.shans(0.6)) {
    const [a, b, c] = [r.chyslo(3, 10) * 10, r.chyslo(2, 6) * 10, r.chyslo(2, 6) * 10]; // см
    const V = (a / 10) * (b / 10) * (c / 10); // дм³ = л
    return {
      pytannia: `Скільки літрів води вміщує акваріум довжиною ${a} см, шириною ${b} см і висотою ${c} см?`,
      vidpovid: V,
      odynytsi: 'л',
      pidkazka: 'Переведи виміри в дециметри: 1 л = 1 дм³.',
      rozviazok: `${a / 10} · ${b / 10} · ${c / 10} = ${V} (дм³) = ${V} л`,
    };
  }
  const [m, n] = r.vybir([[2, 1], [3, 1], [4, 2], [6, 2], [6, 3], [9, 3], [10, 5], [10, 2]] as [number, number][]);
  const k = m / n;
  return {
    pytannia: `Скільки кубиків з ребром ${n} см можна скласти в коробку у формі куба з ребром ${m} см?`,
    vidpovid: k ** 3,
    pidkazka: `Уздовж кожного ребра вміщується ${m} : ${n} = ${k} кубиків.`,
    rozviazok: `${k} · ${k} · ${k} = ${k ** 3}`,
  };
}

export default {
  rivni: ['V = abc і V = a³', 'десяткові виміри, невідома висота', 'одиниці об’єму, літри, кубики'],
  zavdannia(r, riven) {
    if (riven === 1) return obiem(r);
    if (riven === 2) return r.vybir([desiatkovi, nevidomyi, nevidomyi, obiem])(r);
    return r.vybir([odynytsi, odynytsi, akvarium, akvarium, desiatkovi])(r);
  },
} satisfies Henerator;
