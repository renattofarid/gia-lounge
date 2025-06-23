import { useEffect, useState } from "react";
import Layout from "@/components/layouts/layout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { DynamicAvatar } from "@/components/dinamyc-avatar";
import { Check, Loader2, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEnvironmentStore } from "../lib/environment.store";
import { EnvironmentItem } from "../lib/environment.interface";
import DeleteDialog from "@/components/delete-dialog";
import CreateEnvironment from "./addEnvironment";
import { deleteEnvironment } from "../lib/environment.actions";
import { errorToast, successToast } from "@/lib/core.function";
import UpdateEnvironment from "./updateEnvironment";
import { useComapanyStore } from "@/pages/company/lib/company.store";
// import { useAuthStore } from "@/pages/auth/lib/auth.store";
// import { useHasPermission } from "@/hooks/useHasPermission";

export default function EnvironmentPage() {
  const { companyId } = useComapanyStore();
  const { environments, loadEnvironments, loading, setEnvironmentId } =
    useEnvironmentStore();

  const [selectedEnvironment, setSelectedEnvironment] = useState<number | null>(
    null
  );
  const [environmentUpdate, setEnvironmentUpdate] = useState<EnvironmentItem>(
    {} as EnvironmentItem
  );
  const [idDeleteSelected, setIdDeleteSelected] = useState<number>(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (companyId) loadEnvironments(1, companyId);
    else navigate("/empresas");
  }, []);

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
    {
      name: "Sorteos",
      link: "/empresas/sorteos",
      permission: {
        name: "Leer",
        type: "Lotería",
        link: "/empresas/sorteos",
      },
    }
  ];
  // const { permisos } = useAuthStore();

  // const filteredOptions = options.filter((option) => {
  //   return permisos.some(
  //     (p) =>
  //       p.name === option.permission.name && p.type === option.permission.type
  //   );
  // });
  const filteredOptions = options


  // const canCreateEnvironment = useHasPermission("Crear", "Salon");
  // const canUpdateEnvironment = useHasPermission("Actualizar", "Salon");
  // const canDeleteEnvironment = useHasPermission("Eliminar", "Salon");

   const canCreateEnvironment = true;
  const canUpdateEnvironment = true;
  const canDeleteEnvironment = true;

  // const handleSelectEnvironment = (id: number) => {
  //   console.log("Salón seleccionado:", id);
  //   setSelectedEnvironment(id);
  // };

  const handleSelectEnvironment = (id: number) => {
    if (selectedEnvironment === id) {
      setSelectedEnvironment(null);
    } else {
      setSelectedEnvironment(id);
    }
  };

  const handleClickUpdate = (environment: EnvironmentItem) => {
    setEnvironmentUpdate(environment);
    setIsUpdateDialogOpen(true);
  };

  const handleClickDelete = (id: number) => {
    setIsDeleteDialogOpen(true);
    setIdDeleteSelected(id);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
    loadEnvironments(1, companyId ? Number(companyId) : undefined);
  };

  const handleDelete = () => {
    deleteEnvironment(idDeleteSelected)
      .then(() => {
        loadEnvironments(1, companyId ? Number(companyId) : undefined);
        setIsDeleteDialogOpen(false);
        successToast("Salón eliminado correctamente");
      })
      .catch(() => {
        errorToast("Error al eliminar el salón");
      });
  };

  const handleConfirm = () => {
    if (selectedEnvironment) {
      setEnvironmentId(selectedEnvironment);
      navigate(`/empresas/mesas`);
    } else {
      errorToast("Por favor, selecciona un salon.");
    }
  };

  const handleUpdateClose = () => {
    setIsUpdateDialogOpen(false);
    loadEnvironments(1, companyId ? Number(companyId) : undefined);
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
              <h1 className="text-2xl font-bold font-inter">Salones</h1>
              <p className="text-gray-500 text-base font-inter">
                Gestione salones de la empresa
              </p>
            </div>
            {canCreateEnvironment && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-violet-500 hover:bg-violet-600 text-secondary font-inter">
                    Agregar salón
                  </Button>
                </DialogTrigger>
                <DialogContent className="p-6 max-w-md">
                  <DialogHeader>
                    <DialogTitle>Agregar Salón</DialogTitle>
                    <DialogDescription>
                      Gestione los salones de la empresa seleccionada.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogDescription />
                  <CreateEnvironment
                    companyId={Number(companyId)}
                    onClose={handleClose}
                  />
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Lista de Salones */}
            <div className="grid grid-cols-2  sm:grid-cols-3 gap-6 w-full max-w-4xl mx-auto">
            {environments.map((environment) => (
              <div
              key={environment.id}
              onClick={() => handleSelectEnvironment(environment.id)}
              className={`relative flex flex-col items-center gap-3 cursor-pointer p-4 rounded-lg shadow-lg transition-transform duration-300 ${
                selectedEnvironment === environment.id
                ? "ring-4 ring-violet-500 scale-105 bg-gradient-to-br from-purple-500 to-purple-700"
                : "hover:ring-4 hover:ring-gray-300 bg-secondary"
              }`}
              >
              {/* Reemplazamos el Avatar por DynamicAvatar */}
              <DynamicAvatar
                image={environment.route ?? ""}
                name={environment.name}
                className="w-24 h-24 rounded-full"
              />

              <div className="flex justify-center items-center gap-2">
                {/* Nombre del salón */}
                <p
                className={`sm:text-base text-sm font-medium uppercase text-center font-inter ${
                  selectedEnvironment === environment.id
                  ? "text-secondary"
                  : "text-foreground/90"
                }`}
                >
                {environment.name}
                </p>
                {(canUpdateEnvironment || canDeleteEnvironment) && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48">
                  {canUpdateEnvironment && (
                    <DropdownMenuItem
                    className="flex items-center space-x-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleClickUpdate(environment)}
                    >
                    <span className="font-inter">Editar</span>
                    </DropdownMenuItem>
                  )}

                  {/* Eliminar opción */}
                  {canDeleteEnvironment && (
                    <DropdownMenuItem
                    className="flex items-center space-x-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleClickDelete(environment.id)}
                    >
                    <span className="font-inter">Eliminar</span>
                    </DropdownMenuItem>
                  )}

                  </DropdownMenuContent>
                </DropdownMenu>
                )}
              </div>

              {/* Indicador de selección */}
              {selectedEnvironment === environment.id && (
                <Check className="absolute top-2 right-2 w-6 h-6 bg-green-600  text-secondary rounded-full" />
              )}
              </div>
            ))}
            </div>

          <Button
            onClick={handleConfirm}
            className="mt-6 bg-violet-500 hover:bg-violet-600 px-6 py-2 rounded-lg text-secondary font-inter"
          >
            Confirmar
          </Button>

          <Dialog
            open={isUpdateDialogOpen}
            onOpenChange={setIsUpdateDialogOpen}
          >
            <DialogContent className="max-w-xl p-6">
              <DialogHeader>
                <DialogTitle className="font-inter">
                  Actualizar Salón
                </DialogTitle>
                <DialogDescription />
              </DialogHeader>
              <UpdateEnvironment
                companyId={Number(companyId)}
                onClose={handleUpdateClose}
                environment={environmentUpdate}
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
