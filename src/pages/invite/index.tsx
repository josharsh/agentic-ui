import { useUser } from "@/user-context";
import { Button, Card, Heading, Text } from "@radix-ui/themes";
import { t } from "i18next";

import Loader from "@/components/common/loader";
import Header from "@/components/Header";
import NavBar from "@/components/NavBar";
import InviteUser from "@/components/users/invite";
import UserManagement from "@/components/users/userManagement";

export default function InviteLayout() {
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
            <div className="flex grow flex-col gap-2 pl-12 pt-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("User Management")}</h1>
              <p className="text-lg text-gray-600">{t("Add and manage users in your organization")}</p>
            </div>
              <Card className="w-full">
                <UserManagement />
                {/* <InviteUser /> */}
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
