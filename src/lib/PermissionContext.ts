// import { createContext, useContext, ReactNode } from "react";

// interface Permission {
//   id: number;
//   name: string;
//   type: string;
//   status: string;
// }

// interface AuthContextType {
//   permissions: Permission[];
//   hasPermission: (permissionName: string) => boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const permissions: Permission[] = [
//     { id: 1, name: "Leer", type: "Usuarios", status: "Activo" },
//     { id: 2, name: "Crear", type: "Usuarios", status: "Activo" },
//     { id: 3, name: "Editar", type: "Usuarios", status: "Activo" },
//     { id: 4, name: "Eliminar", type: "Usuarios", status: "Activo" },
//     { id: 5, name: "Leer Roles", type: "Roles", status: "Activo" },
//     { id: 6, name: "Asignar Permiso", type: "Roles", status: "Activo" },
//     { id: 7, name: "Revocar Permiso", type: "Roles", status: "Activo" },
//   ];

//   const hasPermission = (permissionName: string) => {
//     return permissions.some((perm) => perm.name === permissionName);
//   };

//   return (
//     <AuthContext.Provider value={{ permissions, hasPermission }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth debe ser usado dentro de un AuthProvider");
//   }
//   return context;
// };
