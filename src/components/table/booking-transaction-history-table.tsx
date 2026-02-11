import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";





import Image, { StaticImageData } from "next/image";

interface ActivityStatus {
    label: string;
    type: "success" | "warning" | "purple";
}

interface BookingTransactionHistoryTypeItem {
    customer: {
        name: string;
        image: string | StaticImageData; // ✅ allow both
    };
    id: string;
    duration: string;
    amount: string;
    date: string;
    status: ActivityStatus;
}

const bookingTransactionsHistoryTableContents: BookingTransactionHistoryTypeItem[] = [
    {
        customer: {
            name: "Grand Palace",
            image: "/assets/images/home-twelve/transaction-img1.png",
        },
        id: "#63254",
        duration: "5 min ago",
        amount: "$12,408.12",
        date: "21/09/2025",
        status: { label: "Completed", type: "success" },
    },
    {
        customer: {
            name: "Paris France",
            image: "/assets/images/home-twelve/transaction-img2.png",
        },
        id: "#63254",
        duration: "12 min ago",
        amount: "$12,408.12",
        date: "21/09/2025",
        status: { label: "Pending", type: "warning" },
    },
    {
        customer: {
            name: "Khaosan Road",
            image: "/assets/images/home-twelve/transaction-img3.png",
        },
        id: "#63254",
        duration: "15 min ago",
        amount: "$12,408.12",
        date: "21/09/2025",
        status: { label: "Completed", type: "success" },
    },
    {
        customer: {
            name: "Wat Phra Kaew",
            image: "/assets/images/home-twelve/transaction-img4.png",
        },
        id: "#63254",
        duration: "17 min ago",
        amount: "$12,408.12",
        date: "21/09/2025",
        status: { label: "Pending", type: "warning" },
    },
    {
        customer: {
            name: "Wat Pho",
            image: "/assets/images/home-twelve/transaction-img5.png",
        },
        id: "#63254",
        duration: "25 min ago",
        amount: "$12,408.12",
        date: "21/09/2025",
        status: { label: "Completed", type: "success" },
    },
];

const BookingTransactionHistoryTable = () => {
    return (
        <Table className="table-auto border-spacing-0 border-separate">
            <TableHeader>
                <TableRow>
                    <TableHead className="bg-neutral-100 dark:bg-slate-700 text-base px-6 h-16 text-start">
                        Place
                    </TableHead>
                    <TableHead className="bg-neutral-100 dark:bg-slate-700 text-base px-6 h-16 text-center">
                        ID
                    </TableHead>
                    <TableHead className="bg-neutral-100 dark:bg-slate-700 text-base px-6 h-16 text-center">
                        Duration
                    </TableHead>
                    <TableHead className="bg-neutral-100 dark:bg-slate-700 text-base px-6 h-16 text-center">
                        Amount
                    </TableHead>
                    <TableHead className="bg-neutral-100 dark:bg-slate-700 text-base px-6 h-16 text-center">
                        Date
                    </TableHead>
                    <TableHead className="bg-neutral-100 dark:bg-slate-700 text-base px-6 h-16 text-center">
                        Status
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {bookingTransactionsHistoryTableContents.map((item, index) => (
                    <TableRow key={index}>
                        {/* Customer */}
                        <TableCell className="py-3.5 px-6 text-start">
                            <div className="flex items-center">
                                <Image
                                    src={item.customer.image}
                                    alt={item.customer.name}
                                    width={40}
                                    height={40}
                                    className="w-10 h-10 rounded-md me-3"
                                />
                                <div>
                                    <h6 className="text-base mb-0">{item.customer.name}</h6>
                                </div>
                            </div>
                        </TableCell>

                        {/* ID */}
                        <TableCell className="py-3.5 px-6 text-center">{item.id}</TableCell>

                        {/* duration */}
                        <TableCell className="py-3.5 px-6 text-center">{item.duration}</TableCell>

                        {/* Amount */}
                        <TableCell className="py-3.5 px-6 text-center">{item.amount}</TableCell>

                        {/* date */}
                        <TableCell className="py-3.5 px-6 text-center">{item.date}</TableCell>

                        {/* Status */}
                        <TableCell className="py-3.5 px-6 text-center">
                            <span
                                className={`px-4 py-1.5 rounded-md font-medium text-sm
                                    ${item.status.type === "success" && "bg-green-500/15 text-green-600 dark:text-green-600"}
                                    ${item.status.type === "warning" && "bg-yellow-500/15 text-yellow-600 dark:text-yellow-600"}
                                    ${item.status.type === "purple" && "bg-purple-500/15 text-purple-600 dark:text-purple-600"}
                                `}
                            >
                                {item.status.label}
                            </span>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default BookingTransactionHistoryTable;
