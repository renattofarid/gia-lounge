"use client";

import type React from "react";

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

import { useState, useEffect } from "react";
import { useGalleryStore } from "../lib/gallery.store";
import { createGallery } from "../lib/gallery.actions";
import { useComapanyStore } from "@/pages/company/lib/company.store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, ImageIcon, X } from "lucide-react";

const GallerySchema = z.object({
  company_id: z.string().nonempty("El ID de la empresa es obligatorio"),
  route_drive: z.string().url("Debe ser una URL válida"),
  images: z
    .array(
      z.object({
        name: z.string().nonempty("El nombre de la imagen es obligatorio"),
        file: z
          .instanceof(File, { message: "Por favor selecciona una imagen" })
          .refine((file) => file.size <= 5000000, {
            message: "La imagen debe ser menor a 5MB",
          })
          .refine(
            (file) =>
              ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
                file.type
              ),
            {
              message: "Formato de archivo no soportado. Usa JPEG, PNG o WebP",
            }
          ),
      })
    )
    .min(1, "Debes agregar al menos una imagen"),
});

interface AddGalleryProps {
  onClose: () => void;
}

export default function CreateGalleryPage({ onClose }: AddGalleryProps) {
  const form = useForm<z.infer<typeof GallerySchema>>({
    resolver: zodResolver(GallerySchema),
    defaultValues: {
      company_id: "",
      route_drive: "",
      images: [],
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const { loading } = useGalleryStore();
  const { companies, loadCompanies } = useComapanyStore();

  useEffect(() => {
    loadCompanies(1);
  }, [loadCompanies]);

  const handleMultipleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const newImages = files.map((file) => ({
      name: file.name,
      file,
    }));

    const updatedImages = [...form.getValues("images"), ...newImages];
    form.setValue("images", updatedImages, { shouldValidate: true });

    const newPreviews = newImages.map((img) => URL.createObjectURL(img.file));
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
  };

  const handleNameChange = (value: string, index: number) => {
    const currentImages = form.getValues().images || [];
    const updatedImages = [...currentImages];
    updatedImages[index] = { ...updatedImages[index], name: value };
    form.setValue("images", updatedImages, { shouldValidate: true });
  };

  const removeImageField = (index: number) => {
    const updatedImages = form.getValues().images.filter((_, i) => i !== index);
    form.setValue("images", updatedImages, { shouldValidate: true });

    const newPreviewUrls = [...previewUrls];
    newPreviewUrls.splice(index, 1);
    setPreviewUrls(newPreviewUrls);
  };

  const handleFormSubmit = async (data: z.infer<typeof GallerySchema>) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("company_id", data.company_id.toString());
      formData.append("route_drive", data.route_drive);

      data.images.forEach((image, index) => {
        formData.append(`images[${index}][name]`, image.name);
        formData.append(`images[${index}][file]`, image.file);
      });

      await createGallery(formData);

      successToast("Imágenes guardadas correctamente");
      onClose();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        "Ocurrió un error al guardar las imágenes";
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
    <div className="bg-white">
      <div className="flex flex-col">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)}>
            <div className="w-full rounded-lg bg-[#f8f5ff] p-4 text-sm mb-4 space-y-3">
              <FormField
                control={form.control}
                name="company_id"
                render={({ field }) => (
                  <FormItem className="mb-0">
                    <FormLabel className="text-sm font-inter">
                      Compañía
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger className=" border-[#9A7FFF] focus:border-[#9A7FFF] focus:ring-[#9A7FFF] font-poopins">
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
                name="route_drive"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-inter">
                      Link del Álbum
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="border-[#9A7FFF]"
                        placeholder="https://drive.google.com/..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="max-h-[300px] overflow-y-auto pr-2 hiddenScroll">
              <div className="space-y-4">
                {/* INPUT GLOBAL PARA SELECCIONAR IMÁGENES */}
                <input
                  id="file-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="hidden"
                  onChange={handleMultipleFileChange}
                />

                {form.watch("images").map((image, index) => (
                  <div key={index} className="border rounded-lg p-4 relative">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8 text-gray-500 hover:text-red-500"
                      onClick={() => removeImageField(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>

                    <h3 className="font-sm mb-3 font-poopins">
                      Imagen {index + 1}
                    </h3>

                    <div className="mb-4">
                      <FormLabel className="text-sm font-inter">
                        Nombre de la imagen
                      </FormLabel>
                      <Input
                        className="border-[#9A7FFF] focus:border-[#9A7FFF] focus:ring-[#9A7FFF] font-poopins"
                        placeholder="Nombre descriptivo"
                        value={image.name}
                        onChange={(e) =>
                          handleNameChange(e.target.value, index)
                        }
                      />
                      {form.formState.errors.images?.[index]?.name && (
                        <p className="text-sm font-medium text-destructive mt-1">
                          {form.formState.errors.images[index]?.name?.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <FormLabel className="text-sm font-inter">
                        Imagen
                      </FormLabel>
                      <div className="flex flex-col items-center">
                        <div
                          className="border-2 border-dashed border-[#9A7FFF] rounded-lg p-6 w-full cursor-pointer hover:bg-[#9A7FFF]/5 transition-colors"
                          onClick={() =>
                            document.getElementById("file-upload")?.click()
                          }
                        >
                          {previewUrls[index] ? (
                            <div className="flex flex-col items-center">
                              <img
                                src={previewUrls[index]}
                                alt="Vista previa"
                                className="max-h-48 max-w-full mb-2 rounded-md"
                              />
                              <p className="text-sm text-gray-500 font-poopins">
                                Haz clic para cambiar la imagen
                              </p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center">
                              <ImageIcon className="h-12 w-12 text-[#9A7FFF] mb-2" />
                              <p className="text-sm font-medium font-poopins">
                                Haz clic para seleccionar una imagen
                              </p>
                              <p className="text-xs text-gray-500 mt-1 font-inter">
                                PNG, JPG o WEBP (máx. 5MB)
                              </p>
                            </div>
                          )}
                        </div>
                        <input
                          id="file-upload"
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          multiple
                          className="hidden"
                          onChange={handleMultipleFileChange}
                        />
                      </div>
                      {form.formState.errors.images?.[index]?.file && (
                        <p className="text-sm font-medium text-destructive mt-2">
                          {form.formState.errors.images[index]?.file?.message}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Opcional: puedes ocultar este botón si usas selección múltiple */}
            <div className="mt-4 mb-4">
              <Button
                type="button"
                variant="outline"
                className="w-full border-dashed border-[#9A7FFF] text-[#9A7FFF] hover:bg-[#9A7FFF]/5 font-poopins"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Agregar imagen/es
              </Button>
            </div>

            <div className="mt-4 flex justify-end gap-2 border-t pt-4">
              <DialogFooter>
                <Button
                  variant="outline"
                  type="button"
                  onClick={onClose}
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
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <Upload className="mr-2 h-4 w-4 animate-spin" />
                      Subiendo...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Upload className="mr-2 h-4 w-4" />
                      Subir imágenes
                    </div>
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
