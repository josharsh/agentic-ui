import React, { useState } from "react";
import api from "@/common/api";
import { Button, Dialog, Flex, Heading, Text } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";

interface Props {
  buttonText?: any;
  buttonSlot?: any;
  buttonColor?: any;
  text?: any;
  actionButton?: any;
  cancelButton?: any;
  action?: any;
  cancel?: any;
  heading?: any;
  case_id?: any;
  session_id?: any;
}

const DialogBox: React.FC<Props> = ({
  buttonText,
  buttonSlot,
  buttonColor,
  heading,
  text,
  actionButton,
  cancelButton,
  action,
  cancel,
  case_id,
  session_id,
}) => {
  const [showApproveCase, setShowApproveCase] = useState<Boolean>(false),
    [open, setOpen] = useState(false),
    { t } = useTranslation();

  const doAction = async () => {
    if (!showApproveCase) {
      setShowApproveCase(true);
    }
    if (!showApproveCase) {
      await updateSession();
    } else {
      await patchCase();
      action();
    }
  };
  const updateSession = async () => {
    let params = {
      status: buttonText === "Reject" ? "rejected" : "approved",
    };
    await api.session
      .patchSessionStatus(params, session_id)
      .then((res) => setOpen(true))
      .catch((error) => setOpen(true));
  };

  const patchCase = async () => {
    let params = {
      status: buttonText === "Reject" ? "rejected" : "approved",
      remark: "",
    };
    await api.session
      .patchCase(params, case_id)
      .then(() => setOpen(false))
      .catch((error) => setOpen(true));
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger color="indigo">
        <div>
          <Button
            color={buttonColor}
            size={"2"}
            variant="solid"
            className="cursor-pointer"
          >
            {buttonSlot}
            {t(buttonText)}
          </Button>
        </div>
      </Dialog.Trigger>
      <Dialog.Content
        onPointerDownOutside={(e) => e.preventDefault()}
        size={"1"}
        className={
          `p-5` + (showApproveCase ? "pulse transition delay-700" : "")
        }
      >
        <Flex direction={"column"} gap={"6"}>
          <Flex className="items-center gap-6">
            <Flex gap={"2"} direction={"column"} className="grow">
              <Heading>
                {showApproveCase
                  ? t(heading.replace("Session", "Inspection"))
                  : t(heading)}
              </Heading>
              <Text>
                {showApproveCase
                  ? t(text.replace("session", "Inspection"))
                  : t(text)}
              </Text>
            </Flex>
          </Flex>
          <Flex gap="3" className="justify-end">
            <Dialog.Close>
              <div
                onClick={() => {
                  if (showApproveCase) {
                    action();
                  }
                  setShowApproveCase(false);
                }}
              >
                <Button color="gray" variant="soft" className="cursor-pointer">
                  {t(cancel) || t("Cancel")}
                </Button>
              </div>
            </Dialog.Close>

            <div>
              <Button
                color={buttonColor}
                variant="solid"
                onClick={() => doAction()}
                className="cursor-pointer"
              >
                {t(actionButton)}
              </Button>
            </div>
          </Flex>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default DialogBox;
