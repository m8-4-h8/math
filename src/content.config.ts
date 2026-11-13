import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: z.object({
        // Значок теми (емодзі) для карток на головній сторінці, наприклад `ikonka: 🍕`.
        ikonka: z.string().optional(),
        // Розділ підручника, наприклад `rozdil: 1. Звичайні дроби`. Якщо в класі є теми з розділами,
        // меню класу і список тем на головній групуються за розділами (див. `meniuKlasu` у src/klasy.mjs).
        rozdil: z.string().optional(),
        // Де ця тема в підручниках, наприклад `paragraf: "Істер § 4 · Мерзляк п. 9"` — рядок під назвою теми.
        paragraf: z.string().optional(),
      }),
    }),
  }),
};
