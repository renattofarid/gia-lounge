"use client";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { iconComponents, menuItems } from "@/lib/constants/menu";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { IconWithTooltip } from "./IconWithTooltip";

export function AppSidebar() {
  const navigate = useNavigate();
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const handleNavigate = (item: { name: string; link: string }) => {
    if (item.name === "Regresar") {
      navigate(-1);
    } else {
      navigate(item.link);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
  };

  if (!mounted) {
    return null;
  }

  return (
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
            <Icon className="min-w-5 min-h-5" to />
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

          {/* <Moon className="h-5 w-5" /> */}
        </Button>

        <Button
          size="icon"
          variant={resolvedTheme === "light" ? "default" : "ghost"}
          className="rounded-full h-10 w-10"
          onClick={() => toggleTheme("light")}
        >
          <Sun className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
