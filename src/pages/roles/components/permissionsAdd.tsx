"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { Permission, SetAccessRol } from "../lib/rol.interface";
import { usePermissionStore } from "../lib/permission.store";
import SkeletonForm from "@/components/skeleton-form";
import { Label } from "@/components/ui/label";
import { setAccessRol } from "../lib/rol.actions";
import { errorToast, successToast } from "@/lib/core.function";

export interface PermissionsDialogProps {
  id: number;
  onClose: () => void;
  permissionsRol: Permission[];
}

export default function PermissionsDialog({
  id,
  onClose,
  permissionsRol,
}: PermissionsDialogProps) {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    permissionsRol.map((p) => p.id.toString())
  );

  const { permissions, loadPermissiones, loading } = usePermissionStore();

  useEffect(() => {
    loadPermissiones();
  }, []);

  const togglePermission = (permissionId: string) => {
    setSelectedPermissions((current) =>
      current.includes(permissionId)
        ? current.filter((id) => id !== permissionId)
        : [...current, permissionId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dataAccesses: SetAccessRol = {
      access: selectedPermissions.map((p) => parseInt(p)),
    };
    await setAccessRol(id, dataAccesses)
      .then(() => {
        successToast("Permisos guardados correctamente");
      })
      .catch(() => {
        errorToast("Ocurrió un error al guardar los permisos");
      });
    onClose();
  };

  if (loading) {
    return <SkeletonForm />;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {permissions.map((permission) => (
          <div key={permission.name} className="flex flex-col gap-1">
            <h3 className="font-medium text-sm text-gray-900">
              {permission.name}
            </h3>
            <div className="flex flex-col gap-2">
              {permission.permissions.map((permission) => (
                <div
                  key={permission.id}
                  className="flex items-center justify-between"
                >
                  <Label
                    htmlFor={permission.id.toString()}
                    className="text-sm font-normal text-gray-600"
                  >
                    {permission.name}
                  </Label>
                  <Switch
                    id={permission.id.toString()}
                    checked={selectedPermissions.includes(
                      permission.id.toString()
                    )}
                    onCheckedChange={() =>
                      togglePermission(permission.id.toString())
                    }
                    className="data-[state=checked]:bg-[#818cf8]"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          className="bg-black text-white hover:bg-gray-800 border-0"
          onClick={onClose}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="bg-[#818cf8] hover:bg-[#6366f1] text-white"
          onClick={handleSubmit}
        >
          Guardar
        </Button>
      </div>
    </form>
  );
}
