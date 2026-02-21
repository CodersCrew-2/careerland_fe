import type { Metadata } from "next";
import "@/assets/index.css";
import { AuthProvider } from "@/components/context/AuthContext";

export const metadata: Metadata = {
    title: "CareerLand",
    description: "A career guidance platform with interactive onboarding, career discovery, and detailed career insights.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
