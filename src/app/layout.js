import "./globals.css";

export const metadata = {
  title: "Gallery Vault",
  description: "A secure cloud-based gallery app using MinIO (S3)",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100">{children}</body>
    </html>
  );
}
