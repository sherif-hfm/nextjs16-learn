"use client";

import { useSession, signOut,signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn();
    }
  }, [status, router]);

  const handleSignOut = async () => {
    await signOut({ redirect: false, callbackUrl: "/login" });
    
    // Sign out from Keycloak if user logged in via Keycloak
    if (session?.user?.provider === "keycloak") {
      const keycloakLogoutUrl = `${process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER}/protocol/openid-connect/logout`;
      const logoutParams = new URLSearchParams({
        post_logout_redirect_uri: window.location.origin + "/login",
        client_id: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || "",
      });
      
      // Add id_token_hint if available for better logout
      if (session.user.id_token) {
        logoutParams.append("id_token_hint", session.user.id_token);
      }
      
      window.location.href = `${keycloakLogoutUrl}?${logoutParams.toString()}`;
    } else {
      router.push("/login");
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h1 className="text-3xl font-bold text-center text-gray-900">
            User Profile
          </h1>
          <div className="mt-4 space-y-2">
            <p className="text-gray-700">
              <span className="font-semibold">Name:</span> {session.user?.name}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Email:</span> {session.user?.email}
            </p>
            {session.user?.FullName && (
              <p className="text-gray-700">
                <span className="font-semibold">Full Name:</span> {session.user.FullName}
              </p>
            )}
            {session.user?.MobileNumber && (
              <p className="text-gray-700">
                <span className="font-semibold">Mobile Number:</span> {session.user.MobileNumber}
              </p>
            )}
            {session.user?.IdentityNo && (
              <p className="text-gray-700">
                <span className="font-semibold">Identity No:</span> {session.user.IdentityNo}
              </p>
            )}
            {session.user?.role && session.user.role.length > 0 && (
              <p className="text-gray-700">
                <span className="font-semibold">Roles:</span> {session.user.role.join(", ")}
              </p>
            )}
          </div>
        </div>
        <div className="space-y-3">
          <button
            onClick={() => router.push("/")}
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back to Home
          </button>
          <button
            onClick={handleSignOut}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
