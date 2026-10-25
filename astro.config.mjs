// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { unified } from '@astrojs/markdown-remark';

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
      defaultLocale: 'root',
      locales: { root: { label: 'Українська', lang: 'uk' } },
      customCss: ['katex/dist/katex.min.css'],
      // Один клас = одна папка в src/content/docs і один рядок тут.
      // Теми всередині класу потрапляють до меню автоматично: новий .md файл = нова тема.
      sidebar: [
        { label: '5 клас', items: [{ autogenerate: { directory: '5-klas' } }] },
      ],
    }),
  ],
});
