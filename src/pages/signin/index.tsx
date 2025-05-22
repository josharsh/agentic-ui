/**
 * v0 by Vercel.
 * @see https://v0.dev/t/3mGZtJBkUiR
 */
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/common/api";
import {
  EnvelopeClosedIcon,
  ExclamationTriangleIcon,
  EyeOpenIcon,
  LockClosedIcon,
} from "@radix-ui/react-icons";
import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Flex,
  Heading,
  Text,
  TextField,
} from "@radix-ui/themes";
import { useTranslation } from "react-i18next";

export default function Signup() {
  const [showPassword, setShowPassword] = useState<boolean>(false),
    [email, setEmail] = useState<string>(""),
    [password, setPassword] = useState<string>(""),
    [errors, setErrors] = useState<any>({}),
    [loginFailed, setLoginFailed] = useState<Boolean>(false),
    { push } = useRouter(),
    { t } = useTranslation();

  const validate = () => {
    let errorsTemp: any = {};
    const regex =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!email) {
      errorsTemp.email = "Email Required";
    }
    if (!password) {
      errorsTemp.password = "Password Required";
    }
    if (email && !regex.test(email)) {
      errorsTemp.email = "Email is not Valid";
    }
    return errorsTemp;
  };

  const handleSignIn = () => {
    let errorsTemp = validate();
    setErrors(errorsTemp);
    if (Object.keys(errorsTemp).length) {
      return;
    }
    let params = {
      username: email,
      password: password,
    };
    api.session
      .getToken(params)
      .then((resp: any) => {
        setLoginFailed(false);
        window.localStorage.setItem("user_data", JSON.stringify(resp));
        push("/dashboard");
      })
      .catch((error: any) => {
        if (
          error.response &&
          error.response.data?.detail === "Incorrect email or password"
        ) {
          setLoginFailed(true);
        }
      });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gray-100">
      <Card className="w-full max-w-md shadow-lg rounded-lg">
        <Flex gap="6" direction={"column"} p="6">
          <Box className="justify-center">
            <Flex gap="6" direction={"column"} align={"center"}>
              <Container size={"4"}>
                <AgenticIcon className="h-12 w-12 text-indigo-600" />
              </Container>
              <Container>
                <Flex gap="4" direction={"column"} align={"center"}>
                  <Heading weight={"bold"} align={"center"}>
                    {t("Welcome Back to Agentic - AI Teams")}
                  </Heading>
                  <Text size={"3"} className="text-center text-gray-600">
                    {t("Sign in to your account")}
                  </Text>
                </Flex>
              </Container>
            </Flex>
          </Box>
          <Box>
            <Flex gap={"6"} direction={"column"}>
              <Flex gap={"4"} direction={"column"}>
                {loginFailed ? (
                  <Badge
                    color="red"
                    size={"2"}
                    className="flex items-center justify-center"
                  >
                    <ExclamationTriangleIcon height={"16"} width={"16"} />
                    <p className="text-sm ml-2">
                      {t("Incorrect email or password")}
                    </p>
                  </Badge>
                ) : null}
                <div>
                  <Text
                    htmlFor="email"
                    className={errors.email ? "text-red-500" : "text-gray-700"}
                  >
                    {t("Email")}
                  </Text>
                  <TextField.Root radius="large">
                    <TextField.Slot>
                      {errors.email ? (
                        <EnvelopeClosedIcon
                          height="16"
                          width="16"
                          color="red"
                        />
                      ) : (
                        <EnvelopeClosedIcon height="16" width="16" />
                      )}
                    </TextField.Slot>
                    <TextField.Input
                      type={"input"}
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </TextField.Root>
                  {errors.email ? (
                    <Text color="red" size={"2"}>
                      {errors.email}
                    </Text>
                  ) : null}
                </div>
                <div>
                  <Text
                    htmlFor="password"
                    className={errors.password ? "text-red-500" : "text-gray-700"}
                  >
                    {t("Password")}
                  </Text>
                  <TextField.Root radius="large">
                    <TextField.Slot>
                      {errors.password ? (
                        <LockClosedIcon height="16" width="16" color="red" />
                      ) : (
                        <LockClosedIcon height="16" width="16" />
                      )}
                    </TextField.Slot>
                    <TextField.Input
                      type={showPassword ? "input" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <TextField.Slot>
                      <EyeOpenIcon
                        height="16"
                        width="16"
                        onClick={() => setShowPassword(!showPassword)}
                        className="cursor-pointer"
                      />
                    </TextField.Slot>
                  </TextField.Root>
                  {errors.password ? (
                    <Text color="red" size={"2"}>
                      {errors.password}
                    </Text>
                  ) : null}
                </div>
              </Flex>
              <div className="mb-6 flex justify-center">
                <Button
                  className="w-full cursor-pointer bg-indigo-600 text-white hover:bg-indigo-700"
                  onClick={() => handleSignIn()}
                >
                  {t("Sign In")}
                </Button>
              </div>
            </Flex>
          </Box>
        </Flex>
      </Card>
    </div>
  );
}

function AgenticIcon(props: any) {
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
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
}