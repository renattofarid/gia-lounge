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
import { updateStation } from "../lib/station.actions";
import { StationItem, StationRequest } from "../lib/station.interface";
import { LoaderCircle } from "lucide-react";

const StationSchema = z.object({
  name: z.string().nonempty(),
  description: z.string().optional(),
  type: z.string().nonempty(),
  status: z.string().nonempty(),
  route: z.string().optional(),
});

interface AddStationProps {
  station: StationItem;
  environmentId: number;
  onClose: () => void;
}

export default function UpdateStation({
  station,
  environmentId,
  onClose,
}: AddStationProps) {
  // const [previewImage, setPreviewImage] = useState<string | null>(null);
  // const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  // const [file, setFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof StationSchema>>({
    resolver: zodResolver(StationSchema),
    defaultValues: {
      name: station.name,
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
      setIsSending(true);
      const data = form.getValues();
      const companyData: StationRequest = {
        name: data.name,
        description: data.description ?? "",
        type: data.type,
        status: 1,
        environment_id: environmentId,
        // route: file ?? undefined,
      };
      await updateStation(station.id, companyData);
      successToast("Empresa guardada correctamente");
      setIsSending(false);
      onClose();
    } catch (error) {
      errorToast("Ocurrió un error al guardar la empresa");
      setIsSending(false);
    }
  };

  // if (isLoading) {
  //   return (
  //     <div className="flex flex-col gap-6 p-6 bg-secondary">
  //       {[...Array(7)].map((_, i) => (
  //         <Skeleton key={i} className="w-full h-4" />
  //       ))}
  //     </div>
  //   );
  // }

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
              type="button"
              onClick={onClose}
              className="bg-foreground text-secondary font-inter hover:bg-foreground/95 hover:text-secondary text-sm"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSending}
              className="bg-[#6366f1] hover:bg-[#818cf8]"
            >
              {isSending ? "Guardando" : "Guardar"}
              {isSending ? (
                <LoaderCircle className="animate-spin h-6 w-6" />
              ) : null}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
