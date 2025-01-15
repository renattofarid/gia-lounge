import Layout from "@/components/layouts/layout";
import { useUserStore } from "../lib/user.store";
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
import { IdCard, MoreVertical, Phone, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CreateUserPage from "./addUser";
import { Badge } from "@/components/ui/badge";
import UpdateUserPage from "./updateUser";
import { UserItem } from "../lib/user.interface";
import { DialogDescription } from "@radix-ui/react-dialog";
import DeleteDialog from "@/components/delete-dialog";
import { deleteUser } from "../lib/user.actions";
import { errorToast, successToast } from "@/lib/core.function";

export default function UserPage() {
  const options = [
    { name: "Usuarios", link: "/usuarios" },
    { name: "Roles", link: "/usuarios/roles" },
    { name: "Permisos", link: "/usuarios/permisos" },
  ];

  // STORE
  const { users, loadUsers } = useUserStore();

  // STATE
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [userSelected, setUserSelected] = useState({} as UserItem);
  const [idSelected, setIdSelected] = useState(0);

  const handleClose = () => {
    setIsAddDialogOpen(false);
    loadUsers(1);
  };

  const handleUpdateClose = () => {
    setIsUpdateDialogOpen(false);
    loadUsers(1);
  };

  const handleClickDelete = (id: number) => {
    setIsDeleteDialogOpen(true);
    setIdSelected(id);
  };

  const handleDelete = async () => {
    try {
      await deleteUser(idSelected).then(() => {
        setIsDeleteDialogOpen(false);
        successToast("Usuario eliminado correctamente");
        loadUsers(1);
      });
    } catch (error) {
      errorToast("Error al eliminar el usuario");
    }
  };

  const handleClickUpdate = (user: UserItem) => {
    setUserSelected(user);
    setIsUpdateDialogOpen(true);
  };

  useEffect(() => {
    loadUsers(1);
  }, [loadUsers]);

  return (
    <Layout options={options}>
      <div className="flex w-full justify-center items-center">
        <div className="flex flex-col gap-4 w-full justify-between items-center mb-6 px-4 max-w-screen-2xl">
          <div className="flex flex-col sm:flex-row w-full gap-2">
            <div className="w-full flex flex-col">
              <h1 className="text-2xl font-bold font-inter">Usuarios</h1>
              <p className="text-gray-500 font-inter text-sm">
                Gestionar todos los usuarios.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-end items-center gap-2 w-full">
              <div className="flex gap-2 flex-col sm:flex-row w-full justify-end">
                <div className="flex gap-2">
                  <Input
                    placeholder="Busqueda ..."
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
                      Agregar usuario
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-5xl p-6">
                    <DialogHeader>
                      <DialogTitle className="font-inter">
                        Agregar Usuario
                      </DialogTitle>
                    </DialogHeader>
                    <CreateUserPage onClose={handleClose} />
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
                    Usuario
                  </TableHead>
                  <TableHead className="font-inter text-base text-foreground text-center p-2">
                    Nombres
                  </TableHead>
                  <TableHead className="font-inter text-base text-foreground text-center p-2">
                    Datos
                  </TableHead>
                  <TableHead className="font-inter text-base text-foreground text-center p-2">
                    Rol
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-inter py-2 px-2 text-sm">
                      <strong>{user.name}</strong>
                      <p>{user.username}</p>
                    </TableCell>

                    <TableCell className="font-inter  py-2 px-2 text-sm">
                      {user.person.names} {user.person.father_surname ?? ""}{" "}
                      {user.person.mother_surname ?? ""}
                    </TableCell>
                    <TableCell className="font-inter py-2 px-4 text-sm">
                      <div className="flex gap-2 justify-start items-center font-bold">
                        <IdCard className="w-5 h-5" />{" "}
                        {user.person.type_document}
                      </div>
                      <div className="ps-7 pb-2">
                        {user.person.number_document}
                      </div>
                      <div className="flex gap-2 justify-start items-center font-bold">
                        <Phone className="w-5 h-5" /> {user.person.phone}
                      </div>
                      {/* <div className="ps-7">{user.person.number_document}</div> */}
                    </TableCell>
                    <TableCell className="font-inter text-center py-2 px-2 text-sm">
                      {typeof user.rol !== "string" && user.rol.name && (
                        <Badge className="rounded-full">{user.rol.name}</Badge>
                      )}
                    </TableCell>
                    <TableCell className="font-inter er py-2 px-2 text-sm">
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
                            onClick={() => handleClickUpdate(user)}
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
                            onClick={() => handleClickDelete(user.id)}
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
        </div>
        <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
          <DialogContent className="max-w-5xl p-6">
            <DialogHeader>
              <DialogTitle className="font-inter">
                Actualizar Usuario
              </DialogTitle>
              <DialogDescription />
            </DialogHeader>
            <UpdateUserPage onClose={handleUpdateClose} user={userSelected} />
          </DialogContent>
        </Dialog>

        <DeleteDialog isOpen={isDeleteDialogOpen} onConfirm={handleDelete} onCancel={() => setIsDeleteDialogOpen(false)} />
      </div>
    </Layout>
  );
}
