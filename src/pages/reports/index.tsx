import Header from "@/components/Header";
import NavBar from "@/components/NavBar";
import ReportsComponent from "@/components/reports/ReportsComponent";
import { Card, Heading } from "@radix-ui/themes";
import { t } from "i18next";

export default function Reports() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
        <Header />
         <div className="flex grow pr-3">
            <NavBar />
            <div className="flex grow flex-col gap-6 pl-12 pt-6">
              <ReportsComponent />
            </div>
          </div>
      
    </div>
  );
}
