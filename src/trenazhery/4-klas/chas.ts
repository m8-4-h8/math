// Час: секунди, хвилини, години, доба; століття; скільки часу минуло.
import { ch, mnozh, rymskeLatynytseiu, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';
import { rymske } from '../../components/rymski.ts';

const ODYNYTSI = [
  { bilsha: 'хв', mensha: 'с', k: 60, nazva: '1 хв = 60 с' },
  { bilsha: 'год', mensha: 'хв', k: 60, nazva: '1 год = 60 хв' },
  { bilsha: 'доба', mensha: 'год', k: 24, nazva: '1 доба = 24 год' },
];
const pokazBilshoi = (n: number, o: string) => (o === 'доба' ? `${n} ${mnozh(n, 'доба', 'доби', 'діб')}` : `${n} ${o}`);

function perevedennia(r: Vypadok): TrenZavdannia {
  const o = r.vybir(ODYNYTSI);
  const n = r.chyslo(2, o.k === 24 ? 7 : 9);
  if (r.shans()) {
    return {
      pytannia: 'Переведи в менші одиниці.',
      vyraz: `${pokazBilshoi(n, o.bilsha)} = □ ${o.mensha}`,
      vidpovid: n * o.k,
      odynytsi: o.mensha,
      pidkazka: `${o.nazva}. У менші одиниці — множимо.`,
      rozviazok: `${o.k} · ${n} = ${n * o.k} (${o.mensha})`,
    };
  }
  return {
    pytannia: 'Переведи у більші одиниці.',
    vyraz: `${n * o.k} ${o.mensha} = □ ${o.bilsha === 'доба' ? 'доб.' : o.bilsha}`,
    vidpovid: n,
    pidkazka: `${o.nazva}. У більші одиниці — ділимо.`,
    rozviazok: `${n * o.k} : ${o.k} = ${n}`,
  };
}

function skladene(r: Vypadok): TrenZavdannia {
  const o = r.vybir(ODYNYTSI.slice(0, 2));
  const n = r.chyslo(1, 5);
  const m = r.chyslo(5, o.k - 1);
  return {
    pytannia: 'Вирази в менших одиницях.',
    vyraz: `${n} ${o.bilsha} ${m} ${o.mensha} = □ ${o.mensha}`,
    vidpovid: n * o.k + m,
    odynytsi: o.mensha,
    pidkazka: `Спершу ${n} ${o.bilsha} у ${o.mensha === 'с' ? 'секундах' : 'хвилинах'}, потім додай ${m}.`,
    rozviazok: `${o.k} · ${n} + ${m} = ${n * o.k + m} (${o.mensha})`,
  };
}

function stolittia(r: Vypadok): TrenZavdannia {
  const rik = r.shans(0.2) ? 100 * r.chyslo(10, 20) : r.chyslo(1001, 2025);
  const st = Math.ceil(rik / 100);
  return {
    pytannia: `У якому столітті був ${ch(rik)} рік? Запиши номер століття числом.`,
    vidpovid: st,
    perevirka: (v) => rymskeLatynytseiu(v) === rymske(st),
    pidkazka: rik % 100 === 0 ? `Рік ${rik} — останній рік століття, а не перший наступного.` : 'Відкинь дві останні цифри року і додай 1.',
    rozviazok:
      rik % 100 === 0
        ? `${rik} : 100 = ${st} — цей рік завершує ${st} століття.`
        : `${Math.floor(rik / 100)} + 1 = ${st}: ${ch(rik)} рік — ${st} століття.`,
  };
}

function minulo(r: Vypadok): TrenZavdannia {
  const h1 = r.chyslo(7, 15);
  const m1 = 5 * r.chyslo(0, 11);
  const tryvalist = 5 * r.chyslo(5, 30);
  const kinets = h1 * 60 + m1 + tryvalist;
  const [h2, m2] = [Math.floor(kinets / 60), kinets % 60];
  const z = (h: number, m: number) => `${h}:${String(m).padStart(2, '0')}`;
  return r.shans()
    ? {
        pytannia: `Екскурсія почалася о ${z(h1, m1)} і закінчилася о ${z(h2, m2)}. Скільки хвилин вона тривала?`,
        vidpovid: tryvalist,
        odynytsi: 'хв',
        pidkazka: 'Порахуй, скільки хвилин до наступної повної години, а потім — решту.',
        rozviazok: `Від ${z(h1, m1)} до ${z(h2, m2)} — ${tryvalist} хв.`,
      }
    : {
        pytannia: `Фільм почався о ${z(h1, m1)} і тривав ${tryvalist} хв. О котрій він закінчився? Запиши так: 14:05.`,
        vidpovid: z(h2, m2),
        perevirka: (v) => {
          const t = v.trim().match(/^(\d{1,2})\s*[:.,\s]\s*(\d{2})$/);
          return !!t && Number(t[1]) === h2 && Number(t[2]) === m2;
        },
        pidkazka: `${tryvalist} хв — це ${Math.floor(tryvalist / 60)} год ${tryvalist % 60} хв.`,
        rozviazok: `${z(h1, m1)} + ${Math.floor(tryvalist / 60)} год ${tryvalist % 60} хв = ${z(h2, m2)}.`,
      };
}

export default {
  rivni: ['хвилини, години, доба', 'складені одиниці й століття', 'скільки часу минуло'],
  zavdannia(r, riven) {
    if (riven === 1) return perevedennia(r);
    if (riven === 2) return r.vybir([perevedennia, skladene, stolittia])(r);
    return r.vybir([minulo, minulo, stolittia, skladene])(r);
  },
} satisfies Henerator;
