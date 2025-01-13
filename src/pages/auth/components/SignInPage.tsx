import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Form } from "react-router-dom";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { login } from "../service/auth.actions";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  user: z.string().nonempty("El usuario no puede estar vacío").max(50, "El usuario no puede tener más de 50 caracteres"),
  password: z.string().nonempty("La contraseña no puede estar vacía").max(50, "La contraseña no puede tener más de 50 caracteres"),
});

export default function SignInPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user: "",
      password: "",
    },
  });

  const navigate = useNavigate();

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      // Llamar a la función login y pasar los datos
      const response = await login({
        username: data.user,
        password: data.password,
      });

      console.log("Inicio de sesión exitoso:", response);
      navigate("/inicio"); 
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Error al iniciar sesión.";
      console.log("Error al iniciar sesión:", errorMessage);
      console.error("Detalles del error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-normal">
            Iniciar Sesión
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="user"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-sm font-medium text-gray-700">
                      Usuario
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="mt-1"
                        placeholder="Ingresa tu usuario"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-sm font-medium text-gray-700">
                      Contraseña
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        className="mt-1"
                        placeholder="Ingresa tu contraseña"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-black text-white hover:bg-gray-800"
                
              >
                Iniciar Sesión
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
