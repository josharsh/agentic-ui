import Configuration from "@/components/configure/configuration";
import Header from "@/components/Header";
import NavBar from "@/components/NavBar";

export default function ConfigurationLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <div className="flex grow pr-6">
        <NavBar />
        <Configuration />
      </div>
    </div>
  );
}
