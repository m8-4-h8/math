// Пропорційне ділення: спершу скільки припадає на одну річ (усе : загальна кількість), потім множимо.
import { ch, dviOsoby, mnozh, rid, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const SIUZHETY = [
  { shcho: ['альбом', 'альбоми', 'альбомів'], tsina: [8, 30], odynytsi: 'грн' },
  { shcho: ['зошит', 'зошити', 'зошитів'], tsina: [5, 15], odynytsi: 'грн' },
  { shcho: ['пакунок', 'пакунки', 'пакунків'], tsina: [2, 9], odynytsi: 'кг' },
];

function zadacha(r: Vypadok, max: number): TrenZavdannia {
  const s = r.vybir(SIUZHETY);
  const [a, b] = dviOsoby(r);
  const na = r.chyslo(2, max);
  const nb = r.krim(2, max, [na]);
  const odna = r.chyslo(s.tsina[0], s.tsina[1]);
  const razom = (na + nb) * odna;
  const forma = (n: number) => `${n} ${mnozh(n, s.shcho[0], s.shcho[1], s.shcho[2])}`;
  const proKoho = r.shans() ? [a, na] as const : [b, nb] as const;
  const zaplatyly = s.odynytsi === 'грн';
  const k = proKoho[0];
  return {
    pytannia: zaplatyly
      ? `${a.imia} ${rid(a, 'купив', 'купила')} ${forma(na)}, а ${b.imia} — ${forma(nb)} за тією самою ціною. Разом вони заплатили ${razom} грн. Скільки гривень ${rid(k, 'заплатив', 'заплатила')} ${k.imia}?`
      : `${a.imia} ${rid(a, 'купив', 'купила')} ${forma(na)} борошна, а ${b.imia} — ${forma(nb)}. Усі пакунки однакові, разом ${razom} кг. Скільки кілограмів борошна ${rid(k, 'купив', 'купила')} ${k.imia}?`,
    vidpovid: proKoho[1] * odna,
    odynytsi: s.odynytsi,
    pidkazka: `Спершу скільки ${zaplatyly ? 'коштує один' : 'важить один'}: ${razom} : (${na} + ${nb}).`,
    rozviazok: `1) ${na} + ${nb} = ${na + nb}; 2) ${razom} : ${na + nb} = ${odna} (${s.odynytsi}) — на один; 3) ${odna} · ${proKoho[1]} = ${proKoho[1] * odna} (${s.odynytsi}).`,
  };
}

function robitnyky(r: Vypadok): TrenZavdannia {
  const b1 = r.chyslo(2, 6);
  const b2 = r.chyslo(2, 6);
  const odnomu = 100 * r.chyslo(5, 30);
  const vse = (b1 + b2) * odnomu;
  return {
    pytannia: `Дві бригади отримали разом ${ch(vse)} грн. У першій ${b1} ${mnozh(b1, 'робітник', 'робітники', 'робітників')}, у другій — ${b2}, і кожен отримав однаково. Скільки гривень отримала друга бригада?`,
    vidpovid: b2 * odnomu,
    odynytsi: 'грн',
    pidkazka: 'Скільки всього робітників? Скільки отримав один?',
    rozviazok: `1) ${b1} + ${b2} = ${b1 + b2}; 2) ${ch(vse)} : ${b1 + b2} = ${ch(odnomu)} (грн); 3) ${ch(odnomu)} · ${b2} = ${ch(b2 * odnomu)} (грн).`,
  };
}

function rizn(r: Vypadok): TrenZavdannia {
  // «За двома різницями»: одна покупка більша на кілька штук і дорожча на певну суму.
  const odna = r.chyslo(3, 15);
  const na = r.chyslo(2, 8);
  const rizn = r.chyslo(1, 5);
  const nb = na + rizn;
  return {
    pytannia: `Одна сім'я купила ${na} кг яблук, а інша — ${nb} кг таких самих яблук і заплатила на ${rizn * odna} грн більше. Скільки гривень заплатила перша сім'я?`,
    vidpovid: na * odna,
    odynytsi: 'грн',
    pidkazka: `Друга купила на ${rizn} кг більше і заплатила на ${rizn * odna} грн більше. Скільки коштує 1 кг?`,
    rozviazok: `1) ${nb} − ${na} = ${rizn} (кг); 2) ${rizn * odna} : ${rizn} = ${odna} (грн) — ціна 1 кг; 3) ${odna} · ${na} = ${na * odna} (грн).`,
  };
}

export default {
  rivni: ['дві покупки за однією ціною', 'більші числа і бригади', 'за двома різницями'],
  zavdannia(r, riven) {
    if (riven === 1) return zadacha(r, 5);
    if (riven === 2) return r.shans() ? zadacha(r, 9) : robitnyky(r);
    return r.vybir([rizn, rizn, robitnyky, () => zadacha(r, 9)])(r);
  },
} satisfies Henerator;
