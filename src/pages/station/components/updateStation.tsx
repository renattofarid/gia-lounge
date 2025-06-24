"use client";

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
import { updateStation } from "../lib/station.actions";
import { StationItem, StationRequest } from "../lib/station.interface";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, LoaderCircle } from 'lucide-react';
import { useEnvironmentStore } from "@/pages/environment/lib/environment.store";
import { useComapanyStore } from "@/pages/company/lib/company.store";

const StationSchema = z.object({
  name: z.string().nonempty(),
  environment_id: z.number(),
  description: z.string().optional(),
  type: z.string().nonempty(),
  status: z.string().nonempty(),
  route: z.string().optional(),
  price: z.string().optional(),
  sort: z.number(),
  price_unitario: z.string().optional(),
  quantity_people: z.number().optional(),
});

interface UpdateStationProps {
  station: StationItem;
  environmentId: number;
  onClose: () => void;
}

export default function UpdateStation({
  station,
  onClose,
}: UpdateStationProps) {
  // const [previewImage, setPreviewImage] = useState<string | null>(null);
  // const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  // const [file, setFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof StationSchema>>({
    resolver: zodResolver(StationSchema),
    defaultValues: {
      name: station.name,
      description: station.description,
      type: station.type,
      status: station.status,
      environment_id: station.environment_id,
      price: station.price,
      sort: station.sort ?? 0,
      price_unitario: station.price_unitario ?? "",
      quantity_people: station.quantity_people ?? 0,
    },
  });

  const watchType = form.watch("type");
  const watchUnit = form.watch("price_unitario");
  const watchQty = form.watch("quantity_people");

  useEffect(() => {
    if (watchType === "BOX") {
      const unit = parseFloat(watchUnit || "0");
      const qty = watchQty || 0;
      const total = (unit * qty).toFixed(2);
      form.setValue("price", total);
    }
  }, [watchUnit, watchQty, watchType, form]);

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

  const { environments, loading, loadEnvironments } = useEnvironmentStore();
  const { companyId } = useComapanyStore();

  useEffect(() => {
    loadEnvironments(1, companyId);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsSending(true);
      const data = form.getValues();
      const stantionData: StationRequest = {
        name: data.name,
        description: data.description ?? "",
        type: data.type,
        status: data.status,
        environment_id: Number(data.environment_id),
        price: data.price ?? "0",
        sort: data.sort,
        price_unitario: data.price_unitario ?? "0",
        quantity_people: data.quantity_people ?? 0,
        // route: file ?? undefined,
      };
      await updateStation(station.id, stantionData);
      // successToast("Mesa guardada correctamente");

      successToast(
        `${
          data.type === "MESA" ? "Mesa guardada" : "Box guardado"
        } correctamente`
      );

      setIsSending(false);
      onClose();
    } catch (error: any) {
      console.error("Error capturado:", error);
      const errorMessage =
        error?.response?.data?.message ||
        "Ocurrió un error al guardar los datos";
      errorToast(errorMessage);
    } finally {
      setIsSending(false);
    }
  };

 if (loading) {
     return (
       <div className="flex flex-col gap-6 p-6 items-center justify-center">
         <Loader2 className="h-10 w-10 animate-spin text-violet-600" />
       </div>
     );
   }
 

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
                  name="environment_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-normal">
                        Salon
                      </FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))} // Convierte a número
                        defaultValue={
                          field.value ? field.value.toString() : undefined
                        }
                      >
                        <FormControl>
                          <SelectTrigger className="border-[#9A7FFF] focus:border-[#9A7FFF] focus:ring-[#9A7FFF] font-poopins">
                            <SelectValue placeholder="Seleccione salon" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {environments.map((environment) => (
                            <SelectItem
                              key={environment.id}
                              value={environment.id.toString()}
                            >
                              {environment.name}
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
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border-[#9A7FFF] focus:border-[#9A7FFF] focus:ring-[#9A7FFF] font-poopins">
                          <SelectValue placeholder="Seleccione tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MESA">Mesa</SelectItem>
                        <SelectItem value="BOX">Box</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {watchType === "BOX" && (
                <div className="flex flex-row gap-4">
                  <FormField
                    control={form.control}
                    name="price_unitario"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Precio unitario
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            className="border-[#9A7FFF] focus:border-[#9A7FFF] focus:ring-[#9A7FFF] font-poopins"
                            placeholder="Precio unitario"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="quantity_people"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Cantidad de personas
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            className="border-[#9A7FFF] focus:border-[#9A7FFF] focus:ring-[#9A7FFF] font-poopins"
                            placeholder="Cantidad"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

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
                        <SelectItem value="Inhabilitado">
                          Inhabilitado
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-row gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Precio por defecto
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          className="border-[#9A7FFF] focus:border-[#9A7FFF] focus:ring-[#9A7FFF] font-poopins"
                          placeholder="Precio"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sort"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Orden
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          className="border-[#9A7FFF] focus:border-[#9A7FFF] focus:ring-[#9A7FFF] font-poopins"
                          placeholder="Orden"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                            src={previewImage || "/placeholder.svg"}
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
              variant="secondary"
              type="reset"
              onClick={onClose}
              className="font-inter text-sm"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="default"
              disabled={isSending}
              className="font-inter text-sm flex items-center gap-2"
            >
              {isSending ? "Guardando" : "Guardar"}
              {isSending ? (
                <LoaderCircle className="animate-spin h-6 w-6" />
              ) : null}
            </Button>
          </div>
          <div className="flex justify-end gap-2"></div>
        </form>
      </Form>
    </div>
  );
}