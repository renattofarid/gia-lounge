import { useAuthStore } from "@/pages/auth/lib/auth.store";

export const useHasPermission = (
  permissionName: string,
  permissionType: string
) => {
  const { permisos } = useAuthStore();
  return permisos.some(
    (p) => p.name === permissionName && p.type === permissionType
  );
};
