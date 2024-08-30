import React from "react";
import { useTranslation } from "react-i18next";
import { Badge, Card, Separator, Text } from "@radix-ui/themes";
import { snakeToTitleCase } from "@/lib/utils";
import { AxeIcon } from "lucide-react";

interface CamcomInfoProps {
  info: any;
}

const CamcomInfo: React.FC<CamcomInfoProps> = ({ info }) => {
  const { t } = useTranslation();

  if (!info?.output_json_camcom) {
    return null;
  }

  return (
    <div className="p-1">
      <div className="flex flex-col justify-between gap-2">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <AxeIcon/>
            <Text className="font-bold">{t("Damage Analysis")}</Text>
          </div>
        </div>
        <Separator size={"4"} />
        <div className="flex">
          <div className="overflow-x-auto ml-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("Part Name")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("Suggestion")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("Damage Type")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("Intensity")}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {info.output_json_camcom.assessment_result.map((result: any, index: number) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Text className="font-medium">{t(snakeToTitleCase(result.parts_name))}</Text>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className="w-min" color="gray">
                        {t(result.suggestion)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className="w-min" color="red">
                        {t(result.damage_type)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className="w-min" color="amber">
                        {result.intensity}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CamcomInfo;