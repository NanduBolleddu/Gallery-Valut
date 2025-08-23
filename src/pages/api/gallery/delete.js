import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import s3, { bucket } from "../../lib/s3";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const key = req.query.key;
  if (!key) {
    return res.status(400).json({ error: "Missing key parameter" });
  }

  try {
    await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
    res.status(200).json({ message: "Delete success" });
  } catch (error) {
    console.error("Error deleting S3 object:", error);
    res.status(500).json({ error: "Failed to delete image" });
  }
}
