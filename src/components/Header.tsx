import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  AWS_ACCESS_KEY,
  AWS_REGION_NAME,
  AWS_S3_BUCKET_NAME,
  AWS_SECRET_KEY,
} from "@/constants/config";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import {
  Avatar,
  Badge,
  Button,
  Dialog,
  Flex,
  Inset,
  Text,
} from "@radix-ui/themes";
import AWS from "aws-sdk";
import LanguageSwitcher from "./common/language-switcher";
import { useTranslation } from "react-i18next";

AWS.config.update({
  credentials: new AWS.Credentials(AWS_ACCESS_KEY, AWS_SECRET_KEY),
  region: AWS_REGION_NAME,
});

function Header() {
  const { t } = useTranslation()
  const [user, setUser] = useState<any>({
      username: "",
      email: "",
      role: "",
      access_control: ""
    }),
    router = useRouter(),
    s3 = new AWS.S3();

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      let userData: any = localStorage.getItem("user_data");
      generateFiles(JSON.parse(userData));
    }
  }, []);

  function generateFiles(resp: any) {
    let promise = new Promise(async (resolve) => {
      if (resp?.meta_data && !resp?.meta_data?.logo) {
        resolve(true);
      }

      let src = await getS3Image(resp?.meta_data?.logo?.s3_key);
      if (resp?.meta_data?.logo) {
        resp.meta_data.logo.src = src;
      }
      resolve(true);
    });

    promise.then(() => {
      if (resp) {
        setUser(resp);
        console.log(resp)
      }
    });
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

      // Assuming the Body is a Buffer containing the image data and it's a PNG image
      // if (mime_type === "application/octet-stream") {
      const objectData = data.Body.toString("base64"),
        imageData = "data:image/svg+xml;base64," + objectData;
      // Set the src of the image to the imageData
      return imageData;
      // }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="flex h-1/5 items-center justify-between border-b-2 border-slate-200 px-8 py-3">
      {user?.meta_data?.logo ? (
        <img src={user?.meta_data?.logo?.src} alt="insurer" />
      ) : (
        <SwissFrancIcon height="24" width="24" className="text-blue-600" />
      )}
      <Dialog.Root>
        <Dialog.Trigger color="indigo">
          <div>
            <Button size={"3"} variant="soft" className="cursor-pointer">
              {user?.email}
            </Button>
          </div>
        </Dialog.Trigger>
        <Dialog.Content>
          <Flex direction={"column"} gap={"6"}>
            <Flex className="items-center gap-6">
              <Inset clip="padding-box" className="rounded-lg p-3">
                <Avatar
                  fallback={`${user?.username[0]}${user?.username[0]}`}
                  size={"6"}
                ></Avatar>
              </Inset>
              <Flex direction={"column"}>
              <Flex gap={"2"} direction={"row"} className="grow">
                <Text>{user?.username}</Text>
              </Flex>
              <Flex gap={"2"} direction={"column"} className="grow">
                <Text>{user?.email}</Text>
              </Flex>
              </Flex>
              
            </Flex>
            <Flex gap="3" className="justify-end">
              <Dialog.Close>
                <div>
                  <Button
                    color="red"
                    variant="solid"
                    onClick={() => {
                      if (
                        typeof window !== "undefined" &&
                        window.localStorage
                      ) {
                        localStorage.removeItem("user_data");
                        router.replace("/signin");
                      }
                    }}
                    className="cursor-pointer"
                  >
                    {t("Log Out")}
                  </Button>
                </div>
              </Dialog.Close>
              <Dialog.Close>
                <div>
                  <Button variant="solid" className="cursor-pointer">
                    Cancel
                  </Button>
                </div>
              </Dialog.Close>
            </Flex>
          </Flex>
          <LanguageSwitcher />
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
}

function SwissFrancIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 21V3h8" />
      <path d="M6 16h9" />
      <path d="M10 9.5h7" />
    </svg>
  );
}

export default Header;