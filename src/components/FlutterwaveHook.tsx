import React from "react";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import { useLocation } from "react-router-dom";

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

const FlutterwaveHook: React.FC = (props) => {
  const email = props.email;
  const fullName = props.fullName;

  const config = {
    public_key: "FLWPUBK_TEST-ed99941c4d235a922aaf21e0f4a99898-X",
    tx_ref: Date.now(),
    amount: amount,
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

  return (
    <div className="FlutterwaveHook">
      <h1>Hello Test user</h1>
      <button
        onClick={() => {
          handleFlutterPayment({
            callback: (response: any) => {
              console.log(response);
              closePaymentModal(); // this will close the modal programmatically
            },
            onClose: () => {},
          });
        }}>
        Payment with React hooks
      </button>
    </div>
  );
};

export default FlutterwaveHook;
