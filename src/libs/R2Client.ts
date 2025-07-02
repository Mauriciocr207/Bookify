import { S3Client } from "@aws-sdk/client-s3";

const {
  R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_DEV_URL,
  MODE
} = process.env;

const R2Url = MODE == "dev" ? R2_DEV_URL : `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`

const R2Client = new S3Client({
  region: "auto",
  endpoint: R2Url,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID || "",
    secretAccessKey: R2_SECRET_ACCESS_KEY || "",
  },
});

export default R2Client;