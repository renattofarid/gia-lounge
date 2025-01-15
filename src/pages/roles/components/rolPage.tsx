import Layout from "@/components/layouts/layout";
import { useRolStore } from "../lib/rol.store";
import { useEffect, useState } from "react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PermissionsDialog from "./permissionsAdd";
import CreateRolPage from "./rolAdd";
import DeleteDialog from "@/components/delete-dialog";
import { RolItem } from "../lib/rol.interface";
import { deleteRol } from "../lib/rol.actions";
import { errorToast, successToast } from "@/lib/core.function";

export default function RolPage() {
  const options = [
    { name: "Usuarios", link: "/usuarios" },
    { name: "Roles", link: "/usuarios/roles" },
    { name: "Permisos", link: "/usuarios/permisos" },
  ];

  // STORE
  const { roles, loadRoles } = useRolStore();

  // STATE
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [roleSelected, setRoleSelected] = useState({} as RolItem);
  const [idSelected, setIdSelected] = useState(0);

  const handleClose = () => {
    setIsAddDialogOpen(false);
    loadRoles(1);
  };

  const handleUpdateClose = () => {
    setIsUpdateDialogOpen(false);
    loadRoles(1);
  };

  const handleClickDelete = (id: number) => {
    setIsDeleteDialogOpen(true);
    setIdSelected(id);
  };

  const handleDelete = async () => {
    try {
      await deleteRol(idSelected).then(() => {
        setIsDeleteDialogOpen(false);
        successToast("Rol eliminado correctamente");
        loadRoles(1);
      });
    } catch (error) {
      errorToast("Error al eliminar el rol");
    }
  };

  const handleClickUpdate = (rol: RolItem) => {
    setRoleSelected(rol);
    setIsUpdateDialogOpen(true);
  };

  useEffect(() => {
    loadRoles(1);
  }, [loadRoles]);

  return (
    <Layout options={options}>
      <div className="flex w-full justify-center items-center">
        <div className="flex flex-col gap-4 w-full justify-between items-center mb-6 px-4 max-w-screen-2xl">
          <div className="flex flex-col sm:flex-row w-full gap-2">
            <div className="w-full flex flex-col">
              <h1 className="text-2xl font-bold font-inter">Roles</h1>
              <p className="text-gray-500 font-inter text-sm">
                Gestionar todos los roles de la empresa.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-end items-center gap-2 w-full">
              <div className="flex gap-2 flex-col sm:flex-row w-full justify-end">
                <div className="flex gap-2">
                  <Input
                    placeholder="Buscar rol..."
                    className="sm:w-[300px] font-poopins text-sm"
                  />
                  <Button
                    size="icon"
                    className="bg-black hover:bg-gray-800 text-white min-w-9 h-9"
                  >
                    <Search className="min-w-4 min-h-4 text-white" />
                  </Button>
                </div>
                <Dialog
                  open={isAddDialogOpen}
                  onOpenChange={setIsAddDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      className="bg-violet-500 hover:bg-violet-600 font-inter"
                      onClick={() => setIsAddDialogOpen(true)}
                    >
                      Agregar Rol
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="p-6">
                    <DialogHeader>
                      <DialogTitle className="font-inter">
                        Agregar Rol
                      </DialogTitle>
                    </DialogHeader>
                    <CreateRolPage onClose={handleClose} />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
          <div className="rounded-lg w-full">
            <Table className="">
              <TableHeader>
                <TableRow>
                  <TableHead className="font-inter text-base text-foreground text-center p-2">
                    Nombre
                  </TableHead>
                  <TableHead className="font-inter text-base text-foreground text-center p-2">
                    Opciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((rol) => (
                  <TableRow key={rol.id}>
                    <TableCell className="font-inter py-2 px-2 text-sm">
                      <strong>{rol.name}</strong>
                    </TableCell>
                    <TableCell className="font-inter py-2 px-2 text-sm">
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
                            onClick={() => handleClickUpdate(rol)}
                          >
                            <span className="font-inter">Editar</span>
                          </DropdownMenuItem>

                          {/* Permisos */}
                          <DropdownMenuItem className="flex items-center space-x-2 hover:bg-gray-100 cursor-pointer">
                            <span>Permisos</span>
                          </DropdownMenuItem>

                          {/* Eliminar opción */}
                          <DropdownMenuItem
                            className="flex items-center space-x-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleClickDelete(rol.id)}
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
          </div>
          <DeleteDialog
            isOpen={isDeleteDialogOpen}
            onConfirm={handleDelete}
          />
        </div>
      </div>
    </Layout>
  );
}
