"use client";

import Image, { StaticImageData } from "next/image";






interface Transaction {
  id: number;
  paymentMethod: string;
  description: string;
  amount: string;
  amountType: "credit" | "debit";
  image: StaticImageData;
}

const transactions: Transaction[] = [
  {
    id: 1,
    paymentMethod: "Paytm",
    description: "Starbucks",
    amount: "-$20",
    amountType: "debit",
    image: "/assets/images/payment/payment1.png",
  },
  {
    id: 2,
    paymentMethod: "PayPal",
    description: "Client Payment",
    amount: "+$800",
    amountType: "credit",
    image: "/assets/images/payment/payment2.png",
  },
  {
    id: 3,
    paymentMethod: "Stripe",
    description: "Ordered iPhone 14",
    amount: "-$300",
    amountType: "debit",
    image: "/assets/images/payment/payment3.png",
  },
  {
    id: 4,
    paymentMethod: "Razorpay",
    description: "Refund",
    amount: "+$400",
    amountType: "credit",
    image: "/assets/images/payment/payment4.png",
  },
  {
    id: 5,
    paymentMethod: "Paytm",
    description: "Starbucks",
    amount: "-$1400",
    amountType: "debit",
    image: "/assets/images/payment/payment1.png",
  },
  {
    id: 6,
    paymentMethod: "Stripe",
    description: "Ordered iPhone 14",
    amount: "+$800",
    amountType: "credit",
    image: "/assets/images/payment/payment2.png",
  },
];

const TransactionList = () => {
  return (
    <>
      {transactions.map((transactionItem) => (
        <div
          key={transactionItem.id}
          className="flex items-center justify-between gap-3 mb-5 last:mb-0"
        >
          <div className="flex items-center gap-4">
            <Image
              src={transactionItem.image}
              alt={transactionItem.paymentMethod}
              width={40}
              height={40}
              className="w-10 h-10 rounded-lg shrink-0"
            />
            <div className="grow">
              <h6 className="text-base mb-0 font-normal">
                {transactionItem.paymentMethod}
              </h6>
              <span className="text-sm text-neutral-500 dark:text-neutral-300 font-normal">
                {transactionItem.description}
              </span>
            </div>
          </div>
          <span
            className={`text-base font-medium ${transactionItem.amountType === "credit"
                ? "text-green-600"
                : "text-red-600"
              }`}
          >
            {transactionItem.amount}
          </span>
        </div>
      ))}
    </>
  );
};

export default TransactionList;
