import { Suspense } from "react";
import { LoginView } from "@/src/components/auth/login-view";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8fafc]" />}>
      <LoginView />
    </Suspense>
  );
}
