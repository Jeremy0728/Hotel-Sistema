import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Edit, Eye, Trash2 } from "lucide-react";
import Image from "next/image";
import { User } from "@/types/auth";

interface UserTableProps {
    users: User[];
}

export default function UserTable({ users }: UserTableProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600 rounded-tl-lg w-[80px]">S.L</TableHead>
                    <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600 ">Join Date</TableHead>
                    <TableHead className="px-4 h-12 text-start bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600 ">Name</TableHead>
                    <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600 ">Email</TableHead>
                    <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600 ">Department</TableHead>
                    <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600 ">Designation</TableHead>
                    <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600 text-center">Status</TableHead>
                    <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600 text-center rounded-tr-lg">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map((user, index) => {
                    const isLast = index === users.length - 1;
                    return (
                        <TableRow key={user.id}>
                            <TableCell
                                className={`py-4 px-4 border-b text-center first:border-s last:border-e border-neutral-200 dark:border-slate-600 ${isLast ? "rounded-bl-lg" : ""
                                    }`}
                            >{String(index + 1).padStart(2, "0")}</TableCell>
                            <TableCell
                                className={`py-4 px-4 border-b text-center first:border-s last:border-e border-neutral-200 dark:border-slate-600 ${isLast ? "rounded-bl-lg" : ""
                                    }`}
                            >{user.created_at ? new Date(user.created_at).toLocaleDateString() : "-"}</TableCell>
                            <TableCell
                                className={`py-4 px-4 border-b text-center first:border-s last:border-e border-neutral-200 dark:border-slate-600 ${isLast ? "rounded-bl-lg" : ""
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                                        {user.name?.charAt(0).toUpperCase() || "U"}
                                    </div>
                                    <span>{user.name || "Usuario"}</span>
                                </div>
                            </TableCell>
                            <TableCell
                                className={`py-4 px-4 border-b text-center first:border-s last:border-e border-neutral-200 dark:border-slate-600 ${isLast ? "rounded-bl-lg" : ""
                                    }`}
                            >{user.email}</TableCell>
                            <TableCell
                                className={`py-4 px-4 border-b text-center first:border-s last:border-e border-neutral-200 dark:border-slate-600 ${isLast ? "rounded-bl-lg" : ""
                                    }`}
                            >{user.role || "-"}</TableCell>
                            <TableCell
                                className={`py-4 px-4 border-b text-center first:border-s last:border-e border-neutral-200 dark:border-slate-600 ${isLast ? "rounded-bl-lg" : ""
                                    }`}
                            >{user.role || "-"}</TableCell>
                            <TableCell
                                className={`py-4 px-4 border-b text-center first:border-s last:border-e border-neutral-200 dark:border-slate-600 ${isLast ? "rounded-bl-lg" : ""
                                    }`}
                            >
                                <span
                                    className={`px-3 py-1.5 rounded text-sm font-medium border ${user.is_active
                                        ? "bg-green-600/15 text-green-600 border-green-600"
                                        : "bg-gray-600/15 text-gray-600 dark:text-white border-gray-400"
                                        }`}
                                >
                                    {user.is_active ? "Active" : "Inactive"}
                                </span>
                            </TableCell>
                            <TableCell
                                className={`py-4 px-4 border-b text-center first:border-s last:border-e border-neutral-200 dark:border-slate-600 ${isLast ? "rounded-bl-lg" : ""
                                    }`}
                            >
                                <div className="flex justify-center gap-2">
                                    <Button size="icon" variant="ghost" className="rounded-[50%] text-blue-500 bg-primary/10">
                                        <Eye className="w-5 h-5" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="rounded-[50%] text-green-600 bg-green-600/10">
                                        <Edit className="w-5 h-5" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="rounded-[50%] text-red-500 bg-red-500/10">
                                        <Trash2 className="w-5 h-5" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    );
}
