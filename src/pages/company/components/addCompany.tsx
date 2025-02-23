"use client";

import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useCallback } from "react";
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
import { createCompany } from "../lib/company.actions";
import { searchPersonByRUC } from "@/pages/users/lib/user.actions";
import { CompanyRequest } from "../lib/company.interface";

const CompanySchema = z.object({
  ruc: z
    .string()
    .nonempty("El RUC es obligatorio")
    .length(11, "El RUC debe tener exactamente 11 dígitos")
    .regex(/^\d+$/, "El RUC solo debe contener números"),
  business_name: z.string().optional(),
  address: z.string().nonempty(),
  phone: z
    .string()
    .nonempty("El teléfono es obligatorio")
    .regex(/^\d{9}$/, "El teléfono debe tener 9 dígitos"),
  email: z.string().email(),
  route: z.string().optional(),
});

interface AddCompanyProps {
  onClose: () => void;
}

export default function CreateCompanyPage({ onClose }: AddCompanyProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof CompanySchema>>({
    resolver: zodResolver(CompanySchema),
    defaultValues: {
      ruc: "",
      business_name: "",
      address: "",
      phone: "",
      email: "",
      route: "",
    },
  });

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        const imageUrl = URL.createObjectURL(file);
        setPreviewImage(imageUrl);
        form.setValue("route", file.name);
        setFile(file);
      }
    },
    [form]
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const data = form.getValues();
      const companyData: CompanyRequest = {
        ruc: data.ruc,
        business_name: data.business_name ?? "",
        address: data.address,
        phone: data.phone,
        email: data.email,
        status: true,
        route: file ?? undefined,
      };
      await createCompany(companyData);
      successToast("Empresa guardada correctamente");
      setIsLoading(false);
      onClose();
    } catch (error) {
      errorToast("Ocurrió un error al guardar la empresa");
      setIsLoading(false);
    }
  };

  const handleSearchCompany = async () => {
    try {
      const number_document = form.getValues("ruc");
      if (!number_document) return;

      const company = await searchPersonByRUC(number_document);
      if (company.code === 9) {
        errorToast("No se encontró la Empresa");
        return;
      }

      form.setValue("business_name", company.RazonSocial);
      form.setValue("address", company.Direccion);
      form.setValue("phone", company.phone);
    } catch (error) {
      errorToast("No se encontró la Empresa");
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Formulario */}
            <div className="flex flex-col gap-4">
              <div className="w-full rounded-lg bg-secondary p-4 text-sm space-y-4 font-inter">
                <FormField
                  control={form.control}
                  name="ruc"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel className="text-sm font-normal">RUC</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            className="border-[#9A7FFF] focus:border-[#9A7FFF] focus:ring-[#9A7FFF] font-poopins"
                            placeholder="Número de documento"
                            maxLength={11}
                            pattern="[0-9]*" 
                            inputMode="numeric"
                            onInput={(e) => (e.currentTarget.value = e.currentTarget.value.replace(/\D/g, ""))} // Elimina cualquier carácter que no sea número
                            {...field}
                          />
                          <button
                            type="button"
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-purple-500"
                            onClick={handleSearchCompany}
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24">
                              <path
                                fill="currentColor"
                                d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z"
                              />
                            </svg>
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="business_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-normal">
                        Nombre
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="border-[#9A7FFF] focus:border-[#9A7FFF] focus:ring-[#9A7FFF] font-poopins"
                          placeholder="Nombre o Razón Social"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-normal">
                        Dirección
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="border-[#9A7FFF] focus:border-[#9A7FFF] focus:ring-[#9A7FFF] font-poopins"
                          placeholder="Dirección"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-normal">
                        Teléfono
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="border-[#9A7FFF] focus:border-[#9A7FFF] focus:ring-[#9A7FFF] font-poopins"
                          placeholder="Teléfono"
                          maxLength={9}
                          pattern="[0-9]*"
                          inputMode="numeric"
                          onInput={(e) =>
                            (e.currentTarget.value =
                              e.currentTarget.value.replace(/\D/g, ""))
                          }
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-normal">
                        E-mail
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="border-[#9A7FFF] focus:border-[#9A7FFF] focus:ring-[#9A7FFF] font-poopins"
                          type="email"
                          placeholder="E-mail"
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
            <div className="flex flex-col gap-4">
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
            </div>
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
