import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import s3, { bucket } from "../../../lib/s3";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const data = await s3.send(new ListObjectsV2Command({ Bucket: bucket }));
    const keys = data.Contents?.map((item) => item.Key) || [];
    res.status(200).json(keys);
  } catch (error) {
    console.error("Error listing S3 objects:", error);
    res.status(500).json({ error: "Failed to list images" });
  }
}
