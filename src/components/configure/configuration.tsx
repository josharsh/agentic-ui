import React, { useEffect, useState } from "react";
import api from "@/common/api";
import { FILES_ALWAYS_REQUIRED } from "@/constants";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { Button, Card, Heading, Switch, Table, Text } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";

import { snakeToTitleCase } from "@/lib/utils";

function Configuration() {
  const [user, setUser] = useState<any>({}),
    [promptData, setPromptData] = useState([]),
    [documentData, setDocumentData] = useState([]),
    [inspectionRequirements, setInspectionRequirements] = useState<any>({}),
    [documentRequirements, setDocumentRequirements] = useState<any>({}),
    [allowInspectionRequirementChanges, setAllowInspectionRequirementChanges] =
      useState<Boolean>(false),
    [allowDocumentsChanges, setAllowDocumentChanges] = useState<Boolean>(false),
    { t } = useTranslation();

  useEffect(() => {
    getPromptDetails();
    getDocumentsDetails();
  }, []);

  useEffect(() => {
    if (promptData?.length && documentData?.length) {
      getUserDetails();
    }
  }, [promptData, documentData]);

  const getPromptDetails = () => {
    api.session
      .getPromptDetails()
      .then((resp: any) => setPromptData(resp))
      .catch((error) => console.log(error));
  };

  const getDocumentsDetails = () => {
    api.session
      .getDocumentsDetails()
      .then((resp) => setDocumentData(resp))
      .catch((error) => console.log(error));
  };

  const getUserDetails = () => {
    api.session
      .getUserDetails()
      .then((resp: any) => {
        let inspectionData: any = {};
        let documents: any = {};
        promptData.map((requirement: any) => {
          let obj: any = resp?.inspection?.find(
            (inspection: any) => requirement.id === inspection.id
          );
          if (obj) {
            obj.is_deleted = obj?.is_deleted === true ? false : true;
            inspectionData[obj?.id] = { ...obj };
          }
        });
        documentData.map((document: any) => {
          let obj: any = resp?.documents?.find(
            (inspection: any) => document.id === inspection.id
          );
          if (obj) {
            obj.is_deleted = obj?.is_deleted === true ? false : true;
            documents[obj?.id] = { ...obj };
          }
        });
        setDocumentRequirements(documents);
        setInspectionRequirements(inspectionData);
        setUser(resp);
      })
      .catch((error) => console.log(error));
  };

  const handleRequiredChange = (type: string, id: string) => {
    if (type === "prompt") {
      let inspections = { ...inspectionRequirements };
      let deleted = !inspections[id]?.is_deleted;
      if (id in inspections) {
        inspections[id] = {
          ...inspections[id],
          is_deleted: deleted,
        };
      } else {
        inspections[id] = {
          is_deleted: deleted,
          is_mandatory: false,
          id: id,
        };
      }
      setInspectionRequirements(inspections);
    }
    if (type === "document") {
      let documents = { ...documentRequirements };
      let deleted = !documents[id]?.is_deleted;

      if (id in documents) {
        documents[id] = {
          ...documents[id],
          is_deleted: deleted,
        };
      } else {
        documents[id] = {
          is_deleted: deleted,
          is_mandatory: false,
          id: id,
        };
      }
      setDocumentRequirements(documents);
    }
  };

  const handleMandatoryChange = (type: string, id: string) => {
    if (type === "prompt") {
      let inspections = { ...inspectionRequirements };
      let requiredInitially = inspections[id]?.is_deleted;
      let mandatoryChecked = !inspections[id]?.is_mandatory;
      let deleted = requiredInitially;
      if (mandatoryChecked === true && !inspections[id]?.is_deleted) {
        deleted = true;
      } else if (mandatoryChecked === false && requiredInitially === false) {
        deleted = false;
      }
      if (id in inspections) {
        inspections[id] = {
          ...inspections[id],
          is_mandatory: mandatoryChecked,
          is_deleted: deleted,
        };
      } else {
        inspections[id] = {
          is_mandatory: mandatoryChecked,
          is_deleted: deleted,
          id: id,
        };
      }
      setInspectionRequirements(inspections);
    }
    if (type === "document") {
      let documents = { ...documentRequirements };
      let requiredInitially = documents[id]?.is_deleted;
      let mandatoryChecked = !documents[id]?.is_mandatory;
      let deleted = requiredInitially;
      if (mandatoryChecked === true && !documents[id]?.is_deleted) {
        deleted = true;
      } else if (mandatoryChecked === false && requiredInitially === false) {
        deleted = false;
      }
      if (id in documents) {
        documents[id] = {
          ...documents[id],
          is_mandatory: mandatoryChecked,
          is_deleted: deleted,
        };
      } else {
        documents[id] = {
          is_mandatory: mandatoryChecked,
          is_deleted: deleted,
          id: id,
        };
      }

      setDocumentRequirements(documents);
    }
  };

  const handlePromptSave = () => {
    let inspectionData: any = [];
    Object.keys(inspectionRequirements).map((requirement: any) => {
      let obj: any = {
        prompt_id: inspectionRequirements[requirement]?.id,
        is_mandatory: inspectionRequirements[requirement]?.is_mandatory,
      };
      obj.is_deleted =
        inspectionRequirements[requirement]?.is_deleted === true ? false : true;
      inspectionData.push(obj);
    });
    api.session.linkPromptsToOrg(inspectionData, user?.id).then((resp) => {
      alert("Config Update Successfully");
      getUserDetails();
      setAllowInspectionRequirementChanges(false);
    });
  };
  const handleDocumentsSave = () => {
    let documentData: any = [];
    Object.keys(documentRequirements).map((requirement: any) => {
      let obj: any = {
        document_id: documentRequirements[requirement]?.id,
        is_mandatory: documentRequirements[requirement]?.is_mandatory,
      };
      obj.is_deleted =
        documentRequirements[requirement]?.is_deleted === true ? false : true;
      documentData.push(obj);
    });
    api.session.linkDocumentsToOrg(documentData).then((resp) => {
      alert("Config Update Successfully");
      getUserDetails();
      setAllowDocumentChanges(false);
    });
  };

  return (
    <div className="flex grow flex-col gap-6 pl-12 pt-6">
      <Heading weight={"bold"} align={"left"} size={"8"}>
        {t("Configuration")}
      </Heading>
      <div className="flex items-center gap-3">
        <Heading weight={"medium"} align={"left"} size={"5"}>
          {t("Inspection Requirements")}
        </Heading>

        <Button
          onClick={() =>
            setAllowInspectionRequirementChanges(
              !allowInspectionRequirementChanges
            )
          }
          className="cursor-pointer"
        >
          <Text>{t("Change config")}</Text>
        </Button>
      </div>
      <Card>
        <div className="flex h-96 w-full flex-col overflow-y-auto">
          <Table.Root
            variant="surface"
            className="w-9/12 border-none shadow-none"
          >
            <Table.Header className="border-0">
              <Table.Row className="border-0 shadow-none">
                <Table.Cell className="font-bold shadow-none">
                  {t("Image")}
                </Table.Cell>
                <Table.Cell className="font-bold shadow-none">
                  {t("Description")}
                </Table.Cell>
                <Table.Cell className="font-bold shadow-none">
                  {t("Required")}
                </Table.Cell>
                <Table.Cell className="font-bold shadow-none">
                  {t("Mandatory")}
                </Table.Cell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {promptData.map((requirement: any) => {
                return (
                  <Table.Row
                    key={requirement?.id}
                    className="m-3"
                    align={"center"}
                  >
                    <Table.Cell className="shadow-none">
                      {snakeToTitleCase(requirement?.label)}
                    </Table.Cell>
                    <Table.Cell className="shadow-none">
                      {snakeToTitleCase(requirement?.description)}
                    </Table.Cell>
                    <Table.Cell className="shadow-none">
                      <Switch
                        checked={
                          FILES_ALWAYS_REQUIRED.includes(requirement?.label)
                            ? true
                            : Boolean(
                                inspectionRequirements[requirement?.id]
                                  ?.is_deleted
                              )
                        }
                        onClick={() => {
                          if (
                            FILES_ALWAYS_REQUIRED.includes(
                              requirement?.label
                            ) ||
                            !allowInspectionRequirementChanges
                          ) {
                            return;
                          }
                          handleRequiredChange("prompt", requirement?.id);
                        }}
                        className={
                          !allowInspectionRequirementChanges ? "opacity-80" : ""
                        }
                      />
                    </Table.Cell>
                    <Table.Cell className="shadow-none">
                      <Switch
                        checked={
                          FILES_ALWAYS_REQUIRED.includes(requirement?.label)
                            ? true
                            : Boolean(
                                inspectionRequirements[requirement?.id]
                                  ?.is_mandatory
                              )
                        }
                        onClick={(event) => {
                          if (
                            FILES_ALWAYS_REQUIRED.includes(
                              requirement?.label
                            ) ||
                            !allowInspectionRequirementChanges
                          ) {
                            return;
                          }
                          handleMandatoryChange("prompt", requirement?.id);
                        }}
                        className={
                          !allowInspectionRequirementChanges ? "opacity-80" : ""
                        }
                      />
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table.Root>
        </div>
        {allowInspectionRequirementChanges ? (
          <div className="flex cursor-pointer flex-row-reverse gap-3">
            <Button onClick={() => setAllowInspectionRequirementChanges(false)}>
              {t("Cancel")}
            </Button>
            <Button
              onClick={() => handlePromptSave()}
              className="cursor-pointer"
            >
              {t("Save")}
            </Button>
          </div>
        ) : null}
      </Card>
      <div className="flex items-center gap-3">
        <Heading weight={"medium"} align={"left"} size={"5"}>
          {t("Document Requirements")}
        </Heading>
        <Button
          onClick={() => setAllowDocumentChanges(!allowDocumentsChanges)}
          className="cursor-pointer"
        >
          <Text>{t("Change config")}</Text>
        </Button>
      </div>
      <Card>
        <div className="flex h-96 w-full flex-col overflow-y-auto">
          <Table.Root
            variant="surface"
            className="w-9/12 border-none shadow-none"
          >
            <Table.Header className="border-0">
              <Table.Row className="border-0 shadow-none">
                <Table.Cell className="font-bold shadow-none">
                  {t("Document")}
                </Table.Cell>
                <Table.Cell className="font-bold shadow-none">
                  {t("Description")}
                </Table.Cell>
                <Table.Cell className="font-bold shadow-none">
                  {t("Required")}
                </Table.Cell>
                <Table.Cell className="font-bold shadow-none">
                  {t("Mandatory")}
                </Table.Cell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {documentData.map((requirement: any) => {
                return (
                  <Table.Row
                    key={requirement?.id}
                    className="m-3"
                    align={"center"}
                  >
                    <Table.Cell className="shadow-none">
                      {snakeToTitleCase(requirement?.label)}
                    </Table.Cell>
                    <Table.Cell className="shadow-none">
                      {snakeToTitleCase(requirement?.description)}
                    </Table.Cell>
                    <Table.Cell className="shadow-none">
                      <Switch
                        checked={Boolean(
                          documentRequirements[requirement?.id]?.is_deleted
                        )}
                        onClick={(event) => {
                          if (!allowDocumentsChanges) {
                            return;
                          }
                          handleRequiredChange("document", requirement?.id);
                        }}
                        className={!allowDocumentsChanges ? "opacity-80" : ""}
                      />
                    </Table.Cell>
                    <Table.Cell className="shadow-none">
                      <Switch
                        disabled={!allowDocumentsChanges}
                        checked={Boolean(
                          documentRequirements[requirement?.id]?.is_mandatory
                        )}
                        onClick={(event) => {
                          if (!allowDocumentsChanges) {
                            return;
                          }
                          handleMandatoryChange("document", requirement?.id);
                        }}
                        className={!allowDocumentsChanges ? "opacity-80" : ""}
                      />
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table.Root>
        </div>
        {allowDocumentsChanges ? (
          <div className="flex cursor-pointer flex-row-reverse gap-3">
            <Button onClick={() => setAllowDocumentChanges(false)}>
              {t("Cancel")}
            </Button>
            <Button
              onClick={() => handleDocumentsSave()}
              className="cursor-pointer"
            >
              {t("Save")}
            </Button>
          </div>
        ) : null}
      </Card>
    </div>
  );
}

export default Configuration;
