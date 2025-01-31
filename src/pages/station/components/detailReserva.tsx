import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { StationItem } from "../lib/station.interface"

interface ReservationDetailsProps {
  station: StationItem
  onClose: () => void
}

export function ReservationDetails({ station, onClose }: ReservationDetailsProps) {
  if (!station.reservation) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No hay reserva activa para esta mesa</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-muted-foreground">
            Fecha de reserva: {format(new Date(station.date_reservation), "dd/MM/yyyy HH:mm")}
          </p>
          <Badge variant="outline" className="mt-2">
            {station.reservation.nroPeople} personas
          </Badge>
        </div>
        <Badge
          className={
            station.status === "Reservado"
              ? "bg-[#FFC8AE8F] text-[#FC6C28]"
              : station.status === "Disponible"
                ? "bg-[#E5FFBD99] text-[#96C451]"
                : "bg-[#FFA5A54F] text-[#E84747]"
          }
        >
          {station.status}
        </Badge>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombres</TableHead>
            <TableHead>Apellidos</TableHead>
            <TableHead>DNI</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>E-mail</TableHead>
            <TableHead>N° de personas</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>{station.reservation.person.names}</TableCell>
            <TableCell>
              {`${station.reservation.person.father_surname} ${station.reservation.person.mother_surname}`}
            </TableCell>
            <TableCell>{station.reservation.person.number_document}</TableCell>
            <TableCell>{station.reservation.person.phone}</TableCell>
            <TableCell>{station.reservation.person.email}</TableCell>
            <TableCell>{station.reservation.nroPeople}</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <div className="flex justify-end">
        <Button variant="outline" onClick={onClose} className="w-24">
          Cerrar
        </Button>
      </div>
    </div>
  )
}

