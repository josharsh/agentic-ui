import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Badge, Button, Dialog, Separator, Text } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";

import { snakeToTitleCase } from "@/lib/utils";

interface Props {
  info: any;
}

enum BadgeColors {
  amber = "amber",
  green = "green",
  red = "red",
  gray = "gray",
  grass = "grass",
  tomato = "tomato",
}

export default function AiInfo({ info }: Props) {
  const { t } = useTranslation();
  console.log(info);
  return (
    <>
      <div className="grid grid-cols-2 gap-y-2">
        {info?.output_json == null? <strong>{t("Processing")}</strong>: null}
        {info?.output_json?.is_real_image ? (
          <div className="grid grid-cols-2 items-start">
            <Text className="max-w-120px pl-1 font-medium ">
              {t("Real Image")}
            </Text>
            <Badge
              className="w-min"
              color={
                info?.output_json && info?.output_json?.is_real_image === "yes"
                  ? "green"
                  : info?.output_json?.is_real_image === "no"
                  ? "red"
                  : "amber"
              }
            >
              {info?.output_json && "is_real_image" in info?.output_json
                ? snakeToTitleCase(info?.output_json["is_real_image"])
                : "-"}
            </Badge>
          </div>
        ) : null}

        {Object?.keys(info?.output_json || {})?.map((key, index) => {
          if (
            key === "description" ||
            key === "score" ||
            key === "is_valid" ||
            key === "is_real_image" ||
            key === "list_of_damages" ||
            key === "body_parts" ||
            key === "has_damage" ||
            key === "Result"
          ) {
            return null;
          }
          window.console.log("Type of data", typeof info?.output_json[key]);
          return (
            <div key={index} className="grid grid-cols-2 items-start ">
              <Text className="items-left max-w-120px pl-1 font-medium ">
                {t(snakeToTitleCase(key))}
              </Text>
              {typeof info?.output_json[key] === "string" ? (
                <Text className=" items-left  ">
                  {t(snakeToTitleCase(info?.output_json[key])) || "-"}
                </Text>
              ) : typeof info?.output_json[key] === "boolean" ? (
                <Badge
                  className=" items-left w-min"
                  color={
                    key === "has_damage"
                      ? info?.output_json[key] === true
                        ? BadgeColors["red"]
                        : BadgeColors["green"]
                      : info?.output_json[key] === true
                      ? BadgeColors["green"]
                      : BadgeColors["red"]
                  }
                >
                  {info?.output_json
                    ? snakeToTitleCase(
                        info?.output_json[key] === true ? t("Yes") : t("No")
                      ) || "-"
                    : null}
                </Badge>
              ) : typeof info?.output_json[key] === "number" ? (
                <Text className=" items-left  ">
                  {snakeToTitleCase(info?.output_json[key]) || "-"}
                </Text>
              ) : (
                <div className="items-left">
                  {info?.output_json[key] &&
                    info?.output_json[key]?.map((key: any, index: any) => (
                      <Badge
                        color="gray"
                        key={index}
                        className="mx-1 rounded-lg"
                      >
                        {t(snakeToTitleCase(key))}
                      </Badge>
                    ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* {info?.output_json &&
      "body_parts" in info?.output_json &&
      info?.output_json["body_parts"] ? (
        <>
          <div className="flex items-start  ">
            <Text className="items-left min-w-120px max-w-120px pl-1 font-medium font-medium ">
              {t(snakeToTitleCase("Body Parts"))}
            </Text>
            <div className="items-left">
              {info?.output_json ? (
                info?.output_json["body_parts"]?.map((key: any, index: any) => (
                  <Badge color="gray" key={index} className="mx-1 rounded-lg">
                    {t(snakeToTitleCase(key))}
                  </Badge>
                ))
              ) : (
                <Text className="pl-2  ">-</Text>
              )}
            </div>
          </div>
        </>
      ) : null}
      {info?.output_json &&
      "list_of_damages" in info?.output_json &&
      info?.output_json["list_of_damages"] ? (
        <div className="flex items-start  ">
          <Text className="items-left min-w-120px max-w-120px pl-1 font-medium font-medium ">
            {t(snakeToTitleCase("Damaged Parts"))}
          </Text>
          <div className="items-left">
            {info?.output_json["list_of_damages"]?.length ? (
              info?.output_json["list_of_damages"]?.map(
                (key: any, index: any) => (
                  <Badge color="tomato" key={index} className="mx-1 rounded-lg">
                    {t(snakeToTitleCase(key))}
                  </Badge>
                )
              )
            ) : (
              <Text className="pl-2  ">-</Text>
            )}
          </div>
        </div>
      ) : null} */}
      <div className="flex flex-row-reverse">
        <Dialog.Root>
          <Dialog.Trigger>
            <Button variant="soft" size={"1"} className="cursor-pointer">
              {t("See More")}
            </Button>
          </Dialog.Trigger>
          <Dialog.Content>
            <div className="mb-3 mt-1 flex items-center justify-center">
              <MagnifyingGlassIcon height={"24"} width={"24"} />
              <Text className="font-bold">{t("AI Auto Inspector")}</Text>
            </div>
            <Separator size={"4"} className="mb-3" />
            <div className="flex flex-col gap-2 ">
              {Object?.keys(info?.output_json || {})?.map((key, index) => {
                if (
                  key === "description" ||
                  key === "score" ||
                  key === "is_valid" ||
                  key === "is_real_image" ||
                  key === "list_of_damages" ||
                  key === "body_parts" ||
                  key === "has_damage" ||
                  key === "Result"
                ) {
                  return null;
                }
                if (key === "is_valid") {
                  return (
                    <div key={index}>
                      <div key={index} className="flex gap-1">
                        <Text className="min-w-150px">{t("Result")}</Text>
                        <Text className="font-semibold">
                          {info?.output_json[key] === true
                            ? t("accepted")
                            : info?.output_json[key] === false
                            ? t("rejected")
                            : t("Human input needed")}
                        </Text>
                      </div>

                      <Separator orientation="horizontal" size="4" my="2" />
                    </div>
                  );
                }
                if (
                  (key === "body_parts" || key === "list_of_damages") &&
                  typeof info?.output_json[key] !== "string"
                ) {
                  return (
                    <div key={index}>
                      <div className="flex items-start  " key={index}>
                        <Text className="items-left min-w-120px max-w-120px pl-1">
                          {t(snakeToTitleCase(key))}
                        </Text>
                        <div className="items-left">
                          {info?.output_json ? (
                            info?.output_json[key]?.map(
                              (data: any, index: any) => (
                                <Badge
                                  color={
                                    key === "body_parts"
                                      ? BadgeColors["gray"]
                                      : BadgeColors["tomato"]
                                  }
                                  key={index}
                                  className="mx-1 rounded-lg"
                                >
                                  {t(snakeToTitleCase(data))}
                                </Badge>
                              )
                            )
                          ) : (
                            <Text className="pl-2 ">-</Text>
                          )}
                        </div>
                      </div>
                      <Separator orientation="horizontal" size="4" my="2" />
                    </div>
                  );
                }
                return (
                  <div key={index}>
                    <div className="flex gap-1">
                      <Text className="min-w-150px">
                        {t(snakeToTitleCase(key))}
                      </Text>
                      <Text className="font-semibold">
                        {info?.output_json
                          ? t(snakeToTitleCase(info?.output_json[key])) || "-"
                          : ""}
                      </Text>
                    </div>
                    <Separator orientation="horizontal" size="4" my="2" />
                  </div>
                );
              })}

              <div className="flex gap-1">
                <Text className="min-w-150px">
                  {t(snakeToTitleCase("description"))}
                </Text>
                <Text className="font-semibold">
                  {info?.output_json && "description" in info?.output_json
                    ? t(snakeToTitleCase(info?.thai_output_json["description"].content))
                    : "-"}
                </Text>
              </div>
            </div>
            <Dialog.Close>
              <div className="mt-2 flex flex-row-reverse">
                <Button variant="soft" size={"2"} className="cursor-pointer">
                  {t("Close")}
                </Button>
              </div>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Root>
      </div>
    </>
  );
}