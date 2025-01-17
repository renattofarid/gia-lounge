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
import { Check, MoreVertical } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEnvironmentStore } from "../lib/environment.store";
import { EnvironmentItem } from "../lib/environment.interface";
import DeleteDialog from "@/components/delete-dialog";
import CreateEnvironment from "./addEnvironment";
import { deleteEnvironment } from "../lib/environment.actions";
import { errorToast, successToast } from "@/lib/core.function";
import UpdateEnvironment from "./updateEnvironment";
import SkeletonTable from "@/components/skeleton-table";

export default function EnvironmentPage() {
  const { companyId } = useParams<{ companyId: string }>();
  const { environments, loadEnvironments, loading } = useEnvironmentStore();

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
    if (companyId) loadEnvironments(1, Number(companyId));
  }, [loadEnvironments, companyId]);

  const options = [
    { name: "Empresas", link: "/empresas" },
    { name: "Salones", link: "/empresas/salones" },
    { name: "Mesas/Box", link: "/empresas/mesas" },
  ];

  const handleSelectEnvironment = (id: number) => {
    console.log("Salón seleccionado:", id);
    setSelectedEnvironment(id);
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
    loadEnvironments(1, Number(companyId));
  };

  const handleDelete = () => {
    deleteEnvironment(idDeleteSelected)
      .then(() => {
        loadEnvironments(1, Number(companyId));
        setIsDeleteDialogOpen(false);
        successToast("Salón eliminado correctamente");
      })
      .catch(() => {
        errorToast("Error al eliminar el salón");
      });
  };

  const handleConfirm = () => {
    if (selectedEnvironment) {
      console.log("Salón seleccionado:", selectedEnvironment);
      navigate(`/empresas/mesas/${selectedEnvironment}`);
    } else {
      alert("Por favor, selecciona un salon.");
    }
  };

  const handleUpdateClose = () => {
    setIsUpdateDialogOpen(false);
    loadEnvironments(1, Number(companyId));
  };

  return (
    <Layout options={options}>
      {loading ? (
        <SkeletonTable />
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
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-violet-500 hover:bg-violet-600 font-inter">
                  Agregar salón
                </Button>
              </DialogTrigger>
              <DialogContent className="p-6 max-w-xl">
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
          </div>

          {/* Lista de Salones */}
          <div className="flex gap-6 justify-center items-center flex-wrap">
            {environments.map((environment) => (
              <div
                key={environment.id}
                onClick={() => handleSelectEnvironment(environment.id)}
                className={`relative flex flex-col items-center gap-3 cursor-pointer p-4 rounded-lg shadow-lg transition-transform duration-300 ${
                  selectedEnvironment === environment.id
                    ? "ring-4 ring-violet-500 scale-105 bg-gradient-to-br from-purple-500 to-purple-700"
                    : "hover:ring-4 hover:ring-gray-300 bg-white"
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
                    className={`text-base font-medium uppercase text-center font-inter ${
                      selectedEnvironment === environment.id
                        ? "text-white"
                        : "text-gray-800"
                    }`}
                  >
                    {environment.name}
                  </p>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48">
                      {/* Editar opción */}
                      <DropdownMenuItem
                        className="flex items-center space-x-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleClickUpdate(environment)}
                      >
                        <span className="font-inter">Editar</span>
                      </DropdownMenuItem>

                      {/* Eliminar opción */}
                      <DropdownMenuItem
                        className="flex items-center space-x-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleClickDelete(environment.id)}
                      >
                        <span>Eliminar</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Indicador de selección */}
                {selectedEnvironment === environment.id && (
                  <Check className="absolute top-2 right-2 w-6 h-6 bg-green-600  text-white rounded-full" />
                )}
              </div>
            ))}
          </div>

          <Button
            onClick={handleConfirm}
            className="mt-6 bg-violet-500 hover:bg-violet-600 px-6 py-2 rounded-lg text-white font-inter"
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
                  Actualizar Usuario
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
