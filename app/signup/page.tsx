"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Signup has been consolidated into the /login page (toggleable).
 * Redirecting users to /login to ensure a single entry point.
 */
export default function SignUpRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/login?mode=signup");
    }, [router]);

    return null;
}
