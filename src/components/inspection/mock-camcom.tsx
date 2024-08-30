import React from 'react';
import { Card, Text, Badge, Separator, Flex, Inset } from "@radix-ui/themes";
import { snakeToTitleCase } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const mockData = {
  output_json_camcom: {
    url_image: "https://mediapilot.camcom.ai/root/media_staging/qoalaid/test-query-param-1/damages/image1_de5ce245bad6.jpg",
    assessment_result: [
      {
        intensity: 4.0,
        parts_name: "Right Fender",
        suggestion: "Repair",
        damage_type: "dent"
      },
      {
        intensity: 10.0,
        parts_name: "Right Fog Lamp",
        suggestion: "Replace",
        damage_type: "broken"
      }
    ]
  }
};

const MockCamcomResultsInfo: React.FC = () => {
  const { t } = useTranslation();
  const { url_image, assessment_result } = mockData.output_json_camcom;

  return (
    <Card className="p-1 w-full">
      <Flex direction={"row"} className="gap-8">
        <Inset
          clip="padding-box"
          className="max-height-30 min-w-[384px] max-w-[384px] rounded-lg p-3"
        >
          <img
            src={url_image}
            alt="Camcom Assessment"
            className="min-w-[360px] max-w-[360px] cursor-pointer rounded-lg object-contain"
          />
        </Inset>
        <div className="flex grow flex-col justify-between gap-6">
          <div className="flex flex-col justify-between gap-2">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Text className="font-bold">{t("Camcom Assessment")}</Text>
              </div>
            </div>
            <Separator size={"4"} />
            <div className="grid grid-cols-2 gap-y-2">
              {assessment_result.map((result, index) => (
                <React.Fragment key={index}>
                  <Text className="max-w-120px pl-1 font-medium">
                    {t(snakeToTitleCase(result.parts_name))}
                  </Text>
                  <Badge className="w-min" color="gray">
                    {t(result.suggestion)}
                  </Badge>
                  <Text className="max-w-120px pl-1 font-medium">
                    {t("Damage Type")}
                  </Text>
                  <Badge className="w-min" color="red">
                    {t(result.damage_type)}
                  </Badge>
                  <Text className="max-w-120px pl-1 font-medium">
                    {t("Intensity")}
                  </Text>
                  <Badge className="w-min" color="amber">
                    {result.intensity}
                  </Badge>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </Flex>
    </Card>
  );
};

export default MockCamcomResultsInfo;