// Графік оберненої пропорційності y = k/x (гіпербола) на координатній площині від −m до m: сітка, осі, дві вітки,
// точки з пунктиром до осей. Повертає SVG-рядок: його вставляють і компонент Hiperbola, і тренажери (поле `malunok`).
// Підписи точок задає той, хто викликає: шукане — «?», тож малюнок не видає відповідь.
// Файл не є генератором: генератори лежать у `<N>-klas/`.

export interface TochkaHiperboly {
  x: number;
  y: number;
  /** Підпис біля точки: «A», «A(2; 3)», «?». */
  pidpys?: string;
  /** Пунктир від точки до осей. */
  punktyr?: boolean;
}

export interface HiperbolaOpts {
  /** Коефіцієнт k ≠ 0. */
  k: number;
  /** Межі осей: від −m до m. */
  m?: number;
  /** Підписати формулу біля вітки (наприклад «y = 6/x»); '' — без підпису. */
  formula?: string;
  tochky?: TochkaHiperboly[];
  /** Показати лише вітку в першій (k > 0) чи другій (k < 0) чверті — для задач з життя, де x > 0. */
  lysheDodatni?: boolean;
}

const f = (v: number) => v.toFixed(1);
// Підкладка кольору тла під цифрами й підписами, щоб пунктир їх не перекреслював.
const TLO = 'paint-order="stroke" stroke="var(--ill-paper)" stroke-width="3" stroke-linejoin="round"';
const minus = (v: number) => (v < 0 ? `−${-v}` : `${v}`);

export function hiperbola(o: HiperbolaOpts) {
  const { k, m = 6, tochky = [], lysheDodatni = false } = o;
  if (!k) throw new Error('hiperbola: k не може дорівнювати 0');
  const kl = 22;
  const W = (2 * m + 2) * kl;
  const c = W / 2;
  const X = (x: number) => c + x * kl;
  const Y = (y: number) => c - y * kl;

  let tilo = '';
  // Цифри на осях малюємо після пунктирів — поверх них.
  let tsyfry = '';
  for (let v = -m; v <= m; v++) {
    tilo += `<line x1="${f(X(v))}" y1="${f(Y(m))}" x2="${f(X(v))}" y2="${f(Y(-m))}" stroke="var(--ill-line)" stroke-width="0.6" opacity="0.6"/>`;
    tilo += `<line x1="${f(X(-m))}" y1="${f(Y(v))}" x2="${f(X(m))}" y2="${f(Y(v))}" stroke="var(--ill-line)" stroke-width="0.6" opacity="0.6"/>`;
    if (v !== 0 && (m <= 6 || v % 2 === 0)) {
      tsyfry += `<text x="${f(X(v))}" y="${f(c + 14)}" text-anchor="middle" font-size="10" fill="var(--ill-muted)" ${TLO}>${minus(v)}</text>`;
      tsyfry += `<text x="${f(c - 5)}" y="${f(Y(v) + 3.5)}" text-anchor="end" font-size="10" fill="var(--ill-muted)" ${TLO}>${minus(v)}</text>`;
    }
  }
  tilo += `<line x1="4" y1="${c}" x2="${W - 6}" y2="${c}" stroke="var(--ill-ink)" stroke-width="1.8"/><path d="M ${W - 4} ${c} l -8 -4 v 8 z" fill="var(--ill-ink)"/>`;
  tilo += `<line x1="${c}" y1="${W - 4}" x2="${c}" y2="6" stroke="var(--ill-ink)" stroke-width="1.8"/><path d="M ${c} 4 l -4 8 h 8 z" fill="var(--ill-ink)"/>`;
  tilo += `<text x="${W - 10}" y="${c - 8}" font-size="13" font-style="italic" fill="var(--ill-ink)">x</text>`;
  tilo += `<text x="${c + 8}" y="14" font-size="13" font-style="italic" fill="var(--ill-ink)">y</text>`;
  tsyfry += `<text x="${c - 5}" y="${c + 14}" text-anchor="end" font-size="10" fill="var(--ill-muted)" ${TLO}>0</text>`;

  // Вітки: x від |k|/m (там |y| = m) до m — і дзеркально для x < 0.
  const x0 = Math.abs(k) / m;
  const vitka = (znak: 1 | -1) => {
    const kroky = 80;
    const tochkyV: string[] = [];
    for (let i = 0; i <= kroky; i++) {
      // Густіше біля осі y, де графік крутий.
      const x = znak * (x0 * Math.pow(m / x0, i / kroky));
      tochkyV.push(`${f(X(x))},${f(Y(k / x))}`);
    }
    return `<polyline points="${tochkyV.join(' ')}" fill="none" stroke="var(--ill-1)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
  };
  tilo += vitka(1);
  if (!lysheDodatni) tilo += vitka(-1);
  if (o.formula) {
    // Підпис — у вільній чверті вгорі (k > 0 — у II, k < 0 — у I), щоб не лягти на вітку.
    const xp = k > 0 ? -m + 0.3 : m - 0.3;
    tilo += `<text x="${f(X(xp))}" y="${f(Y(m - 0.6))}" text-anchor="${k > 0 ? 'start' : 'end'}" font-size="14" font-weight="700" fill="var(--ill-1)" ${TLO}>${o.formula}</text>`;
  }

  const opys = [`Графік оберненої пропорційності: гіпербола${o.formula ? ` ${o.formula}` : ''}, ${lysheDodatni ? 'вітка' : 'вітки'} в ${k > 0 ? (lysheDodatni ? 'I чверті' : 'I і III чвертях') : lysheDodatni ? 'IV чверті' : 'II і IV чвертях'}`];
  const kolir = (t: TochkaHiperboly, i: number) => `var(--ill-${t.pidpys === '?' ? 4 : [2, 3, 4][i % 3]})`;
  tochky.forEach((t, i) => {
    if (t.punktyr) {
      const kol = kolir(t, i);
      tilo += `<line x1="${f(X(t.x))}" y1="${f(Y(t.y))}" x2="${f(X(t.x))}" y2="${c}" stroke="${kol}" stroke-width="1.6" stroke-dasharray="4 3"/>`;
      tilo += `<line x1="${f(X(t.x))}" y1="${f(Y(t.y))}" x2="${c}" y2="${f(Y(t.y))}" stroke="${kol}" stroke-width="1.6" stroke-dasharray="4 3"/>`;
    }
  });
  tilo += tsyfry;
  tochky.forEach((t, i) => {
    const kol = kolir(t, i);
    tilo += `<circle cx="${f(X(t.x))}" cy="${f(Y(t.y))}" r="4.5" fill="${kol}"/>`;
    if (t.pidpys) {
      // Підпис — з того боку від точки, де немає осі: від центра назовні.
      const dx = t.x >= 0 ? 7 : -7;
      const dy = t.y >= 0 ? -8 : 16;
      tilo += `<text x="${f(X(t.x) + dx)}" y="${f(Y(t.y) + dy)}" text-anchor="${t.x >= 0 ? 'start' : 'end'}" font-size="13" font-weight="700" fill="${kol}" ${TLO}>${t.pidpys}</text>`;
      if (t.pidpys !== '?') opys.push(`точка ${t.pidpys}`);
    }
  });
  return `<svg viewBox="0 0 ${W} ${W}" width="${W}" height="${W}" role="img" aria-label="${opys.join('; ')}">${tilo}</svg>`;
}
