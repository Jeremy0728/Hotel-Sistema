"use client";

import DashboardBreadcrumb from "@/components/layout/dashboard-breadcrumb";
import CustomSelect from "@/components/shared/custom-select";
import SearchBox from "@/components/shared/search-box";
import UsersListTable from '@/components/table/users-list-table';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useUsers } from "@/hooks/useUsers";
import { useUserOperations } from "./hooks/useUserOperations";

const UsersList = () => {
    // Obtener datos desde hooks individuales
    const { users: apiUsers, isLoading: usersLoading } = useUsers({ limit: 100 });

    // Hook de operaciones de usuarios
    const {
        search,
        setSearch,
        statusFilter,
        setStatusFilter,
        pageSize,
        setPageSize,
        paginatedUsers,
    } = useUserOperations({
        users: apiUsers,
    });

    if (usersLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center space-y-3">
                    <div className="h-8 w-8 animate-spin mx-auto border-4 border-primary border-t-transparent rounded-full" />
                    <p className="text-sm text-neutral-500">Cargando usuarios...</p>
                </div>
            </div>
        );
    }
    return (
        <>
            <DashboardBreadcrumb title="Users List" text="Users List" />

            <Card className="card h-full !p-0 !block border-0 overflow-hidden mb-6">
                <CardHeader className="border-b border-neutral-200 dark:border-slate-600 !py-4 px-6 flex items-center flex-wrap gap-3 justify-between">
                    <div className="flex items-center flex-wrap gap-3">
                        <span className="text-base font-medium text-neutral-500 dark:text-neutral-300 mb-0">Show</span>
                        <CustomSelect
                            placeholder={String(pageSize)}
                            options={["5", "10", "20", "50", "100"]}
                            onChange={(value) => setPageSize(Number(value))}
                        />
                        <SearchBox value={search} onChange={setSearch} />
                        <CustomSelect
                            placeholder="Status"
                            options={["all", "active", "inactive"]}
                            onChange={(value) => setStatusFilter(value as any)}
                        />
                    </div>
                    <Button className={cn(`w-auto h-11`)} asChild>
                        <Link href="#">
                            <Plus className="w-5 h-5" />
                            Add New User
                        </Link>
                    </Button>
                </CardHeader>

                <CardContent className="card-body p-6">
                    <UsersListTable users={paginatedUsers} />
                </CardContent>
            </Card>

        </>
    );
};
export default UsersList;
