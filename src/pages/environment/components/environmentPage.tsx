import { useState } from "react";
import Layout from "@/components/layouts/layout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DynamicAvatar } from "@/components/dinamyc-avatar";
import { Check } from "lucide-react";
// import { useNavigate } from "react-router-dom";

export default function EnvioronmentPage() {
  const options = [
    { name: "Empresas", link: "/empresas" },
    { name: "Salones", link: "/empresas/salones" },
    { name: "Mesas/Box", link: "/empresas/mesas" },
  ];

  const [selectedSalon, setSelectedSalon] = useState<number | null>(null);
  //   const navigate = useNavigate();

  const salones = [
    { id: 1, name: "Salón Principal", image: "/salon1.jpg" },
    { id: 2, name: "Salón Secundario", image: "/salon2.jpg" },
  ];

  const handleSelectSalon = (id: number) => {
    setSelectedSalon(id);
  };

  const handleConfirm = () => {
    if (selectedSalon) {
      console.log("Salón seleccionado:", selectedSalon);
    } else {
      alert("Por favor, selecciona un salón.");
    }
  };

  return (
    <Layout options={options}>
      <div className="flex flex-col items-center w-full py-6 px-4 max-w-screen-2xl">
        {/* Encabezado */}
        <div className="w-full flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold font-inter">Salones</h1>
            <p className="text-gray-500 text-base font-inter">
              Gestione salones de la empresa.
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-violet-500 hover:bg-violet-600 font-inter">
                Agregar salón
              </Button>
            </DialogTrigger>
            <DialogContent className="p-6 max-w-3xl">
              <DialogHeader>
                <DialogTitle>Agregar Salón</DialogTitle>
                <p>Gestione los salones de la empresa seleccionada.</p>
              </DialogHeader>
              {/* Aquí puedes agregar el formulario para crear un nuevo salón */}
            </DialogContent>
          </Dialog>
        </div>

        {/* Lista de Salones */}
        <div className="flex gap-6 justify-center items-center flex-wrap">
          {salones.map((salon) => (
            <div
              key={salon.id}
              onClick={() => handleSelectSalon(salon.id)}
              className={`relative flex flex-col items-center gap-3 cursor-pointer p-4 rounded-lg shadow-lg transition-transform duration-300 ${
                selectedSalon === salon.id
                  ? "ring-4 ring-violet-500 scale-105 bg-gradient-to-br from-purple-500 to-purple-700"
                  : "hover:ring-4 hover:ring-gray-300 bg-white"
              }`}
            >
              {/* Reemplazamos el Avatar por DynamicAvatar */}
              <DynamicAvatar
                image={salon.image}
                name={salon.name}
                className="w-24 h-24 rounded-full"
              />

              {/* Nombre del salón */}
              <p
                className={`text-base font-medium uppercase text-center font-inter ${
                  selectedSalon === salon.id ? "text-white" : "text-gray-800"
                }`}
              >
                {salon.name}
              </p>

              {/* Indicador de selección */}
              {selectedSalon === salon.id && (
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
      </div>
    </Layout>
  );
}
