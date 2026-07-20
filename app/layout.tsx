import "./globals.css";

export const metadata = {
  title: "Charmz.ai",
  description: "Your AI Financial Intelligence Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-bg text-white min-h-screen">{children}</body>
    </html>
  );
}
