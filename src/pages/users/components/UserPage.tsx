import Layout from "@/components/layouts/layout";
import { useUserStore } from "../lib/user.store";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function UserPage() {
  const options = [
    { name: "Roles", link: "/usuarios/roles" },
    { name: "Permisos", link: "/usuarios/permisos" },
  ];

  const { users, loadUsers } = useUserStore();

  // params
  const params = useParams();

  useEffect(() => {
    loadUsers(1);
  }, [loadUsers]);

  return (
    <Layout options={options}>
      <div>
        <h1>Usuarios</h1>
        <pre>{JSON.stringify(params, null, 2)}</pre>
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}
