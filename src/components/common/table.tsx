import React from "react";
import { useRouter } from "next/router";
import { formatSessionStage, SessionStage } from "@/constants";
import { EyeOpenIcon } from "@radix-ui/react-icons";
import { Badge, Table, Text } from "@radix-ui/themes";
import moment from "moment";
import { useTranslation } from "react-i18next";

import { snakeToTitleCase, toLocalTime } from "@/lib/utils";

interface Props {
  columns?: any;
  data?: any;
}

enum BadgeColors {
  amber = "amber",
  green = "green",
  red = "red",
}

const SubTable: React.FC<Props> = ({ columns, data }) => {
  const { push } = useRouter(),
    { t } = useTranslation();
  function getVehicleDetails(data: any) {
    if (data.metadata?.vehicle_detail) {
      return data.metadata?.vehicle_detail;
    }
    if (data.vehicle_detail) {
      return data.vehicle_detail;
    }
    if (data.metadata) {
      return `${data.metadata[`Merk`] || ""} ${data.metadata[`Seri`] || ""} ${
        data.metadata[`Tahun Produksi`] || ""
      }`;
    }
    return "";
  }

  return (
    <Table.Root className="max-h-[400px] overflow-auto bg-secondary">
      <Table.Header>
        <Table.Row>
          {columns.map((col: any, index: any) => {
            return (
              <Table.ColumnHeaderCell key={index}>
                {t(col)}
              </Table.ColumnHeaderCell>
            );
          })}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {data?.session_info.map((item: any, index: any) => {
          const badge_color =
            item?.stage === SessionStage.DOCUMENTS_SUBMITTED
              ? BadgeColors["amber"]
              : item?.stage === SessionStage.VALID
                ? BadgeColors["green"]
                : BadgeColors["red"];

          return (
            <Table.Row key={index}>
              <Table.RowHeaderCell>
                <div className="flex flex-wrap items-center gap-2">
                  {moment().diff(moment(item.created_at), "hours") < 24 && (
                    <Badge color={`pink`}>{t("New")}</Badge>
                  )}
                  <span className="w-full sm:w-auto">{item?.id}</span>
                  <Badge color={`${badge_color}`} className="mr-1">
                    {t(formatSessionStage(item?.stage))}
                  </Badge>
                </div>
              </Table.RowHeaderCell>
              <Table.Cell>
                <Text>{getVehicleDetails(data)}</Text>
              </Table.Cell>
              <Table.Cell>
                <Text>{data?.metadata?.customer_name}</Text>
              </Table.Cell>
              <Table.Cell>
                <Text>
                  {data?.created_by_user?.first_name}{" "}
                  {data?.created_by_user.last_name}
                </Text>
              </Table.Cell>
              <Table.Cell>
                <Text>{toLocalTime(item?.created_at)}</Text>
              </Table.Cell>
              <Table.Cell>
                <EyeOpenIcon
                  height={"16"}
                  width={"16"}
                  color="indigo"
                  onClick={(event) => {
                    if (event.metaKey) {
                      window.open(
                        `/inspection?id=${item?.session_id}`,
                        "_blank"
                      );
                    } else {
                      push(`/inspection?id=${item?.session_id}`);
                    }
                  }}
                  className="cursor-pointer"
                />{" "}
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table.Root>
  );
};

export default SubTable;
