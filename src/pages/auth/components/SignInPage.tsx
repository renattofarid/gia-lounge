"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { login } from "../service/auth.actions";
import { errorToast, successToast } from "@/lib/core.function";

const formSchema = z.object({
  user: z
    .string()
    .nonempty("El usuario no puede estar vacío")
    .max(50, "El usuario no puede tener más de 50 caracteres"),
  password: z
    .string()
    .nonempty("La contraseña no puede estar vacía")
    .max(50, "La contraseña no puede tener más de 50 caracteres"),
});

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const response = await login({
        username: data.user,
        password: data.password,
      });

      console.log("Inicio de sesión exitoso:", response);
      successToast("Inicio de sesión exitoso");
      navigate("/inicio");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Error al iniciar sesión.";
      console.log("Error al iniciar sesión:", errorMessage);
      console.error("Detalles del error:", error);
      errorToast("Error al iniciar sesión", errorMessage);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#EFEAFE" }}
    >
      <Card className="w-[400px] shadow-lg">
        {/* Logo */}
        <div className="flex justify-center mt-6">
          <img
            src="/logo.png"
            alt="Logo"
            width={150}
            height={150}
            className="rounded-full"
          />
        </div>

        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold font-inter text-foreground/90">
            Iniciar Sesión
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="user"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-sm font-medium text-gray-700 font-inter">
                      Usuario
                    </FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          {...field}
                          className="pl-10 w-full border-[#C4B5FD] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#9A7FFF] font-inter"
                          placeholder="Ingresa tu usuario"
                        />
                      </FormControl>
                      <Mail
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-sm font-medium text-gray-700 font-inter">
                      Contraseña
                    </FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          className="pl-10 pr-10 w-full border-[#C4B5FD] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#9A7FFF] font-inter"
                          placeholder="Ingresa tu contraseña"
                        />
                      </FormControl>
                      <Lock
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full py-2 px-4 mt-6 bg-[#9A7FFF] hover:bg-[#5238B3]"
              >
                Iniciar Sesión
              </Button>
            </form>
          </Form>

          {/* <div className="text-center mt-4">
            <a 
              href="#" 
              className="text-sm text-[#9A7FFF] hover:text-[#C4B5FD]"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
}
