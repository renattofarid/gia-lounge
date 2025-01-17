import { create } from "zustand";
import { PermissionResource, TypePermission } from "./rol.interface";
import { getPermissions } from "./rol.actions";

interface PermissionStore {
  permissions: TypePermission[];
  loading: boolean;
  loadPermissiones: () => void;
}
export const usePermissionStore = create<PermissionStore>((set) => ({
  permissions: [],
  loading: false,
  loadPermissiones: async () => {
    set({ loading: true }); // Indicamos que está cargando

    try {
      const response: PermissionResource[] = await getPermissions();

      // Agrupamos los permisos por tipo
      const groupedPermissions = response.reduce<
        Record<string, TypePermission>
      >((acc, permission) => {
        if (!acc[permission.type]) {
          acc[permission.type] = {
            name: permission.type,
            permissions: [],
          };
        }
        acc[permission.type].permissions.push({
          id: permission.id,
          name: permission.name,
          type: permission.type,
          status: permission.status,
        });
        return acc;
      }, {});

      // Convertimos el objeto en un array
      const mappedPermissions: TypePermission[] =
        Object.values(groupedPermissions);

      set({
        permissions: mappedPermissions,
        loading: false, // Cambiamos el estado a no cargando
      });
    } catch (error) {
      console.error("Error al cargar permisos:", error);
      set({ loading: false }); // Aseguramos que loading se desactive en caso de error
    }
  },
}));
