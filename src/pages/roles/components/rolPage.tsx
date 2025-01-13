import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreVertical, Search } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PermissionsDialog from "./permissionsAdd";
import Layout from "@/components/layouts/layout";

interface Rol {
  id: number;
  name: string;
  date: string;
}

export default function RolPage() {
  const options = [
    { name: "Usuarios", link: "/usuarios" },
    { name: "Roles", link: "/usuarios/roles" },
    { name: "Permisos", link: "/usuarios/permisos" },
  ];

  const initialRol: Rol[] = [
    {
      id: 1,
      name: "Rol 1",
      date: "2021-10-10",
    },
    {
      id: 2,
      name: "Rol 2",
      date: "2021-10-10",
    },
  ];

  const [rols] = useState<Rol[]>(initialRol);

  //VARIABLES DE ESTADO
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <Layout options={options}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibol font-inter">Roles</h1>
          <p className="text-gray-500 font-inter">
            Gestionar rol de los usuarios
          </p>
        </div>
        <div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-violet-500 hover:bg-violet-600 font-inter">
                Agregar usuario
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="font-inter">Agregar Rol</DialogTitle>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <Input
              placeholder="Buscar usuario..."
              className="w-[300px] font-poopins"
            />
            <Button className="">
              <Search className="w-4 h-4 text-white" />
            </Button>
          </div>
        </div>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-inter text-base">Nombre</TableHead>
                <TableHead className="font-inter text-base">
                  Fecha de actualizacion
                </TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rols.map((rol) => (
                <TableRow key={rol.id}>
                  <TableCell className="font-inter">{rol.name}</TableCell>

                  <TableCell className="font-inter">{rol.date}</TableCell>
                  <TableCell className="flex justify-center items-center">
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
                          // onClick={() => handleClickUpdate(sparepartId)}
                        >
                          <span className="font-inter">Editar</span>
                        </DropdownMenuItem>

                        {/* Permisos */}
                        <DropdownMenuItem className="flex items-center space-x-2 hover:bg-gray-100 cursor-pointer">
                          <span>Permisos</span>
                        </DropdownMenuItem>

                        {/* Eliminar opción */}
                        <DropdownMenuItem className="flex items-center space-x-2 hover:bg-gray-100 cursor-pointer">
                          <span>Eliminar</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {/* Dialogo de permisos */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Abrir Permisos</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Permisos</DialogTitle>
                  </DialogHeader>
                  <PermissionsDialog />
                </DialogContent>
              </Dialog>
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
}
