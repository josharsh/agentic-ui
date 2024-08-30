import React from "react";
import { useRouter } from "next/router";
import { GearIcon, FaceIcon, HomeIcon, PlusCircledIcon, ArchiveIcon } from "@radix-ui/react-icons";
import { Badge } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";
import { useUser } from "@/user-context";

function NavBar() {
  const { t } = useTranslation();
  const { user, loading: userLoading } = useUser();
  const { push } = useRouter();
  return (
    <div className="flex min-w-[80px] max-w-[80px] justify-center border-r-2 border-slate-200 pt-6">
      <div className="mb-6 flex w-16 flex-col items-center  gap-4  bg-background">
        <div onClick={() => push("/dashboard")} className="cursor-pointer">
          <HomeIcon height="26" width="26" className="mx-auto" />
          <Badge className="bg-red-1">{t("Home")}</Badge>
        </div>
        {user?.role === "admin" ? (
          <div className="mt-1">
          <div onClick={() => push("/configure")} className="cursor-pointer">
          <GearIcon height="26" width="26" className="mx-auto" />
          <Badge className="bg-red-1">{t("Configure")}</Badge>
        </div>
        <div onClick={() => push("/invite")} className="cursor-pointer mt-4">
          <PlusCircledIcon height="26" width="26" className="mx-auto" />
          <Badge className="bg-red-1">{t("Add User")}</Badge>
        </div>
      </div>
        ) : null}
        <div onClick={() => push("/reports")} className="cursor-pointer">
          <ArchiveIcon height="26" width="26" className="mx-auto" />
          <Badge className="bg-red-1">{t("Reports")}</Badge>
        </div>
        </div>
    </div>
  );
}

export default NavBar;
