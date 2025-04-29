import { api } from "@/lib/config";
import { useAuthStore } from "../lib/auth.store";
import { AuthResponse, User } from "./auth.interface";

// Define el tipo para los datos de inicio de sesión
export interface LoginBody {
  username: string;
  password: string;
}

export async function login(body: LoginBody): Promise<AuthResponse> {
  try {
    const { data } = await api.post<AuthResponse>("/login", body);

    // Guardar el token y el usuario en el store
    const { setToken, setUser, setPermisos } = useAuthStore.getState();
    setToken(data.token);
    setUser(data.user);
    setPermisos(data.user.rol.permissions);

    return data;
  } catch (error: any) {
    console.error("Error en login:", error.response?.data || error.message);
    throw error;
  }
}

export async function getAuthenticatedUser(): Promise<User | null> {
  try {
    const { token } = useAuthStore.getState();
    if (!token) throw new Error("Token no disponible");

    const { data } = await api.get<User>("/authenticate", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error: any) {
    console.error(
      "Error al obtener el usuario autenticado:",
      error.response?.data || error.message
    );

    // Si el error es de autenticación, limpia el estado y redirige
    const { clearAuth } = useAuthStore.getState();
    clearAuth();
    window.location.href = "/login"; // Redirige manualmente al login
    return null;
  }
}

export async function logout(): Promise<void> {
  try {
    const { token, clearAuth } = useAuthStore.getState();
    if (!token) throw new Error("Token no disponible");

    await api.post("/logout", null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Limpiar el estado de autenticación
    clearAuth();
  } catch (error: any) {
    console.error(
      "Error al cerrar sesión:",
      error.response?.data || error.message
    );
  }
}
