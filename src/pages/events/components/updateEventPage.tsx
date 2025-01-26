"use client"

import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { DialogFooter } from "@/components/ui/dialog"
import { errorToast, successToast } from "@/lib/core.function"
import { Skeleton } from "@/components/ui/skeleton"
import { useState } from "react"
import { useEventStore } from "../lib/event.store"
import { updateEvent } from "../lib/event.actions"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, parse } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import type { EventItem } from "../lib/event.interface"

const EventSchema = z.object({
  name: z.string().nonempty("El nombre es obligatorio"),
  comment: z.string().optional(),
  event_datetime: z.date(),
})

interface UpdateEventProps {
  event: EventItem
  onClose: () => void
}

export default function UpdateEventPage({ event, onClose }: UpdateEventProps) {
  // Parse the date string to a Date object for the form
  const parsedDate = parse(event.event_datetime, "yyyy-MM-dd", new Date())

  const form = useForm<z.infer<typeof EventSchema>>({
    resolver: zodResolver(EventSchema),
    defaultValues: {
      name: event.name,
      comment: event.comment || "",
      event_datetime: parsedDate,
    },
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const { loading } = useEventStore()

  const handleFormSubmit = async (data: z.infer<typeof EventSchema>) => {
    try {
      const formattedDate = format(data.event_datetime, "yyyy-MM-dd")
      const payload = {
        ...data,
        event_datetime: formattedDate,
        status: event.status, // Mantener el estado actual
      }

      setIsSubmitting(true)
      await updateEvent(event.id, payload)
      successToast("Evento actualizado correctamente")
      onClose()
    } catch (error: any) {
      console.error("Error al actualizar:", error)
      const errorMessage = error?.response?.data?.message || "Ocurrió un error al actualizar el evento"
      errorToast(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6 p-6 bg-secondary">
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-full h-4" />
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="flex flex-col gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="w-full space-y-4 rounded-lg bg-secondary p-4 text-sm">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-normal font-poopins">Nombre</FormLabel>
                      <FormControl>
                        <Input
                          className="border-[#9A7FFF] focus:border-[#9A7FFF] focus:ring-[#9A7FFF] font-poopins"
                          placeholder="Nombre del evento"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="comment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-normal font-poopins">Comentario</FormLabel>
                      <FormControl>
                        <Textarea
                          className="border-[#9A7FFF] focus:border-[#9A7FFF] focus:ring-[#9A7FFF] font-poopins"
                          placeholder="Comentario"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="event_datetime"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="text-sm font-normal font-poopins">Fecha</FormLabel>
                      <Popover>
                        <PopoverTrigger className="h-9" asChild>
                          <FormControl>
                            <Button className="w-full bg-secondary border-[#9A7FFF]" variant="outline">
                              {field.value ? format(field.value, "dd/MM/yyyy") : <span>Seleccionar fecha</span>}
                              <CalendarIcon className="ml-auto h-4 w-4" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={`bg-[#818cf8] hover:bg-[#6366f1] ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {isSubmitting ? "Actualizando..." : "Actualizar"}
                </Button>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

