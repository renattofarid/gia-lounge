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
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  MoreVertical,
  Phone,
  Search,
  SquareUser,
  Table,
  User2,
} from "lucide-react";
import { useState } from "react";
import { User } from "../service/user.interface";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function UsersPage() {
  const initialUsers: User[] = [
    {
      id: 1,
      name: "Noely Moscol Montestroque",
      email: "noely.admin@gmail.com",
      dni: "71074593",
      phone: "954677030",
      role: "Administrador",
    },
    {
      id: 2,
      name: "Lupita Vásquez Ramírez",
      email: "lupitavip@gmail.com",
      dni: "71074593",
      phone: "954677030",
      role: "Cajera",
    },
  ];

  const [users] = useState<User[]>(initialUsers);

  //VARIABLES DE ESTADO
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-semibol font-inter">Usuarios</h1>
        <p className="text-gray-500 font-inter">Gestionar todos los usuarios</p>
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
              <DialogTitle className="font-inter">Crear usuario</DialogTitle>
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
          <Button className="bg-violet-500 hover:bg-violet-600">
            <Search className="w-4 h-4 text-gray-500" />
          </Button>
        </div>
      </div>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-inter text-base">Usuarios</TableHead>
              <TableHead className="font-inter text-base">Nombres</TableHead>
              <TableHead className="font-inter text-base">Datos</TableHead>
              <TableHead className="font-inter text-base">Rol</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-violet-100 flex items-center justify-center">
                      <User2 className="w-5 h-5 text-violet-500" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">{user.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-inter">{user.name}</TableCell>
                <TableCell className="font-inter">
                  <div className="flex flex-col">
                    <SquareUser />
                    <span>DNI: {user.dni}</span>
                    <Phone />
                    <span>Tel: {user.phone}</span>
                  </div>
                </TableCell>
                <TableCell className="font-inter">{user.role}</TableCell>
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
                        {/* <Pencil className="h-4 w-4 text-[--lightblue]" /> */}
                        <span className="font-inter">Editar</span>
                      </DropdownMenuItem>

                      {/* Eliminar opción */}
                      <DropdownMenuItem
                        className="flex items-center space-x-2 hover:bg-gray-100 cursor-pointer"
                        // onClick={() => handleClickDelete(sparepartId)}
                      >
                        {/* <Trash2 className="h-4 w-4 text-[--ligthPink]" /> */}
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
  );
}
