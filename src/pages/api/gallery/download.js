import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import s3, { bucket } from "../../../lib/s3";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const key = req.query.key;
  if (!key) {
    return res.status(400).json({ error: "Missing key parameter" });
  }

  try {
    const object = await s3.send(
      new GetObjectCommand({ Bucket: bucket, Key: key })
    );
    res.setHeader("Content-Disposition", `attachment; filename="${key}"`);
    object.Body.pipe(res);
  } catch (error) {
    console.error("Error downloading S3 object:", error);
    res.status(500).json({ error: "Failed to download image" });
  }
}
