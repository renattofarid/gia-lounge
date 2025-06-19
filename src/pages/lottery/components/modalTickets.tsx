"use client";

import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";
import type { ParticipantesItem } from "../lib/lottery.interface";

interface ModalTicketsProps {
  isOpen: boolean;
  onClose: () => void;
  participant: ParticipantesItem | null;
  raffleName: string;
}

export default function ModalTickets({
  isOpen,
  onClose,
  participant,
  raffleName,
}: ModalTicketsProps) {
  if (!participant) return null;

  const handleDownload = (ticketCode: string, barcodeUrl: string) => {
    // Implement download functionality here
    console.log("Downloading ticket:", ticketCode, barcodeUrl);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-2xl p-0 bg-[#DCDAE6]">
        <div className="relative">
          {/* Header */}
          <div className="p-6 pb-4 text-center relative">
            <DialogClose className="absolute right-4 top-4 rounded-full">
              {/* <X className="h-4 w-4" /> */}
            </DialogClose>
            <h2 className="text-lg font-medium text-gray-800 mb-1 font-poopins">
              Lista de tickets
            </h2>
            <p className="text-sm text-primary font-light font-poopins">
              {`${participant.person.names} ${participant.person.father_surname} ${participant.person.mother_surname}`.trim()}
            </p>
          </div>

          {/* Tickets List */}
          <div className="px-6 pb-6 space-y-4 max-h-96 overflow-y-auto">
            {participant.tickets.map((ticket, index) => (
              <div
                key={ticket.id_ticket}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
              >
                {/* Ticket Header */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-xs text-gray-500 font-poopins tracking-wide">
                      Tickets
                    </p>
                    <p className="text-base  font-inter font-semibold text-gray-800">
                      {raffleName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary font-poopins">
                      {String(index + 1).padStart(3, "0")}
                    </p>
                  </div>
                </div>

                {/* Participant Info */}
                <div className="mb-4  bg-[#EEE9FF] p-3 rounded-sm">
                  <p className="text-sm text-gray-500 mb-1 font-poopins">Participante</p>
                  <p className="text-[15px] text-primary font-medium font-poopins">
                    {`${participant.person.names} ${participant.person.father_surname} ${participant.person.mother_surname}`.trim()}
                  </p>
                </div>

                {/* Dotted Line */}
                <div className="border-t border-dashed border-gray-300 my-4"></div>

                {/* Barcode Section */}
                <div className="text-center">
                  {ticket.code.barcode_path ? (
                    <img
                      src={ticket.code.barcode_path || "/placeholder.svg"}
                      alt={`Barcode for ticket ${ticket.code.description}`}
                      className="mx-auto mb-3 h-12 object-contain"
                      onError={(e) => {
                        // Fallback to a barcode pattern if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        target.nextElementSibling?.classList.remove("hidden");
                      }}
                    />
                  ) : null}

                  {/* Fallback barcode pattern */}
                  <div className="hidden mx-auto mb-3 h-12 w-48 bg-white border border-gray-200  items-center justify-center">
                    <div className="flex space-x-px">
                      {Array.from({ length: 30 }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-8 ${
                            Math.random() > 0.5
                              ? "w-1 bg-black"
                              : "w-px bg-black"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-purple-100 text-primary"
                    onClick={() =>
                      handleDownload(
                        ticket.code.description,
                        ticket.code.barcode_path
                      )
                    }
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {participant.tickets.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">
                  No hay tickets disponibles para este participante.
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
