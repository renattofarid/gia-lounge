"use client";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { iconComponents, menuItems } from "@/lib/constants/menu";

export function AppSidebar() {
  const navigate = useNavigate();
  const handleNavigate = (link: string) => {
    navigate(link);
  };

  return (
    <div className="hidden sm:flex sm:flex-col min-w-24 p-4 justify-center items-center gap-4">
      {menuItems.map((item, index) => {
        const Icon = iconComponents[item.icon];
        return (
          <Button
            key={index}
            size="icon"
            className="bg-primary/60 rounded-full h-10 w-10"
            onClick={() => handleNavigate(item.link)}
          >
            <Icon className="min-w-5 min-h-5" />
          </Button>
        );
      })}
    </div>
  );
}
