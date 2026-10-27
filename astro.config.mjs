// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { unified } from '@astrojs/markdown-remark';
import { papkyKlasiv, znachokKlasu } from './src/klasy.mjs';

export default defineConfig({
  site: 'https://m8-4-h8.github.io',
  base: '/math',
  markdown: {
    // Формули: $...$ у рядку та $$...$$ окремим блоком.
    processor: unified({ remarkPlugins: [remarkMath], rehypePlugins: [rehypeKatex] }),
  },
  integrations: [
    starlight({
      title: 'Математика',
      logo: { src: './src/assets/sova.svg' },
      defaultLocale: 'root',
      locales: { root: { label: 'Українська', lang: 'uk' } },
      customCss: [
        '@fontsource-variable/nunito',
        'katex/dist/katex.min.css',
        './src/styles/dytiacha-tema.css',
        './src/styles/ilustratsii.css',
      ],
      // Один клас = одна папка в src/content/docs (наприклад `6-klas`). Меню будується само:
      // нова папка = новий клас, новий .md/.mdx файл у ній = нова тема.
      sidebar: [
        { label: '🎮 Тренажер', link: '/trenazher/' },
        ...papkyKlasiv().map(({ papka, nomer }) => ({
          label: `${znachokKlasu(nomer)} ${nomer} клас`,
          items: [{ autogenerate: { directory: papka } }],
        })),
        { label: '✏️ Як намалювати задачу', items: [{ autogenerate: { directory: 'vizualizatsiia-zadach' } }] },
      ],
    }),
  ],
});
