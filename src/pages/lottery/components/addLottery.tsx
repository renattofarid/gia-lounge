"use client";

import type React from "react";
import { z } from "zod";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Camera } from "lucide-react";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  // Dialog,
  // DialogContent,
  DialogFooter,
  // DialogHeader,
  // DialogTitle,
  // DialogTrigger,
} from "@/components/ui/dialog";
import { useComapanyStore } from "@/pages/company/lib/company.store";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEventStore } from "@/pages/events/lib/event.store";
import { DateTimePickerInline } from "@/components/DateTimePickerInline";
import RichTextEditor from "@/components/RichTextEditor";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { createRaffle } from "../lib/lottery.actions";
import { LotteryItem } from "../lib/lottery.interface";
import { useLotteryStore } from "../lib/lottery.store";
import { errorToast, successToast } from "@/lib/core.function";

const PrizeSchema = z.object({
  name: z.string().nonempty("El nombre del premio es obligatorio"),
  description: z.string().nonempty("La descripción del premio es obligatoria"),
  route: z.any().optional(),
});

const LotterySchema = z.object({
  company_id: z.number(),
  lottery_name: z.string().nonempty("El nombre de la lotería es obligatorio"),
  lottery_description: z.string().nonempty("La descripción es obligatoria"),
  lottery_date: z.date({ required_error: "La fecha es obligatoria" }),
  event_id: z.number().min(1, {
    message: "Debe seleccionar un evento",
  }),
  lottery_price: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "El precio debe ser un número mayor a 0",
    }),
  price_factor_consumo: z
    .string()
    .optional()
    .refine(
      (val) =>
        val === undefined ||
        val === "" ||
        (!isNaN(Number(val)) && Number(val) > 0),
      {
        message: "El factor de consumo debe ser un número mayor a 0",
      }
    ),
  number_of_prizes: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "La cantidad de premios debe ser un número mayor a 0",
    }),
  main_image: z.any().optional(),
  prizes: z.array(PrizeSchema).optional(),
});

interface CreateLotteryProps {
  onClose: () => void;
  companyId: number;
}

export default function CreateLotteryForm({
  onClose,
  companyId,
}: CreateLotteryProps) {
  const form = useForm<z.infer<typeof LotterySchema>>({
    resolver: zodResolver(LotterySchema),
    defaultValues: {
      lottery_name: "",
      lottery_date: new Date(),
      lottery_description: "",
      event_id: 0,
      lottery_price: "",
      price_factor_consumo: "",
      number_of_prizes: "",
      main_image: null,
      prizes: [],
      company_id: companyId,
    },
    mode: "onChange",
  });
  // const [open, setOpen] = useState(false);

  const { companies, loadCompanies } = useComapanyStore();

  const { events, loadEvents } = useEventStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number>(
    companyId || 0
  );
  const { raffles } = useLotteryStore() as { raffles: LotteryItem[] };

  useEffect(() => {
    loadCompanies(1);
    loadEvents(1, undefined, undefined, selectedCompanyId);
  }, []);

  const handleMainImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setMainImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue("main_image", file);
    }
  };

  const handleFormSubmit = async (data: z.infer<typeof LotterySchema>) => {
    try {
      const formattedDate = format(data.lottery_date, "yyyy-MM-dd HH:mm");
      const formData = new FormData();
      formData.append("company_id", data.company_id.toString());
      formData.append("lottery_name", data.lottery_name);
      formData.append("lottery_description", data.lottery_description);
      formData.append("lottery_date", formattedDate);
      formData.append("event_id", data.event_id.toString());
      formData.append("lottery_price", data.lottery_price);
      if (data.price_factor_consumo) {
        formData.append("price_factor_consumo", data.price_factor_consumo);
      }
      formData.append("number_of_prizes", data.number_of_prizes);
      if (data.main_image) {
        formData.append("main_image", data.main_image);
      }
      if (data.prizes && Array.isArray(data.prizes)) {
        data.prizes.forEach((prize, idx) => {
          formData.append(`prizes[${idx}][name]`, prize.name);
          formData.append(`prizes[${idx}][description]`, prize.description);
          if (prize.route) {
            formData.append(`prizes[${idx}][route]`, prize.route);
          }
        });
      }
      formData.append("company_id", selectedCompanyId.toString());

      setIsSubmitting(true);
      // Llama a la API createRaffle
      await createRaffle(formData);
      // Si la creación es exitosa, muestra un mensaje de éxito
      successToast("Sorteo creada exitosamente");
      onClose();
    } catch (error) {
      errorToast(
        "Ocurrió un error al crear el sorteo. Por favor, inténtalo de nuevo."
      );
      console.error("Error capturado:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const numberOfPrizes = form.watch("number_of_prizes");
  return (
    <div className="p-2">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-secondary  rounded-lg p-6">
            <div className="flex flex-col gap-3 ">
              <div className=" grid grid-cols-2 justify-between gap-3">
                {/* Selector de Compañía */}
                <div className="col-span-2">
                  <Label className="text-sm font-normal font-poopins">
                    Compañía
                  </Label>
                  <Select
                    value={selectedCompanyId.toString()}
                    onValueChange={(value) => {
                      const companyId = Number(value);
                      setSelectedCompanyId(companyId);
                      // Reset event selection when company changes
                      form.setValue("event_id", 0);
                    }}
                  >
                    <SelectTrigger className="border-[#9A7FFF] focus:border-[#9A7FFF] focus:ring-[#9A7FFF] font-poopins">
                      <SelectValue placeholder="Seleccionar compañía" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0" className="hidden">
                        Seleccionar compañía
                      </SelectItem>
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
                </div>

                <FormField
                  control={form.control}
                  name="event_id"
                  render={({ field }) => {
                    // Mostrar solo eventos que NO tienen un sorteo asociado
                    const eventosDisponibles = events.filter(
                      (event) =>
                        event.company_id === selectedCompanyId &&
                        !raffles.some(
                          (raffle: LotteryItem) => raffle.event_id === event.id
                        )
                    );

                    return (
                      <FormItem>
                        <FormLabel className="text-sm font-normal font-poopins">
                          Evento
                        </FormLabel>
                        <Select
                          value={field.value ? field.value.toString() : ""}
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          disabled={selectedCompanyId === 0}
                        >
                          <SelectTrigger className="border-[#9A7FFF] focus:ring-[#9A7FFF] font-poopins">
                            <SelectValue placeholder="Seleccionar evento" />
                          </SelectTrigger>
                          <SelectContent>
                            {eventosDisponibles.length === 0 ? (
                              <div className="p-2 text-sm text-muted-foreground">
                                Todos los eventos de esta compañía ya tienen un
                                sorteo asignado.
                              </div>
                            ) : (
                              eventosDisponibles.map((event) => (
                                <SelectItem
                                  key={event.id}
                                  value={event.id.toString()}
                                >
                                  {event.name}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                {/* Nombre */}
                <FormField
                  control={form.control}
                  name="lottery_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-normal font-poopins">
                        Nombre
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nombre de la lotería"
                          {...field}
                          className="border-[#9A7FFF] focus:border-[#9A7FFF] focus:ring-[#9A7FFF] font-poopins"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Descripción */}
              </div>
              <Label className="text-sm font-normal font-poopins">
                Descripción
              </Label>
              <FormField
                control={form.control}
                name="lottery_description"
                render={({ field }) => (
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />

              <FormField
                control={form.control}
                name="main_image"
                render={() => (
                  <FormItem>
                    <FormLabel className="font-poopins text-sm">
                      Imagen principal
                    </FormLabel>
                    <FormControl>
                      <>
                        {mainImagePreview ? (
                          <div className="flex relative w-full h-20 rounded-md overflow-hidden border border-dashed bg-white/40  justify-center items-center p-2">
                            <img
                              src={mainImagePreview || "/placeholder.svg"}
                              alt="Preview"
                              className="w-auto h-full object-cover rounded-md"
                            />
                            <label className="absolute top-2 right-2 cursor-pointer bg-white/80 hover:bg-white rounded-full p-1 shadow flex items-center justify-center">
                              <Camera className="h-5 w-5 text-pink-400" />
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleMainImageChange}
                              />
                            </label>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center h-20 rounded-md border border-dashed border-pink-400 bg-pink-200 text-pink-700 hover:bg-pink-300/80 cursor-pointer transition-colors">
                            <Camera className="h-6 w-6 mb-2 text-pink-400" />
                            <span className="font-poopins text-sm ">
                              Agregar imagen
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleMainImageChange}
                            />
                          </label>
                        )}
                      </>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="">
              <div className=" grid grid-cols-2 justify-between gap-4">
                <FormField
                  control={form.control}
                  name="lottery_date"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel className="text-sm font-normal font-poopins">
                        Fecha y Hora
                      </FormLabel>
                      <DateTimePickerInline
                        value={field.value}
                        onChange={(date) => form.setValue("lottery_date", date)}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lottery_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-normal font-poopins">
                        Precio
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="0.00"
                          type="number"
                          {...field}
                          className="border-[#9A7FFF] focus:border-[#9A7FFF] focus:ring-[#9A7FFF] font-poopins"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price_factor_consumo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-normal font-poopins">
                        Factor de consumo
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="0.00"
                          type="number"
                          {...field}
                          className="border-[#9A7FFF] focus:border-[#9A7FFF] focus:ring-[#9A7FFF] font-poopins"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="number_of_prizes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-normal font-poopins">
                        Cantidad de premios
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="1"
                          type="number"
                          min="1"
                          {...field}
                          className="border-[#9A7FFF] focus:border-[#9A7FFF] focus:ring-[#9A7FFF] font-poopins"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Separator className="my-4 bg-[#9A7FFF]" />

              <div className="h-48 overflow-y-auto hiddenScroll px-2">
                {Array.from({ length: Number(numberOfPrizes) }).map(
                  (_, index) => (
                    <div key={index} className="flex items-end gap-4 mb-4">
                      <FormField
                        control={form.control}
                        name={`prizes.${index}.name`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel className="text-sm font-normal font-poopins">
                              Nombre del premio {index + 1}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder={`Nombre del premio ${index + 1}`}
                                {...field}
                                className="border-[#9A7FFF] focus:border-[#9A7FFF] focus:ring-[#9A7FFF] font-poopins"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* Descripción */}
                      <FormField
                        control={form.control}
                        name={`prizes.${index}.description`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel className="text-sm font-normal font-poopins">
                              Descripción del premio {index + 1}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder={`Descripción del premio ${
                                  index + 1
                                }`}
                                {...field}
                                className="border-[#9A7FFF] focus:border-[#9A7FFF] focus:ring-[#9A7FFF] font-poopins"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* Ruta */}
                      <FormField
                        control={form.control}
                        name={`prizes.${index}.route`}
                        render={({ field }) => {
                          const file = field.value as File | undefined;
                          const [preview, setPreview] = useState<string | null>(
                            null
                          );

                          useEffect(() => {
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (e) =>
                                setPreview(e.target?.result as string);
                              reader.readAsDataURL(file);
                            } else {
                              setPreview(null);
                            }
                          }, [file]);

                          return (
                            <FormItem className="aspect-square">
                              <FormLabel className="text-sm font-normal font-poopins">
                                Imagen
                              </FormLabel>
                              <FormControl>
                                <label className="flex flex-col items-center justify-center h-10 rounded-md border border-dashed bg-pink-200   cursor-pointer transition-colors relative">
                                  <Camera className="h-4 w-4 text-pink-400" />
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        field.onChange(file);
                                      }
                                    }}
                                  />
                                  {preview ? (
                                    <img
                                      src={preview || "/placeholder.svg"}
                                      alt="Preview"
                                      className="absolute top-0 left-0 w-full h-full object-cover rounded-md opacity-80"
                                    />
                                  ) : file ? (
                                    <span className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-xs text-green-700 font-semibold bg-green-100/80 rounded-md">
                                      Imagen subida
                                    </span>
                                  ) : null}
                                </label>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
          {/* Botones */}
          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="text-sm"
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
        </form>
      </Form>
    </div>
  );
}
