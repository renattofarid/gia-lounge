"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useNavigate } from "react-router-dom";

import { Moon, Sun, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { IconWithTooltip } from "@/components/IconWithTooltip";

import { iconComponents, menuItems } from "@/lib/menu";
import { useAuthStore } from "@/pages/auth/lib/auth.store";
import { errorToast } from "@/lib/core.function";

export function AppSidebar() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();
  const { permisos } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNavigate = (item: {
    name: string;
    link: string;
    permissions?: { name: string; type: string; link: string }[];
  }) => {
    if (item.name === "Regresar") {
      navigate(-1);
    } else if (item.permissions) {
      const allowedOptions = item.permissions.filter((permission) =>
        permisos.some(
          (p) => p.name === permission.name && p.type === permission.type
        )
      );
      if (allowedOptions.length > 0) {
        navigate(allowedOptions[0].link);
      } else {
        errorToast("No tienes permisos para acceder a esta sección.");
      }
    } else {
      navigate(item.link);
    }
  };

  const toggleTheme = (theme: "light" | "dark") => setTheme(theme);

  if (!mounted) return null;

  return (
    <>
      {/* Sidebar para desktop */}
      <div className="hidden sm:flex sm:flex-col min-w-24 p-4 justify-center items-center gap-4">
        {menuItems.map((item, index) => {
          const Icon = iconComponents[item.icon];
          return (
            <Button
              key={index}
              size="icon"
              className="bg-primary/60 rounded-full h-10 w-10"
              onClick={() => handleNavigate(item)}
            >
              <Icon className="min-w-5 min-h-5" />
            </Button>
          );
        })}

        <div className="pt-12 flex flex-col gap-4">
          <Button
            size="icon"
            variant={resolvedTheme === "dark" ? "default" : "ghost"}
            className="rounded-full h-10 w-10"
            onClick={() => toggleTheme("dark")}
          >
            <IconWithTooltip icon={Moon} label="Modo oscuro" />
          </Button>
          <Button
            size="icon"
            variant={resolvedTheme === "light" ? "default" : "ghost"}
            className="rounded-full h-10 w-10"
            onClick={() => toggleTheme("light")}
          >
            <IconWithTooltip icon={Sun} label="Modo claro" />
          </Button>
        </div>
      </div>

      {/* Menú móvil */}
      <div className="fixed top-4 left-4 sm:hidden z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="secondary" size="icon">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-4 w-52 max-w-xs">
            <div className="flex flex-col gap-4">
              {menuItems.map((item, index) => {
                const Icon = iconComponents[item.icon];
                return (
                  <Button
                    key={index}
                    variant="ghost"
                    className="justify-start font-poopins text-sm font-normal text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => handleNavigate(item)}
                  >
                    <Icon className="mr-2 w-5 h-5" />
                    {item.name}
                  </Button>
                );
              })}
            </div>
            <div className="flex flex-col gap-2 mt-32 pb-2 absolute bottom-0 ">
              <Button
              variant={resolvedTheme === "dark" ? "default" : "ghost"}
              onClick={() => toggleTheme("dark")}
              className="flex items-center justify-start p-3 py-2 rounded-md"
              >
              <Moon className="mr-2 w-5 h-5" /> Modo oscuro
              </Button>
              <Button
              variant={resolvedTheme === "light" ? "default" : "ghost"}
              onClick={() => toggleTheme("light")}
              className="flex items-center justify-start px-3 py-2 rounded-md"
              >
              <Sun className="mr-2 w-5 h-5" /> Modo claro
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
