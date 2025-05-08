import { editSettingPercent, editSettingTime } from "./configuration.actions"

export const updateSettingByType = async (name: string, data: any) => {
  console.log("Actualizando configuración:", name, data)

  switch (name) {
    case "Tiempo de Reserva":
      console.log("Editando tiempo de reserva")
      return await editSettingTime(data)
    case "Porcentaje Descuento Producto":
      console.log("Editando porcentaje de descuento")
      return await editSettingPercent(data)
    default:
      console.error("Tipo de configuración no soportado:", name)
      throw new Error(`Tipo de configuración no soportado: ${name}`)
  }
}
