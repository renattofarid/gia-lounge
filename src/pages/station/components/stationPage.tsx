import { useEffect, useState } from "react";
import Layout from "@/components/layouts/layout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Hash, MoreVertical } from "lucide-react";
import { useParams } from "react-router-dom";
import { useStationStore } from "../lib/station.store";
import { StationItem } from "../lib/station.interface";
import DeleteDialog from "@/components/delete-dialog";
import CreateStation from "./addStation";
import { deleteStation } from "../lib/station.actions";
import { errorToast, successToast } from "@/lib/core.function";
import UpdateStation from "./updateStation";
import SkeletonTable from "@/components/skeleton-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
// import { useNavigate } from "react-router-dom";

export default function StationPage() {
  const { environmentId } = useParams<{ environmentId: string }>();
  const { stations, loadStations, loading } = useStationStore();

  const [stationUpdate, setStationUpdate] = useState<StationItem>(
    {} as StationItem
  );
  const [idDeleteSelected, setIdDeleteSelected] = useState<number>(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    loadStations(1, environmentId ? Number(environmentId) : undefined);
  }, [loadStations, environmentId]);

  const options = [
    { name: "Empresas", link: "/empresas" },
    { name: "Salones", link: "/empresas/salones" },
    { name: "Mesas/Box", link: "/empresas/mesas" },
  ];

  const handleClickUpdate = (station: StationItem) => {
    setStationUpdate(station);
    setIsUpdateDialogOpen(true);
  };

  const handleClickDelete = (id: number) => {
    setIsDeleteDialogOpen(true);
    setIdDeleteSelected(id);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
    loadStations(1, environmentId ? Number(environmentId) : undefined);
  };

  const handleDelete = () => {
    deleteStation(idDeleteSelected)
      .then(() => {
        loadStations(1, environmentId ? Number(environmentId) : undefined);
        setIsDeleteDialogOpen(false);
        successToast("Mesa eliminado correctamente");
      })
      .catch(() => {
        errorToast("Error al eliminar el salón");
      });
  };

  const handleUpdateClose = () => {
    setIsUpdateDialogOpen(false);
    loadStations(1, environmentId ? Number(environmentId) : undefined);
  };

  return (
    <Layout options={options}>
      {loading ? (
        <SkeletonTable />
      ) : (
        <div className="flex flex-col items-center w-full py-6 px-4 max-w-screen-2xl">
          {/* Encabezado */}
          <div className="w-full flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold font-inter">Mesas</h1>
              <p className="text-gray-500 text-base font-inter">
                Gestione las mesas de la empresa seleccionada.
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-violet-500 hover:bg-violet-600 font-inter">
                  Agregar mesa
                </Button>
              </DialogTrigger>
              <DialogContent className="p-6 max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Agregar Mesa</DialogTitle>
                  <DialogDescription>
                    Gestione los mesas de la empresa seleccionada.
                  </DialogDescription>
                </DialogHeader>
                <CreateStation
                  environmentId={Number(environmentId)}
                  onClose={handleClose}
                />
              </DialogContent>
            </Dialog>
          </div>

          {/* Lista de Mesas */}
          <Table className="">
            <TableHeader>
              <TableRow>
                <TableHead className="font-inter text-base text-foreground text-star p-2">
                  Nombre
                </TableHead>
                <TableHead className="font-inter text-base text-foreground text-center p-2">
                  Tipo
                </TableHead>
                <TableHead className="font-inter text-base text-foreground text-center p-2">
                  Estado
                </TableHead>
                <TableHead className="font-inter text-base text-foreground text-center p-2">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stations.map((station) => (
                <TableRow key={station.id}>
                  <TableCell className="font-inter py-2 px-2 text-sm flex gap-2 items-center">
                    {/* {station.route ? (
                      <img
                        src={station.route}
                        alt="Avatar"
                        className="w-8 h-8 rounded-lg"
                      />
                    ) : (
                      // <img
                      //   src="/logo.jpg"
                      //   alt="Avatar"
                      //   className="w-8 h-8 rounded-lg"
                      // /> */}
                        <Hash className="w-3 h-4" />
                    {/* )} */}
                    {station.name}
                  </TableCell>
                  <TableCell className="font-inter text-center py-2 px-2 text-sm">
                    <Badge>{station.type}</Badge>
                  </TableCell>
                  <TableCell className="font-inter text-center py-2 px-2 text-sm">
                    <Badge
                      className={`${
                        station.status === "Reservado"
                          ? "text-[#FC6C28] bg-[#FFC8AE8F] hover:bg-[#FFC8AE]"
                          : station.status === "Disponible"
                          ? "text-[#96C451] bg-[#E5FFBD99] hover:bg-[#E5FFBD]"
                          : "text-[#E84747] bg-[#FFA5A54F] hover:bg-[#FFA5A5]"
                      }`}
                    >
                      {station.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-inter text-center py-2 px-2 text-sm">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="bg-transparent hover:bg-gray-100"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-48">
                        {/* Editar opción */}
                        <DropdownMenuItem
                          className="flex items-center space-x-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleClickUpdate(station)}
                        >
                          <span className="font-inter">Editar</span>
                        </DropdownMenuItem>

                        {/* Eliminar opción */}
                        <DropdownMenuItem
                          className="flex items-center space-x-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleClickDelete(station.id)}
                        >
                          <span>Eliminar</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Dialog
            open={isUpdateDialogOpen}
            onOpenChange={setIsUpdateDialogOpen}
          >
              <DialogContent className="p-6 max-w-3xl">
              <DialogHeader>
                <DialogTitle className="font-inter">
                  Actualizar Mesa
                </DialogTitle>
                <DialogDescription />
              </DialogHeader>
              <UpdateStation
                environmentId={Number(environmentId)}
                onClose={handleUpdateClose}
                station={stationUpdate}
              />
            </DialogContent>
          </Dialog>

          <DeleteDialog
            isOpen={isDeleteDialogOpen}
            onConfirm={handleDelete}
            onCancel={() => setIsDeleteDialogOpen(false)}
          />
        </div>
      )}
    </Layout>
  );
}
