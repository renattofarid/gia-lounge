import {
  Home,
  ChevronLeft,
  User,
  Settings,
  Drama,
  Calendar,
  Gift,
} from "lucide-react";

export interface MenuItem {
  id: number;
  name: string;
  icon: string;
  link: string;
}

export const iconComponents: Record<string, any> = {
  Home,
  ChevronLeft,
  User,
  Settings,
  Drama,
  Calendar,
  Gift,
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
  },
  {
    id: 4,
    name: "Ajustes",
    icon: "Settings",
    link: "/",
  },
  {
    id: 5,
    name: "Eventos",
    icon: "Drama",
    link: "/",
  },
  {
    id: 6,
    name: "Reservas",
    icon: "Calendar",
    link: "/",
  },
  {
    id: 7,
    name: "Sorteos",
    icon: "Gift",
    link: "/",
  },
];
