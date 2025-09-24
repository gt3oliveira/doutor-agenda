import z from "zod";

export const upsertDoctorSchema = z
  .object({
    id: z.string().uuid().optional(),
    name: z.string().trim().min(2, "O nome é obrigatório."),
    specialty: z.string().trim().min(2, "A especialidade é obrigatória."),
    appointmentPriceInCents: z
      .number()
      .min(1, "O preço da consulta é obrigatório."),
    availableFromWeekDay: z.number().min(0).max(6),
    availableToWeekDay: z.number().min(0).max(6),
    availableFromTime: z.string().min(1, "O horário de início é obrigatório."),
    availableToTime: z.string().min(1, "O horário de término é obrigatório."),
  })
  .refine(
    (data) => {
      return data.availableFromTime < data.availableToTime;
    },
    {
      message: "O horário de término deve ser posterior ao horário de início.",
      path: ["availableToTime"],
    },
  );

export type UpsertDoctorSchema = z.infer<typeof upsertDoctorSchema>;
