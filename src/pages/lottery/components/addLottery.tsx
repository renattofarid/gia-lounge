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
import { DialogFooter } from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useEventStore } from "@/pages/events/lib/event.store";
import { DateTimePickerInline } from "@/components/DateTimePickerInline";

const LotterySchema = z.object({
  lottery_name: z.string().nonempty("El nombre de la lotería es obligatorio"),
  lottery_description: z.string().nonempty("La descripción es obligatoria"),
  lottery_date: z.date({ required_error: "La fecha es obligatoria" }),
  event_id: z.number(),
  lottery_price: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "El precio debe ser un número mayor a 0",
    }),
  price_factor_consumo: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "El factor de consumo debe ser un número mayor a 0",
    }),
  number_of_prizes: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "La cantidad de premios debe ser un número mayor a 0",
    }),
  main_image: z.any().optional(),
  prize_images: z.array(z.any()).optional(),
});

interface CreateLotteryProps {
  onClose: () => void;
}

export default function CreateLotteryForm({ onClose }: CreateLotteryProps) {
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
      prize_images: [],
    },
  });

  const { events, loadEvents } = useEventStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [eventAssociated, setEventAssociated] = useState(false);

  useEffect(() => {
    loadEvents(1, undefined, undefined, 0);
  }, [loadEvents]);

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
      const payload = { ...data, lottery_date: formattedDate };

      setIsSubmitting(true);
      console.log("Enviando datos:", payload);
      console.log("Datos del formulario:", data);
      onClose();
    } catch (error) {
      console.error("Error capturado:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-2">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="space-y-6"
        >
          <div className="flex flex-col gap-6 bg-secondary rounded-lg p-6">
            {/* Switch Evento Asociado */}
            <div className="flex items-center justify-center gap-3">
              <Switch
                checked={eventAssociated}
                onCheckedChange={setEventAssociated}
                className="data-[state=checked]:bg-[#9a7fff]"
              />
              <span className="text-sm font-poopins">Evento asociado</span>
              {eventAssociated && (
                <Select
                  onValueChange={(val) =>
                    form.setValue("event_id", Number(val))
                  }
                >
                  <SelectTrigger className="w-48 border-[#9A7FFF]">
                    <SelectValue placeholder="Seleccionar evento" />
                  </SelectTrigger>
                  <SelectContent>
                    {events.map((event) => (
                      <SelectItem key={event.id} value={event.id.toString()}>
                        {event.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="flex flex-row justify-between gap-4">
              {/* Nombre */}
              <FormField
                control={form.control}
                name="lottery_name"
                render={({ field }) => (
                  <FormItem className="w-1/2">
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
              <FormField
                control={form.control}
                name="lottery_description"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel className="text-sm font-normal font-poopins">
                      Descripción
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Descripción de la lotería"
                        {...field}
                        className="border-[#9A7FFF] focus:border-[#9A7FFF] focus:ring-[#9A7FFF] font-poopins"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Fecha, Precio */}
            <div className="flex flex-row justify-between gap-4">
              <FormField
                control={form.control}
                name="lottery_date"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel className="text-sm font-normal font-poopins">
                      Seleccionar fecha y hora
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
                  <FormItem className="w-1/2">
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
            </div>

            <div className="flex flex-row justify-between gap-4">
              <FormField
                control={form.control}
                name="price_factor_consumo"
                render={({ field }) => (
                  <FormItem className="w-1/2">
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
                  <FormItem className="w-1/2">
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

            {/* Imagen principal estilo destacado */}
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
                        <div className="relative w-full h-32 rounded-md overflow-hidden border border-dashed  bg-[#F6ADE2]">
                          <img
                            src={mainImagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            <label className="cursor-pointer bg-white/80 hover:bg-white rounded-full p-2 shadow">
                              <Camera className="h-6 w-6 text-pink-400" />
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleMainImageChange}
                              />
                            </label>
                          </div>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center h-32 rounded-md border border-dashed border-pink-400 bg-pink-200 text-pink-700 hover:bg-pink-300/80 cursor-pointer transition-colors">
                          <Camera className="h-10 w-10 mb-2 text-pink-400" />
                          <span className="font-poopins text-sm text-secondary ">
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

            {/* Botones */}
            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="bg-foreground text-secondary hover:bg-foreground/95 text-sm"
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
  );
}
