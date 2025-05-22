import React from "react";
import { useRouter } from "next/router";
import { GearIcon, FaceIcon, HomeIcon, PlusCircledIcon, ArchiveIcon } from "@radix-ui/react-icons";
import { useTranslation } from "react-i18next";
import { useUser } from "@/user-context";

function NavBar() {
  const { t } = useTranslation();
  const { user, loading: userLoading } = useUser();
  const { push } = useRouter();

  const navItems = [
    { icon: <HomeIcon height="26" width="26" />, label: t("Home"), path: "/dashboard" },
    { icon: <ArchiveIcon height="26" width="26" />, label: t("Agents"), path: "/agents" },
  ];

  if (user?.role === "admin") {
    navItems.push(
      { icon: <GearIcon height="26" width="26" />, label: t("Configure"), path: "/configure" },
      { icon: <PlusCircledIcon height="26" width="26" />, label: t("Add User"), path: "/invite" }
    );
  }

  return (
    <div className="flex flex-col min-w-[80px] max-w-[80px] justify-between border-r bg-gradient-to-r from-blue-200">
      <div className="flex flex-col items-center gap-6 pt-6">
        {navItems.map((item, index) => (
          <div
            key={index}
            onClick={() => push(item.path)}
            className="flex flex-col items-center cursor-pointer hover:text-gray-200 transition-colors"
          >
            {item.icon}
            <span className="mt-2 text-xs">{item.label}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center gap-6 pb-6">
        <div onClick={() => push("/profile")} className="flex flex-col items-center cursor-pointer hover:text-gray-200 transition-colors">
          <FaceIcon height="26" width="26" />
          <span className="mt-2 text-xs">{t("Profile")}</span>
        </div>
      </div>
    </div>
  );
}

export default NavBar;