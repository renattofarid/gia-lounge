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
import { createStation } from "../lib/station.actions";
import { StationRequest } from "../lib/station.interface";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const StationSchema = z.object({
  name: z.string().nonempty(),
  description: z.string().optional(),
  type: z.string().nonempty(),
  status: z.string().nonempty(),
  route: z.string().optional(),
});

interface AddStationProps {
  environmentId: number;
  onClose: () => void;
}

export default function CreateStation({
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
      name: "",
      type: "",
      description: "",
      status: "",
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
      const stationData: StationRequest = {
        name: data.name,
        description: data.description ?? "",
        type: data.type,
        status: data.status,
        environment_id: environmentId,
        // route: file ?? undefined,
      };
      await createStation(stationData);
      successToast("Mesa guardada correctamente");
      setIsSending(false);
      onClose();
    } catch (error) {
      errorToast("Ocurrió un error al guardar la mesa");
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
    <div className="p-2 ">
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-secondary rounded-lg">
            {/* Formulario */}
            <div className="flex flex-col gap-4">
              <div className="w-full rounded-lg p-4 text-sm space-y-4 font-inter">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel className="text-sm font-medium">
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
                      <FormLabel className="text-sm font-medium">
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

            <div className="flex flex-col gap-4  rounded-lg p-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Tipo</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border-[#9A7FFF] focus:border-[#9A7FFF] focus:ring-[#9A7FFF] font-poopins">
                          <SelectValue placeholder="Seleccione tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Mesa">Mesa</SelectItem>
                        <SelectItem value="Box">Box</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Estado
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border-[#9A7FFF] focus:border-[#9A7FFF] focus:ring-[#9A7FFF] font-poopins">
                          <SelectValue placeholder="Seleccione estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Disponible">Disponible</SelectItem>
                        <SelectItem value="Reservado">Reservado</SelectItem>
                        <SelectItem value="Inhabilitado">Inhabilitado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <FormField
                control={form.control}
                name="route"
                render={() => (
                  <FormItem className="col-span-2">
                    <FormLabel className="text-sm font-medium">
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
                          <div className="relative w-full flex justify-center items-center overflow-hidden rounded-full">
                            <img
                              src={previewImage}
                              alt="Preview"
                              className="object-cover size-24 flex justify-center items-center rounded-full"
                            />
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              type="reset"
              onClick={onClose}
              className="bg-foreground text-white font-inter hover:bg-foreground/95 hover:text-white text-sm"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSending}
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
