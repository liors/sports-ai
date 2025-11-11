import { z } from 'zod';

export const gamesListSchema = z.object({
  games: z.array(z.object({
    title: z.string(),
    link: z.string(),
  })),
});
