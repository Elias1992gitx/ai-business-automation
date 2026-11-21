import { Suspense } from "react";
import { SignupView } from "@/src/components/auth/signup-view";

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8fafc]" />}>
      <SignupView />
    </Suspense>
  );
}
