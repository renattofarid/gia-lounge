// import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Badge } from "@/components/ui/badge"
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
        <p className="text-gray-500 font-poopins">No hay reserva activa para esta mesa</p>
      </div>
    )
  }

  return (
    <div className="">
      <div className="flex justify-between items-center">
        <div>
          {/* <Badge variant="secondary" className="mt-2 text-sm"> 
            Fecha de reserva: {format(new Date(station.date_reservation), "dd/MM/yyyy HH:mm")}
          </Badge> */}
          {/* <Badge variant="outline" className="mt-2">
            {station.reservation.nroPeople} personas
          </Badge> */}
        </div>
        {/* <Badge
          className={
            station.status === "Reservado"
              ? "bg-[#FFC8AE8F] text-[#FC6C28]"
              : station.status === "Disponible"
                ? "bg-[#E5FFBD99] text-[#96C451]"
                : "bg-[#FFA5A54F] text-[#E84747]"
          }
        >
          {station.status}
        </Badge> */}
      </div>
      <div className="bg-secondary rounded-lg p-4 mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-sm font-poopins font-semibold ">Nombres</TableHead>
            <TableHead className="font-sm font-poopins font-semibold">Apellidos</TableHead>
            <TableHead className="font-sm font-poopins font-semibold">DNI</TableHead>
            <TableHead className="font-sm font-poopins font-semibold">Teléfono</TableHead>
            <TableHead className="font-sm font-poopins font-semibold">E-mail</TableHead>
            <TableHead className="font-sm font-poopins font-semibold">N° de 
              <br/>
              personas</TableHead>
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
            <TableCell>{station.reservation.nro_people}</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      </div>
      

      <div className="flex justify-end pt-4">
        <Button variant="default" onClick={onClose} className="w-24">
          Cerrar
        </Button>
      </div>
    </div>
  )
}

