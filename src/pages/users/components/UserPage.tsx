"use client";

import type React from "react";

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
import {
  IdCardIcon,
  Loader2,
  MoreVertical,
  Phone,
  Search,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CreateUserPage from "./addUser";
import { Badge } from "@/components/ui/badge";
import UpdateUserPage from "./updateUser";
import type { UserItem } from "../lib/user.interface";
import { DialogDescription } from "@radix-ui/react-dialog";
import DeleteDialog from "@/components/delete-dialog";
import { deleteUser } from "../lib/user.actions";
import { errorToast, successToast } from "@/lib/core.function";
import { useHasPermission } from "@/hooks/useHasPermission";
import { useAuthStore } from "@/pages/auth/lib/auth.store";
import { Pagination } from "@/components/pagination";
// import { useAuthStore } from "@/pages/auth/lib/auth.store";
// import { USER_TYPE } from "@/lib/menu";

export default function UserPage() {
  const allOptions = [
    {
      name: "Usuarios",
      link: "/usuarios",
      permission: { name: "Leer", type: "Usuarios", link: "/usuarios" },
    },
    {
      name: "Roles",
      link: "/usuarios/roles",
      permission: {
        name: "Leer Roles",
        type: "Roles",
        link: "/usuarios/roles",
      },
    },
  ];

  const { permisos } = useAuthStore();

  const filteredOptions = allOptions.filter((option) => {
    return permisos.some(
      (p) =>
        p.name === option.permission.name && p.type === option.permission.type
    );
  });

  // STORE
  // const type = USER_TYPE;
  // const { permisos } = useAuthStore();
  const { users, loadUsers, filter, setFilter, meta, links, loading } =
    useUserStore();
  const canCreateUser = useHasPermission("Crear", "Usuarios");
  const canEditUser = useHasPermission("Editar", "Usuarios");
  const canDeleteUser = useHasPermission("Eliminar", "Usuarios");

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

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  const handleSearch = () => {
    loadUsers(1);
  };

  const handlePageChange = (page: number) => {
    loadUsers(page);
  };

  useEffect(() => {
    loadUsers(1);
  }, [loadUsers]);

  return (
    <Layout options={filteredOptions}>
      <div className="flex w-full justify-center items-start h-full">
        <div className="flex flex-col gap-4 w-full justify-between items-center px-4 max-w-screen-2xl h-full">
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
                    value={filter}
                    onChange={handleFilterChange}
                  />
                  <Button
                    size="icon"
                    className="bg-foreground hover:bg-gray-800 text-secondary min-w-9 h-9"
                    onClick={handleSearch}
                  >
                    <Search className="min-w-4 min-h-4 text-secondary" />
                  </Button>
                </div>
                {canCreateUser && (
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
                )}
              </div>
            </div>
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-full w-full">
              <Loader2 className="h-10 w-10 animate-spin text-violet-600" />
            </div>
          ) : (
            <div className="rounded-lg w-full flex flex-col h-full overflow-auto">
              <Table className="flex-grow">
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
                    <TableRow key={user.id} className="text-nowrap">
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
                          <IdCardIcon  className="w-5 h-5" />{" "}
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
                        {user.rol &&
                          typeof user.rol !== "string" &&
                          user.rol.name && (
                            <Badge className="rounded-full">
                              {user.rol.name}
                            </Badge>
                          )}
                      </TableCell>
                      {(canEditUser || canDeleteUser) && (
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
                              {canEditUser && (
                                // Editar opción
                                <DropdownMenuItem
                                  className="flex items-center space-x-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => handleClickUpdate(user)}
                                >
                                  <span className="font-inter">Editar</span>
                                </DropdownMenuItem>
                              )}

                              {canDeleteUser && (
                                // Eliminar opción
                                <DropdownMenuItem
                                  className="flex items-center space-x-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => handleClickDelete(user.id)}
                                >
                                  <span>Eliminar</span>
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-auto">
                <Pagination
                  links={links}
                  meta={meta}
                  onPageChange={handlePageChange}
                />
              </div>
            </div>
          )}
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

        <DeleteDialog
          isOpen={isDeleteDialogOpen}
          onConfirm={handleDelete}
          onCancel={() => setIsDeleteDialogOpen(false)}
        />
      </div>
    </Layout>
  );
}
