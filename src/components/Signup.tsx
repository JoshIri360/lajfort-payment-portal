"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Icons } from "../assets/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { auth, db } from "../../firebase-config";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Signup({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [name, setName] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [confirmPassword, setConfirmPassword] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");

  const navigate = useNavigate();

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    if (!name) {
      setError("Please enter your name");
      return;
    }
    if (!email || !password) {
      setError("Please enter your email and password");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setIsLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password).then(() => {
        setDoc(doc(db, "users", email), {});
        navigate("/");
      });
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function signUpWithGoogle() {
    const provider = new GoogleAuthProvider();
    setIsLoading(true);
    setError("");
    try {
      await signInWithPopup(auth, provider).then(() => {
        setDoc(doc(db, "users", email), {});
        navigate("/");
      });
    } catch (error: any) {
      if (error.message.includes("auth/popup-closed-by-user")) {
        setError("Please allow popups for this site");
      } else {
        setError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="auth-form mt-10">
      <div className={`${cn("grid", className)}`} {...props}>
        {error && <div className="text-red-500 text-left text-sm">{error}</div>}
        <form onSubmit={onSubmit}>
          <div className="grid gap-2">
            <div className="grid gap-2">
              <Label className="text-left" htmlFor="name">
                Name
              </Label>
              <Input
                id="name"
                placeholder="name"
                type="text"
                autoCapitalize="none"
                disabled={isLoading}
                onChange={(e) => {
                  setError("");
                  setName(e.target.value);
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-left" htmlFor="email">
                Email
              </Label>
              <Input
                id="email"
                placeholder="cipher@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading}
                onChange={(e) => {
                  setError("");
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-left" htmlFor="password">
                Password
              </Label>
              <Input
                id="password"
                placeholder="Password"
                type="password"
                autoCapitalize="none"
                autoComplete="password"
                autoCorrect="off"
                disabled={isLoading}
                onChange={(e) => {
                  setError("");
                  setPassword(e.target.value);
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-left" htmlFor="password">
                Confirm password
              </Label>
              <Input
                id="confirmPassword"
                placeholder="Confirm password"
                type="password"
                autoCapitalize="none"
                autoComplete="password"
                autoCorrect="off"
                disabled={isLoading}
                onChange={(e) => {
                  setError("");
                  setConfirmPassword(e.target.value);
                }}
              />
            </div>
            <Button disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign Up
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
          onClick={signUpWithGoogle}>
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
