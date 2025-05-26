"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import type { SettingRequest } from "../lib/configuration.interface";
import { updateSettingByType } from "../lib/configuration.service";
import { errorToast, successToast } from "@/lib/core.function";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { LoaderCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface UpdateSettingProps {
  station: {
    name: string;
    description: string;
    amount: string;
  } | null;
  open: boolean;
  onClose: () => void;
  onUpdateSuccess?: () => void;
}

const SettingSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  description: z.string().optional(),
  amount: z.string().min(1, {
    message: "El monto es requerido.",
  }),
});

export function UpdateSettingModal({
  station,
  open,
  onClose,
  onUpdateSuccess,
}: UpdateSettingProps) {
  const [isSending, setIsSending] = useState(false);

  const form = useForm<z.infer<typeof SettingSchema>>({
    resolver: zodResolver(SettingSchema),
    defaultValues: {
      name: station?.name || "",
      description: station?.description || "",
      amount: station?.amount || "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof SettingSchema>) => {
    if (!station) return;

    try {
      setIsSending(true);

      const settingPayload: SettingRequest = {
        name: data.name,
        description: data.description ?? "",
        amount: data.amount.toString(),
      };

      await updateSettingByType(station.name, settingPayload);

      successToast("Configuración actualizada correctamente");

      if (onUpdateSuccess) {
        onUpdateSuccess();
      } else {
        onClose();
      }
    } catch (error: any) {
      console.error("Error al actualizar configuración:", error);
      const errorMessage =
        error?.response?.data?.message ||
        "Ocurrió un error al guardar los datos";
      errorToast(errorMessage);
    } finally {
      setIsSending(false);
    }
  };

  const handleCancel = () => {
    setIsSending(false); // Asegurar que el loader se resetee
    form.reset(); // Resetear el formulario
    onClose();
  };

  useEffect(() => {
    if (open && station) {
      form.reset({
        name: station.name,
        description: station.description,
        amount: station.amount,
      });
      setIsSending(false);
    }
  }, [open, station, form]);

  if (!station) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar configuración</DialogTitle>
          <DialogDescription>
            Modifica los campos necesarios y guarda los cambios.
          </DialogDescription>
        </DialogHeader>
        <div className="bg-secondary p-5 rounded-md">
          <div className="flex flex-col gap-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-inter text-sm">
                        Nombre
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nombre del ambiente"
                          className="font-inter text-xs font-semibold"
                          {...field}
                          disabled={true} // Deshabilitar la edición del nombre si es un identificador
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-inter text-sm">
                        Descripción
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          className="w-full font-inter text-xs"
                          placeholder="Descripción"
                          {...field}
                          disabled={true}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-inter text-sm">
                        Monto
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="font-inter text-sm"
                          placeholder="Monto"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleCancel}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSending}
                    className="flex items-center gap-2"
                  >
                    {isSending ? "Guardando" : "Guardar"}
                    {isSending && (
                      <LoaderCircle className="animate-spin h-5 w-5" />
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
