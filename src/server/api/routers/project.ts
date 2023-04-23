import { z } from "zod";

import { projectCreateSchema } from "~/pages/index";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const projectRouter = createTRPCRouter({
  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.project.findUnique({
        where: {
          id: input.id,
        },
      });
    }),

  create: publicProcedure
    .input(projectCreateSchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.project.create({
        data: input,
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.project.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
