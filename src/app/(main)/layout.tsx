import { Footer, Header } from "@components/common";

export default function WhiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <div className="container px-4 overflow-hidden">
        {children}
        <Footer />
      </div>
    </>
  );
}
