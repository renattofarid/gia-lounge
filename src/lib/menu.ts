import {
  Home,
  ChevronLeft,
  User,
  Settings,
  Settings2,
  Drama,
  Calendar,
  Gift,
  Percent,
} from "lucide-react";

export interface MenuItem {
  id: number;
  name: string;
  icon: string;
  link: string;
  permissions?: { name: string; type: string; link: string }[];
}

export const iconComponents: Record<string, any> = {
  Home,
  ChevronLeft,
  User,
  Settings,
  Drama,
  Calendar,
  Gift,
  Settings2,
  Percent
};

export const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Regresar",
    icon: "ChevronLeft",
    link: "/",
  },
  {
    id: 2,
    name: "Inicio",
    icon: "Home",
    link: "/",
  },
  {
    id: 3,
    name: "Usuarios",
    icon: "User",
    link: "/usuarios",
    permissions: [
      { name: "Leer", type: "Usuarios", link: "/usuarios" },
      { name: "Leer Roles", type: "Roles", link: "/usuarios/roles" },
    ],
  },
  {
    id: 4,
    name: "Ajustes",
    icon: "Settings",
    link: "/empresas",
  },
  {
    id: 5,
    name: "Eventos",
    icon: "Drama",
    link: "/empresas/eventos",
  },
  {
    id: 6,
    name: "Sorteos",
    icon: "Gift",
    link: "/empresas/sorteos",
  },
  {
    id: 7,
    name: "Promociones",
    icon: "Percent", 
    link: "/promociones",
  },
  {
    id: 8,
    name: "Configuración",
    icon: "Settings2",
    link: "/configuracion",
  },
];

export const USER_TYPE = "Usuarios";
