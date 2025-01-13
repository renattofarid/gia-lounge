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

  const handleClose = () => {
    setIsAddDialogOpen(false);
  };

  useEffect(() => {
    loadUsers(1);
  }, [loadUsers]);

  return (
    <Layout options={options}>
      <div className="grid grid-cols-2 grid-rows-2 gap-4 w-full justify-between items-center mb-6 px-4">
        <div>
          <h1 className="text-2xl font-bold font-inter">Usuarios</h1>
          <p className="text-gray-500 font-inter text-sm">
            Gestionar todos los usuarios.
          </p>
        </div>
        <div className="flex justify-end gap-2 w-full">
          <div className="flex gap-2">
            <Input
              placeholder="Busqueda ..."
              className="w-[300px] font-poopins text-sm"
            />
            <Button size="icon" className="bg-black hover:bg-gray-800 text-white ">
              <Search className="w-4 h-4 text-white" />
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
        <div className="rounded-lg col-span-2">
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
                      <IdCard className="w-5 h-5" /> {user.person.type_document}
                    </div>
                    <div className="ps-7">{user.person.number_document}</div>
                    <div className="flex gap-2 justify-start items-center font-bold">
                      <Phone className="w-5 h-5" /> {user.person.phone}
                    </div>
                    {/* <div className="ps-7">{user.person.number_document}</div> */}
                  </TableCell>
                  <TableCell className="font-inter  py-2 px-2 text-sm">
                    {user.rol.name}
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
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
}
