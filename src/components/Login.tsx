"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Icons } from "../assets/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../../firebase-config";
import { useNavigate } from "react-router-dom";

// import login from firebase auth

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Login({ className, ...props }: UserAuthFormProps) {
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");
  const navigate = useNavigate();

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    if (!email || !password) {
      setError("Please enter your email and password");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password).then(() => {
        navigate("/");
      });
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function onGoogleSignIn() {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    setIsLoading(true);
    setError("");
    try {
      await signInWithPopup(auth, provider).then(() => {
        navigate("/");
      });
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="auth-form mt-10">
      <div className={`${cn("grid gap-6", className)} `} {...props}>
        {error && <div className="text-red-500 text-left text-sm">{error}</div>}
        <form onSubmit={onSubmit}>
          <div className="grid gap-2">
            <div className="grid gap-2">
              <Label className="text-left" htmlFor="email">
                Email
              </Label>
              <Input
                id="email"
                placeholder="cipher@example.com"
                type="email"
                autoCapitalize="none"
                autoCorrect="off"
                disabled={isLoading}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div className="grid gap-1">
              <Label className="text-left pb-1 pt-2" htmlFor="password">
                Password
              </Label>
              <Input
                id="password"
                placeholder="Password"
                type="password"
                autoCapitalize="none"
                autoCorrect="off"
                disabled={isLoading}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <Button disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign In with Email
            </Button>
          </div>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          type="button"
          disabled={isLoading}
          onClick={onGoogleSignIn}>
          {isLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.google className="mr-2 h-4 w-4" />
          )}{" "}
          Google
        </Button>
      </div>
    </Card>
  );
}
