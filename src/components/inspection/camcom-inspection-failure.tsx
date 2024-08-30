import React from "react";
import { Badge, Card, Flex, Text } from "@radix-ui/themes";
import { AlertCircle, AlertCircleIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

const CamcomAssessmentFailure = ({ result }: { result: any }) => {
  const { t } = useTranslation();

  if (!result?.data?.vehicle?.error_message) {
    return null;
  }

  return (
    <Card className="my-2 p-4">
      <Flex direction="column" gap="2">
        <div className="flex gap-2">
          <AlertCircle height={"24"} width={"24"} />
          <Text className="font-bold">
            {t("Inspection Verdict")}: {t("Rejected")}
          </Text>
        </div>

        <Badge color="red" className="mt-2">
          {result.data.vehicle.error_message}
        </Badge>
      </Flex>
    </Card>
  );
};

export default CamcomAssessmentFailure;
