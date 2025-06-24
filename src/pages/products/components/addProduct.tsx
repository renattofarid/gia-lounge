"use client";

import type React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
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
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label";
import { createProduct } from "../lib/producto.actions";
import RichTextEditor from "@/components/RichTextEditor";

const ProductSchema = z.object({
  //   company_id: z.number(),
  name: z.string().nonempty("El nombre del producto es obligatorio"),
  description: z.string().nonempty("La descripción es obligatoria"),
  precio: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "El precio debe ser un número mayor a 0",
  }),
  status: z.string().nonempty("El estado es obligatorio"),
  route: z.any().optional(),
});

interface CreateProductProps {
  onClose: () => void;
  //   companyId: number
}

export default function CreateProduct({ onClose }: CreateProductProps) {
  const form = useForm<z.infer<typeof ProductSchema>>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: "",
      description: "",
      precio: "",
      status: "Activo",
      route: null,
      //   company_id: companyId,
    },
    mode: "onChange",
  });

  //   const { companies, loadCompanies } = useComapanyStore()
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  //   const [selectedCompanyId, setSelectedCompanyId] = useState<number>(companyId || 0)

  //   useEffect(() => {
  //     loadCompanies(1)
  //   }, [])

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue("route", file);
    }
  };

  const handleFormSubmit = async (data: z.infer<typeof ProductSchema>) => {
    try {
      const formData = new FormData();
      //   formData.append("company_id", data.company_id.toString())
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("precio", data.precio);
      formData.append("status", data.status);

      if (data.route) {
        formData.append("route", data.route);
      }

      setIsSubmitting(true);

      await createProduct(formData);
      console.log("Datos del producto:", Object.fromEntries(formData));

      onClose();
    } catch (error) {
      console.error("Error capturado:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  //   const statusOptions = [
  //     { value: "active", label: "Activo" },
  //     { value: "inactive", label: "Inactivo" },
  //     { value: "draft", label: "Borrador" },
  //     { value: "out_of_stock", label: "Agotado" },
  //   ]

  return (
    <div className="p-2">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="space-y-6"
        >
          <div className="grid grid-cols-1  gap-6 bg-secondary rounded-lg p-6">
            <div className="flex flex-row gap-4 w-full justify-between">
              {/* Nombre del Producto */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel className="text-sm font-normal font-poopins">
                      Nombre del Producto
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nombre del producto"
                        {...field}
                        className="border-[#9A7FFF] focus:border-[#9A7FFF] focus:ring-[#9A7FFF] font-poopins"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Precio */}
              <FormField
                control={form.control}
                name="precio"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel className="text-sm font-normal font-poopins">
                      Precio
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="0.00"
                        type="number"
                        step="0.01"
                        {...field}
                        className="border-[#9A7FFF] focus:border-[#9A7FFF] focus:ring-[#9A7FFF] font-poopins"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <Label className="text-sm font-normal font-poopins">
                Descripción
              </Label>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
            {/* Imagen del Producto */}
            <FormField
              control={form.control}
              name="route"
              render={() => (
                <FormItem>
                  <FormLabel className="font-poopins text-sm">
                    Imagen del producto
                  </FormLabel>
                  <FormControl>
                    <>
                      {imagePreview ? (
                        <div className="flex relative w-full h-24 rounded-md overflow-hidden border border-dashed bg-white/40 justify-center items-center p-2">
                          <img
                            src={imagePreview || "/placeholder.svg"}
                            alt="Preview"
                            className="w-auto h-full object-cover rounded-md"
                          />
                          <label className="absolute top-2 right-2 cursor-pointer bg-white/80 hover:bg-white rounded-full p-1 shadow flex items-center justify-center">
                            <Camera className="h-5 w-5 text-pink-400" />
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleImageChange}
                            />
                          </label>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center h-24 rounded-md border border-dashed border-pink-400 bg-pink-200 text-pink-700 hover:bg-pink-300/80 cursor-pointer transition-colors">
                          <Camera className="h-8 w-8 mb-2 text-pink-400" />
                          <span className="font-poopins text-sm">
                            Agregar imagen
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
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
              {isSubmitting ? "Guardando..." : "Guardar Producto"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </div>
  );
}
