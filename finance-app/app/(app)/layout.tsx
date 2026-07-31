import AppShell from "@/components/layout/AppShell";
import QuickAdd from "@/components/QuickAdd";
import Toaster from "@/components/ui/Toaster";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AppShell>{children}</AppShell>
      <QuickAdd />
      <Toaster />
    </>
  );
}