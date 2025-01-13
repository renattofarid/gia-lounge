import Layout from "@/components/layouts/layout";
import { useUserStore } from "../lib/user.store";
import { useEffect } from "react";

export default function UserPage() {
  const options = [
    { name: "Roles", link: "/usuarios/roles" },
    { name: "Permisos", link: "/usuarios/permisos" },
  ];

  const { users, loadUsers } = useUserStore();

  useEffect(() => {
    loadUsers(1);
  }, [loadUsers]);

  return (
    <Layout options={options}>
      <div>
        <h1>Usuarios</h1>
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}
