"use client";

import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DialogFooter } from "@/components/ui/dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

import { useEffect, useState } from "react";
import { useUserStore } from "@/pages/users/lib/user.store";
import { createTicket } from "../lib/ticket.action";
import { errorToast, successToast } from "@/lib/core.function";
import { Input } from "@/components/ui/input";
import { FormSelect } from "@/components/FormSelect";

const TicketSchema = z.object({
  quantity: z.number().min(1, "Debe seleccionar al menos una cantidad"),
  user_owner_id: z.number().min(1, "Debe seleccionar un usuario"),
});

interface Lottery {
  id: number;
  lottery_name: string;
  code_serie: string;
  lottery_date: string;
  lottery_description: string;
  status: string;
  event_name: string;
}

interface CreateTicketFormProps {
  onClose: () => void;
  lottery: Lottery;
}

export default function CreateTicketForm({
  onClose,
  lottery,
}: CreateTicketFormProps) {
  const form = useForm<z.infer<typeof TicketSchema>>({
    resolver: zodResolver(TicketSchema),
    defaultValues: {
      user_owner_id: 0,
      quantity: 1,
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { users, loading: loadingUsers, loadUsers } = useUserStore();

  useEffect(() => {
    loadUsers(1);
  }, [loadUsers]);

  const userOptions = users.map((user) => ({
    label: `${user.name} ${user.person.father_surname} ${user.person.mother_surname}`,
    value: user.id.toString(), 
  }));

  const handleFormSubmit = async (data: z.infer<typeof TicketSchema>) => {
    try {
      setIsSubmitting(true);
      const ticketData = {
        lottery_id: lottery.id,
        user_owner_id: data.user_owner_id,
        quantity: data.quantity,
      };

      const response = await createTicket(ticketData);
      console.log("Ticket created successfully:", response);

      // Detectar si es arreglo
      // const tickets = Array.isArray(response) ? response : [response];

      successToast(
        // `Se crearon ${tickets.length} ticket${
        //   tickets.length > 1 ? "s" : ""
        // } exitosamente`
        "Ticket/s creado exitosamente"
      );

      onClose();
    } catch (error: any) {
      console.error("Error:", error);
      const message =
        error?.response?.data?.message || "Ocurrió un error al crear el ticket";
      errorToast(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingUsers) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <Loader2 className="h-10 w-10 animate-spin text-violet-600" />
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex items-start gap-3 mb-6 border-b pb-4">
        <div className="w-full">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-base text-primary font-poppins">
              {lottery.code_serie} - {lottery.lottery_name}
            </span>
          </div>
          <div className="ml-1 text-base text-muted-foreground ">
            <span className="font-medium font-poopins">Evento:</span>{" "}
            {lottery.event_name} <span className="mx-2">|</span>{" "}
            <span className="font-medium font-poopins">Concepto:</span> Admin
          </div>
        </div>
      </div>

      <div className="bg-secondary p-5 rounded-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)}>
            <FormSelect
              name="user_owner_id"
              label="Usuarios"
              placeholder="Seleccionar usuario"
              options={userOptions}
              control={form.control}
            />

            {/* <FormField
              control={form.control}
              name="user_owner_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[15px] font-normal font-poopins">
                    Usuarios
                  </FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value ? field.value.toString() : ""}
                  >
                    <FormControl>
                      <SelectTrigger className="border-[#9A7FFF] focus:border-[#9A7FFF] focus:ring-[#9A7FFF] font-poopins">
                        <SelectValue
                          placeholder="Seleccionar usuario"
                          className="font-poopins text-sm"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          <div className="flex flex-col text-sm font-inter">
                            <span className="font-sm">{user.name}</span>
                            <span className="text-muted-foreground text-xs">
                              {user.person.father_surname}{" "}
                              {user.person.mother_surname}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel className="text-[15px] font-normal font-poopins">
                    Cantidad de tickets
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      value={field.value}
                      onChange={(e) => {
                        const val = e.target.value;
                        const numeric = val === "" ? "" : Number(val);
                        field.onChange(numeric);
                      }}
                      className="w-full border border-[#9A7FFF] rounded-md px-3 py-2 font-poopins text-sm focus:outline-none focus:ring-2 focus:ring-[#9A7FFF]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Botones */}
            <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4 w-full">
              <DialogFooter className="flex flex-1 flex-col sm:flex-row gap-2 p-0 w-full">
                <Button
                  variant="outline"
                  type="button"
                  onClick={onClose}
                  className="bg-foreground text-secondary font-inter hover:bg-foreground/95 hover:text-secondary text-sm w-full sm:w-auto"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || form.watch("user_owner_id") === 0}
                  className={`bg-[#818cf8] hover:bg-[#6366f1] ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  } w-full sm:w-auto`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creando...
                    </>
                  ) : (
                    "Crear Ticket"
                  )}
                </Button>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
