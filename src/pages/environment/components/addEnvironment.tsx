"use client";

import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { createEnvironment } from "../lib/environment.actions";
import { EnvironmentRequest } from "../lib/environment.interface";

const EnvironmentSchema = z.object({
  name: z.string().nonempty(),
  description: z.string().optional(),
  status: z.string().nonempty(),
});

interface AddEnvironmentProps {
  companyId: number;
  onClose: () => void;
}

export default function CreateEnvironment({
  companyId,
  onClose,
}: AddEnvironmentProps) {
  // const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // const [file, setFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof EnvironmentSchema>>({
    resolver: zodResolver(EnvironmentSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "1",
    },
  });

  // const handleFileChange = useCallback(
  //   (event: React.ChangeEvent<HTMLInputElement>) => {
  //     if (event.target.files && event.target.files[0]) {
  //       const file = event.target.files[0];
  //       const imageUrl = URL.createObjectURL(file);
  //       setPreviewImage(imageUrl);
  //       setFile(file);
  //     }
  //   },
  //   [form]
  // );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const data = form.getValues();
      const companyData: EnvironmentRequest = {
        name: data.name,
        description: data.description ?? "",
        status: 1,
        company_id: companyId,
        // route: file ?? undefined,
      };
      await createEnvironment(companyData);
      successToast("Empresa guardada correctamente");
      setIsLoading(false);
      onClose();
    } catch (error) {
      errorToast("Ocurrió un error al guardar la empresa");
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6 bg-secondary">
        {[...Array(7)].map((_, i) => (
          <Skeleton key={i} className="w-full h-4" />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-secondary p-6">
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Formulario */}
            <div className="flex flex-col gap-4">
              <div className="w-full rounded-lg bg-secondary p-4 text-sm space-y-4 font-inter">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel className="text-sm font-normal">
                        Nombre
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            className="border-[#9A7FFF] focus:border-[#9A7FFF] focus:ring-[#9A7FFF] font-poopins"
                            placeholder="Nombre del ambiente"
                            {...field}
                          />
                        </div>
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
                      <FormLabel className="text-sm font-normal">
                        Descripción
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="border-[#9A7FFF] focus:border-[#9A7FFF] focus:ring-[#9A7FFF] font-poopins"
                          placeholder="Descripción"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Image Upload Section */}
            {/* <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="route"
                render={() => (
                  <FormItem className="col-span-2">
                    <FormLabel className="text-sm font-normal">
                      Imagen de la empresa
                    </FormLabel>
                    <FormControl>
                      <div className="flex flex-col items-start gap-4">
                        <div className="flex-1">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="border-[#9A7FFF] focus:border-[#9A7FFF] focus:ring-[#9A7FFF] font-poopins"
                          />
                        </div>
                        {previewImage && (
                          <div className="relative size-32 border flex justify-center items-center overflow-hidden rounded-full">
                            <img
                              src={previewImage}
                              alt="Preview"
                              className="object-cover rounded-full"
                            />
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div> */}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              type="reset"
              onClick={onClose}
              className="bg-foreground text-secondary font-inter hover:bg-foreground/95 hover:text-secondary text-sm"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#6366f1] hover:bg-[#818cf8]"
            >
              Guardar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
