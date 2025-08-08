"use client";

import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DialogFooter } from "@/components/ui/dialog";

import { errorToast, successToast } from "@/lib/core.function";
import { Skeleton } from "@/components/ui/skeleton";

import { useEffect, useState } from "react";
import { useEventStore } from "../lib/event.store";
import { updateEvent } from "../lib/event.actions";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { EventItem } from "../lib/event.interface";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useComapanyStore } from "@/pages/company/lib/company.store";
import { DateTimePickerInline } from "@/components/DateTimePickerInline";

const EventSchema = z.object({
  name: z.string().nonempty("El nombre es obligatorio"),
  comment: z.string().optional(),
  event_datetime: z.date(),
  company_id: z.number(),
  pricebox: z.string().optional(),
  pricetable: z.string().optional(),
  price_entry: z.string().optional(),
  route: z.any().optional(),
});

interface UpdateEventProps {
  onClose: () => void;
  onCloseModal: () => void;
  event: EventItem;
}

export default function UpdateEvent({
  event,
  onClose,
  onCloseModal,
}: UpdateEventProps) {
  const form = useForm<z.infer<typeof EventSchema>>({
    resolver: zodResolver(EventSchema),
    defaultValues: {
      name: event.name,
      comment: event.comment,
      event_datetime: new Date(event.event_datetime),
      company_id: event.company_id,
      pricebox: event.pricebox || "",
      pricetable: event.pricetable || "",
      price_entry: event.price_entry || "",
    },
  });

  const [previewImage, setPreviewImage] = useState<string | null>(
    event.route || null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loading } = useEventStore();

  const { companies, loadCompanies } = useComapanyStore();

  useEffect(() => {
    loadCompanies(1);
  }, []);

  // const handleFormSubmit = async (data: z.infer<typeof EventSchema>) => {
  //   try {
  //     const formattedDate = format(data.event_datetime, "yyyy-MM-dd HH:mm");
  //     const payload = { ...data, event_datetime: formattedDate };

  //     setIsSubmitting(true);
  //     await updateEvent(event.id, payload);
  //     successToast("Evento editado correctamente");
  //     onClose();
  //   } catch (error: any) {
  //     console.error("Error capturado:", error);
  //     const errorMessage =
  //       error?.response?.data?.message ||
  //       "Ocurrió un error al editar el evento";
  //     errorToast(errorMessage);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const handleFormSubmit = async (data: z.infer<typeof EventSchema>) => {
    try {
      const formattedDate = format(data.event_datetime, "yyyy-MM-dd HH:mm");
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("comment", data.comment || "");
      formData.append("event_datetime", formattedDate);
      formData.append("company_id", data.company_id.toString());
      formData.append("pricebox", data.pricebox || "");
      formData.append("pricetable", data.pricetable || "");
      formData.append("price_entry", data.price_entry || "");

      if (data.route instanceof File) {
        formData.append("route", data.route);
      }

      setIsSubmitting(true);
      await updateEvent(event.id, formData); // Asegúrate de que updateEvent acepte FormData
      successToast("Evento editado correctamente");
      onClose();
    } catch (error: any) {
      console.error("Error capturado:", error);
      const errorMessage =
        error?.response?.data?.message ||
        "Ocurrió un error al editar el evento";
      errorToast(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6 p-6 bg-secondary">
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-full h-4" />
      </div>
    );
  }

  return (
    <div className=" p-4">
      <div className="flex flex-col gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)}>
            {/* Campos del formulario */}

            <div className="flex flex-col gap-6">
              <div className="w-full space-y-4 rounded-lg bg-secondary p-6 text-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                  <FormField
                    control={form.control}
                    name="company_id"
                    render={({ field }) => (
                      <FormItem className="w-1/2">
                        <FormLabel className="text-sm font-normal">
                          Compañía
                        </FormLabel>
                        <Select
                          value={field.value?.toString()}
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                        >
                          <FormControl>
                            <SelectTrigger className="border-[#9A7FFF] focus:border-[#9A7FFF] focus:ring-[#9A7FFF] font-poopins">
                              <SelectValue placeholder="Seleccione compañía" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {companies.map((company) => (
                              <SelectItem
                                key={company.id}
                                value={company.id.toString()}
                              >
                                {company.business_name}
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
                    name="name"
                    render={({ field }) => (
                      <FormItem className="w-1/2">
                        <FormLabel className="text-sm font-normal font-poopins">
                          Nombre
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="border-[#9A7FFF] focus:border-[#9A7FFF] focus:ring-[#9A7FFF] font-poopins"
                            placeholder="Nombre del evento"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="comment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-normal font-poopins">
                        Comentario
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          className="border-[#9A7FFF] focus:border-[#9A7FFF] focus:ring-[#9A7FFF] font-poopins"
                          placeholder="Comentario"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="route"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-normal font-poopins">
                        Imagen del evento
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-4">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setPreviewImage(URL.createObjectURL(file));
                                field.onChange(file);
                              }
                            }}
                          />
                          {previewImage && (
                            <img
                              src={previewImage}
                              alt="Preview"
                              className="h-28 w-28 object-cover rounded-full border"
                            />
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="event_datetime"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-sm font-normal font-poopins">
                        Seleccionar fecha y hora
                      </FormLabel>
                      <DateTimePickerInline
                        value={field.value}
                        onChange={(date) =>
                          form.setValue("event_datetime", date)
                        }
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col  justify-between sm:flex-row gap-4">
                  <FormField
                    control={form.control}
                    name="pricebox"
                    render={({ field }) => (
                      <FormItem className="w-1/2">
                        <FormLabel className="text-sm font-normal font-poopins">
                          Precio del Box
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            className="border-[#9A7FFF] focus:border-[#9A7FFF] focus:ring-[#9A7FFF] font-poopins"
                            placeholder="Precio del Box"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pricetable"
                    render={({ field }) => (
                      <FormItem className="w-1/2">
                        <FormLabel className="text-sm font-normal font-poopins">
                          Precio de la Mesa
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            className="border-[#9A7FFF] focus:border-[#9A7FFF] focus:ring-[#9A7FFF] font-poopins"
                            placeholder="Precio de la Mesa"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price_entry"
                    render={({ field }) => (
                      <FormItem className="w-full sm:w-1/2">
                        <FormLabel className="text-sm font-normal font-poopins">
                          Precio de Entrada
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            className="border-[#9A7FFF] focus:border-[#9A7FFF] focus:ring-[#9A7FFF] font-poopins"
                            placeholder="Precio de Entrada"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Botones en la parte inferior */}
            <div className="mt-6 flex justify-end gap-2">
              <DialogFooter>
                <Button
                  variant="outline"
                  type="button"
                  onClick={onCloseModal}
                  className="bg-foreground text-secondary font-inter hover:bg-foreground/95 hover:text-secondary text-sm"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={`bg-[#818cf8] hover:bg-[#6366f1] ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? "Guardando..." : "Guardar"}
                </Button>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
