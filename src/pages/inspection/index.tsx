import Header from "@/components/Header";
import InspectionDashboard from "@/components/inspection/inspectionDashboard";
import NavBar from "@/components/NavBar";

export default function InspectionLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <div className="flex grow pr-3">
        <NavBar />
        <div className="flex w-full justify-center">
          <InspectionDashboard />
        </div>
      </div>
    </div>
  );
}
