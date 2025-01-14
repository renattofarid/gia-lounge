"use client"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useEffect, useState } from "react"


interface PermissionGroup {
  title: string
  permissions: {
    id: string
    label: string
  }[]
}

const permissionGroups: PermissionGroup[] = [
  {
    title: "USUARIOS",
    permissions: [
      { id: "user-read", label: "Leer" },
      { id: "user-create", label: "Crear" },
      { id: "user-edit", label: "Editar" },
      { id: "user-delete", label: "Eliminar" },
    ],
  },
  {
    title: "ROLES",
    permissions: [
      { id: "role-read", label: "Leer" },
      { id: "role-load", label: "Asignar permiso" },
      { id: "role-revoke", label: "Revocar permiso" },
    ],
  },
]

export default function PermissionsDialog() {
  const [open, setOpen] = useState(false)
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])

  useEffect(() => {
    if (open) {
      setSelectedPermissions([])
    }
  }, [open])

  const togglePermission = (permissionId: string) => {
    setSelectedPermissions(current =>
      current.includes(permissionId)
        ? current.filter(id => id !== permissionId)
        : [...current, permissionId]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Selected permissions:', selectedPermissions)
    setOpen(false)
  }

  return (
    <form onSubmit={handleSubmit}>
    <div className="space-y-8">
      {permissionGroups.map((group) => (
        <div key={group.title} className="space-y-4">
          <h3 className="font-medium text-sm text-gray-900">
            {group.title}
          </h3>
          <div className="space-y-4">
            {group.permissions.map((permission) => (
              <div
                key={permission.id}
                className="flex items-center justify-between"
              >
                <label
                  htmlFor={permission.id}
                  className="text-sm font-normal text-gray-600"
                >
                  {permission.label}
                </label>
                <Switch
                  id={permission.id}
                  checked={selectedPermissions.includes(permission.id)}
                  onCheckedChange={() => togglePermission(permission.id)}
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
        onClick={() => setOpen(false)}
      >
        Cancelar
      </Button>
      <Button 
        type="submit"
        className="bg-[#818cf8] hover:bg-[#6366f1] text-white"
      >
        Guardar
      </Button>
    </div>
  </form>
  )
}

