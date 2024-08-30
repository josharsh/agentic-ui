let SENTRY_DSN = "";
let TRACES_SAMPLE_RATE = "";
let AWS_ACCESS_KEY = "";
let AWS_SECRET_KEY = "";
let AWS_REGION_NAME = "";
let AWS_S3_BUCKET_NAME = "";
let API_URL = "";


export enum BadgeColors {
  amber = "amber",
  green = "green",
  red = "red",
  gray = "gray",
  pink = "pink",
  hue = "hue",
  yellow = "yellow",
  orange = "orange",
  purple = "purple",
  cyan = "cyan",
}

const FUSE_OPTIONS = {
  keys: [
    "case_id",
    "metadata.make",
    "metadata.vehicle_number",
    "metadata.customer_name",
    "created_by_user.first_name",
    "created_by_user.last_name",
    "metadata.preprocessed_vehicle_number",
    "metadata.preprocessed_customer_name",
    "metadata.preprocessed_first_name",
    "metadata.preprocessed_last_name",
  ],
  threshold: 0.3,
};

if (typeof window !== "undefined") {
  const obj: any = window;
  SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN || '';
  TRACES_SAMPLE_RATE = process.env.NEXT_PUBLIC_TRACES_SAMPLE_RATE || '';
  AWS_ACCESS_KEY = process.env.NEXT_PUBLIC_AWS_ACCESS_KEY || '';
  AWS_SECRET_KEY = process.env.NEXT_PUBLIC_AWS_SECRET_KEY || '';
  AWS_REGION_NAME = process.env.NEXT_PUBLIC_AWS_REGION_NAME || '';
  AWS_S3_BUCKET_NAME = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME || '';
  API_URL = process.env.NEXT_PUBLIC_API_URL || '';
}

export {
  SENTRY_DSN,
  TRACES_SAMPLE_RATE,
  AWS_ACCESS_KEY,
  AWS_SECRET_KEY,
  AWS_REGION_NAME,
  AWS_S3_BUCKET_NAME,
  API_URL,
  FUSE_OPTIONS,
};