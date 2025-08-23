import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { IncomingForm } from "formidable";
import fs from "fs";
import s3, { bucket } from "../../lib/s3";

export const config = { api: { bodyParser: false } };


export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  return new Promise((resolve, reject) => {
    const form = new IncomingForm({ keepExtensions: true });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(400).json({ error: "Upload failed", details: err.message });
        return reject(err);
      }

      // In formidable v3, files are arrays
      const file = Array.isArray(files.file) ? files.file[0] : files.file;
      if (!file) {
        res.status(400).json({ error: "No file uploaded" });
        return reject(new Error("No file uploaded"));
      }

      const filePath = file.filepath || file.path; // depending on version
      if (!filePath) {
        res.status(500).json({ error: "File path missing" });
        return reject(new Error("File path missing"));
      }

      const stream = fs.createReadStream(filePath);

      try {
        await s3.send(
          new PutObjectCommand({
            Bucket: bucket,
            Key: file.originalFilename || file.newFilename, // fallback
            Body: stream,
            ContentType: file.mimetype || "application/octet-stream",
          })
        );
        res.status(200).json({ message: "Upload success" });
        resolve();
      } catch (e) {
        console.error("Upload failed:", e);
        res.status(500).json({ error: "Failed to upload" });
        reject(e);
      }
    });
  });
}
