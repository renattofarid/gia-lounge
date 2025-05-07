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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useComapanyStore } from "../lib/company.store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CreateCompanyPage from "./addCompany";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useNavigate } from "react-router-dom";
import { errorToast, successToast } from "@/lib/core.function";
import { Loader2, MoreVertical } from "lucide-react";
import { CompanyItem } from "../lib/company.interface";
import UpdateCompanyPage from "./updateCompany";
import { deleteCompany } from "../lib/company.actions";
import DeleteDialog from "@/components/delete-dialog";
import { useEnvironmentStore } from "@/pages/environment/lib/environment.store";
// import { useAuthStore } from "@/pages/auth/lib/auth.store";
// import { useHasPermission } from "@/hooks/useHasPermission";

export default function CompanyPage() {
  const options = [
    {
      name: "Empresas",
      link: "/empresas",
      permission: {
        name: "Leer",
        type: "Empresa",
        link: "/empresas",
      },
    },
    {
      name: "Salones",
      link: "/empresas/salones",
      permission: {
        name: "Leer",
        type: "Salón",
        link: "/empresas/salones",
      },
    },
    {
      name: "Mesas/Box",
      link: "/empresas/mesas",
      permission: {
        name: "Leer",
        type: "Mesa",
        link: "/empresas/mesas",
      },
    },

    {
      name: "Eventos",
      link: "/empresas/eventos",
      permission: {
        name: "Leer",
        type: "Evento",
        link: "/empresas/eventos",
      },
    },
    
  ];

  // const { permisos } = useAuthStore();

  // const filteredOptions = options.filter((option) => {
  //   return permisos.some(
  //     (p) =>
  //       p.name === option.permission.name && p.type === option.permission.type
  //   );
  // });

  const filteredOptions = options;

  // const canCreateCompany = useHasPermission("Crear", "Empresa");
  // const canUpdateCompany = useHasPermission("Actualizar", "Empresa");
  // const canDeleteCompany = useHasPermission("Eliminar", "Empresa");

  const canCreateCompany = true;
  const canUpdateCompany = true;
  const canDeleteCompany = true;
  //STORE
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { companies, loadCompanies, loading, setCompanyId, setSelectCompany } =
    useComapanyStore();
  const { setSelectEnvironment, setEnvironmentId } = useEnvironmentStore();
  const [selectedCompany, setSelectedCompany] = useState<CompanyItem | null>(
    null
  );
  const [companyUpdate, setCompanyUpdate] = useState<CompanyItem>(
    {} as CompanyItem
  );
  const [idDeleteSelected, setIdDeleteSelected] = useState<number>(0);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    loadCompanies(1);
  }, []);

  const handleSelectCompany = (company: CompanyItem) => {
    setSelectedCompany(company);
  };

  const handleClose = () => {
    setIsAddDialogOpen(false);
    loadCompanies(1);
  };

  const handleConfirm = () => {
    if (selectedCompany) {
      setCompanyId(selectedCompany.id);
      setSelectCompany(selectedCompany);
      setEnvironmentId(0);
      setSelectEnvironment(null);
      navigate(`/empresas/salones`);
      successToast("Empresa seleccionada correctamente.");
    } else {
      errorToast("Por favor, selecciona una empresa.");
    }
  };

  const handleClickUpdate = (company: CompanyItem) => {
    setCompanyUpdate(company);
    setIsUpdateDialogOpen(true);
  };

  const handleClickDelete = (id: number) => {
    setIsDeleteDialogOpen(true);
    setIdDeleteSelected(id);
  };

  const handleUpdateClose = () => {
    setIsUpdateDialogOpen(false);
    loadCompanies(1);
  };

  const handleDelete = async () => {
    await deleteCompany(idDeleteSelected)
      .then(() => {
        setIsDeleteDialogOpen(false);
        loadCompanies(1);
        successToast("Empresa eliminada correctamente");
      })
      .catch(() => {
        errorToast("No se pudo eliminar la empresa");
      });
  };

  return (
    <Layout options={filteredOptions}>
      {loading ? (
        <div className="flex items-center justify-center w-full h-full">
          <Loader2 className="h-10 w-10 animate-spin text-violet-600" />
        </div>
      ) : (
        <div className="flex flex-col items-center w-full py-6 px-4 max-w-screen-2xl">
          {/* Encabezado */}
          <div className="w-full flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold font-inter">Empresa</h1>
              <p className="text-gray-500 text-base font-inter">
                Seleccione su empresa.
              </p>
            </div>
            {canCreateCompany && (
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-violet-500 hover:bg-violet-600 font-inter">
                    Agregar Empresa
                  </Button>
                </DialogTrigger>
                <DialogContent className="p-6 max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Agregar Empresa</DialogTitle>
                    <DialogDescription>
                      Gestione sus empresas.
                    </DialogDescription>
                  </DialogHeader>
                  <CreateCompanyPage onClose={handleClose} />
                  {/* Formulario de creación de empresa */}
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Lista de Empresas */}
          <div
            className={`grid ${
              companies.length <= 1
                ? "grid-cols-1"
                : companies.length === 2
                ? "grid-cols-2"
                : "grid-cols-4"
            }  gap-6 justify-center items-center flex-wrap`}
          >
            {loading ? (
              <div className="flex items-center justify-center w-full h-full">
                <Loader2 className="h-10 w-10 animate-spin text-violet-600" />
              </div>
            ) : (
              companies.map((company) => (
                <div
                  key={company.id}
                  onClick={() => handleSelectCompany(company)}
                  className="flex flex-col items-center gap-2 cursor-pointer"
                >
                  {/* Contenedor del avatar con el anillo */}
                  <div
                    className={`p-1 rounded-full transition-transform duration-300 ${
                      selectedCompany && selectedCompany.id === company.id
                        ? "ring-4 ring-violet-500 scale-110"
                        : "hover:ring-4 hover:ring-gray-300"
                    }`}
                  >
                    <Avatar className="w-20 h-20">
                      {company.route && (
                        <AvatarImage
                          src={company.route}
                          alt={company.business_name}
                          className="w-full h-auto object-contain rounded-full"
                        />
                      )}
                      <AvatarFallback className="bg-gray-200 text-gray-600 flex items-center justify-center w-full h-full rounded-full">
                        {company.business_name[0]?.toUpperCase() || "E"}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  {/* Nombre de la empresa */}
                  <div className="flex justify-center items-center gap-2">
                    <p
                      className={`text-base font-medium uppercase font-inter ${
                        selectedCompany && selectedCompany.id === company.id
                          ? "text-violet-500"
                          : "text-foreground/90"
                      }`}
                    >
                      {company.business_name}
                    </p>
                    {(canUpdateCompany || canDeleteCompany) && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-48">
                          {canUpdateCompany && (
                            <DropdownMenuItem
                              className="flex items-center space-x-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleClickUpdate(company)}
                            >
                              <span className="font-inter">Editar</span>
                            </DropdownMenuItem>
                          )}
                          {/* Eliminar opción */}
                          {canDeleteCompany && (
                            <DropdownMenuItem
                              className="flex items-center space-x-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleClickDelete(company.id)}
                            >
                              <span>Eliminar</span>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <Button
            onClick={handleConfirm}
            className="mt-8 bg-violet-500 hover:bg-violet-600 px-6 py-2 rounded-lg text-secondary font-inter"
          >
            Confirmar
          </Button>

          <Dialog
            open={isUpdateDialogOpen}
            onOpenChange={setIsUpdateDialogOpen}
          >
            <DialogContent className="max-w-5xl p-6">
              <DialogHeader>
                <DialogTitle className="font-inter">
                  Actualizar Empresa
                </DialogTitle>
                <DialogDescription />
              </DialogHeader>
              <UpdateCompanyPage
                onClose={handleUpdateClose}
                company={companyUpdate}
              />
            </DialogContent>
          </Dialog>

          <DeleteDialog
            isOpen={isDeleteDialogOpen}
            onConfirm={handleDelete}
            onCancel={() => setIsDeleteDialogOpen(false)}
          />
        </div>
      )}
    </Layout>
  );
}
