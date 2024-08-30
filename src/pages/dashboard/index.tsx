import { useUser } from "@/user-context";

import Loader from "@/components/common/loader";
import Header from "@/components/Header";
import NavBar from "@/components/NavBar";
import CreateAgent from "./CreateAgent";

export default function DashboardLayout() {
  const { user, loading: userLoading } = useUser();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {userLoading ? (
        <Loader />
      ) : (
        <>
          <Header />
          <div className="flex grow pr-3">
            <NavBar />
            <CreateAgent/>
          </div>
        </>
      )}
    </div>
  );
}
