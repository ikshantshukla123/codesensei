export default function ScanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // No navbar, no footer - full immersive experience
  return <>{children}</>;
}
