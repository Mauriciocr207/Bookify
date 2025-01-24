import { Footer, Header } from "@components/common";

export default function GrayLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <div className="bg-gray-light-2 px-4">
        <div className="container">
          {children}
          <Footer />
        </div>
      </div>
    </>
  );
}
