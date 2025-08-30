import { useState } from "react";

import { createFileRoute, redirect } from "@tanstack/react-router";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

const RouteComponent = () => {
  const [isIdentityLoading, setIsIdentityLoading] = useState(false);

  const handleIdentitySignIn = async () => {
    try {
      setIsIdentityLoading(true);
      await authClient.signIn.social({
        provider: "identity",
        callbackURL: "/",
      });
    } catch (error) {
      console.error(error, "Error during Identity sign in");
      toast.error("An error occurred while signing in with Identity");
    } finally {
      setIsIdentityLoading(false);
    }
  };

  return (
    <div className="bg-card mx-auto max-w-lg rounded-lg p-12 shadow-lg">
      <div className="mb-12 text-center">
        <img src="/logo.png" alt="Atlas" className="mx-auto mb-6 h-20 w-20" />
        <h1 className="mb-4 text-3xl font-bold">Welcome to Atlas</h1>
        <p className="text-muted-foreground">
          Sign in with your Panchito Ritalin Productions Identity account to get started
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="space-y-4">
          <button
            onClick={handleIdentitySignIn}
            disabled={isIdentityLoading}
            className="bg-primary hover:bg-primary/80 active:bg-primary/80 flex w-full transform items-center justify-center gap-3 rounded-lg px-6 py-4 font-medium text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="text-sm">
              {isIdentityLoading
                ? "Signing in..."
                : "Sign in with Panchito Identity"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/_auth/login")({
  beforeLoad: async ({ context }) => {
    if (context.auth.isAuthenticated) {
      return redirect({ to: "/" });
    }
  },
  component: RouteComponent,
});
