"use client";

import Layout from "@/components/layouts/layout";
import { useState, useEffect } from "react";
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
  Loader2,
  MoreVertical,
  Plus,
  ImageIcon,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import DeleteDialog from "@/components/delete-dialog";
import { errorToast, successToast } from "@/lib/core.function";

import { useGalleryStore } from "../lib/gallery.store";
import type { GalleryItem } from "../lib/gallery.interface";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useComapanyStore } from "@/pages/company/lib/company.store";
import { deleteGallery, getGallery } from "../lib/gallery.actions";
import CreateGalleryPage from "./addGallery";
import { Pagination } from "@/components/pagination";

export default function GalleryPage() {
  const options = [
    { name: "Configuración", link: "/configuracion" },
    {
      name: "Galeria",
      link: "/galeria",
    },
  ];

  const filteredOptions = options;

  const canCreateGallery = true;
  const canUpdateGallery = true;
  const canDeleteGallery = true;

  const { gallery, loadGallerys, loading, links, meta } = useGalleryStore();
  const { companies, loadCompanies } = useComapanyStore();

  // STATE
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [gallerySelected, setGallerySelected] = useState<GalleryItem | null>(
    null
  );
  const [previewImage, setPreviewImage] = useState<string>("");
  const [search] = useState("");
  const [idSelected, setIdSelected] = useState(0);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("all");
  const [companyGallery, setCompanyGallery] = useState<GalleryItem[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedCompanies, setExpandedCompanies] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    loadCompanies(1);
    loadGallerys(1);
  }, [loadCompanies, loadGallerys]);

  const handleClose = () => {
    setIsAddDialogOpen(false);
    loadGallerys(currentPage);
  };

  const handleClickDelete = (id: number) => {
    setIsDeleteDialogOpen(true);
    setIdSelected(id);
  };

  const handleDelete = async () => {
    try {
      await deleteGallery(idSelected);
      setIsDeleteDialogOpen(false);
      successToast("Imagen eliminada correctamente");
      loadGallerys(currentPage);
    } catch (error) {
      errorToast("Error al eliminar la imagen");
    }
  };

  const handleClickUpdate = (gallery: GalleryItem) => {
    setGallerySelected(gallery);
    setIsUpdateDialogOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (selectedCompanyId === "all") {
      loadGallerys(page);
    } else {
      handleCompanyChange(selectedCompanyId, page);
    }
  };

  const handleCompanyChange = async (value: string, page: number = 1) => {
    setSelectedCompanyId(value);
    setCurrentPage(page);

    if (value === "all") {
      loadGallerys(page);
    } else {
      try {
        const companyId = Number.parseInt(value);
        await getGallery({ page, company_id: companyId });
      } catch (error) {
        errorToast("Error al cargar las imágenes de la compañía");
      }
    }
  };

  const handleImageClick = (imageUrl: string, gallery: GalleryItem) => {
    setPreviewImage(imageUrl);
    setGallerySelected(gallery);

    // Filtrar imágenes de la misma compañía
    const companyImages = filteredGallery.filter(
      (img) => img.company_id === gallery.company_id
    );
    setCompanyGallery(companyImages);

    // Encontrar el índice de la imagen actual en la galería de la compañía
    const currentIndex = companyImages.findIndex(
      (img) => img.id === gallery.id
    );
    setCurrentImageIndex(currentIndex >= 0 ? currentIndex : 0);

    setIsImagePreviewOpen(true);
  };

  const navigateImage = (direction: "next" | "prev") => {
    if (companyGallery.length <= 1) return;

    let newIndex;
    if (direction === "next") {
      newIndex = (currentImageIndex + 1) % companyGallery.length;
    } else {
      newIndex =
        (currentImageIndex - 1 + companyGallery.length) % companyGallery.length;
    }

    setCurrentImageIndex(newIndex);
    const newImage = companyGallery[newIndex];
    setPreviewImage(newImage.route);
    setGallerySelected(newImage);
  };

  const toggleCompanyExpand = (companyId: string) => {
    setExpandedCompanies((prev) => ({
      ...prev,
      [companyId]: !prev[companyId],
    }));
  };

  // Filtrar la galería por término de búsqueda y compañía
  const filteredGallery = gallery.filter((item) => {
    const matchesSearch =
      item.name_image.toLowerCase().includes(search.toLowerCase()) ||
      item.company_name.toLowerCase().includes(search.toLowerCase());
    const matchesCompany =
      selectedCompanyId === "all" ||
      item.company_id.toString() === selectedCompanyId;

    return matchesSearch && matchesCompany;
  });

  // Agrupar imágenes por compañía para la vista de grid
  const groupedByCompany = filteredGallery.reduce((acc, item) => {
    const companyId = item.company_id.toString();
    if (!acc[companyId]) {
      acc[companyId] = {
        companyName: item.company_name,
        images: [],
      };
    }
    acc[companyId].images.push(item);
    return acc;
  }, {} as Record<string, { companyName: string; images: GalleryItem[] }>);

  return (
    <Layout options={filteredOptions}>
      {loading ? (
        <div className="flex items-center justify-center w-full h-full">
          <Loader2 className="h-10 w-10 animate-spin text-violet-600" />
        </div>
      ) : (
        <div className="flex flex-col items-center w-full py-6 px-4 max-w-screen-2xl">
          <div className="flex w-full justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold font-inter">Galería</h1>
              <p className="text-gray-500 font-inter text-sm">
                Gestionar todas las imágenes de la galería
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 space-x-3">
              <Select
                value={selectedCompanyId}
                onValueChange={(value) => handleCompanyChange(value)}
              >
                <SelectTrigger className="w-[200px]">
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
              {canCreateGallery && (
                <Dialog
                  open={isAddDialogOpen}
                  onOpenChange={setIsAddDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="bg-violet-500 hover:bg-violet-600 font-inter">
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar imágenes
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-xl p-6">
                    <DialogHeader>
                      <DialogTitle className="font-inter">
                        Agregar Imágenes
                      </DialogTitle>
                      <DialogDescription>
                        Sube nuevas imágenes a la galería
                      </DialogDescription>
                    </DialogHeader>
                    <CreateGalleryPage onClose={handleClose} />
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
          {/* 
          <div className="w-full mb-4 justify-end flex"></div> */}

          {/* Vista de galería agrupada por compañía */}
          <div className="w-full mb-8">
            {Object.keys(groupedByCompany).length > 0 ? (
              Object.entries(groupedByCompany).map(
                ([companyId, { companyName, images }]) => (
                  <div key={companyId} className="mb-8">
                    <div
                      className="flex items-center mb-4 cursor-pointer"
                      onClick={() => toggleCompanyExpand(companyId)}
                    >
                      <div className="flex items-center">
                        {expandedCompanies[companyId] ? (
                          <ChevronUp className="h-5 w-5 mr-2 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-5 w-5 mr-2 text-gray-500" />
                        )}
                        <h2 className="text-xl font-semibold font-poopins">
                          {companyName}
                        </h2>
                      </div>
                      <Badge className="ml-2">{images.length} imágenes</Badge>
                    </div>

                    {/* Mostrar imágenes solo si la compañía está expandida o si no hay estado (por defecto expandido) */}
                    {(expandedCompanies[companyId] === undefined ||
                      expandedCompanies[companyId]) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {images.map((item) => (
                          <div
                            key={item.id}
                            className="relative group overflow-hidden rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all"
                          >
                            <div className="aspect-square overflow-hidden bg-gray-100 flex items-center justify-center">
                              {item.route ? (
                                <img
                                  src={item.route || "/placeholder.svg"}
                                  alt={item.name_image}
                                  className="w-full h-full object-cover cursor-pointer transition-transform group-hover:scale-105"
                                  onClick={() =>
                                    handleImageClick(item.route, item)
                                  }
                                />
                              ) : (
                                <div className="flex flex-col items-center justify-center text-gray-400">
                                  <ImageIcon className="h-12 w-12 mb-2" />
                                  <p>Sin imagen</p>
                                </div>
                              )}
                            </div>
                            <div className="p-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium text-sm truncate">
                                    {item.name_image}
                                  </h3>
                                </div>
                                {(canUpdateGallery || canDeleteGallery) && (
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
                                      {canUpdateGallery && (
                                        <DropdownMenuItem
                                          onClick={() =>
                                            handleClickUpdate(item)
                                          }
                                        >
                                          Editar
                                        </DropdownMenuItem>
                                      )}
                                      {canDeleteGallery && (
                                        <DropdownMenuItem
                                          onClick={() =>
                                            handleClickDelete(item.id)
                                          }
                                        >
                                          Eliminar
                                        </DropdownMenuItem>
                                      )}
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              )
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <ImageIcon className="h-16 w-16 mb-4 opacity-30" />
                <p className="text-lg font-medium">
                  No hay imágenes disponibles
                </p>
                <p className="text-sm">
                  {search
                    ? `No se encontraron resultados para "${search}"`
                    : selectedCompanyId !== "all"
                    ? "Esta compañía no tiene imágenes"
                    : "Agrega imágenes a la galería"}
                </p>
              </div>
            )}
          </div>

          {/* Paginación */}
          <div className="w-full flex justify-center mt-4 mb-8">
            <Pagination
              links={links}
              meta={meta}
              onPageChange={handlePageChange}
            />
          </div>

          {/* Diálogo para actualizar imagen */}
          <Dialog
            open={isUpdateDialogOpen}
            onOpenChange={setIsUpdateDialogOpen}
          >
            <DialogContent className="max-w-2xl p-6">
              <DialogHeader>
                <DialogTitle className="font-inter">
                  Actualizar Imagen
                </DialogTitle>
                <DialogDescription>
                  Modifica los detalles de la imagen
                </DialogDescription>
              </DialogHeader>
              {/* Aquí iría el componente para actualizar la imagen */}
              {/* <UpdateGallery onClose={handleUpdateClose} gallery={gallerySelected} /> */}
            </DialogContent>
          </Dialog>

          {/* Diálogo para vista previa de imagen con navegación entre imágenes de la misma compañía */}
          <Dialog
            open={isImagePreviewOpen}
            onOpenChange={setIsImagePreviewOpen}
          >
            <DialogContent className="max-w-4xl p-0 overflow-hidden">
              <div className="relative">
                {companyGallery.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-10 "
                      onClick={() => navigateImage("prev")}
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-10"
                      onClick={() => navigateImage("next")}
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  </>
                )}

                <img
                  src={previewImage || "/placeholder.svg"}
                  alt={gallerySelected?.name_image || "Vista previa"}
                  className="w-full max-h-[80vh] object-contain"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-4">
                  <h3 className="text-white font-medium font-poopins">
                    {gallerySelected?.name_image}
                  </h3>
                  <div className="flex justify-between items-center">
                    <p className="text-white/80 text-sm font-inter">
                      {gallerySelected?.company_name}
                    </p>
                    {companyGallery.length > 1 && (
                      <p className="text-white/80 text-sm font-inter">
                        {currentImageIndex + 1} de {companyGallery.length}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

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
