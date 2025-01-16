import { AppSidebar } from "@/components/app-sidebar";
import Header from "../header";
import Options, { Option } from "../options";

export default function Layout({
  children,
  options,
}: {
  children: React.ReactNode;
  options: Option[];
}) {
  return (
    <div className="flex min-h-svh flex-col">
      <Header />
      <div className="flex min-h-[calc(100vh-5rem)]">
        <AppSidebar />
        <main className="w-full p-4">
          <div className="bg-secondary h-full rounded-3xl">
            <Options options={options} />
            <div className="h-[calc(100%-3rem)] p-4 flex justify-center">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
