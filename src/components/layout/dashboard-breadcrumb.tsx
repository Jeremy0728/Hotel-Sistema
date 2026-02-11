import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { House } from 'lucide-react';


interface BreadcrumbData {
    title: string,
    text: string,
}

const DashboardBreadcrumb = ({ title, text }: BreadcrumbData) => {
    return (
        <div className='mb-6 flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
            <h6 className="text-2xl font-semibold">{title}</h6>
            <Breadcrumb className="hidden min-w-0 sm:block">
                <BreadcrumbList className="max-w-full flex-wrap">
                    <BreadcrumbItem className="">
                        <BreadcrumbLink href='/' className='flex items-center gap-2 font-medium text-base text-neutral-600 hover:text-primary dark:text-white dark:hover:text-primary'>
                            <House size={16} />
                            Dashboard
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem className="text-base">
                        <BreadcrumbPage className="block max-w-[70vw] truncate">{text}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    );
};

export default DashboardBreadcrumb;
