// Зірочки за розв'язані завдання. Зберігаються лише в браузері дитини (localStorage):
// { "/math/5-klas/drib-vid-chysla/": [0, 2] } — номери розв'язаних завдань на сторінці.
// Якщо браузер не дозволяє зберігати (приватне вікно), усе працює, просто без пам'яті.
const KLUCH = 'math-zirky';

type Zirky = Record<string, number[]>;

function normShliakh(shliakh: string) {
  return shliakh.endsWith('/') ? shliakh : shliakh + '/';
}

export function usiZirky(): Zirky {
  try {
    const dani = JSON.parse(localStorage.getItem(KLUCH) || '{}');
    return dani && typeof dani === 'object' ? dani : {};
  } catch {
    return {};
  }
}

export function zirkyStorinky(shliakh = location.pathname): number[] {
  return usiZirky()[normShliakh(shliakh)] || [];
}

export function dodatyZirku(nomer: number, shliakh = location.pathname) {
  const vsi = usiZirky();
  const kluch = normShliakh(shliakh);
  const spysok = new Set(vsi[kluch] || []);
  spysok.add(nomer);
  vsi[kluch] = [...spysok].sort((a, b) => a - b);
  try {
    localStorage.setItem(KLUCH, JSON.stringify(vsi));
  } catch {
    // Немає доступу до сховища — зірочка залишиться лише до перезавантаження сторінки.
  }
}

// Кілька емодзі, що розлітаються з точки: маленьке свято за правильну відповідь.
export function salut(dzherelo: HTMLElement) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const r = dzherelo.getBoundingClientRect();
  const znachky = ['⭐', '✨', '🎉', '🌟', '💜'];
  for (let i = 0; i < 14; i++) {
    const s = document.createElement('span');
    s.textContent = znachky[i % znachky.length];
    const kut = (i / 14) * Math.PI * 2;
    const dal = 60 + Math.random() * 60;
    s.style.cssText = `position:fixed;left:${r.left + r.width / 2}px;top:${r.top + r.height / 2}px;
      font-size:${16 + Math.random() * 14}px;pointer-events:none;z-index:1000;
      transition:transform .8s cubic-bezier(.2,.8,.3,1),opacity .8s ease-in;`;
    document.body.appendChild(s);
    s.getBoundingClientRect(); // спершу браузер малює значок на місці, потім запускаємо політ
    s.style.transform = `translate(${Math.cos(kut) * dal}px, ${Math.sin(kut) * dal - 30}px) rotate(${Math.random() * 360}deg)`;
    s.style.opacity = '0';
    setTimeout(() => s.remove(), 900);
  }
}

const POKHVALA = ['Правильно! Молодець!', 'Супер! Так тримати!', 'Чудово! Усе вийшло!', 'Ура! Усе вірно!', 'Клас! Саме так!'];

export function pokhvala() {
  return POKHVALA[Math.floor(Math.random() * POKHVALA.length)];
}
