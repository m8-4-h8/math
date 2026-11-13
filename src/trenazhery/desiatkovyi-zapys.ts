// Звичайний дріб → десятковий запис діленням з остачами (6 клас: періодичні дроби, десяткове наближення).

/** Десятковий запис a/b діленням з остачами: «0,375», «0,41(6)», «2,(18)». */
export function desiatkovyi(a: number, b: number) {
  const tsila = Math.floor(a / b);
  let ost = a % b;
  const tsyfry: number[] = [];
  const ostachi: number[] = [];
  const bachyly = new Map<number, number>();
  while (ost !== 0 && !bachyly.has(ost)) {
    bachyly.set(ost, tsyfry.length);
    ostachi.push(ost);
    tsyfry.push(Math.floor((ost * 10) / b));
    ost = (ost * 10) % b;
  }
  const s = tsyfry.join('');
  if (ost === 0) return { zapys: s ? `${tsila},${s}` : `${tsila}`, period: '', ostachi, skinchennyi: true };
  const p = bachyly.get(ost)!;
  return { zapys: `${tsila},${s.slice(0, p)}(${s.slice(p)})`, period: s.slice(p), ostachi: [...ostachi, ost], skinchennyi: false };
}
