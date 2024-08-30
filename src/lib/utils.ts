import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import moment from "moment-timezone";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getParameterByName(name: string, url?: string) {
  if (!url) {
    return null;
  }
  /*eslint-disable */
  name = name.replace(/[\[\]]/g, "\\$&");
  /*eslint-enable */
  let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

export const snakeToTitleCase = (str: any) => {
  if (str === 0 || !str) {
    return str;
  }
  str = str.toString();
  return str
    .split("_")
    .map((item: any) => item.charAt(0).toUpperCase() + item.substring(1))
    .join(" ");
};

export const isAuthenticated = () => {
  if (localStorage.getItem("user_data")) {
    return true;
  }
  return false;
};

export const scrollToTop = (element: any) => {
  if (!element) {
    return;
  }
  element.scrollTop = 0;
};

export const toLocalTime = (date: string) => {
  return moment.utc(date).tz("Asia/Bangkok").format("HH:mm:ss, DD MMM YYYY");
};
