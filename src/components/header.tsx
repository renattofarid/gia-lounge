import { Store, User } from "lucide-react";
import { Button } from "./ui/button";
import { useAuthStore } from "@/pages/auth/lib/auth.store";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useComapanyStore } from "@/pages/company/lib/company.store";
import { useEffect, useState } from "react";
import { getCompany } from "@/pages/company/lib/company.actions";

export default function Header() {
  const { clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const { companyId, loadCompanies } = useComapanyStore();
  const [companyLogo, setCompanyLogo] = useState<string | null>(null); // Estado para guardar el logo

  const handleLogout = () => {
    clearAuth();
    navigate("/login"); // Redirige al usuario a la página de inicio de sesión
  };
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        await loadCompanies(1); // 
        const selectedCompany = await getCompany(companyId); // Obtiene la compañía por ID
        setCompanyLogo(selectedCompany?.route || null); // Establece el logo
      } catch (error) {
        console.error("Error al cargar la compañía:", error);
      }
    };

    if (companyId) {
      fetchCompany();
    }
  }, [companyId, loadCompanies]);

  return (
    <header className="">
      <div className="flex justify-between p-4">
        <img src="/logo.svg" alt="" className="h-10" />
        <div className="flex justify-between gap-2">
          <Button
            size="icon"
            className="rounded-full bg-pink-400 hover:bg-pink-400/80"
          >
            <User className="min-w-5 min-h-5" />
          </Button>
          <Button
            size="icon"
            className="rounded-full bg-foreground hover:bg-foreground/80"
          >
            {/* <Store className="min-w-5 min-h-5" /> */}
            {companyLogo ? (
              <img
                src={companyLogo}
                alt="Logo de la compañía"
                className="h-8 w-8 object-cover rounded-full"
              />
            ) : (
              <span className="text-white">
                <Store />
              </span> // Emoji o fallback
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                className="rounded-full"
                aria-label="User menu"
              >
                <User className="min-w-5 min-h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem onClick={handleLogout} className="font-inter">
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
