"use client"

import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const UserSchema = z.object({
  username: z.string().nonempty(),
  password: z.string().nonempty(),
  rol: z.string().nonempty(),
  type_document: z.enum(["dni", "ruc", "ce"]),
  type_person: z.enum(["Individual", "Business"]),
  documentNumber: z.string().nonempty(),
  names: z.string().nonempty(),
  address: z.string().nonempty(),
  phone: z.string().nonempty(),
  email: z.string().email(),
})

export default function CreateUserPage() {
  const form = useForm<z.infer<typeof UserSchema>>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      username: "",
      password: "",
      rol: "",
      type_document: "dni",
      type_person: "Individual",
      documentNumber: "",
      names: "",
      address: "",
      phone: "",
      email: "",
    },
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Add form submission logic here
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4">
          <h2 className="text-lg font-medium font-inter">Crear usuario</h2>
          <p className="text-sm text-gray-500">Gestionar todos los datos del usuario</p>
        </div>
        
        <Form {...form}>
          <form onSubmit={handleSubmit}>
            <div className="flex gap-6">
              {/* Left Section */}
              <div className="w-72 space-y-4 rounded-lg bg-[#EFE9FF] p-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-normal font-inter">Usuario</FormLabel>
                      <FormControl>
                        <Input 
                          className="bg-white border-gray-200" 
                          placeholder="Usuario" 
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
                      <FormLabel className="text-sm font-normal">Contraseña</FormLabel>
                      <FormControl>
                        <Input 
                          type="password"
                          className="bg-white border-gray-200" 
                          placeholder="Contraseña" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rol"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-normal">Rol</FormLabel>
                      <FormControl>
                        <Input 
                          className="bg-white border-gray-200" 
                          placeholder="Rol" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Right Section */}
              <div className="flex-1 space-y-4 rounded-lg bg-[#EFE9FF] p-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="type_person"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-normal">Tipo de persona</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white border-gray-200">
                              <SelectValue placeholder="Seleccione tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Individual">Individual</SelectItem>
                            <SelectItem value="Business">Empresa</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-normal">E-mail</FormLabel>
                        <FormControl>
                          <Input 
                            className="bg-white border-gray-200" 
                            type="email" 
                            placeholder="E-mail" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type_document"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-normal">Tipo de documento</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white border-gray-200">
                              <SelectValue placeholder="Seleccione documento" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="dni">DNI</SelectItem>
                            <SelectItem value="ruc">RUC</SelectItem>
                            <SelectItem value="ce">CE</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-normal">Dirección</FormLabel>
                        <FormControl>
                          <Input 
                            className="bg-white border-gray-200" 
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
                    name="documentNumber"
                    render={({ field }) => (
                      <FormItem className="relative">
                        <FormLabel className="text-sm font-normal">Número de documento</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              className="bg-white border-gray-200 pr-10" 
                              placeholder="Número de documento" 
                              {...field} 
                            />
                            <button 
                              type="button"
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-purple-500"
                            >
                              <svg width="20" height="20" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z"/>
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
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-normal">Teléfono</FormLabel>
                        <FormControl>
                          <Input 
                            className="bg-white border-gray-200" 
                            placeholder="Teléfono" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="names"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-normal">Nombres</FormLabel>
                        <FormControl>
                          <Input 
                            className="bg-white border-gray-200" 
                            placeholder="Nombres" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button 
                variant="outline" 
                type="button"
                className="bg-white hover:bg-gray-50"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-[#818cf8] hover:bg-[#6366f1]"
              >
                Guardar
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

