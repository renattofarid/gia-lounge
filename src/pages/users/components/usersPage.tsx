'use client'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { MoreVertical, Phone, Search, SquareUser, User2 } from 'lucide-react'
import { useState } from "react"
import { User } from "../service/user.interface"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Layout from "@/pages/home/components/Homepage"
import CreateUserPage from "./addUser"

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
  ]

  const [users] = useState<User[]>(initialUsers)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  return (
    <Layout>
      <div className="flex flex-col gap-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold font-inter">Usuarios</h1>
            <p className="text-gray-500 font-inter">
              Gestionar todos los usuarios
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Buscar usuario..."
                className="w-[300px] font-inter focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-violet-500"
              />
              <Button size="icon" className="bg-black hover:bg-black/80">
                <Search className="h-4 w-4" />
              </Button>
            </div>

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
                <CreateUserPage />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-inter text-base text-black">Usuario</TableHead>
                <TableHead className="font-inter text-base text-black">Nombres</TableHead>
                <TableHead className="font-inter text-base text-black">Datos</TableHead>
                <TableHead className="font-inter text-base text-black">Rol</TableHead>
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
                  <TableCell>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <SquareUser className="h-4 w-4 text-gray-500" />
                        <span className="font-inter">DNI: {user.dni}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="font-inter">Tel: {user.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-inter">{user.role}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-gray-100"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem className="font-inter cursor-pointer">
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="font-inter cursor-pointer text-red-600">
                          Eliminar
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
  )
}

