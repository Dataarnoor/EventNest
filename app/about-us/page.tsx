"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AboutUsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (session?.user?.userType === "college") {
      router.replace("/my-events");
    } else if (session?.user?.userType === "sponsor") {
      router.replace("/sponsorships");
    }
  }, [session, status, router]);

  return (
    <div>
      {/* Existing About Us page content */}
      <h1>About Us</h1>
      <p>Welcome to our website. We are glad to have you here.</p>
      {/* Add more content as needed */}
    </div>
  );
}