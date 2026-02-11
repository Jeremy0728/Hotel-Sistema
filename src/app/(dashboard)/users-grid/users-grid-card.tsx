import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import { ChevronRight, EllipsisVertical } from "lucide-react";
import Image, { StaticImageData } from "next/image";



























export interface UserData {
    id: number;
    name: string;
    email: string;
    department: string;
    designation: string;
    bgImage: StaticImageData;
    avatar: StaticImageData;
}

export const usersData: UserData[] = [
    {
        id: 1,
        name: "Jacob Jones",
        email: "jacob.jones@example.com",
        department: "Design",
        designation: "UI UX Designer",
        bgImage: "/assets/images/user-grid/user-grid-bg1.png",
        avatar: "/assets/images/user-grid/user-grid-img1.png",
    },
    {
        id: 2,
        name: "Darrell Steward",
        email: "darrell.steward@example.com",
        department: "Marketing",
        designation: "Content Strategist",
        bgImage: "/assets/images/user-grid/user-grid-bg2.png",
        avatar: "/assets/images/user-grid/user-grid-img2.png",
    },
    {
        id: 3,
        name: "Jerome Bell",
        email: "jerome.bell@example.com",
        department: "Engineering",
        designation: "Frontend Developer",
        bgImage: "/assets/images/user-grid/user-grid-bg3.png",
        avatar: "/assets/images/user-grid/user-grid-img3.png",
    },
    {
        id: 4,
        name: "Marvin McKinney",
        email: "marvin.mckinney@example.com",
        department: "Engineering",
        designation: "Backend Developer",
        bgImage: "/assets/images/user-grid/user-grid-bg4.png",
        avatar: "/assets/images/user-grid/user-grid-img4.png",
    },
    {
        id: 5,
        name: "Kristin Watson",
        email: "kristin.watson@example.com",
        department: "HR",
        designation: "Recruiter",
        bgImage: "/assets/images/user-grid/user-grid-bg5.png",
        avatar: "/assets/images/user-grid/user-grid-img5.png",
    },
    {
        id: 6,
        name: "Courtney Henry",
        email: "courtney.henry@example.com",
        department: "Design",
        designation: "Graphic Designer",
        bgImage: "/assets/images/user-grid/user-grid-bg6.png",
        avatar: "/assets/images/user-grid/user-grid-img6.png",
    },
    {
        id: 7,
        name: "Ronald Richards",
        email: "ronald.richards@example.com",
        department: "Finance",
        designation: "Accountant",
        bgImage: "/assets/images/user-grid/user-grid-bg7.png",
        avatar: "/assets/images/user-grid/user-grid-img7.png",
    },
    {
        id: 8,
        name: "Kathryn Murphy",
        email: "kathryn.murphy@example.com",
        department: "Operations",
        designation: "Operations Manager",
        bgImage: "/assets/images/user-grid/user-grid-bg8.png",
        avatar: "/assets/images/user-grid/user-grid-img8.png",
    },
    {
        id: 9,
        name: "Cody Fisher",
        email: "cody.fisher@example.com",
        department: "Support",
        designation: "Support Engineer",
        bgImage: "/assets/images/user-grid/user-grid-bg9.png",
        avatar: "/assets/images/user-grid/user-grid-img9.png",
    },
    {
        id: 10,
        name: "Annette Black",
        email: "annette.black@example.com",
        department: "Legal",
        designation: "Legal Advisor",
        bgImage: "/assets/images/user-grid/user-grid-bg10.png",
        avatar: "/assets/images/user-grid/user-grid-img10.png",
    },
    {
        id: 11,
        name: "Eleanor Pena",
        email: "eleanor.pena@example.com",
        department: "Admin",
        designation: "Office Admin",
        bgImage: "/assets/images/user-grid/user-grid-bg11.png",
        avatar: "/assets/images/user-grid/user-grid-img11.png",
    },
    {
        id: 12,
        name: "Guy Hawkins",
        email: "guy.hawkins@example.com",
        department: "IT",
        designation: "IT Support",
        bgImage: "/assets/images/user-grid/user-grid-bg12.png",
        avatar: "/assets/images/user-grid/user-grid-img12.png",
    },
];

const UsersGridCard = () => {
    return (
        usersData.map((userItem, index) => {
            return (
                <div className="user-grid-card" key={index}>
                    <div className="relative border border-neutral-200 dark:border-neutral-600 rounded-2xl overflow-hidden">
                        <div className="relative h-[127px]">
                            <Image src={userItem.bgImage} alt="Image" fill className="w-full object-fit-cover" />

                        </div>

                        <div className="dropdown absolute top-0 end-0 me-4 mt-4">
                            <DropdownMenu>
                                <DropdownMenuTrigger className='bg-gradient-to-r from-white/50 w-8 h-8 rounded-lg border border-light-white flex justify-center items-center text-white'>
                                    <EllipsisVertical className="h-5" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem>Edit</DropdownMenuItem>
                                    <DropdownMenuItem>Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <div className="pe-6 pb-4 ps-6 text-center mt--50 relative z-[1]">
                            <Image src={userItem.avatar} alt="Image" width={100} height={100} className="border br-white border-width-2-px w-[100px] h-[100px] ms-auto me-auto -mt-[50px] rounded-full object-fit-cover" />
                            <h6 className="text-lg mb-0 mt-1.5">{userItem.name}</h6>
                            <span className="text-neutral-500 dark:text-neutral-300 mb-4">{userItem.email}</span>

                            <div className="center-border relative bg-gradient-to-r from-red-500/10 to-red-50/25 rounded-lg p-3 flex items-center gap-4 before:absolute before:w-px before:h-full before:z-[1] before:bg-neutral-200 dark:before:bg-neutral-500 before:start-1/2">
                                <div className="text-center w-1/2">
                                    <h6 className="text-base mb-0">{userItem.department}</h6>
                                    <span className="text-neutral-500 dark:text-neutral-300 text-sm mb-0">Department</span>
                                </div>
                                <div className="text-center w-1/2">
                                    <h6 className="text-base mb-0">{userItem.designation}</h6>
                                    <span className="text-neutral-500 dark:text-neutral-300 text-sm mb-0">Designation</span>
                                </div>
                            </div>
                            <Button className={cn(`bg-blue-50 hover:bg-primary dark:hover:bg-primary hover:text-white dark:hover:text-white dark:bg-primary/25 text-primary dark:text-blue-400 text-sm px-3 py-3 rounded-lg flex items-center justify-center mt-4 font-medium gap-2 w-full h-12`)}>
                                View Profile
                                <ChevronRight className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            )
        })
    );
};

export default UsersGridCard;
