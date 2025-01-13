import Layout from "@/components/layouts/layout";

export default function HomePage() {
  const options = [
    { name: "Inicio", link: "/" },
  ];
  return (
    <Layout options={options}>
      <div>Home Page</div>
    </Layout>
  );
}
