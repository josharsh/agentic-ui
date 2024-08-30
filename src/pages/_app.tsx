import "@/styles/globals.css";
import "../lib/i18n";

import React, { useEffect } from "react";
import { AppProps } from "next/app";
import Head from "next/head";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { Theme } from "@radix-ui/themes";

import { isAuthenticated } from "@/lib/utils";
import Layout from "@/components/layout/layout";
import { UserProvider } from "@/user-context"; 
import { useTranslation } from "react-i18next";

export default function App({ Component, pageProps }: AppProps) {
  const { i18n } = useTranslation();
  const theme = "indigo",
    router = useRouter(),
    pathname = usePathname();

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }

    const queryParams = new URLSearchParams(window.location.search);
    if(isAuthenticated() && pathname !== "/inspection"){
      router.replace({
        pathname: "/dashboard",
        query: Object.fromEntries(queryParams.entries())
      });
    }
    if (!isAuthenticated() && pathname !== "/signin") {
      router.replace("/signin");
    }
  }, []);

  // useEffect(() => {
  //   const handleRouteChange = () => {
  //     if (!isAuthenticated() && pathname !== "/signin") {
  //       router.replace("/signin");
  //     }
  //   };

  //   router.events.on("routeChangeStart", handleRouteChange);

  //   return () => {
  //     router.events.off("routeChangeStart", handleRouteChange);
  //   };
  // }, []);

  return (
    <>
      <Head>
        <title>Falcon Eye</title>
        <meta name="description" content="" />
      </Head>
      <Theme accentColor={theme}>
        <Layout>
        <UserProvider>
          <Component {...pageProps} />
        </UserProvider>
        </Layout>
      </Theme>
    </>
  );
}
