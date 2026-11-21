// Одночасний рух двох тіл у різних напрямках (4 клас): назустріч одне одному або з одного місця в протилежних
// напрямках. Шлях кожного тіла — відрізок свого кольору, поділений рисками на шматочки «за кожну одиницю часу»;
// унизу дужка — уся відстань. Невідоме підписуємо «?», тож малюнок не видає відповідь.
// Повертає SVG-рядок: його вставляють і компонент RukhDvokhTil, і тренажери (поле `malunok`).
// Файл не є генератором: генератори лежать у `<N>-klas/`.

export interface RukhDvokhOpts {
  v1: number;
  v2: number;
  t: number;
  /** Назустріч одне одному (від двох місць) чи з одного місця в протилежних напрямках. */
  napriamok: 'nazustrich' | 'protylezhno';
  /** Що невідоме — замість числа «?». */
  shukaty?: 's' | 'v1' | 'v2' | 't' | '';
  /** Одиниця шляху: км, м. */
  odynytsia?: string;
  /** Одиниця часу: год, хв, с. */
  chas?: string;
}

const f = (v: number) => v.toFixed(1);

export function rukhDvokh(o: RukhDvokhOpts) {
  const { v1, v2, t, napriamok, shukaty = '', odynytsia = 'км', chas = 'год' } = o;
  const nazustrich = napriamok === 'nazustrich';
  const W = 380;
  const H = 150;
  const [xL, xR] = [26, 354];
  const s1 = v1 * t;
  const s = (v1 + v2) * t;
  const k = (xR - xL) / s;
  // Точка, де шляхи стикаються: місце зустрічі або спільний старт.
  const xM = xL + s1 * k;
  const y = 74;

  const shv = (v: number, ch: 'v1' | 'v2') => `${shukaty === ch ? '?' : v} ${odynytsia}/${chas}`;
  const chasTekst = shukaty === 't' ? '?' : String(t);
  const vsia = shukaty === 's' ? `? ${odynytsia}` : `${s} ${odynytsia}`;

  let tilo = '';
  tilo += `<line x1="${xL - 14}" y1="${y}" x2="${xR + 14}" y2="${y}" stroke="var(--ill-line)" stroke-width="2"/>`;

  // Відрізок тіла від a до b (рух у бік b) з рисками через кожну одиницю часу.
  const vidrizok = (a: number, b: number, v: number, kol: string) => {
    let r = `<line x1="${f(a)}" y1="${y}" x2="${f(b)}" y2="${y}" stroke="${kol}" stroke-width="7" stroke-linecap="butt"/>`;
    const napr = Math.sign(b - a);
    r += `<path d="M ${f(b - napr * 10)} ${y - 8} L ${f(b + napr * 2)} ${y} L ${f(b - napr * 10)} ${y + 8} z" fill="${kol}"/>`;
    // Риски: стільки шматочків, скільки одиниць часу (якщо час невідомий — без рисок, щоб не видати його).
    if (shukaty !== 't' && t <= 12 && v * k >= 12) {
      for (let i = 1; i < t; i++) {
        const x = a + napr * v * i * k;
        r += `<line x1="${f(x)}" y1="${y - 9}" x2="${f(x)}" y2="${y + 9}" stroke="var(--ill-ink)" stroke-width="1.5"/>`;
      }
    }
    return r;
  };
  if (nazustrich) {
    tilo += vidrizok(xL, xM, v1, 'var(--ill-1)');
    tilo += vidrizok(xR, xM, v2, 'var(--ill-2)');
    tilo += `<circle cx="${xL}" cy="${y}" r="5.5" fill="var(--ill-ink)"/><circle cx="${xR}" cy="${y}" r="5.5" fill="var(--ill-ink)"/>`;
    tilo += `<text x="${f(xM)}" y="${y + 26}" text-anchor="middle" font-size="12" fill="var(--ill-muted)">зустріч</text>`;
  } else {
    tilo += vidrizok(xM, xL, v1, 'var(--ill-1)');
    tilo += vidrizok(xM, xR, v2, 'var(--ill-2)');
    tilo += `<circle cx="${f(xM)}" cy="${y}" r="5.5" fill="var(--ill-ink)"/>`;
    tilo += `<text x="${f(xM)}" y="${y + 26}" text-anchor="middle" font-size="12" fill="var(--ill-muted)">старт</text>`;
  }
  // Швидкості — біля зовнішніх кінців, щоб підписи не налягали навіть при дуже різних швидкостях.
  tilo += `<text x="${xL - 6}" y="${y - 16}" font-size="14" font-weight="700" fill="var(--ill-1)">${shv(v1, 'v1')}</text>`;
  tilo += `<text x="${xR + 6}" y="${y - 16}" text-anchor="end" font-size="14" font-weight="700" fill="var(--ill-2)">${shv(v2, 'v2')}</text>`;
  tilo += `<text x="${W / 2}" y="22" text-anchor="middle" font-size="14" fill="var(--ill-ink)">${nazustrich ? 'до зустрічі' : 'рух триває'} ${chasTekst} ${chas}</text>`;
  // Дужка під усією відстанню.
  const yD = y + 36;
  const m = (xL + xR) / 2;
  tilo += `<path d="M ${xL} ${yD} Q ${xL} ${yD + 8} ${xL + 8} ${yD + 8} H ${m - 8} Q ${m} ${yD + 8} ${m} ${yD + 16} Q ${m} ${yD + 8} ${m + 8} ${yD + 8} H ${xR - 8} Q ${xR} ${yD + 8} ${xR} ${yD}" fill="none" stroke="var(--ill-line)" stroke-width="1.5"/>`;
  tilo += `<text x="${m}" y="${yD + 34}" text-anchor="middle" font-size="15" font-weight="700" fill="var(--ill-ink)">${vsia}</text>`;

  const nev = (x: string) => (x.startsWith('?') ? 'невідома' : x);
  const opys = [
    nazustrich ? 'Рух назустріч одне одному від двох місць' : 'Рух з одного місця в протилежних напрямках',
    `швидкість першого — ${nev(shv(v1, 'v1'))}`,
    `другого — ${nev(shv(v2, 'v2'))}`,
    `час руху — ${shukaty === 't' ? 'невідомий' : `${t} ${chas}`}`,
    `уся відстань — ${nev(vsia)}`,
  ];
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${opys.join('; ')}">${tilo}</svg>`;
}
