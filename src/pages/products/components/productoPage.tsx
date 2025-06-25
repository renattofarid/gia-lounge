"use client";

import type React from "react";
import { useEffect, useState } from "react";

import Layout from "@/components/layouts/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/pagination";
import { HtmlRenderer } from "@/components/html-renderer";

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

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Hash, MoreVertical, Loader2, Search } from "lucide-react";

import { errorToast, successToast } from "@/lib/core.function";
import DeleteDialog from "@/components/delete-dialog";
import { useProductStore } from "../lib/prodcut.store";
import type { Product } from "../lib/producto.interface";
import CreateProduct from "./addProduct";
import { deleteProduct } from "../lib/producto.actions";
import UpdateProduct from "./updateProducto";

export default function ProductPage() {
  const { products, loadProducts, loading, links, meta } = useProductStore();

  const [productUpdate, setProductUpdate] = useState<Product>({} as Product);
  const [idDeleteSelected, setIdDeleteSelected] = useState<number>(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  // const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [search, setSearch] = useState("");

  const canCreateProduct = true;
  const canUpdateProduct = true;
  const canDeleteProduct = true;

  useEffect(() => {
    loadProducts(1);
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handlePageChange = (page: number) => {
    loadProducts(page);
  };

  const handleClickUpdate = (product: Product) => {
    setProductUpdate(product);
    setIsUpdateDialogOpen(true);
  };

  const handleClickDelete = (id: number) => {
    setIdDeleteSelected(id);
    setIsDeleteDialogOpen(true);
  };

  const handleUpdateClose = () => {
    setIsUpdateDialogOpen(false);
    loadProducts(1);
  };
  const handleDelete = async () => {
    try {
      await deleteProduct(idDeleteSelected);
      loadProducts(1);
      successToast("Producto eliminado correctamente");
      setIsDeleteDialogOpen(false);
    } catch {
      errorToast("Error al eliminar el producto");
    }
  };

  const handleCloseCreate = () => {
    setIsDialogOpen(false);
    loadProducts(1);
  };

  const options = [
    {
      name: "Productos",
      link: "/productos",
      permission: { name: "Leer", type: "Productos" },
    },
    { name: "Promociones", link: "/promociones" },
  ];

  return (
    <Layout options={options}>
      {loading ? (
        <div className="flex items-center justify-center w-full h-full">
          <Loader2 className="h-10 w-10 animate-spin text-violet-600" />
        </div>
      ) : (
        <div className="flex flex-col items-center w-full py-4 px-4 max-w-screen-2xl">
          {/* Header */}
          <div className="flex w-full justify-between items-center mb-6 flex-col sm:flex-row gap-4 sm:gap-0">
            <div className="w-full sm:w-auto flex flex-col items-start">
              <h1 className="text-2xl font-bold font-poopins">Productos</h1>
              <p className="text-gray-500 text-base font-inter">
                Gestione los productos
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="flex gap-2 w-full sm:w-auto">
                <Input
                  placeholder="Buscar..."
                  className="w-full sm:w-[300px] font-poopins text-[13px]"
                  value={search}
                  onChange={handleFilterChange}
                />
                <Button
                  size="icon"
                  className="bg-foreground hover:bg-gray-800 text-secondary min-w-9 h-9"
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>

              {canCreateProduct && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-violet-500 hover:bg-violet-600 font-inter w-full sm:w-auto">
                      Agregar Producto
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="p-6 max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Agregar Producto</DialogTitle>
                      <DialogDescription>
                        Gestione los productos de la empresa seleccionada.
                      </DialogDescription>
                    </DialogHeader>
                    <CreateProduct onClose={handleCloseCreate} />
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="w-full flex relative flex-col rounded-lg pt-2 h-[39vh] bg-gradient-to-t from-muted via-transparent via-10% overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Nombre</TableHead>
                  <TableHead className="text-center">Descripción</TableHead>
                  <TableHead className="text-center">Precio</TableHead>
                  <TableHead className="text-center">Estado</TableHead>
                  <TableHead className="text-center">Imagen</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.length > 0 ? (
                  products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Hash className="w-3 h-3" />
                          {product.name}
                        </div>
                      </TableCell>
                      <TableCell className="text-center text-sm max-w-xs">
                        {product.description ? (
                          <HtmlRenderer
                            content={product.description}
                            className="text-left text-sm line-clamp-3"
                          />
                        ) : (
                          <span className="text-muted-foreground">
                            No hay descripción
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-center text-sm">
                        <Badge className="bg-violet-50 text-violet-700 dark:bg-violet-900/20 dark:text-violet-300">
                          S/ {product.precio}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center text-sm">
                        <Badge className={getStatusClass(product.status)}>
                          {product.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center text-sm">
                        {product.route ? (
                          <div className="flex justify-center">
                            <img
                              src={product.route || "/placeholder.svg"}
                              alt={product.name}
                              className="w-10 h-10 object-cover rounded"
                            />
                          </div>
                        ) : (
                          <span className="text-muted-foreground">
                            Sin imagen
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {canUpdateProduct && (
                              <DropdownMenuItem
                                onClick={() => handleClickUpdate(product)}
                              >
                                Actualizar
                              </DropdownMenuItem>
                            )}
                            {canDeleteProduct && (
                              <DropdownMenuItem
                                onClick={() => handleClickDelete(product.id)}
                              >
                                Eliminar
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-muted-foreground"
                    >
                      No se encontraron productos
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 justify-between w-full flex">
            <Pagination
              links={links}
              meta={meta}
              onPageChange={handlePageChange}
            />
          </div>

          {/* Diálogo actualizar */}
          <Dialog
            open={isUpdateDialogOpen}
            onOpenChange={setIsUpdateDialogOpen}
          >
            <DialogContent className="p-6 max-w-3xl">
              <DialogHeader>
                <DialogTitle>Actualizar Producto</DialogTitle>
                <DialogDescription>
                  Actualice los detalles del producto seleccionado.
                </DialogDescription>
              </DialogHeader>
              <UpdateProduct
                product={productUpdate}
                onClose={handleUpdateClose}
              />
            </DialogContent>
          </Dialog>

          {/* Diálogo eliminar */}
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

// Helper para clases según estado
function getStatusClass(status: string): string {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800";
    case "inactive":
      return "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800";
    case "draft":
      return "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800";
    case "out_of_stock":
      return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800";
  }
}
