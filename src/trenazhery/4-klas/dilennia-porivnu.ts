// Ділення: ділимо порівну; назви компонентів; ділення через множення; перевірка остачі.
import { mnozh, osoba, rid, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

function porivnu(r: Vypadok): TrenZavdannia {
  const lyudy = r.chyslo(2, 9);
  const kozhnomu = r.chyslo(2, 9);
  const vsi = lyudy * kozhnomu;
  const o = osoba(r);
  return {
    pytannia: `${o.imia} ${rid(o, 'роздав', 'роздала')} ${vsi} ${mnozh(vsi, 'наліпку', 'наліпки', 'наліпок')} порівну ${lyudy} друзям. Скільки наліпок отримав кожен?`,
    vidpovid: kozhnomu,
    pidkazka: `Яке число треба помножити на ${lyudy}, щоб вийшло ${vsi}?`,
    rozviazok: `${vsi} : ${lyudy} = ${kozhnomu}, бо ${kozhnomu} · ${lyudy} = ${vsi}.`,
  };
}

function komponenty(r: Vypadok): TrenZavdannia {
  const dilnyk = r.chyslo(2, 9);
  const chastka = r.chyslo(2, 12);
  const dilene = dilnyk * chastka;
  return r.vybir<() => TrenZavdannia>([
    () => ({ pytannia: `Ділене ${dilene}, дільник ${dilnyk}. Знайди частку.`, vidpovid: chastka, pidkazka: 'Частка = ділене : дільник.', rozviazok: `${dilene} : ${dilnyk} = ${chastka}` }),
    () => ({ pytannia: `Частка ${chastka}, дільник ${dilnyk}. Знайди ділене.`, vidpovid: dilene, pidkazka: 'Ділене = частка · дільник.', rozviazok: `${chastka} · ${dilnyk} = ${dilene}` }),
    () => ({ pytannia: `Ділене ${dilene}, частка ${chastka}. Знайди дільник.`, vidpovid: dilnyk, pidkazka: 'Дільник = ділене : частка.', rozviazok: `${dilene} : ${chastka} = ${dilnyk}` }),
  ])();
}

function zOstacheiu(r: Vypadok): TrenZavdannia {
  const dity = r.chyslo(2, 6);
  const kozhnomu = r.chyslo(2, 6);
  const zalyshok = r.chyslo(1, dity - 1);
  const vsi = dity * kozhnomu + zalyshok;
  return {
    pytannia: `${vsi} ${mnozh(vsi, 'цукерку', 'цукерки', 'цукерок')} роздали порівну ${dity} дітям, скільки змогли. Скільки цукерок отримала кожна дитина і скільки лишилося? Запиши так: 3 ост 2.`,
    vidpovid: [`${kozhnomu} ост ${zalyshok}`, `${kozhnomu} (ост. ${zalyshok})`],
    pokaz: `по ${kozhnomu}, лишилося ${zalyshok}`,
    pidkazka: `Яке найбільше число, помножене на ${dity}, не перевищує ${vsi}?`,
    rozviazok: `${kozhnomu} · ${dity} + ${zalyshok} = ${vsi}`,
  };
}

function chyMozhe(r: Vypadok): TrenZavdannia {
  const dilnyk = r.chyslo(3, 9);
  const mozhe = r.shans();
  const ostacha = mozhe ? r.chyslo(1, dilnyk - 1) : r.chyslo(dilnyk, dilnyk + 4);
  return {
    pytannia: `Чи може при діленні на ${dilnyk} вийти остача ${ostacha}?`,
    vidpovid: mozhe ? 'Так' : 'Ні',
    varianty: ['Так', 'Ні'],
    pidkazka: 'Порівняй остачу з дільником.',
    rozviazok: mozhe
      ? `Так: ${ostacha} < ${dilnyk}, остача завжди менша за дільник.`
      : `Ні: ${ostacha} ≥ ${dilnyk}, з такої «остачі» можна дати ще по одній.`,
  };
}

export default {
  rivni: ['ділимо порівну', 'ділене, дільник, частка', 'з остачею'],
  zavdannia(r, riven) {
    if (riven === 1) return porivnu(r);
    if (riven === 2) return r.shans(0.7) ? komponenty(r) : porivnu(r);
    return r.vybir([zOstacheiu, zOstacheiu, chyMozhe, komponenty])(r);
  },
} satisfies Henerator;
