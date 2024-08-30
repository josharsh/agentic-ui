import { CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import PlayThumbnail from "@/../public/images/play.svg";
import api from "@/common/api";
import {
  CaseStage,
  formatSessionStage,
  INSURER_STAGES,
  MIN_GREEN_SCORE,
  MIN_YELLOW_SCORE,
  SessionStage,
} from "@/constants";
import {
  AWS_ACCESS_KEY,
  AWS_REGION_NAME,
  AWS_S3_BUCKET_NAME,
  AWS_SECRET_KEY,
} from "@/constants/config";
import { useUser } from "@/user-context";
import { getSessionRemarkBadgeColor, getStageBadgeColor } from "@/utils/utils";
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ClockIcon,
  InfoCircledIcon,
  Pencil2Icon,
} from "@radix-ui/react-icons";
import {
  Badge,
  Box,
  Button,
  Card,
  Dialog,
  Flex,
  Heading,
  IconButton,
  Inset,
  Separator,
  Text,
  TextArea,
} from "@radix-ui/themes";
import AWS from "aws-sdk";
import { EyeIcon, RotateCwIcon } from "lucide-react";
import { Trans, useTranslation } from "react-i18next";
import QuickPinchZoom, { make3dTransformValue } from "react-quick-pinch-zoom";

import {
  getParameterByName,
  scrollToTop,
  snakeToTitleCase,
  toLocalTime,
} from "@/lib/utils";

import DialogBox from "../common/dialogBox";
import Loader from "../common/loader";
import AiInfo from "./ai-info";
import CamcomAssessmentFailure from "./camcom-inspection-failure";
import CamcomInfo from "./camcom-info";

AWS.config.update({
  credentials: new AWS.Credentials(AWS_ACCESS_KEY, AWS_SECRET_KEY),
  region: AWS_REGION_NAME,
});

const fixedStyle: CSSProperties = {
  position: "fixed",
  bottom: "20px",
  right: "calc((100% - 1400px) / 2)",
};

const rightAlignStyle: CSSProperties = {
  textAlign: "right",
};

function InspectionDashboard() {
  const [sessionStage, setSessionStage] = useState<string>("");
  const [imageToView, setImageToView] = useState<string>("");
  const [camcomAssessmentResult, setCamcomAssessmentResult] = useState<any>(null);
  const [showConfirmationDialog, setShowConfirmationDialog] =
    useState<boolean>(false);
  const [confirmationAction, setConfirmationAction] = useState<string>("");
  const [hoverInformation, setHoverInformation] = useState<string>("");
  const [caseStage, setCaseStage] = useState<string>("");
  const [isEditingRemark, setIsEditingRemark] = useState<boolean>(true);
  const [showOptionalCaseUpdateDialog, setShowOptionalCaseUpdateDialog] =
    useState<boolean>(false);
  const [showInformationDialog, setShowInformationDialog] =
    useState<boolean>(false);
  const [dialogInformation, setDialogInformation] = useState<string>("");
  const [showVehicleDetails, setShowVehicleDetails] = useState<Boolean>(false),
    [session, setSession] = useState<any>([]),
    [selectedFile, setSelectedFile] = useState<any>({}),
    [fileRemark, setFileRemark] = useState<string>(""),
    [inspectedImages, showInspectedImages] = useState<number>(0),
    [selectedFileIndex, setSelectedFileIndex] = useState<number>(0),
    [loading, setLoading] = useState<Boolean>(true),
    [invalidURL, setInvalidURL] = useState<Boolean>(false),
    [result, setResult] = useState<any>({}),
    [showImageViewer, setShowImageViewer] = useState<boolean>(false),
    [caseRemark, setCaseRemark] = useState<string>(""),
    [sessionRemark, setSessionRemark] = useState<string>(""),
    [showCaseUpdateDialog, setShowCaseUpdateDialog] = useState<boolean>(false),
    [caseUpdateAction, setCaseUpdateAction] = useState<string>(""),
    [showSessionUpdateDialog, setShowSessionUpdateDialog] =
      useState<boolean>(false),
    [sessionUpdateAction, setSessionUpdateAction] = useState<string>(""),
    [userType, setUserType] = useState<string>(""),
    contentDivRef: any = useRef(),
    { asPath, push } = useRouter(),
    router = useRouter(),
    { t } = useTranslation(),
    imgRef: any = useRef(),
    onUpdate: any = useCallback((props: any) => {
      const { current: img } = imgRef,
        x = props.x,
        y = props.y,
        scale = props.scale;

      if (img) {
        const value: any = make3dTransformValue({ x, y, scale });
        img.style.setProperty("transform", value);
      }
    }, []),
    s3 = new AWS.S3();

  const { user, loading: userLoading } = useUser();

  const [rotationAngle, setRotationAngle] = useState<number>(0);

  const handleRotateImage = () => {
    setRotationAngle((prevAngle) => (prevAngle + 90) % 360);
  };

  useEffect(() => {
    getSession();
  }, []);

  useEffect(() => {
    if (user && !userLoading) {
      // getSession();
      setUserType(user?.user_type || "");
    }
  }, [user, userLoading]);

  useEffect(() => {
    if (contentDivRef && contentDivRef.current) {
      setTimeout(() => {
        scrollToTop(contentDivRef.current);
      }, 200);
    }
    if (selectedFile?.id) {
      handleAddNewParam(selectedFile.id);
    }
  }, [selectedFile]);

  const handleAddNewParam = (param: number) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, file: param },
    });
  };

  const calculateInspectedImages = (files: any[]) => {
    return files.filter((file) => file.remark && file.remark.remark).length;
  };

  const saveFileRemark = async () => {
    if (selectedFile?.id && fileRemark !== selectedFile?.remark?.remark) {
      try {
        const params = {
          status: "Reviewed",
          remark: fileRemark,
        };
        const response = await api.session.updateFileRemark(
          selectedFile.id,
          params
        );
        if (response.status == 200) {
          const updatedRemark = {
            ...selectedFile.remark,
            remark: fileRemark,
            status: params.status,
          };
          setSelectedFile((prevFile: any) => ({
            ...prevFile,
            remark: updatedRemark,
          }));
          setResult((prevResult: any) => {
            const updatedFiles = prevResult.files.map((file: any) =>
              file.id === selectedFile.id
                ? { ...file, remark: updatedRemark }
                : file
            );
            showInspectedImages(calculateInspectedImages(updatedFiles));
            setIsEditingRemark(false);
            return { ...prevResult, files: updatedFiles };
          });
        } else {
          console.error(t("Failed to save remark"), response.statusText);
        }
      } catch (error) {
        console.error(t("Error saving remarks"), error);
      }
    }
  };

  const handlePreviousImage = async () => {
    await saveFileRemark();
    if (selectedFileIndex > 0) {
      const newIndex = selectedFileIndex - 1;
      setSelectedFile(result?.files[newIndex]);
      setFileRemark(result?.files[newIndex]?.remark?.remark);
      setSelectedFileIndex(newIndex);
    }
  };

  const handleNextImage = async () => {
    await saveFileRemark();
    if (selectedFileIndex < result?.files?.length - 1) {
      const newIndex = selectedFileIndex + 1;
      setSelectedFile(result?.files[newIndex]);
      setFileRemark(result?.files[newIndex]?.remark?.remark);
      setSelectedFileIndex(newIndex);
    }
  };

  const getSession = async () => {
    let session_id: any = getParameterByName("id", asPath);
    if (!session_id) {
      return;
    }
    setLoading(true);
    try {
      const resp = await api.session.getSession(session_id);
      setSessionStage(resp.stage);
      setCaseStage(resp.case_info.stage);
      setCaseRemark(resp.case_info.remark?.remark || "");
      setSessionRemark(resp.remark?.remark || "");
      if (resp.camcom_assessment_result) {
        setCamcomAssessmentResult(resp.camcom_assessment_result);
      }
      resp.files = resp?.files.sort((a: any, b: any) => {
        if (a.file["mime_type"] > b.file["mime_type"]) {
          return 1;
        }
        if (b.file["mime_type"] > a.file["mime_type"]) {
          return -1;
        }
        return 0;
      });
      let index = resp.files.findIndex(
        (obj: any) => obj?.file.mime_type.includes("video")
      );
      let pageOne: any = [];
      if (index !== -1) {
        pageOne = resp?.files.slice(0, index);
      } else {
        pageOne = resp?.files;
      }
      await generateFiles(pageOne, resp);
      setResult(resp);
      showInspectedImages(calculateInspectedImages(resp.files));
    } catch (error: any) {
      setLoading(false);
      if (error?.response?.data?.detail === t("Invalid Session ID")) {
        setInvalidURL(true);
      }
    }
  };

  async function generateFiles(resp: any, result: any = {}) {
    await Promise.all(
      resp.map(async (image: any) => {
        let src = await getS3Image(image.file.s3_key);
        image.file.src = src;
      })
    );

    if (resp) {
      let fileselected = resp.find((file: any) => file.id === selectedFile?.id),
        fileId = getParameterByName("file", asPath);

      if (!fileselected && fileId) {
        fileselected = resp.find((file: any) => file.id.toString() === fileId);
      }

      if (fileselected) {
        setSelectedFile(fileselected);
        setFileRemark(fileselected?.remark?.remark);
      } else {
        setSelectedFile(resp[0]);
        setFileRemark(resp[0]?.remark?.remark);
      }
      if (resp.length === 0) {
        setSelectedFile(result?.files[0]);
        setFileRemark(result?.files[0]?.remark?.remark);
      }
      if (session?.length > 0) {
        resp = session?.concat(resp);
      }
      let count = 0;
      resp?.forEach((file: any) => {
        if (
          file.output_json &&
          "is_real_image" in file.output_json &&
          file.output_json.is_real_image !== null &&
          file.output_json.is_real_image !== undefined
        ) {
          let text = file.output_json.is_real_image.toString().toLowerCase();
          if (text === "true" || text === "false") {
            file.output_json.is_real_image = text === "true" ? "yes" : "no";
          } else {
            file.output_json.is_real_image = text;
          }
        }

        if (
          file?.remark?.status === "approved" ||
          file?.remark?.status === "rejected"
        ) {
          count++;
        }
      });
      showInspectedImages(count);
      setSession(resp);
    }
    setLoading(false);
  }

  async function getS3Image(key: string) {
    if (!key) {
      return;
    }
    var getParams = {
      Bucket: AWS_S3_BUCKET_NAME, // your bucket name,
      Key: key, // path to the object you're looking for
    };

    try {
      const data: any = await new Promise((resolve, reject) => {
        s3.getObject(getParams, function (err, data: any) {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });

      const objectData = data.Body.toString("base64"),
        imageData = "data:image/png;base64," + objectData;
      return imageData;
    } catch (err) {
      console.error(err);
    }
  }

  const updateSessionStatus = (status: string) => {
    setSessionUpdateAction(status);
    setFileRemark("");
    setShowSessionUpdateDialog(true);
  };

  const confirmSessionStatusUpdate = async (status: string) => {
    let params = {
      stage: status,
      remark: fileRemark,
    };
    try {
      await api.session.updateSessionStatus(result.session_id, params);

      setSessionStage(status);
      if (status === SessionStage.VALID) {
        setShowCaseUpdateDialog(true);
      } else {
        setShowOptionalCaseUpdateDialog(true);
        getSession();
      }
      setShowSessionUpdateDialog(false);
    } catch (error) {
      console.error(t("Error updating session status"), error);
    }
  };

  const sendToInsurer = () => {
    setCaseUpdateAction("UNDER_REVIEW_WITH_INSURER");
    setCaseRemark("");
    setShowCaseUpdateDialog(true);
  };

  const sendToEnquiryByBroker = () => {
    setCaseRemark("");
    setCaseUpdateAction("ENQUIRY_BY_BROKER");
    setShowOptionalCaseUpdateDialog(true);
  };

  const sendToEnquiryByInsurer = () => {
    setCaseRemark("");
    setCaseUpdateAction("ENQUIRY_BY_INSURER");
    setShowOptionalCaseUpdateDialog(true);
  };

  const updateCaseStatus = async (status: string) => {
    let params = {
      stage: status,
      remark: caseRemark,
    };
    try {
      await api.session.updateCaseStage(result.case_info.case_id, params);
      if (userType == "insurer") {
        if (status === CaseStage.APPROVED || status === CaseStage.REJECTED) {
          setDialogInformation(t(`Case status updated to ${status}`));
          setShowInformationDialog(true);
        }
        setShowOptionalCaseUpdateDialog(false);
      } else {
        setShowCaseUpdateDialog(false);
        setShowOptionalCaseUpdateDialog(false);
      }
      getSession();
    } catch (error) {
      console.error(t("Error updating case status"), error);
    }
  };
  return (
    <>
      {loading ? (
        <div className="w-full p-10">
          <Loader />
        </div>
      ) : invalidURL ? (
        <main className="p-4">
          <Box className="full-width flex justify-center">
            <Heading as="h1" mt="4" mb="2" weight="bold" size="6">
              <Trans i18nKey="Invalid Link" components={{ br: <br /> }} />
            </Heading>
          </Box>
        </main>
      ) : (
        <div className="flex max-h-full max-w-[1400px] grow flex-col gap-6 overflow-y-hidden pl-4 pt-6">
          <div className="flex flex-col gap-6">
            {caseRemark ? (
              <div
                className="mx-1 rounded-lg p-2"
                style={{
                  display: "inline-block",
                  maxWidth: "320px",
                  whiteSpace: "normal",
                  wordWrap: "break-word",
                }}
              >
                <Badge
                  color={getStageBadgeColor(caseStage)}
                  className="rounded-lg"
                >
                  {caseRemark}{" "}
                </Badge>
              </div>
            ) : null}
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ArrowLeftIcon
                height={"18"}
                width={"18"}
                onClick={() => push("/dashboard")}
                className="cursor-pointer"
              ></ArrowLeftIcon>
              <Heading weight={"bold"} align={"left"} size={"8"}>
                {t("Inspection Details")}
              </Heading>
              <Badge
                color={
                  !sessionStage
                    ? "amber"
                    : sessionStage === SessionStage.VALID
                      ? "green"
                      : "red"
                }
                size={"2"}
              >
                {t(formatSessionStage(sessionStage))}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              {hoverInformation.length > 0 && (
                <div className="rounded bg-black p-2 text-white">
                  <p className="text-sm">{hoverInformation}</p>
                </div>
              )}
              {userType === "broker" && (
                <>
                  <div className="broker-button-group flex items-center space-x-2">
                    {sessionStage === SessionStage.VALID &&
                    caseStage !== CaseStage.UNDER_REVIEW_WITH_INSURER ? (
                      <Button
                        className="w-50 cursor-pointer"
                        size={"2"}
                        onClick={sendToInsurer}
                        disabled={INSURER_STAGES.includes(caseStage)}
                      >
                        {t("Send to Insurer")}
                      </Button>
                    ) : null}
                    {sessionStage === SessionStage.INVALID &&
                    [
                      CaseStage.ENQUIRY_BY_BROKER.toString(),
                      CaseStage.UNDER_REVIEW_WITH_BROKER.toString(),
                    ].includes(caseStage) ? (
                      <Button
                        disabled={INSURER_STAGES.includes(caseStage)}
                        className="w-50 cursor-pointer"
                        size={"2"}
                        onClick={sendToEnquiryByBroker}
                      >
                        {t("Send Enquiry to User")}
                      </Button>
                    ) : null}
                    <Button
                      disabled={
                        sessionStage === SessionStage.VALID ||
                        INSURER_STAGES.includes(caseStage)
                      }
                      className="w-50 cursor-pointer"
                      size={"2"}
                      onClick={() => updateSessionStatus(SessionStage.VALID)}
                    >
                      {t("Mark as Valid")}
                    </Button>
                    <Button
                      disabled={
                        sessionStage === SessionStage.INVALID ||
                        INSURER_STAGES.includes(caseStage)
                      }
                      className="w-50 cursor-pointer"
                      size={"2"}
                      onClick={() => updateSessionStatus(SessionStage.INVALID)}
                      color="red"
                    >
                      {t("Mark as Invalid")}
                    </Button>
                    {INSURER_STAGES.includes(caseStage) &&
                    userType == "broker" ? (
                      <InfoCircledIcon
                        height={"16"}
                        width={"16"}
                        onMouseEnter={() =>
                          setHoverInformation(
                            "Case is with Insurer. No Changes are allowed."
                          )
                        }
                        onMouseLeave={() => setHoverInformation("")}
                        className="cursor-pointer"
                      />
                    ) : null}
                  </div>
                </>
              )}
              {userType === "insurer" &&
                sessionStage === SessionStage.VALID && (
                  <div className="insurer-button-group flex items-center space-x-2">
                    <Button
                      disabled={[
                        CaseStage.APPROVED.toString(),
                        CaseStage.REJECTED.toString(),
                        CaseStage.ENQUIRY_BY_INSURER.toString(),
                      ].includes(caseStage)}
                      className="w-50 cursor-pointer"
                      size={"2"}
                      onClick={sendToEnquiryByInsurer}
                    >
                      {t("Send Enquiry")}
                    </Button>
                    <Button
                      className="w-50 cursor-pointer"
                      size={"2"}
                      onClick={() => {
                        setConfirmationAction("APPROVED");
                        setShowConfirmationDialog(true);
                      }}
                      // onClick={() => updateCaseStatus("APPROVED")}
                      color="green"
                      disabled={[
                        CaseStage.APPROVED.toString(),
                        CaseStage.ENQUIRY_BY_INSURER.toString(),
                      ].includes(caseStage)}
                    >
                      {t("Accept Case")}
                    </Button>
                    <Button
                      className="w-50 cursor-pointer"
                      size={"2"}
                      onClick={() => {
                        setConfirmationAction("REJECTED");
                        setShowConfirmationDialog(true);
                      }}
                      // onClick={() => updateCaseStatus("REJECTED")}
                      color="red"
                      disabled={[
                        CaseStage.APPROVED.toString(),
                        CaseStage.ENQUIRY_BY_INSURER.toString(),
                        CaseStage.REJECTED.toString(),
                      ].includes(caseStage)}
                    >
                      {t("Reject Case")}
                    </Button>
                  </div>
                )}
            </div>
          </div>
          <div className="pl-7">
            <span>
              {result?.case_info?.vehicle_number ||
                result?.case_info?.metadata?.[`Plat Nomor`]}
            </span>
          </div>
          <div className="flex gap-6">
            <div className="scrollbar flex h-[calc(100vh-210px)] w-1/4 min-w-[320px] max-w-[320px] flex-col gap-2 overflow-y-auto pr-1">
              {sessionRemark ? (
                <div className="flex flex-col gap-2">
                  <Text className="ml-2">
                    <strong>{t("Session Remarks")}: </strong>
                  </Text>
                  <Badge
                    color={getSessionRemarkBadgeColor(sessionStage)}
                    className="mx-1 rounded-lg"
                    style={{ whiteSpace: "normal", wordWrap: "break-word" }} // Add this line
                  >
                    {sessionRemark}{" "}
                  </Badge>
                </div>
              ) : null}

              <Card>
                <div className=" flex items-center justify-between gap-6">
                  <Text>{t("Vehicle Details")}</Text>
                  {!showVehicleDetails ? (
                    <ChevronDownIcon
                      height={"16"}
                      width={"16"}
                      onClick={() => setShowVehicleDetails(true)}
                      className="cursor-pointer"
                    />
                  ) : null}
                  {showVehicleDetails ? (
                    <ChevronUpIcon
                      height={"16"}
                      width={"16"}
                      onClick={() => setShowVehicleDetails(false)}
                      className="cursor-pointer"
                    />
                  ) : null}
                </div>
                {showVehicleDetails ? (
                  <div className="mt-2">
                    <Separator orientation="horizontal" size="4" />

                    {result?.case_info?.metadata &&
                      Object.keys(result.case_info.metadata).map(
                        (key: string, index: number) => (
                          <div
                            className="my-2 flex items-center justify-between gap-6"
                            key={index}
                          >
                            <Text>{t(snakeToTitleCase(key))}</Text>
                            <Text style={rightAlignStyle}>
                              {result?.case_info?.metadata[key]}
                            </Text>
                          </div>
                        )
                      )}
                  </div>
                ) : null}
              </Card>
              <Card>
                <div className="mb-2 flex items-center justify-between gap-6">
                  <Text>{t("Customer Name")}</Text>
                  <Text style={rightAlignStyle}>
                    {result?.case_info?.metadata.customer_name}
                  </Text>
                </div>
                <div className="my-2 flex items-center justify-between gap-6">
                  <Text>{t("Agent Name")}</Text>
                  <Text style={rightAlignStyle}>
                    {result?.case_info?.created_by_user?.first_name}{" "}
                    {result?.case_info?.created_by_user?.last_name}
                  </Text>
                </div>
                <Separator orientation="horizontal" size="4" />

                <div className="my-2 flex items-center justify-between gap-6">
                  <Text>{t("Capturing Date")}</Text>
                  <Text style={rightAlignStyle}>
                    {toLocalTime(result?.created_at)} 
                  </Text>
                </div>
              </Card>
              <div className="my-4 flex gap-3">
                <Heading weight={"bold"} align={"left"} size={"5"}>
                  {t("Inspection Items")}
                </Heading>
                <Badge color="gray" size={"2"}>
                  {inspectedImages}/
                  {
                     result?.files?.length
                    // result?.files?.filter(
                    //   (file: any) => !file.file.mime_type.includes("video")
                    // ).length
                  }{" "}
                  {t("Inspected")}
                </Badge>
              </div>
              <div className="flex w-full flex-col gap-4">
              {result?.files
              ?.filter((file: any) => file.tag !== null || file.file.mime_type === "video/mp4")
              .map((file: any, index: number) => {
                  // return file?.file?.mime_type.includes("video") ? "Text" : 
                  return (
                    <Card
                      key={index}
                      onClick={() => {
                        setFileRemark(file?.remark?.remark);
                        setSelectedFileIndex(index);
                        setSelectedFile(file);
                        generateFiles([file]);
                      }}
                      className={
                        selectedFile?.id === file?.id
                          ? "cursor-pointer border-2 border-blue-200 bg-blue-300"
                          : "cursor-pointer"
                      }
                    >
                      <Flex className="items-center gap-4">
                        <Inset
                          clip="padding-box"
                          className="w-[100px] min-w-[100px] rounded-lg p-3"
                        >
                          {file?.file?.src &&
                          !file?.file?.mime_type.includes("video") ? (
                            <img
                              src={file?.file?.src}
                              alt="Bold typography"
                              className="h-[80px] w-[100px] rounded-lg object-cover"
                            />
                          ) : (
                            <img
                              src={PlayThumbnail.src}
                              alt="Bold typography"
                              className="h-[80px] w-[100px] rounded-lg"
                            />
                          )}
                        </Inset>
                        
                        <Flex direction={"column"} gap={"2"} className="grow ">
                          <Text>
                            {!file?.file?.mime_type.includes("video")
                              ? snakeToTitleCase(
                                  file?.file.original_file_name.split("-")[1]
                                )
                              : snakeToTitleCase("Video")}{" "}
                            <Badge
                              color={
                                file?.remark?.status === "pending"
                                  ? "amber"
                                  : file?.remark?.status === "Reviewed"
                                    ? "green"
                                    : "red"
                              }
                            >
                              {t(file?.remark.status)}
                            </Badge>
                          </Text>
                          <Text className="flex items-center">
                            <ClockIcon />
                            {toLocalTime(file?.created_at)}
                          </Text>
                        </Flex>
                      </Flex>
                    </Card>
                  );
                })}
              </div>
            </div>
            <div
              className="scrollbar h-[calc(100vh-210px)] grow overflow-y-auto pr-2"
              ref={contentDivRef}
            >
              {selectedFile ? (
                <Card className="px-1">
                  <Flex direction={"column"} className="gap-6">
                    <Flex className="justify-between ">
                      <Flex className="items-center gap-2">
                        <Text className="font-bold">
                          {" "}
                          {!selectedFile?.file?.mime_type.includes("video")
                            ? snakeToTitleCase(
                                selectedFile?.file?.original_file_name.split(
                                  "-"
                                )[1]
                              )
                            : snakeToTitleCase("Video")}{" "}
                        </Text>
                        <Badge
                          size={"2"}
                          color={
                            selectedFile?.remark?.status === "pending"
                              ? "amber"
                              : selectedFile?.remark?.status === "Reviewed"
                                ? "green"
                                : "red"
                          }
                        >
                          {t(selectedFile?.remark?.status)}
                        </Badge>
                      </Flex>
                      <Text className="flex items-center gap-2">
                        <ClockIcon />
                        {toLocalTime(selectedFile?.created_at)}
                      </Text>
                    </Flex>
                    <Flex direction={"row"} className="h-px-600 gap-8">
                      <Inset
                        clip="padding-box"
                        className="max-height-30 min-w-[384px] max-w-[384px] rounded-lg p-3"
                      >
                         
                        {!selectedFile?.file?.mime_type.includes("video") ? (
                          <img
                            src={selectedFile?.file?.src}
                            alt="Car Image"
                            className="min-w-[360px] max-w-[360px] cursor-pointer rounded-lg  object-contain"
                            onClick={() => {
                              setImageToView(selectedFile?.file?.src);
                              setShowImageViewer(true);
                            }}
                          />
                        ) : (
                          <>
                            <video
                              key={selectedFile?.file?.src}
                              controls
                              controlsList="nodownload noplaybackrate"
                              muted
                              className="max-height-30 w-[360xp] min-w-[360px] max-w-[360px] rounded-lg p-3"
                            >
                              <source
                                src={selectedFile?.file?.src}
                                type="video/mp4"
                              />
                            </video>
                          </>
                        )}
                        {selectedFile?.output_json_camcom?.url_image ? 
                         (<div className="mt-4 p-2">
                          <strong className="mt-1">{t("Annotated Image")}</strong>
                         <img
                          src={selectedFile?.output_json_camcom?.url_image}
                          alt="Car Image"
                          className="min-w-[360px] max-w-[360px] cursor-pointer rounded-lg  object-contain"
                          onClick={() => {
                            setImageToView(selectedFile?.output_json_camcom?.url_image);
                            setShowImageViewer(true);
                          }}
                         />
                       </div>): null}
                      </Inset>
                      <div className="flex grow flex-col justify-between gap-6">

                        {!selectedFile?.file?.mime_type.includes("video") ? (
                          <Card className="p-1">
                            <div className="flex flex-col justify-between gap-2">
                              <div className="flex items-center justify-between">
                                <div className="flex gap-2">
                                  <EyeIcon height={"24"} width={"24"} />
                                  <Text className="font-bold">
                                    {t("AI Auto Inspector")}
                                  </Text>
                                </div>
                                {/* <Text
                                  className={
                                    selectedFile?.output_json?.score >=
                                    MIN_GREEN_SCORE
                                      ? "rounded-md bg-green-600 px-3 py-1 font-bold text-white"
                                      : selectedFile?.output_json?.score >=
                                          MIN_YELLOW_SCORE
                                        ? " rounded-md bg-yellow-300 px-3 py-1  font-bold text-white"
                                        : " rounded-md bg-red-500 px-3 py-1  font-bold text-white"
                                  }
                                >
                                  {selectedFile?.output_json?.score || 0}
                                </Text> */}
                              </div>
                              <Separator size={"4"} />
                              {typeof selectedFile?.output_json === "string" ? (
                                <div className="p-2">
                                  <Text>{selectedFile?.output_json}</Text>
                                </div>
                              ) : (
                                <AiInfo info={selectedFile} />
                              )}
                              
                              {selectedFile?.output_json_camcom? (
                                <CamcomInfo info={selectedFile} />
                              ): null}
                            </div>
                          </Card>
                        ) : null}
                        
                        <CamcomAssessmentFailure result={camcomAssessmentResult} />
                        <div className="mb-10 flex grow flex-col gap-6">
                          <div className="flex items-center gap-2">
                            <Text>{t("Remarks")}</Text>
                            {!INSURER_STAGES.includes(caseStage) && (
                              <Pencil2Icon
                                height={"16"}
                                width={"16"}
                                onClick={() => setIsEditingRemark(true)}
                                className="cursor-pointer"
                              />
                            )}
                          </div>
                          {(isEditingRemark ||
                            selectedFile?.remark?.status === "pending") &&
                          !INSURER_STAGES.includes(caseStage) ? (
                            <>
                              <TextArea
                                variant="classic"
                                size={"3"}
                                value={fileRemark}
                                onChange={(e) => setFileRemark(e.target.value)}
                              />
                            </>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Text>
                                {selectedFile?.remark?.remark || "N/A"}
                              </Text>
                            </div>
                          )}
                          {(isEditingRemark ||
                            selectedFile?.remark?.status === "pending") &&
                            !INSURER_STAGES.includes(caseStage) && (
                              <Button
                                className="w-50 cursor-pointer"
                                disabled={
                                  !isEditingRemark ||
                                  fileRemark === selectedFile?.remark?.remark ||
                                  INSURER_STAGES.includes(caseStage)
                                }
                                variant="solid"
                                size={"2"}
                                onClick={saveFileRemark}
                              >
                                {t("Save")}
                              </Button>
                            )}
                        </div>
                        <div
                          className="flex flex-row justify-end gap-4 bg-white"
                          style={fixedStyle}
                        >
                          <Button
                            className="w-50 cursor-pointer"
                            variant="outline"
                            size={"2"}
                            onClick={handlePreviousImage}
                            disabled={Boolean(selectedFileIndex === 0)}
                          >
                            {t("Previous")}
                          </Button>
                          <Button
                            className="w-50 cursor-pointer"
                            variant="outline"
                            size={"2"}
                            onClick={handleNextImage}
                            disabled={Boolean(
                              selectedFileIndex === result?.files?.length - 1
                            )}
                          >
                            {t("Next")}
                          </Button>
                        </div>
                      </div>
                    </Flex>
                  </Flex>
                </Card>
              ) : null}   
            </div>
          </div>
        </div>
      )}

      <Dialog.Root
        open={showConfirmationDialog}
        onOpenChange={setShowConfirmationDialog}
      >
        <Dialog.Content>
          <Dialog.Title>{t("Confirm Action")}</Dialog.Title>
          <Dialog.Description>
            {t(
              `Are you sure? Case Will be ${confirmationAction.toLowerCase()}`
            )}
          </Dialog.Description>
          <div className="mt-4 flex gap-4">
            <Button
              className="w-50 cursor-pointer"
              onClick={() => {
                updateCaseStatus(confirmationAction);
                setShowConfirmationDialog(false);
              }}
            >
              {t("Confirm")}
            </Button>
            <Button
              className="w-50 cursor-pointer"
              onClick={() => setShowConfirmationDialog(false)}
            >
              {t("Cancel")}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Root>

      <Dialog.Root
        open={showInformationDialog}
        onOpenChange={setShowInformationDialog}
      >
        <Dialog.Content>
          <Dialog.Title>{t("Case Stage Update")}</Dialog.Title>
          <Dialog.Description>{t(dialogInformation)}</Dialog.Description>
        </Dialog.Content>
      </Dialog.Root>
      <Dialog.Root
        open={showOptionalCaseUpdateDialog}
        onOpenChange={setShowOptionalCaseUpdateDialog}
      >
        <Dialog.Content>
          <Dialog.Title>{t("Case Status Update")}</Dialog.Title>
          <Dialog.Description>
            {t(`Are you sure you want to update the case stage?`)}
          </Dialog.Description>
          <TextArea
            variant="classic"
            size={"3"}
            value={caseRemark}
            onChange={(e) => setCaseRemark(e.target.value)}
          />
          <div className="mt-4 flex gap-4">
            <Button
              className="w-50 cursor-pointer"
              onClick={() =>
                updateCaseStatus(
                  userType == "insurer"
                    ? "ENQUIRY_BY_INSURER"
                    : "ENQUIRY_BY_BROKER"
                )
              }
              disabled={!caseRemark}
            >
              {t("Send to Enquiry")}
            </Button>
            <Button
              className="w-50 cursor-pointer"
              onClick={() => setShowOptionalCaseUpdateDialog(false)}
            >
              {t("Cancel")}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Root>

      <Dialog.Root open={showImageViewer}>
        <Dialog.Content
          onEscapeKeyDown={() => setShowImageViewer(!showImageViewer)}
          onPointerDownOutside={() => setShowImageViewer(!showImageViewer)}
        >
          {selectedFile?.file?.src ? (
            <>
              <QuickPinchZoom onUpdate={onUpdate}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: rotationAngle % 180 === 0 ? "100%" : "auto",
                    height: rotationAngle % 180 === 0 ? "auto" : "100%",
                  }}
                >
                  <img
                    ref={imgRef}
                    src={imageToView}
                    alt="inspection photo"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      transform: `rotate(${rotationAngle}deg)`,
                      transition: "transform 0.3s ease-in-out",
                    }}
                  />
                </div>
              </QuickPinchZoom>
              <RotateCwIcon
                onClick={handleRotateImage}
                className="cursor-pointer mt-5"
              />
            </>
          ) : null}
        </Dialog.Content>
      </Dialog.Root>
      <Dialog.Root
        open={showSessionUpdateDialog}
        onOpenChange={setShowSessionUpdateDialog}
      >
        <Dialog.Content>
          <Dialog.Title>{t("Update Session Status")}</Dialog.Title>
          <Dialog.Description>
            {t("Please provide remarks and update the session status.")}
          </Dialog.Description>
          <TextArea
            className="rounded-md border-2 text-white"
            variant="classic"
            size={"3"}
            value={fileRemark}
            onChange={(e) => setFileRemark(e.target.value)}
          />
          <Button
            className="w-50 m-2 cursor-pointer"
            onClick={() => confirmSessionStatusUpdate(sessionUpdateAction)}
            disabled={!fileRemark}
          >
            {t(
              sessionUpdateAction === "VALID"
                ? "Mark as Valid"
                : "Mark as Invalid"
            )}
          </Button>
          <Button
            className="w-50 m-2 cursor-pointer"
            onClick={() => setShowSessionUpdateDialog(false)}
          >
            {t("Cancel")}
          </Button>
        </Dialog.Content>
      </Dialog.Root>
      <Dialog.Root
        open={showCaseUpdateDialog}
        onOpenChange={setShowCaseUpdateDialog}
      >
        <Dialog.Content>
          <Dialog.Title>{t("Update Case Status")}</Dialog.Title>
          <Dialog.Description>
            {t("Please provide remarks and update the case status.")}
          </Dialog.Description>
          <TextArea
            variant="classic"
            size={"3"}
            value={caseRemark}
            onChange={(e) => setCaseRemark(e.target.value)}
          />
          <Button
            className="w-50 m-2 cursor-pointer"
            onClick={() => updateCaseStatus("UNDER_REVIEW_WITH_INSURER")}
            disabled={!caseRemark}
          >
            {t("Send to Insurer")}
          </Button>
          <Button
            className="w-50 m-2 cursor-pointer"
            onClick={() => setShowCaseUpdateDialog(false)}
          >
            {t("Cancel")}
          </Button>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
}

export default InspectionDashboard;
