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
import { Loader2, MoreVertical, Plus, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, FolderOpen } from 'lucide-react';
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
import { deleteGallery } from "../lib/gallery.actions";
import CreateGalleryPage from "./addGallery";

// Tipos para la estructura de álbumes
interface AlbumGroup {
  route_drive: string;
  images: GalleryItem[];
  previewImages: GalleryItem[]; // Primeras 4 imágenes para preview
}

interface CompanyAlbums {
  companyName: string;
  albums: AlbumGroup[];
}

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

  const { gallery, loadGallerys, loading} = useGalleryStore();
  const { companies, loadCompanies } = useComapanyStore();

  // STATE
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
  const [gallerySelected, setGallerySelected] = useState<GalleryItem | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [search] = useState("");
  const [idSelected, setIdSelected] = useState(0);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("all");
  const [albumImages, setAlbumImages] = useState<GalleryItem[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedCompanies, setExpandedCompanies] = useState<Record<string, boolean>>({});
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumGroup | null>(null);

  const stateSelectedCompany = selectedCompanyId === "all" ? undefined : Number(selectedCompanyId);

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
      successToast("Imagen eliminada correctamente");
      loadGallerys(currentPage, stateSelectedCompany);
    } catch (error) {
      errorToast("Error al eliminar la imagen");
    }
  };

  const handleCompanyChange = async (value: string, page: number = 1) => {
    setSelectedCompanyId(value);
    setCurrentPage(page);
    loadGallerys(page, value === "all" ? undefined : Number(value));
  };

  // Función para abrir el álbum completo
  const handleAlbumClick = (album: AlbumGroup) => {
    setSelectedAlbum(album);
    setAlbumImages(album.images);
    setCurrentImageIndex(0);
    if (album.images.length > 0) {
      setPreviewImage(album.images[0].route);
      setGallerySelected(album.images[0]);
    }
    setIsAlbumModalOpen(true);
  };

  // Función para navegar entre imágenes del álbum
  const navigateAlbumImage = (direction: "next" | "prev") => {
    if (albumImages.length <= 1) return;

    let newIndex;
    if (direction === "next") {
      newIndex = (currentImageIndex + 1) % albumImages.length;
    } else {
      newIndex = (currentImageIndex - 1 + albumImages.length) % albumImages.length;
    }

    setCurrentImageIndex(newIndex);
    const newImage = albumImages[newIndex];
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
      selectedCompanyId === "all" || item.company_id.toString() === selectedCompanyId;
    return matchesSearch && matchesCompany;
  });

  // Agrupar imágenes por compañía y luego por route_drive
  const groupedByCompanyAndDrive = filteredGallery.reduce((acc, item) => {
    const companyId = item.company_id.toString();
    const routeDrive = item.route_drive || "Sin álbum";

    if (!acc[companyId]) {
      acc[companyId] = {
        companyName: item.company_name,
        albums: [],
      };
    }

    // Buscar si ya existe un álbum para este route_drive
    let existingAlbum = acc[companyId].albums.find(
      (album) => album.route_drive === routeDrive
    );

    if (!existingAlbum) {
      existingAlbum = {
        route_drive: routeDrive,
        images: [],
        previewImages: [],
      };
      acc[companyId].albums.push(existingAlbum);
    }

    existingAlbum.images.push(item);

    // Mantener solo las primeras 4 imágenes para preview
    if (existingAlbum.previewImages.length < 4) {
      existingAlbum.previewImages.push(item);
    }

    return acc;
  }, {} as Record<string, CompanyAlbums>);

  return (
    <Layout options={filteredOptions}>
      {loading ? (
        <div className="flex items-center justify-center w-full h-full">
          <Loader2 className="h-10 w-10 animate-spin text-violet-600" />
        </div>
      ) : (
        <div className="flex flex-col items-center w-full py-6 px-4 max-w-screen-2xl">
          <div className="flex flex-col sm:flex-row w-full justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
            <div className="w-full sm:w-auto">
              <h1 className="text-2xl font-bold font-inter">Galería</h1>
              <p className="text-gray-500 font-inter text-sm">
                Gestionar todas las imágenes de la galería organizadas por álbumes
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
              {canCreateGallery && (
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-violet-500 hover:bg-violet-600 font-inter w-full sm:w-auto">
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar imágenes
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-xl p-6">
                    <DialogHeader>
                      <DialogTitle className="font-inter">Agregar Imágenes</DialogTitle>
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

          {/* Vista de galería agrupada por compañía y álbumes */}
          <div className="w-full mb-8">
            {Object.keys(groupedByCompanyAndDrive).length > 0 ? (
              Object.entries(groupedByCompanyAndDrive).map(
                ([companyId, { companyName, albums }]) => (
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
                      <Badge className="ml-2">
                        {albums.length} álbum{albums.length !== 1 ? 'es' : ''}
                      </Badge>
                    </div>

                    {/* Mostrar álbumes solo si la compañía está expandida */}
                    {(expandedCompanies[companyId] === undefined ||
                      expandedCompanies[companyId]) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {albums.map((album, albumIndex) => (
                          <div
                            key={`${companyId}-${albumIndex}`}
                            className="relative group overflow-hidden rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-all cursor-pointer bg-white"
                            onClick={() => handleAlbumClick(album)}
                          >
                            {/* Preview de imágenes del álbum */}
                            <div className="aspect-square overflow-hidden bg-gray-100 relative">
                              {album.previewImages.length > 0 ? (
                                <div className="w-full h-full grid grid-cols-2 gap-1 p-1">
                                  {album.previewImages.slice(0, 4).map((image, index) => (
                                    <div
                                      key={image.id}
                                      className={`overflow-hidden rounded ${
                                        album.previewImages.length === 1 ? 'col-span-2 row-span-2' :
                                        album.previewImages.length === 2 && index < 2 ? 'col-span-1 row-span-2' :
                                        album.previewImages.length === 3 && index === 0 ? 'col-span-2' : ''
                                      }`}
                                    >
                                      <img
                                        src={image.route || "/placeholder.svg"}
                                        alt={image.name_image}
                                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                      />
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="flex flex-col items-center justify-center text-gray-400 h-full">
                                  <FolderOpen className="h-12 w-12 mb-2" />
                                  <p>Álbum vacío</p>
                                </div>
                              )}
                              
                              {/* Overlay con información del álbum */}
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                  <FolderOpen className="h-8 w-8 text-white" />
                                </div>
                              </div>
                            </div>

                            {/* Información del álbum */}
                            <div className="p-4">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <h3 className="font-medium text-sm truncate max-w-[180px] mb-1">
                                    Álbum: {album.route_drive}
                                  </h3>
                                  <p className="text-xs text-gray-500">
                                    {album.images.length} imagen{album.images.length !== 1 ? 'es' : ''}
                                  </p>
                                </div>
                                
                                {/* Menú de opciones del álbum */}
                                {(canUpdateGallery || canDeleteGallery) && (
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                      <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreVertical className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleAlbumClick(album);
                                        }}
                                      >
                                        Ver álbum
                                      </DropdownMenuItem>
                                      {canDeleteGallery && (
                                        <DropdownMenuItem
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            // Aquí podrías implementar eliminar todo el álbum
                                            // o mostrar las opciones para eliminar imágenes individuales
                                          }}
                                        >
                                          Gestionar imágenes
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
                <FolderOpen className="h-16 w-16 mb-4 opacity-30" />
                <p className="text-lg font-medium">No hay álbumes disponibles</p>
                <p className="text-sm">
                  {search
                    ? `No se encontraron resultados para "${search}"`
                    : selectedCompanyId !== "all"
                    ? "Esta compañía no tiene álbumes"
                    : "Agrega imágenes para crear álbumes"}
                </p>
              </div>
            )}
          </div>

          {/* Modal para ver todas las imágenes del álbum */}
          <Dialog open={isAlbumModalOpen} onOpenChange={setIsAlbumModalOpen}>
            <DialogContent className="max-w-2xl p-0 overflow-hidden">
              <div className="relative">
                {/* Header del modal */}
                <div className="p-4 border-b bg-secondary">
                  <DialogHeader>
                    <DialogTitle className="font-inter">
                      Álbum: {selectedAlbum?.route_drive}
                    </DialogTitle>
                    <DialogDescription>
                      {albumImages.length} imagen{albumImages.length !== 1 ? 'es' : ''} en este álbum
                    </DialogDescription>
                  </DialogHeader>
                </div>

                {/* Contenido del modal */}
                <div className="max-h-[80vh] overflow-y-auto">
                  {/* Vista principal de la imagen */}
                  {previewImage && (
                    <div className="relative bg-black">
                      {albumImages.length > 1 && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white"
                            onClick={() => navigateAlbumImage("prev")}
                          >
                            <ChevronLeft className="h-6 w-6" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white"
                            onClick={() => navigateAlbumImage("next")}
                          >
                            <ChevronRight className="h-6 w-6" />
                          </Button>
                        </>
                      )}
                      <img
                        src={previewImage || "/placeholder.svg"}
                        alt={gallerySelected?.name_image || "Vista previa"}
                        className="w-full max-h-[50vh] object-contain"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-4">
                        <h3 className="text-white font-medium font-poopins">
                          {gallerySelected?.name_image}
                        </h3>
                        <div className="flex justify-between items-center">
                          <p className="text-white/80 text-sm font-inter">
                            {gallerySelected?.company_name}
                          </p>
                          {albumImages.length > 1 && (
                            <p className="text-white/80 text-sm font-inter">
                              {currentImageIndex + 1} de {albumImages.length}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Grid de todas las imágenes del álbum */}
                  <div className="p-4">
                    <h4 className="font-medium mb-4">Todas las imágenes del álbum</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {albumImages.map((image, index) => (
                        <div
                          key={image.id}
                          className={`relative group overflow-hidden rounded-lg border cursor-pointer transition-all ${
                            currentImageIndex === index
                              ? 'border-violet-500 ring-2 ring-violet-200'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => {
                            setCurrentImageIndex(index);
                            setPreviewImage(image.route);
                            setGallerySelected(image);
                          }}
                        >
                          <div className="aspect-square overflow-hidden bg-gray-100">
                            <img
                              src={image.route || "/placeholder.svg"}
                              alt={image.name_image}
                              className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            />
                          </div>
                          
                          {/* Opciones de imagen individual */}
                          {(canUpdateGallery || canDeleteGallery) && (
                            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                  <Button variant="ghost" size="icon" className="h-6 w-6 bg-black/50 hover:bg-black/70 text-white">
                                    <MoreVertical className="h-3 w-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  {canDeleteGallery && (
                                    <DropdownMenuItem
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleClickDelete(image.id);
                                      }}
                                    >
                                      Eliminar
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Diálogo para actualizar imagen */}
          <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
            <DialogContent className="max-w-2xl p-6">
              <DialogHeader>
                <DialogTitle className="font-inter">Actualizar Imagen</DialogTitle>
                <DialogDescription>
                  Modifica los detalles de la imagen
                </DialogDescription>
              </DialogHeader>
              {/* Aquí iría el componente para actualizar la imagen */}
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
