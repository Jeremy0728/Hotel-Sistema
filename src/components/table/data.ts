import { StaticImageData } from "next/image";






interface TransactionsDataType {
  name: string;
  email: string;
  image: string | StaticImageData;
  registered: string;
  plan: string;
  status: "Active" | "Inactive";
  statusVariant:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "success"
    | "warning"
    | "info"
    | "danger";
}

export const users: TransactionsDataType[] = [
  {
    name: "Dianne Russell",
    email: "redaniel@gmail.com",
    image: "/assets/images/users/user1.png",
    registered: "27 Mar 2024",
    plan: "Free",
    statusVariant: "success",
    status: "Active",
  },
  {
    name: "Wade Warren",
    email: "xterris@gmail.com",
    image: "/assets/images/users/user2.png",
    registered: "27 Mar 2024",
    plan: "Basic",
    statusVariant: "danger",
    status: "Inactive",
  },
  {
    name: "Albert Flores",
    email: "seannand@mail.ru",
    image: "/assets/images/users/user3.png",
    registered: "27 Mar 2024",
    plan: "Standard",
    statusVariant: "success",
    status: "Active",
  },
  {
    name: "Bessie Cooper",
    email: "igerrin@gmail.com",
    image: "/assets/images/users/user4.png",
    registered: "27 Mar 2024",
    plan: "Business",
    statusVariant: "danger",
    status: "Inactive",
  },
  {
    name: "Arlene McCoy",
    email: "fellora@mail.ru",
    image: "/assets/images/users/user5.png",
    registered: "27 Mar 2024",
    plan: "Enterprise",
    statusVariant: "success",
    status: "Active",
  },
  {
    name: "Bessie Cooper",
    email: "igerrin@gmail.com",
    image: "/assets/images/users/user4.png",
    registered: "27 Mar 2024",
    plan: "Business",
    statusVariant: "danger",
    status: "Inactive",
  },
  {
    name: "Arlene McCoy",
    email: "fellora@mail.ru",
    image: "/assets/images/users/user5.png",
    registered: "27 Mar 2024",
    plan: "Enterprise",
    statusVariant: "success",
    status: "Active",
  },
  {
    name: "Albert Flores",
    email: "seannand@mail.ru",
    image: "/assets/images/users/user3.png",
    registered: "27 Mar 2024",
    plan: "Standard",
    statusVariant: "success",
    status: "Active",
  },
  {
    name: "Bessie Cooper",
    email: "igerrin@gmail.com",
    image: "/assets/images/users/user4.png",
    registered: "27 Mar 2024",
    plan: "Business",
    statusVariant: "danger",
    status: "Inactive",
  },
  {
    name: "Dianne Russell",
    email: "redaniel@gmail.com",
    image: "/assets/images/users/user1.png",
    registered: "27 Mar 2024",
    plan: "Free",
    statusVariant: "success",
    status: "Active",
  },
];

