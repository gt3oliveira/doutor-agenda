import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";
import z from "zod";

import { upsertDoctor } from "@/actions/upsert-doctor";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { medicalSpecialties } from "../_constants";

const formSchema = z
  .object({
    name: z.string().trim().min(2, "O nome é obrigatório."),
    specialty: z.string().trim().min(2, "A especialidade é obrigatória."),
    appointmentPriceInCents: z
      .number()
      .min(1, "O preço da consulta é obrigatório."),
    availableFromWeekDay: z.string().min(1, "O dia de início é obrigatório."),
    availableToWeekDay: z.string().min(1, "O dia de término é obrigatório."),
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

interface UpsertDoctorFormProps {
  onSuccess?: () => void;
}

export const UpsertDoctorForm = ({ onSuccess }: UpsertDoctorFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      specialty: "",
      appointmentPriceInCents: 0,
      availableFromWeekDay: "1",
      availableToWeekDay: "5",
      availableToTime: "",
      availableFromTime: "",
    },
  });

  const upsertDoctorAction = useAction(upsertDoctor, {
    onSuccess: () => {
      form.reset();
      toast.success("Médico adicionado com sucesso.");
      onSuccess?.();
    },
    onError: () => {
      toast.error("Erro ao adicionar médico.");
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    upsertDoctorAction.execute({
      ...data,
      availableFromWeekDay: parseInt(data.availableFromWeekDay),
      availableToWeekDay: parseInt(data.availableToWeekDay),
      appointmentPriceInCents: data.appointmentPriceInCents * 100,
    });
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Adicionar médico</DialogTitle>
        <DialogDescription>
          Adicione um novo médico à sua clínica preenchendo o formulário abaixo.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="specialty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Especialidade</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma especialidade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {medicalSpecialties.map((specialty) => (
                      <SelectItem key={specialty.value} value={specialty.value}>
                        {specialty.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="appointmentPriceInCents"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço da consulta</FormLabel>
                <FormControl>
                  <NumericFormat
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value.floatValue);
                    }}
                    prefix="R$ "
                    decimalSeparator=","
                    thousandSeparator="."
                    fixedDecimalScale
                    decimalScale={2}
                    allowNegative={false}
                    allowLeadingZeros={false}
                    customInput={Input}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-1">
            <FormLabel>Dias de atendimento</FormLabel>
            <div className="flex w-full gap-2">
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="availableFromWeekDay"
                  render={({ field }) => (
                    <FormItem>
                      <FormDescription>Dia inicial</FormDescription>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione um dia" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0">Domingo</SelectItem>
                          <SelectItem value="1">Segunda</SelectItem>
                          <SelectItem value="2">Terça</SelectItem>
                          <SelectItem value="3">Quarta</SelectItem>
                          <SelectItem value="4">Quinta</SelectItem>
                          <SelectItem value="5">Sexta</SelectItem>
                          <SelectItem value="6">Sábado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="availableToWeekDay"
                  render={({ field }) => (
                    <FormItem>
                      <FormDescription>Dia final</FormDescription>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione um dia" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0">Domingo</SelectItem>
                          <SelectItem value="1">Segunda</SelectItem>
                          <SelectItem value="2">Terça</SelectItem>
                          <SelectItem value="3">Quarta</SelectItem>
                          <SelectItem value="4">Quinta</SelectItem>
                          <SelectItem value="5">Sexta</SelectItem>
                          <SelectItem value="6">Sábado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <FormLabel>Horários de atendimento</FormLabel>
            <div className="flex w-full gap-2">
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="availableFromTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormDescription>Horário inicial</FormDescription>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione um horário" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Manhã</SelectLabel>
                            <SelectItem value="05:00:00">05:00</SelectItem>
                            <SelectItem value="05:30:00">05:30</SelectItem>
                            <SelectItem value="06:00:00">06:00</SelectItem>
                            <SelectItem value="06:30:00">06:30</SelectItem>
                            <SelectItem value="07:00:00">07:00</SelectItem>
                            <SelectItem value="07:30:00">07:30</SelectItem>
                            <SelectItem value="08:00:00">08:00</SelectItem>
                            <SelectItem value="08:30:00">08:30</SelectItem>
                            <SelectItem value="09:00:00">09:00</SelectItem>
                            <SelectItem value="09:30:00">09:30</SelectItem>
                            <SelectItem value="10:00:00">10:00</SelectItem>
                            <SelectItem value="10:30:00">10:30</SelectItem>
                            <SelectItem value="11:00:00">11:00</SelectItem>
                            <SelectItem value="11:30:00">11:30</SelectItem>
                            <SelectItem value="12:00:00">12:00</SelectItem>
                            <SelectItem value="12:30:00">12:30</SelectItem>
                          </SelectGroup>
                          <SelectGroup>
                            <SelectLabel>Tarde</SelectLabel>
                            <SelectItem value="13:00:00">13:00</SelectItem>
                            <SelectItem value="13:30:00">13:30</SelectItem>
                            <SelectItem value="14:00:00">14:00</SelectItem>
                            <SelectItem value="14:30:00">14:30</SelectItem>
                            <SelectItem value="15:00:00">15:00</SelectItem>
                            <SelectItem value="15:30:00">15:30</SelectItem>
                            <SelectItem value="16:00:00">16:00</SelectItem>
                            <SelectItem value="16:30:00">16:30</SelectItem>
                            <SelectItem value="17:00:00">17:00</SelectItem>
                            <SelectItem value="17:30:00">17:30</SelectItem>
                            <SelectItem value="18:00:00">18:00</SelectItem>
                            <SelectItem value="18:30:00">18:30</SelectItem>
                          </SelectGroup>
                          <SelectGroup>
                            <SelectLabel>Noite</SelectLabel>
                            <SelectItem value="19:00:00">19:00</SelectItem>
                            <SelectItem value="19:30:00">19:30</SelectItem>
                            <SelectItem value="20:00:00">20:00</SelectItem>
                            <SelectItem value="20:30:00">20:30</SelectItem>
                            <SelectItem value="21:00:00">21:00</SelectItem>
                            <SelectItem value="21:30:00">21:30</SelectItem>
                            <SelectItem value="22:00:00">22:00</SelectItem>
                            <SelectItem value="22:30:00">22:30</SelectItem>
                            <SelectItem value="23:00:00">23:00</SelectItem>
                            <SelectItem value="23:30:00">23:30</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="availableToTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormDescription>Horário final</FormDescription>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione um horário" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Manhã</SelectLabel>
                            <SelectItem value="05:00:00">05:00</SelectItem>
                            <SelectItem value="05:30:00">05:30</SelectItem>
                            <SelectItem value="06:00:00">06:00</SelectItem>
                            <SelectItem value="06:30:00">06:30</SelectItem>
                            <SelectItem value="07:00:00">07:00</SelectItem>
                            <SelectItem value="07:30:00">07:30</SelectItem>
                            <SelectItem value="08:00:00">08:00</SelectItem>
                            <SelectItem value="08:30:00">08:30</SelectItem>
                            <SelectItem value="09:00:00">09:00</SelectItem>
                            <SelectItem value="09:30:00">09:30</SelectItem>
                            <SelectItem value="10:00:00">10:00</SelectItem>
                            <SelectItem value="10:30:00">10:30</SelectItem>
                            <SelectItem value="11:00:00">11:00</SelectItem>
                            <SelectItem value="11:30:00">11:30</SelectItem>
                            <SelectItem value="12:00:00">12:00</SelectItem>
                            <SelectItem value="12:30:00">12:30</SelectItem>
                          </SelectGroup>
                          <SelectGroup>
                            <SelectLabel>Tarde</SelectLabel>
                            <SelectItem value="13:00:00">13:00</SelectItem>
                            <SelectItem value="13:30:00">13:30</SelectItem>
                            <SelectItem value="14:00:00">14:00</SelectItem>
                            <SelectItem value="14:30:00">14:30</SelectItem>
                            <SelectItem value="15:00:00">15:00</SelectItem>
                            <SelectItem value="15:30:00">15:30</SelectItem>
                            <SelectItem value="16:00:00">16:00</SelectItem>
                            <SelectItem value="16:30:00">16:30</SelectItem>
                            <SelectItem value="17:00:00">17:00</SelectItem>
                            <SelectItem value="17:30:00">17:30</SelectItem>
                            <SelectItem value="18:00:00">18:00</SelectItem>
                            <SelectItem value="18:30:00">18:30</SelectItem>
                          </SelectGroup>
                          <SelectGroup>
                            <SelectLabel>Noite</SelectLabel>
                            <SelectItem value="19:00:00">19:00</SelectItem>
                            <SelectItem value="19:30:00">19:30</SelectItem>
                            <SelectItem value="20:00:00">20:00</SelectItem>
                            <SelectItem value="20:30:00">20:30</SelectItem>
                            <SelectItem value="21:00:00">21:00</SelectItem>
                            <SelectItem value="21:30:00">21:30</SelectItem>
                            <SelectItem value="22:00:00">22:00</SelectItem>
                            <SelectItem value="22:30:00">22:30</SelectItem>
                            <SelectItem value="23:00:00">23:00</SelectItem>
                            <SelectItem value="23:30:00">23:30</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={upsertDoctorAction.isPending}>
              {upsertDoctorAction.isPending && (
                <Loader2 className="mr-2 animate-spin" />
              )}
              Adicionar médico
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};
