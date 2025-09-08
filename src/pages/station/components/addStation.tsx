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
import { createStation } from "../lib/station.actions";
import { StationRequest } from "../lib/station.interface";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEnvironmentStore } from "@/pages/environment/lib/environment.store";
import { useComapanyStore } from "@/pages/company/lib/company.store";
import { Loader2 } from "lucide-react";

const StationSchema = z
  .object({
    name: z.string().min(1, "El nombre es obligatorio"),
    environment_id: z.number(),
    description: z.string().optional(),
    type: z.enum(["MESA", "BOX"], { required_error: "Seleccione el tipo" }),
    status: z.string().min(1, "El estado es obligatorio"),
    route: z.string().optional(),
    price: z.string().optional(), // total calculado o manual
    sort: z.coerce
      .number()
      .int()
      .min(1, { message: "El orden inicia en 1 (no se permite 0)" }),
    price_unitario: z.string().optional(),
    quantity_people: z.coerce.number().int().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "MESA") {
      const qty = data.quantity_people ?? 0;
      if (qty < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["quantity_people"],
          message: "Ingrese la cantidad de personas (mínimo 1)",
        });
      }
      if (qty > 4) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["quantity_people"],
          message: "Máximo 4 personas para MESA",
        });
      }
    }

    if (data.type === "BOX") {
      const unit = parseFloat(data.price_unitario ?? "");
      if (!Number.isFinite(unit) || unit <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["price_unitario"],
          message: "El precio unitario debe ser mayor que 0",
        });
      }
      const qty = data.quantity_people ?? 0;
      if (qty < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["quantity_people"],
          message: "Ingrese la cantidad de personas (mínimo 1)",
        });
      }
    }
  });

interface AddStationProps {
  environmentId: number;
  onClose: () => void;
}

export default function CreateStation({
  environmentId,
  onClose,
}: AddStationProps) {
  const [isSending, setIsSending] = useState(false);

  const form = useForm<z.infer<typeof StationSchema>>({
    resolver: zodResolver(StationSchema),
    shouldUnregister: true,
    defaultValues: {
      name: "",
      type: undefined,
      description: "",
      status: "Disponible",
      price: "",
      sort: 1,
      environment_id: environmentId,
      price_unitario: "",
      quantity_people: undefined,
    },
  });

  const watchType = form.watch("type");
  const watchUnit = form.watch("price_unitario");
  const watchQty = form.watch("quantity_people");

  useEffect(() => {
    if (watchType === "BOX") {
      const unit = parseFloat(watchUnit || "0");
      const qty = Number(watchQty || 0);
      const total = (unit * qty).toFixed(2);
      form.setValue("price", total);
    }
  }, [watchUnit, watchQty, watchType, form]);

  const { environments, loading, loadEnvironments } = useEnvironmentStore();
  const { companyId } = useComapanyStore();

  useEffect(() => {
    loadEnvironments(1, companyId);
  }, [loadEnvironments, companyId]);

  useEffect(() => {
    if (watchType === "MESA") {
      const qp = form.getValues("quantity_people");
      if (qp == null || qp < 1) {
        form.setValue("quantity_people", 4, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    }
  }, [watchType, form]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsSending(true);
      const data = form.getValues();
      const stationData: StationRequest = {
        name: data.name,
        description: data.description ?? "Sin descripción",
        type: data.type,
        status: "Disponible",
        environment_id: Number(data.environment_id),
        price: data.price ?? "0",
        sort: data.sort ?? 1,
        price_unitario: data.price_unitario ?? "0",
        quantity_people: data.quantity_people ?? 1,
      };
      await createStation(stationData);

      successToast(
        `${
          data.type === "MESA" ? "Mesa guardada" : "Box guardado"
        } correctamente`
      );
      setIsSending(false);
      onClose();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Error desconocido";
      errorToast(errorMessage);
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
            {/* Columna izquierda */}
            <div className="flex flex-col gap-4">
              <div className="w-full rounded-lg p-4 text-sm space-y-4 font-inter">
                <FormField
                  control={form.control}
                  name="environment_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-normal">
                        Salón
                      </FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        defaultValue={
                          field.value ? field.value.toString() : undefined
                        }
                      >
                        <FormControl>
                          <SelectTrigger className="border-[#9A7FFF] focus:border-[#9A7FFF] focus:ring-[#9A7FFF] font-poopins">
                            <SelectValue placeholder="Seleccione salón" />
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

            {/* Columna derecha */}
            <div className="flex flex-col gap-4 rounded-lg p-4">
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
                        <SelectItem value="MESA">Mesa</SelectItem>
                        <SelectItem value="BOX">Box</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* MESA: solo cantidad (1-4) */}
              {watchType === "MESA" && (
                <FormField
                  control={form.control}
                  name="quantity_people"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-inter font-medium flex items-center gap-2">
                        Cantidad de personas{" "}
                        <span className="text-xs text-muted-foreground font-inter ml-1">
                          (Máximo 4)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={4}
                          step={1}
                          className="border-[#9A7FFF] focus:border-[#9A7FFF] focus:ring-[#9A7FFF] font-poopins"
                          placeholder="Cantidad"
                          value={field.value ?? 4}
                          onChange={(e) =>
                            field.onChange(e.currentTarget.valueAsNumber)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* BOX: precio unitario + cantidad (>=1) */}
              {watchType === "BOX" && (
                <div className="flex flex-row gap-4">
                  <FormField
                    control={form.control}
                    name="price_unitario"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="text-sm font-medium">
                          Precio unitario
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min={0}
                            className="border-[#9A7FFF] focus:border-[#9A7FFF] focus:ring-[#9A7FFF] font-poopins"
                            placeholder="Precio unitario"
                            value={field.value ?? ""}
                            onChange={(e) =>
                              field.onChange(e.currentTarget.value)
                            } // string; Zod valida > 0
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
                      <FormItem className="flex-1">
                        <FormLabel className="text-sm font-medium">
                          Cantidad de personas
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            step={1}
                            className="border-[#9A7FFF] focus:border-[#9A7FFF] focus:ring-[#9A7FFF] font-poopins"
                            placeholder="Cantidad"
                            value={field.value ?? 1}
                            onChange={(e) =>
                              field.onChange(e.currentTarget.valueAsNumber)
                            }
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
                      disabled
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
                    <FormItem className="flex-1">
                      <FormLabel className="text-sm font-medium">
                        Precio por defecto
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
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
                    <FormItem className="flex-1">
                      <FormLabel className="text-sm font-medium">
                        Orden
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          className="border-[#9A7FFF] focus:border-[#9A7FFF] focus:ring-[#9A7FFF] font-poopins"
                          placeholder="Orden"
                          {...field}
                          onBlur={(e) => {
                            const v = Math.max(1, Number(e.target.value || 1));
                            form.setValue("sort", v);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={onClose}
              className="font-inter text-sm"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSending}
              className="font-inter text-sm"
              variant="default"
            >
              Guardar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
