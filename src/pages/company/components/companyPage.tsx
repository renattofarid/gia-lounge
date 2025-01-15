import { useEffect, useState } from "react";
import Layout from "@/components/layouts/layout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useComapanyStore } from "../lib/company.store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CreateCompanyPage from "./addCompany";
import { DialogDescription } from "@radix-ui/react-dialog";

export default function CompanyPage() {
  const options = [
    { name: "Empresas", link: "/empresas" },
    { name: "Salones", link: "/empresas/salones" },
    { name: "Mesas/Box", link: "/empresas/mesas" },
  ];

  //STORE
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { companies, loadCompanies, loading } = useComapanyStore();
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);

  useEffect(() => {
    loadCompanies(1);
  }, [loadCompanies]);

  const handleSelectCompany = (id: number) => {
    setSelectedCompany(id);
  };

  const handleClose = () => {
    setIsAddDialogOpen(false);
    loadCompanies(1);
  };

  const handleConfirm = () => {
    if (selectedCompany) {
      console.log("Empresa seleccionada:", selectedCompany);
    } else {
      alert("Por favor, selecciona una empresa.");
    }
  };

  return (
    <Layout options={options}>
      <div className="flex flex-col items-center w-full py-6 px-4 max-w-screen-2xl">
        {/* Encabezado */}
        <div className="w-full flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold font-inter">Empresa</h1>
            <p className="text-gray-500 text-base font-inter">
              Seleccione su empresa.
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-violet-500 hover:bg-violet-600 font-inter">
                Agregar Empresa
              </Button>
            </DialogTrigger>
            <DialogContent className="p-6 max-w-3xl">
              <DialogHeader>
                <DialogTitle>Agregar Empresa</DialogTitle>
                <DialogDescription>Gestione sus empresas.</DialogDescription>
              </DialogHeader>
              <CreateCompanyPage onClose={handleClose} />
              {/* Formulario de creación de empresa */}
            </DialogContent>
          </Dialog>
        </div>

        {/* Lista de Empresas */}
        <div className="flex gap-6 justify-center items-center flex-wrap">
          {loading ? (
            <p className="text-gray-500">Cargando empresas...</p>
          ) : (
            companies.map((company) => (
              <div
                key={company.id}
                onClick={() => handleSelectCompany(company.id)}
                className="flex flex-col items-center gap-2 cursor-pointer"
              >
                {/* Contenedor del avatar con el anillo */}
                <div
                  className={`p-1 rounded-full transition-transform duration-300 ${
                    selectedCompany === company.id
                      ? "ring-4 ring-violet-500 scale-110"
                      : "hover:ring-4 hover:ring-gray-300"
                  }`}
                >
                  <Avatar className="w-20 h-20">
                    <AvatarImage
                      src={company.route ? company.route : "/logo.jpg"}
                      alt={company.business_name}
                      className="w-full h-full object-cover rounded-full"
                    />
                    <AvatarFallback className="bg-gray-200 text-gray-600 flex items-center justify-center w-full h-full rounded-full">
                      {company.business_name[0]?.toUpperCase() || "E"}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Nombre de la empresa */}
                <p
                  className={`text-base font-medium uppercase pt-3 font-inter ${
                    selectedCompany === company.id
                      ? "text-violet-500"
                      : "text-gray-800"
                  }`}
                >
                  {company.business_name}
                </p>
              </div>
            ))
          )}
        </div>

        <Button
          onClick={handleConfirm}
          className="mt-6 bg-violet-500 hover:bg-violet-600 px-6 py-2 rounded-lg text-white font-inter"
        >
          Confirmar
        </Button>
      </div>
    </Layout>
  );
}
