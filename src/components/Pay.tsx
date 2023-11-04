import * as React from "react";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Icons } from "../assets/icons";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import generateReceipt from "./GenerateReciept";

interface userData {
  email: string;
  fullName: string;
  classOptions: {
    value: string;
    class: string;
  }[];
  feeType: string;
}

interface Customer {
  email: string;
  phone_number: string;
  name: string;
}

interface Customizations {
  title: string;
  description: string;
  logo: string;
}

export function Pay(props: userData) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [studentName, setStudentName] = React.useState<string>("");
  const [fee, setFee] = React.useState<number>(0);
  const [stuclass, setstuClass] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");
  const [success, setSuccess] = React.useState<string>("");
  const [open, setOpen] = React.useState(false);

  const classOptions = props.classOptions;

  const email = props.email;
  const fullName = props.fullName;

  const config = {
    public_key: "FLWPUBK_TEST-450dcfc0da079a8b0202fe74e5023fd7-X",
    tx_ref: `${studentName} ${stuclass} ${Date.now()}`,
    amount: fee,
    currency: "NGN",
    payment_options: "card,mobilemoney,ussd",
    customer: {
      email: email,
      name: fullName,
    } as Customer,
    customizations: {
      title: `${studentName}'s Fees`,
      description: "Payment for items in cart",
      logo: "https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg",
    } as Customizations,
  };

  const handleFlutterPayment = useFlutterwave(config);

  const checkNulls = (event: React.SyntheticEvent) => {
    event.preventDefault();

    if (!studentName) {
      setError("Please enter student name");
      return;
    }

    if (!fee) {
      setError("Please select a class");
      return;
    }

    setError("");
    setOpen(true);
  };

  async function onSubmit() {
    setIsLoading(true);
    handleFlutterPayment({
      callback: (response: any) => {
        console.log(response);
        if (response.status == "successful") {
          generateReceipt(
            studentName,
            stuclass,
            props.feeType,
            fee,
            email,
            config.tx_ref
          );
          setSuccess(
            "Payment Successful, your invoice will be downloaded shortly..."
          );
          setTimeout(() => {
            setSuccess("");
          }, 5000);
        }
        setIsLoading(false);
        setStudentName("");
        setFee(0);
        closePaymentModal(); // this will close the modal programmatically
      },
      onClose: () => {
        setIsLoading(false);
        setStudentName("");
        setFee(0);
      },
    });
  }

  return (
    <div>
      <Card className="auth-form mt-10">
        <div className="flex items-center justify-center">
          <h1 className="text-2xl font-bold">Pay {props.feeType}</h1>
        </div>
        <div className={"grid gap-6"}>
          <form onSubmit={onSubmit} className="p-4 grid gap-2">
            {error && (
              <div className="text-destructive text-left text-sm">{error}</div>
            )}
            {success && (
              <div className="text-primary text-center text-sm">{success}</div>
            )}
            <div className="grid gap-1">
              <Label className="text-left block" htmlFor="email">
                Student Name
              </Label>
              <div className="flex justify-between">
                <Input
                  id="studentName"
                  placeholder="Student Name"
                  type="text"
                  autoCapitalize="none"
                  autoCorrect="off"
                  disabled={isLoading}
                  value={studentName}
                  onChange={(event) => setStudentName(event.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-1">
              <Label className="text-left block" htmlFor="email">
                Select Class
              </Label>
              <Select
                onValueChange={(event) => {
                  console.log(event);
                  setFee(Number(event.split("|")[0]));
                  setstuClass(event.split("|")[1]);
                }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>

                <SelectContent className="overflow-y-auto max-h-[10rem]">
                  {classOptions.map((option) => (
                    <SelectItem
                      key={`${option.value} - ${option.class}`}
                      value={`${option.value}|${option.class}`}>
                      {`${option.class} - ${option.value}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  disabled={isLoading}
                  className="w-full"
                  onClick={(e) => {
                    checkNulls(e);
                  }}>
                  {isLoading && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Proceed to payment
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-destructive">
                    Cross-check Details?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    The school will not be held responsible for any wrong
                    details entered.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onSubmit}>
                    Proceed
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </form>
        </div>
      </Card>
    </div>
  );
}
