"use client";

import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Gift } from "lucide-react";
import type { Prize } from "../lib/lottery.interface";

interface ModalPremiosProps {
  isOpen: boolean;
  onClose: () => void;
  prizes: Prize[];
  raffleName: string;
}

export default function ModalPremios({
  isOpen,
  onClose,
  prizes,
  raffleName,
}: ModalPremiosProps) {
  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0 bg-white rounded-2xl">
        <div className="relative">
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-foreground font-poopins">
                  Premios del Sorteo
                </h2>
                <p className="text-sm text-gray-500 font-inter">
                  #{raffleName}
                </p>
              </div>
              <DialogClose />
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="bg-secondary rounded-2xl p-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="">
                      <TableHead className="font-sm font-inter font-semibold text-black text-center py-3">
                        #
                      </TableHead>
                      <TableHead className="font-sm font-inter font-semibold text-black text-center py-3">
                        Nombre del Premio
                      </TableHead>
                      <TableHead className="font-sm font-inter font-semibold text-black text-center py-3">
                        Descripción
                      </TableHead>
                      <TableHead className="font-sm font-inter font-semibold text-black text-center py-3">
                        Imagen
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {prizes.length > 0 ? (
                      prizes.map((prize, index) => (
                        <TableRow key={prize.id}>
                          <TableCell className="font-inter text-sm text-gray-900 text-center py-4 font-medium">
                            {String(index + 1).padStart(2, "0")}
                          </TableCell>
                          <TableCell className="font-inter text-sm text-gray-900 py-4">
                            <div className="flex items-center gap-2 justify-center">
                              <Gift className="h-5 w-5 text-amber-600" />
                              {prize.name}
                            </div>
                          </TableCell>
                          <TableCell className="font-inter text-sm text-gray-900 py-4 text-center">
                            {prize.description || "Sin descripción"}
                          </TableCell>
                          <TableCell className="font-inter text-sm text-center py-4">
                            {prize.route ? (
                              <img
                                src={prize.route || "/placeholder.svg"}
                                alt={prize.name}
                                className="w-12 h-12 object-cover rounded-lg mx-auto border border-gray-200"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src =
                                    "/placeholder.svg?height=48&width=48&text=Premio";
                                }}
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gray-100 rounded-lg mx-auto flex items-center justify-center">
                                <Gift className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center text-sm py-8 text-gray-500"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <Gift className="h-8 w-8 text-gray-300" />
                            <span>
                              No hay premios configurados para este sorteo.
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 flex justify-end">
            <Button
              onClick={handleClose}
              variant="secondary"
              className="bg-black hover:bg-gray-900 text-white px-8 rounded-lg font-inter"
            >
              Cerrar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
