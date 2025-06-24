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
import { Loader2, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { type ParticipantesItem } from "../lib/lottery.interface";
import { getRaffleParticipants } from "../lib/lottery.actions";
import ModalTickets from "./modalTickets";

interface ModalParticipantesProps {
  isOpen: boolean;
  onClose: () => void;
  raffleId: number;
  raffleName: string;
}

export default function ModalParticipants({
  isOpen,
  onClose,
  raffleId,
  raffleName,
}: ModalParticipantesProps) {
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [participants, setParticipants] = useState<ParticipantesItem[]>([]);

  const [selectedParticipant, setSelectedParticipant] =
    useState<ParticipantesItem | null>(null);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen && raffleId > 0) {
      loadParticipants();
    }
  }, [isOpen, raffleId]);

  const loadParticipants = async () => {
    setLoadingParticipants(true);
    try {
      const response = await getRaffleParticipants(raffleId);
      setParticipants(response.data);
    } catch (error) {
      console.error("Error loading participants:", error);
      setParticipants([]);
    } finally {
      setLoadingParticipants(false);
    }
  };

  const handleClose = () => {
    setParticipants([]);
    onClose();
  };

  const handleViewTickets = (participant: ParticipantesItem) => {
    setSelectedParticipant(participant);
    setIsTicketModalOpen(true);
  };

  const handleTicketModalClose = () => {
    setIsTicketModalOpen(false);
    setSelectedParticipant(null);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-5xl  rounded-2xl">
          <div className="relative">
            {/* Header */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-foreground font-poopins">
                    Detalle de los participantes
                  </h2>
                  <p className="text-sm text-gray-500 font-inter">
                    {raffleName}
                  </p>
                </div>
                <DialogClose></DialogClose>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {loadingParticipants ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
                </div>
              ) : (
                <div className=" bg-secondary rounded-2xl p-4 pt-2">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-b border-gray-200">
                          <TableHead className="font-sm font-inter font-semibold text-black">
                            #
                          </TableHead>
                          <TableHead className="font-sm font-inter font-semibold text-black text-center">
                            Nombres
                          </TableHead>
                          <TableHead className="font-sm font-inter font-semibold text-black text-center">
                            Apellidos
                          </TableHead>
                          <TableHead className="font-sm font-inter font-semibold text-black text-center">
                            DNI
                          </TableHead>
                          <TableHead className="font-sm font-inter font-semibold text-black text-center">
                            Teléfono
                          </TableHead>
                          <TableHead className="font-sm font-inter font-semibold text-black text-center">
                            E-mail
                          </TableHead>
                          <TableHead className="font-sm font-inter font-semibold text-black text-center">
                            Cantidad de
                            <br />
                            Tickets
                          </TableHead>
                          <TableHead className="font-sm font-inter font-semibold  text-center"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {participants.length > 0 ? (
                          participants.map((participant, index) => (
                            <TableRow key={participant.id}>
                              <TableCell className="font-inter text-sm text-gray-900 text-center py-4 font-medium">
                                {String(index + 1).padStart(2, "0")}
                              </TableCell>
                              <TableCell className="font-inter text-sm text-gray-900 text-center py-4">
                                {participant.person.names}
                              </TableCell>
                              <TableCell className="font-inter text-sm text-gray-900 text-center py-4">
                                {`${participant.person.father_surname} ${participant.person.mother_surname}`.trim()}
                              </TableCell>
                              <TableCell className="font-inter text-sm text-gray-900 text-center py-4">
                                {participant.person.number_document}
                              </TableCell>
                              <TableCell className="font-inter text-sm text-gray-900 text-center py-4">
                                {participant.person.phone}
                              </TableCell>
                              <TableCell className="font-inter text-sm text-center py-4">
                                <a
                                  href={`mailto:${participant.person.email}`}
                                  className="text-blue-600 hover:text-blue-800 underline"
                                >
                                  {participant.person.email}
                                </a>
                              </TableCell>
                              <TableCell className="font-inter text-sm text-gray-900 text-center py-4 font-semibold">
                                {participant.ticket_count}
                              </TableCell>
                              <TableCell className="font-inter text-sm text-center py-4">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-full hover:bg-blue-100"
                                  onClick={() => handleViewTickets(participant)}
                                >
                                  <Eye className="h-8 w-8 text-primary" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={8}
                              className="text-center text-sm py-8 text-gray-500"
                            >
                              No hay participantes disponibles.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 flex justify-end">
              <Button
                onClick={handleClose}
                variant="secondary"
                className="bg-black text-white hover:bg-gray-800"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* Ticket Modal */}
      <ModalTickets
        isOpen={isTicketModalOpen}
        onClose={handleTicketModalClose}
        participant={selectedParticipant}
        raffleName={raffleName}
      />
    </>
  );
}
