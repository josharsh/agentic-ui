import React from "react";
import { UpdateIcon } from "@radix-ui/react-icons";
import { Text } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";

const Loader: React.FC<{ text?: string; type?: string }> = ({ text, type }) => {
  const { t } = useTranslation();
  if (type === "inline") {
    return (
      <div className="items-center">
        <UpdateIcon
          height={"16"}
          width={"16"}
          className="animate-spin"
          color={"hsla(226, 70%, 55%, 1)"}
        />
      </div>
    );
  }
  return (
    <div className="z-50 flex h-full w-full flex-col items-center justify-center">
      <UpdateIcon
        height={"30"}
        width={"30"}
        className="animate-spin"
        color={"hsla(226, 70%, 55%, 1)"}
      />
      <Text color="indigo">{text || t("Loading")}</Text>
    </div>
  );
};

export default Loader;
