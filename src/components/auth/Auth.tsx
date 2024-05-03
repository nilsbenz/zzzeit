import { auth } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { HourglassIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const Messages = {
  "auth/invalid-login-credentials": "Username or password is invalid.",
  "auth/wrong-password": "Username or password is invalid.",
  "auth/user-not-found": "Username or password is invalid.",
  "auth/invalid-email": "This email address does not exist.",
  "auth/email-already-in-use": "This email address is already taken.",
  "auth/weak-password":
    "This password is too weak. Please use at least 6 characters.",
  "auth/expired-action-code": "This authentication token has expired.",
  "auth/invalid-action-code": "This authentication token is invalid.",
} as const;

export default function Auth() {
  const mailInput = useRef<HTMLInputElement>(null);
  const passwordInput = useRef<HTMLInputElement>(null);
  const [action, setAction] = useState<"login" | "register" | "resetPassword">(
    "login"
  );
  const [message, setMessage] = useState<{
    content: string;
    type: "error" | "info";
  } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setLoading(true);
      const username = mailInput.current?.value;
      const password = passwordInput.current?.value;
      if (!username || (action !== "resetPassword" && !password)) {
        setMessage({
          content: "Please fill in all fields.",
          type: "error",
        });
        return;
      }
      setMessage(null);
      if (action === "resetPassword") {
        try {
          await sendPasswordResetEmail(auth, username);
          setMessage({
            content: "A mail was sent to the above address.",
            type: "info",
          });
        } catch (_e) {
          setMessage({
            content:
              "An error occurred whilst sending the password reset mail.",
            type: "error",
          });
        }
      } else {
        try {
          const authFn =
            action === "login"
              ? signInWithEmailAndPassword
              : createUserWithEmailAndPassword;
          await authFn(auth, username, password!);
        } catch (e) {
          const error = e as FirebaseError;
          const errorMessage = error
            ? Messages[error.code as keyof typeof Messages]
            : null;
          setMessage({
            content: errorMessage ?? "Something went wrong. Please try again.",
            type: "error",
          });
        }
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setMessage(null);
  }, [action]);

  return (
    <div className="max-sm:pt-32 fixed bottom-safe-bottom left-safe-left right-safe-right top-safe-top p-8">
      <div className="mx-auto flex h-full max-w-xs flex-col gap-8 sm:justify-center sm:gap-20">
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <HourglassIcon
              className="size-6 animate-hourglass"
              strokeWidth={3}
            />
            <p className="font-brand text-xl">zzzeit</p>
          </div>
          <h2 className="h1 text-center leading-tight">
            {action === "login"
              ? "Login"
              : action === "register"
                ? "Register"
                : "Reset Password"}
          </h2>
        </div>
        <div className="max-sm:flex-grow">
          <div className="relative">
            <div className="absolute inset-0 -z-10 flex w-full items-center justify-center">
              <div className="size-52 bg-primary opacity-15 blur-3xl dark:opacity-10" />
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="mail">Mail</Label>
                <Input
                  id="mail"
                  name="username"
                  ref={mailInput}
                  required
                  className="border-2 border-foreground/80 bg-foreground/5"
                />
              </div>
              {action !== "resetPassword" && (
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    ref={passwordInput}
                    required
                    className="border-2 border-foreground/80 bg-foreground/5"
                  />
                </div>
              )}
              {message && (
                <p
                  className={cn(
                    "text-sm font-medium",
                    message.type === "error"
                      ? "text-destructive"
                      : "text-primary"
                  )}
                >
                  {message.content}
                </p>
              )}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={loading}
                  variant="outline"
                  className="border-2 border-foreground/80 bg-foreground/5 hover:bg-foreground/10"
                >
                  {action === "login"
                    ? "Login"
                    : action === "register"
                      ? "Register"
                      : "Reset"}
                </Button>
              </div>
            </form>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-center">
            {action === "login" ? "New here?" : "You have been here before?"}{" "}
            <button
              className="ml-2 rounded px-1 py-0.5 font-medium text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              onClick={() =>
                setAction((prev) => (prev === "login" ? "register" : "login"))
              }
            >
              {action === "login" ? "Register" : "Login"}
            </button>
          </p>
          <div className="flex justify-center gap-4">
            <button
              className="rounded px-1 py-0.5 text-muted-foreground ring-offset-background transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              onClick={() => setAction("resetPassword")}
            >
              Forgot your password?
            </button>
            <span className="text-muted-foreground">–</span>
            <button className="rounded px-1 py-0.5 text-muted-foreground ring-offset-background transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              Info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
