// Формули в пошуку. KaTeX кожну формулу пише тричі: картинкою з HTML-шматочків (.katex-html),
// MathML для читачів екрана і ще раз TeX-кодом в <annotation>. Pagefind індексує все підряд, і в
// результатах пошуку виходить каша на кшталт «3,653{,}653,65», а дріб 2/5 перетворюється на «25».
// Тому всі три частини ховаємо від пошуку (data-pagefind-ignore), а поруч кладемо невидимий
// рядок простим текстом, зібраний з MathML: «3,65», «2/5», «5²». Читачі екрана його не бачать
// (display: none), вони, як і раніше, читають MathML.
const tekst = (vuzol) => {
  if (vuzol.type === 'text') return vuzol.value;
  if (vuzol.type !== 'element' || vuzol.tagName === 'annotation') return '';
  const dity = (vuzol.children ?? []).filter((d) => d.type === 'element');
  if (vuzol.tagName === 'mfrac' && dity.length === 2) return `${tekst(dity[0])}/${tekst(dity[1])}`;
  if (vuzol.tagName === 'msup' && dity.length === 2) {
    const stepin = tekst(dity[1]);
    const male = { 2: '²', 3: '³' }[stepin];
    return `${tekst(dity[0])}${male ?? `^${stepin}`}`;
  }
  return (vuzol.children ?? []).map(tekst).join('');
};

const maKlas = (vuzol, klas) => vuzol.type === 'element' && (vuzol.properties?.className ?? []).includes(klas);

export default function rehypePoshukFormul() {
  const obiity = (vuzol) => {
    if (maKlas(vuzol, 'katex')) {
      const mathml = vuzol.children.find((d) => maKlas(d, 'katex-mathml'));
      for (const d of vuzol.children) if (d.type === 'element') d.properties.dataPagefindIgnore = '';
      if (mathml) {
        vuzol.children.push({
          type: 'element',
          tagName: 'span',
          properties: { style: 'display:none' },
          children: [{ type: 'text', value: tekst(mathml).replace(/\s+/g, ' ').trim() }],
        });
      }
      return;
    }
    vuzol.children?.forEach(obiity);
  };
  return (derevo) => obiity(derevo);
}
