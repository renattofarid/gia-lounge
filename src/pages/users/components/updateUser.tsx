"use client"

import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { DialogFooter } from "@/components/ui/dialog"
import { updateUser, searchPersonByDNI, searchPersonByRUC } from "../lib/user.actions"
import { errorToast, successToast } from "@/lib/core.function"
import { useRolStore } from "@/pages/roles/lib/rol.store"
import { Skeleton } from "@/components/ui/skeleton"
import { UserItem } from "../lib/user.interface"

const UserSchema = z.object({
  username: z.string().nonempty(),
  password: z.string().optional(), // Make password optional for editing
  rol_id: z.string().optional(),
  type_document: z.enum(["", "DNI", "RUC", "CE"]),
  type_person: z.enum(["", "NATURAL", "JURIDICA"]),
  number_document: z.string().nonempty(),
  business_name: z.string().optional(),
  names: z.string().nonempty(),
  father_surname: z.string().optional(),
  mother_surname: z.string().optional(),
  address: z.string().nonempty(),
  phone: z
    .string()
    .nonempty("El teléfono es obligatorio")
    .regex(/^\d{9}$/, "El teléfono debe tener 9 dígitos"),
  email: z.string().email(),
})

interface UpdateUserProps {
  onClose: () => void;
  user: UserItem;
}
export default function UpdateUserPage({ onClose, user }: UpdateUserProps) {
  const form = useForm<z.infer<typeof UserSchema>>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      username: user.username ?? "",
      password: "",
      rol_id: user.rol_id.toString(), // change on API
      type_document: user.person.type_document ?? "",
      type_person: user.person.type_person ?? "",
      number_document: user.person.number_document ?? "",
      names: user.person.names ?? "",
      business_name: user.person.business_name ?? "",
      father_surname: user.person.father_surname ?? "",
      mother_surname: user.person.mother_surname ?? "",
      address: user.person.address ?? "",
      phone: user.person.phone ?? "",
      email: user.person.email ?? "",
    },
  })

  const [isLoading, setIsLoading] = useState(false)

  const { roles, loading, loadRoles } = useRolStore()

  useEffect(() => {
    loadRoles(1)
  }, [])

  useEffect(() => {
    const typePerson = form.getValues("type_person")
    if (typePerson) {
      if (typePerson === "NATURAL") {
        form.setValue("type_document", "DNI")
      } else {
        form.setValue("type_document", "RUC")
      }
      if (typePerson === "NATURAL") {
        form.setValue("business_name", "")
      } else {
        form.setValue("names", "")
        form.setValue("father_surname", "")
        form.setValue("mother_surname", "")
      }
    }
  }, [form.watch("type_person")])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      const data = form.getValues()
      await updateUser(user.id, data)
      successToast("Usuario actualizado correctamente")
      setIsLoading(false)
    } catch (error) {
      errorToast("Ocurrió un error al actualizar el usuario")
    }
    onClose()
  }

  const handleSearchPerson = async () => {
    try {
      const typeDocument = form.getValues("type_document")
      const number_document = form.getValues("number_document")
      let person = null
      if (typeDocument === "DNI") {
        person = await searchPersonByDNI(number_document)
        form.setValue("names", person.nombres)
        form.setValue("father_surname", person.apepat)
        form.setValue("mother_surname", person.apemat)
      } else if (typeDocument === "RUC") {
        person = await searchPersonByRUC(number_document)
        form.setValue("business_name", person.RazonSocial)
        form.setValue("names", person.RazonSocial)
        form.setValue("address", person.Direccion)
      } else {
        return
      }
      if (person.code === 9) {
        errorToast("No se encontró la persona")
      }
    } catch (error) {
      errorToast("No se encontró la persona")
    }
  }

  const typeDocumentOptions = form.getValues("type_person") === "NATURAL" ? ["DNI", "CE"] : ["RUC"]

  if (loading) {
    return (
      <div className="flex flex-col gap-6 p-6 bg-secondary">
        <Skeleton className="w-full h-4"></Skeleton>
        <Skeleton className="w-full h-4"></Skeleton>
        <Skeleton className="w-full h-4"></Skeleton>
        <Skeleton className="w-full h-4"></Skeleton>
        <Skeleton className="w-full h-4"></Skeleton>
        <Skeleton className="w-full h-4"></Skeleton>
        <Skeleton className="w-full h-4"></Skeleton>
      </div>
    )
  }

  return (
    <div className="bg-secondary p-6">
      <div className="flex flex-col gap-6 ">
        <Form {...form}>
          <form onSubmit={handleSubmit}>
            <div className="flex gap-6">
              {/* Left Section */}
              <div className="w-72 space-y-4 rounded-lg bg-secondary p-4 text-sm">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-normal font-poopins">Usuario</FormLabel>
                      <FormControl>
                        <Input
                          className="border-[#9A7FFF] focus:border-[#9A7FFF] focus:ring-[#9A7FFF] font-poopins"
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
                      <FormLabel className="text-sm font-normal">Contraseña (opcional)</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          className="border-[#9A7FFF] focus:border-[#9A7FFF] focus:ring-[#9A7FFF] font-poopins"
                          placeholder="Dejar en blanco para no cambiar"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rol_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-normal">Roles</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-[#9A7FFF] focus:border-[#9A7FFF] focus:ring-[#9A7FFF] font-poopins">
                            <SelectValue placeholder="Seleccione tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {roles.map((rol) => (
                            <SelectItem key={rol.id} value={rol.id.toString()}>
                              {rol.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Right Section */}
              <div className="flex-1 space-y-4 rounded-lg bg-secondary p-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="type_person"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-normal">Tipo de persona</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-[#9A7FFF] focus:border-[#9A7FFF] focus:ring-[#9A7FFF] font-poopins">
                              <SelectValue placeholder="Seleccione tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="NATURAL">NATURAL</SelectItem>
                            <SelectItem value="JURIDICA">JURIDICA</SelectItem>
                          </SelectContent>
                        </Select>
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
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-[#9A7FFF] focus:border-[#9A7FFF] focus:ring-[#9A7FFF] font-poopins">
                              <SelectValue placeholder="Seleccione documento" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {typeDocumentOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
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
                    name="number_document"
                    render={({ field }) => (
                      <FormItem className="relative">
                        <FormLabel className="text-sm font-normal">Número de documento</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              className="border-[#9A7FFF] focus:border-[#9A7FFF] focus:ring-[#9A7FFF] font-poopins"
                              placeholder="Número de documento"
                              maxLength={
                                form.getValues("type_document") === "DNI"
                                  ? 8
                                  : form.getValues("type_document") === "RUC"
                                    ? 11
                                    : 15
                              }
                              {...field}
                            />
                            <button
                              type="button"
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-purple-500"
                              onClick={handleSearchPerson}
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
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-normal">Dirección</FormLabel>
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
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-normal">E-mail</FormLabel>
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

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-normal">Teléfono</FormLabel>
                        <FormControl>
                          <Input
                            className="border-[#9A7FFF] focus:border-[#9A7FFF] focus:ring-[#9A7FFF] font-poopins"
                            placeholder="Teléfono"
                            maxLength={9}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.getValues("type_person") === "NATURAL" ? (
                    <>
                      <FormField
                        control={form.control}
                        name="names"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-normal">Nombres</FormLabel>
                            <FormControl>
                              <Input
                                className="border-[#9A7FFF] focus:border-[#9A7FFF] focus:ring-[#9A7FFF] font-poopins"
                                placeholder="Nombres"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="father_surname"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-normal">Apellido Paterno</FormLabel>
                            <FormControl>
                              <Input
                                className="border-[#9A7FFF] focus:border-[#9A7FFF] focus:ring-[#9A7FFF] font-poopins"
                                placeholder="Apellido Paterno"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="mother_surname"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-normal">Apellido Materno</FormLabel>
                            <FormControl>
                              <Input
                                className="border-[#9A7FFF] focus:border-[#9A7FFF] focus:ring-[#9A7FFF] font-poopins"
                                placeholder="Apellido Materno"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  ) : (
                    <FormField
                      control={form.control}
                      name="business_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-normal">Razón Social</FormLabel>
                          <FormControl>
                            <Input
                              className="border-[#9A7FFF] focus:border-[#9A7FFF] focus:ring-[#9A7FFF] font-poopins"
                              placeholder="Razón Social"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <DialogFooter>
                <Button
                  variant="outline"
                  type="button"
                  onClick={onClose}
                  className="bg-foreground text-secondary font-inter hover:bg-foreground/95 hover:text-secondary text-sm"
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading} className="bg-[#6366f1] hover:bg-[#818cf8]">
                  Actualizar
                </Button>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

