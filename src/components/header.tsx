"use client";

// import type React from "react";

import { LogOut, Store, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
// import { useState } from "react";

import { useAuthStore } from "@/pages/auth/lib/auth.store";
import { useComapanyStore } from "@/pages/company/lib/company.store";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
// import { Input } from "./ui/input";
// import { cn } from "@/lib/utils";
import { IconWithTooltip } from "./IconWithTooltip";

export default function Header() {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const { selectCompany } = useComapanyStore();
  // const [isSearching, setIsSearching] = useState(false);

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  // const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   const formData = new FormData(e.currentTarget);
  //   const searchQuery = formData.get("search");
  //   console.log("Searching for:", searchQuery);
  //   // Add your search logic here
  // };

  return (
    <header className="">
      <div className="flex justify-between p-4">
        <img src="/logo.svg" alt="" className="h-10" />
        <div className="flex justify-between gap-2 items-center">
          <div className="relative">
            {/* <form onSubmit={handleSearch} className="flex items-center">
              <div
                className={cn(
                  "relative flex items-center transition-all duration-300 ease-in-out",
                  isSearching ? "w-[200px]" : "w-10"
                )}
              >
                <Input
                  type="search"
                  placeholder="Búsqueda..."
                  name="search"
                  className={cn(
                    "rounded-full bg-gradient-to-r from-pink-400 to-pink-300 border-0 placeholder:text-white text-white focus-visible:ring-0 focus-visible:ring-offset-0 transition-all duration-300",
                    !isSearching && "cursor-pointer",
                    "h-10" // Match button height
                  )}
                  onClick={() => !isSearching && setIsSearching(true)}
                  readOnly={!isSearching}
                />
                <div className="absolute right-2 flex items-center">
                  {isSearching ? (
                    <X
                      className="h-5 w-5 text-white hover:scale-110 transition-transform cursor-pointer"
                      onClick={() => setIsSearching(false)}
                    />
                  ) : (
                    <Search
                      className="h-5 w-5 text-white"
                      onClick={() => setIsSearching(true)}
                    />
                  )}
                </div>
              </div>
            </form> */}
          </div>
          <Button
            size="icon"
            className="rounded-full bg-foreground hover:bg-foreground/80"
          >
            {selectCompany ? (
              <Avatar>
                <AvatarImage src={selectCompany.route} alt="Logo Empresa" />
                <AvatarFallback className="bg-gray-200 text-gray-600 flex items-center justify-center w-full h-full rounded-full">
                  {selectCompany.business_name[0]?.toUpperCase() || "E"}
                </AvatarFallback>
              </Avatar>
            ) : (
              <IconWithTooltip icon={Store} label="Compañía" />
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                className="rounded-full"
                aria-label="User menu"
              >
                <IconWithTooltip icon={User} label="Perfil" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="text-xs gap-2">
                <User className="min-w-4 min-h-4" />
                {user?.name}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="font-inter gap-2"
              >
                <LogOut className="min-w-4 min-h-4" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
