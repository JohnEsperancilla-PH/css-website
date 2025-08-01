export const metadata = {
  title: "Forms - Computer Science Society - USLS",
  description: "Complete forms and surveys from the Computer Science Society at University of St. La Salle",
  openGraph: {
    title: "Forms - Computer Science Society - USLS",
    description: "Complete forms and surveys from the Computer Science Society at University of St. La Salle",
    type: "website",
    siteName: "Computer Science Society - USLS",
  },
  twitter: {
    card: "summary_large_image",
    title: "Forms - Computer Science Society - USLS",
    description: "Complete forms and surveys from the Computer Science Society at University of St. La Salle",
  },
};

export default function FormsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50">
      {children}
    </div>
  );
}