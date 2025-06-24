"use client";

import type React from "react";

import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
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
import { errorToast, successToast } from "@/lib/core.function";
import { Calendar, ImagePlus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { updatePromotion } from "../lib/promotion.actions";
import type { PromotionItem } from "../lib/promotions.interface";
import { useProductStore } from "@/pages/products/lib/prodcut.store";

const PromotionSchema = z.object({
  product_id: z.coerce.number().min(1, "Selecciona un producto"),
  name: z.string().nonempty("El nombre es requerido"),
  title: z.string().optional(),
  date_start: z.date({
    required_error: "La fecha de inicio es requerida",
  }),
  date_end: z.date({
    required_error: "La fecha de fin es requerida",
  }),
  stock: z.coerce.number().min(0, "El stock debe ser mayor o igual a 0"),
  precio: z.string().nonempty("El precio es requerido"),
  description: z.string().nonempty("La descripción es requerida"),
  route: z.string().optional(),
});

type PromotionFormValues = z.infer<typeof PromotionSchema>;

interface UpdatePromotionProps {
  onClose: () => void;
  promotion: PromotionItem | null;
}

export default function UpdatePromotion({
  onClose,
  promotion,
}: UpdatePromotionProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { products, loadProducts } = useProductStore();

  useEffect(() => {
    loadProducts(1);
  }, []);

  const form = useForm<PromotionFormValues>({
    resolver: zodResolver(PromotionSchema),
    defaultValues: {
      product_id: promotion?.product_id || 0,
      name: promotion?.name || "",
      title: promotion?.title || "",
      date_start: promotion?.date_start
        ? new Date(promotion.date_start)
        : new Date(),
      date_end: promotion?.date_end ? new Date(promotion.date_end) : new Date(),
      stock: promotion?.stock || 0,
      precio: promotion?.precio?.toString() || "",
      description: promotion?.description || "",
      route: promotion?.route || "",
    },
  });

  // Actualizar el formulario cuando cambia la promoción seleccionada
  useEffect(() => {
    if (promotion) {
      form.reset({
        product_id: promotion.product_id || 0,
        name: promotion.name || "",
        title: promotion.title || "",
        date_start: promotion.date_start
          ? parseISO(promotion.date_start)
          : new Date(),
        date_end: promotion.date_end
          ? parseISO(promotion.date_end)
          : new Date(),
        stock: promotion.stock || 0,
        precio: promotion.precio?.toString() || "",
        description: promotion.description || "",
        route: promotion.route || "",
      });

      // Establecer la imagen de vista previa si existe
      if (promotion.route) {
        setPreviewImage(promotion.route);
      }
    }
  }, [promotion, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const onSubmit = async (data: PromotionFormValues) => {
    if (!promotion?.id) {
      errorToast("No se pudo identificar la promoción a actualizar");
      return;
    }

    setIsLoading(true);
    try {
      // Convertir fechas a formato string para la API
      const formattedData = {
        ...data,
        date_start: format(data.date_start, "yyyy-MM-dd"),
        date_end: format(data.date_end, "yyyy-MM-dd"),
      };

      const formData = new FormData();
      Object.entries(formattedData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      // Solo agregar el archivo si se seleccionó uno nuevo
      if (file) {
        formData.append("file", file);
      }

      await updatePromotion(promotion.id, formData);
      successToast("Promoción actualizada exitosamente");
      onClose();
    } catch (error) {
      console.error("Error al actualizar la promoción:", error);
      errorToast("Error al actualizar la promoción");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-secondary p-5 rounded-md">
      <div className="flex flex-col gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-normal font-poopins">
                        Nombre
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="border-[#9A7FFF] focus:border-[#9A7FFF] focus:ring-[#9A7FFF] font-poopins"
                          placeholder="Nombre de la promoción"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-normal font-poopins">
                        Título
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="border-[#9A7FFF] focus:border-[#9A7FFF] focus:ring-[#9A7FFF] font-poopins"
                          placeholder="Título de la promoción"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date_start"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-sm font-normal font-poopins">
                        Fecha Inicio
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              type="button"
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal bg-secondary border-[#9A7FFF] focus:border-[#9A7FFF] focus:ring-[#9A7FFF] font-poopins",
                                !field.value && "text-muted-foreground"
                              )}
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              {field.value ? (
                                format(field.value, "dd/MM/yyyy", {
                                  locale: es,
                                })
                              ) : (
                                <span>Seleccionar fecha</span>
                              )}
                              <Calendar className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto p-0"
                          align="start"
                          onOpenAutoFocus={(e) => e.preventDefault()}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <CalendarComponent
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              if (date) {
                                field.onChange(date);
                              }
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date_end"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-sm font-normal font-poopins">
                        Fecha Fin
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              type="button"
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal bg-secondary border-[#9A7FFF] focus:border-[#9A7FFF] focus:ring-[#9A7FFF] font-poopins",
                                !field.value && "text-muted-foreground"
                              )}
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              {field.value ? (
                                format(field.value, "dd/MM/yyyy", {
                                  locale: es,
                                })
                              ) : (
                                <span>Seleccionar fecha</span>
                              )}
                              <Calendar className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto p-0"
                          align="start"
                          onOpenAutoFocus={(e) => e.preventDefault()}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <CalendarComponent
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              if (date) {
                                field.onChange(date);
                              }
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <FormField
                  control={form.control}
                  name="product_id"
                  render={({ field }) => (
                    <FormItem className="w-full md:w-1/3">
                      <FormLabel className="text-sm font-normal font-poopins">
                        Producto
                      </FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(Number.parseInt(value))
                        }
                        value={field.value ? field.value.toString() : ""}
                      >
                        <FormControl>
                          <SelectTrigger className="border-[#9A7FFF] font-poopins">
                            <SelectValue placeholder="Seleccionar producto" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem
                              key={product.id}
                              value={product.id.toString()}
                            >
                              {product.name}
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
                  name="precio"
                  render={({ field }) => (
                    <FormItem className="w-full md:w-1/3">
                      <FormLabel className="text-sm font-normal font-poopins">
                        Precio
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="border-[#9A7FFF] font-poopins"
                          placeholder="S/ 0.00"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem className="w-full md:w-1/3">
                      <FormLabel className="text-sm font-normal font-poopins">
                        Stock
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          className="border-[#9A7FFF] font-poopins"
                          {...field}
                          onChange={(e) => {
                            const value = Number.parseInt(e.target.value);
                            field.onChange(isNaN(value) ? 0 : value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-normal font-poopins">
                        Descripción
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          className="border-[#9A7FFF] focus:border-[#9A7FFF] focus:ring-[#9A7FFF] font-poopins min-h-[100px]"
                          placeholder="Descripción de la promoción"
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
                      <FormLabel className="text-sm font-medium">
                        Imagen
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <div
                            className={cn(
                              "flex flex-col items-center justify-center border-2 border-dashed rounded-md p-6 h-[100px] cursor-pointer bg-pink-100 hover:bg-pink-200 transition-colors",
                              previewImage
                                ? "border-pink-300"
                                : "border-pink-200"
                            )}
                            onClick={() =>
                              document.getElementById("image-upload")?.click()
                            }
                          >
                            {previewImage ? (
                              <img
                                src={previewImage || "/placeholder.svg"}
                                alt="Preview"
                                className="max-h-full max-w-full object-contain"
                              />
                            ) : (
                              <div className="flex flex-col items-center text-pink-400">
                                <ImagePlus className="h-8 w-8 mb-2" />
                                <span className="text-sm">
                                  Actualizar imagen
                                </span>
                              </div>
                            )}
                            <input
                              id="image-upload"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleImageChange}
                            />
                          </div>
                          <input
                            type="hidden"
                            {...field}
                            value={previewImage || ""}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="bg-black text-white hover:bg-gray-800"
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-purple-500 hover:bg-purple-600"
                disabled={isLoading}
              >
                {isLoading ? "Actualizando..." : "Actualizar"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
