"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to signin page since we're using /signin as our auth page
    router.replace("/signin");
  }, [router]);

  return null; // No need to render anything as we're redirecting
}
