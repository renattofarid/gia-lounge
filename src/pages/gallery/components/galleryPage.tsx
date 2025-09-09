"use client";
import Layout from "@/components/layouts/layout";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, FolderOpen, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteDialog from "@/components/delete-dialog";
import { errorToast, successToast } from "@/lib/core.function";
import { useGalleryStore } from "../lib/gallery.store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useComapanyStore } from "@/pages/company/lib/company.store";
import { deleteGallery } from "../lib/gallery.actions";
import CreateGalleryPage from "./addGallery";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function GalleryPage() {
  const options = [
    { name: "Configuración", link: "/configuracion" },
    { name: "Galería", link: "/galeria" },
  ];

  const filteredOptions = options;
  const canCreateGallery = true;
  const canDeleteGallery = true;

  const { gallery, loadGallerys, loading } = useGalleryStore();
  const { companies, loadCompanies } = useComapanyStore();

  // STATE
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [idSelected, setIdSelected] = useState(0);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const stateSelectedCompany =
    selectedCompanyId === "all" ? undefined : Number(selectedCompanyId);

  useEffect(() => {
    loadCompanies(1);
    loadGallerys(1, stateSelectedCompany);
  }, []);

  const handleClose = () => {
    setIsAddDialogOpen(false);
    loadGallerys(currentPage, stateSelectedCompany);
  };

  const handleClickDelete = (id: number) => {
    setIsDeleteDialogOpen(true);
    setIdSelected(id);
  };

  const handleDelete = async () => {
    try {
      await deleteGallery(idSelected);
      setIsDeleteDialogOpen(false);
      successToast("Álbum eliminado correctamente");
      loadGallerys(currentPage, stateSelectedCompany);
    } catch (error) {
      errorToast("Error al eliminar el álbum");
    }
  };

  const handleCompanyChange = async (value: string, page: number = 1) => {
    setSelectedCompanyId(value);
    setCurrentPage(page);
    loadGallerys(page, value === "all" ? undefined : Number(value));
  };

  return (
    <Layout options={filteredOptions}>
      {loading ? (
        <div className="flex items-center justify-center w-full h-full">
          <Loader2 className="h-10 w-10 animate-spin text-violet-600" />
        </div>
      ) : (
        <div className="flex flex-col items-center w-full py-6 px-4 max-w-screen-2xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row w-full justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
            <div className="w-full sm:w-auto">
              <h1 className="text-2xl font-bold font-inter">Galería</h1>
              <p className="text-gray-500 font-inter text-sm">
                Gestiona los enlaces de Drive organizados por compañía
              </p>
            </div>
            <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2 sm:space-x-3">
              <Select
                value={selectedCompanyId}
                onValueChange={(value) => handleCompanyChange(value)}
              >
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Filtrar por compañía" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las compañías</SelectItem>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id.toString()}>
                      {company.business_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div>
                {canCreateGallery && (
                  <Dialog
                    open={isAddDialogOpen}
                    onOpenChange={setIsAddDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button className="bg-violet-500 hover:bg-violet-600 font-inter w-full sm:w-auto">
                        Agregar enlace
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="p-6 max-w-xl">
                      <DialogHeader>
                        <DialogTitle>Agregar</DialogTitle>
                      </DialogHeader>
                      <CreateGalleryPage onClose={handleClose} />
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
          </div>

          {/* Vista de álbumes */}
          <div className="w-full mb-8">
            {gallery.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {gallery.map((item) => {
                  const company = companies.find(
                    (c) => c.id === item.company_id
                  );

                  return (
                    <div
                      key={item.id}
                      className="relative group overflow-hidden rounded-xl shadow-sm hover:shadow-lg transition-all bg-card/65 p-6 flex flex-col items-center"
                    >
                      {/* Solo ícono de la compañía */}
                      <div className="mb-4">
                      <FolderOpen className="h-12 w-12 text-gray-400" />
                      </div>

                      {/* Info */}
                      <h3 className="font-semibold text-center">
                      {company?.business_name || item.company_name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 break-all">
                      {item.route_drive
                        ? (
                        <span title={item.route_drive}>
                          {item.route_drive.length > 30
                          ? item.route_drive.slice(0, 30) + "..."
                          : item.route_drive}
                        </span>
                        )
                        : "Sin enlace"}
                      </p>

                      {/* Acción */}
                      {item.route_drive && (
                      <a
                        href={item.route_drive}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 w-full"
                      >
                        <Button className="w-full" variant="secondary">Visitar Drive</Button>
                      </a>
                      )}

                      {/* Opciones */}
                      {canDeleteGallery && (
                      <div className="absolute top-2 right-2">
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          >
                          <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                          onClick={() => handleClickDelete(item.id)}
                          >
                          Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <FolderOpen className="h-16 w-16 mb-4 opacity-30" />
                <p className="text-lg font-medium">
                  No hay álbumes disponibles
                </p>
                <p className="text-sm">
                  Selecciona una compañía o agrega un enlace de Drive
                </p>
              </div>
            )}
          </div>

          {/* Diálogo de confirmación para eliminar */}
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
