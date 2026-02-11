import CommonLink from "@/components/shared/common-link";
import { Card, CardContent } from "@/components/ui/card";
import Image, { StaticImageData } from "next/image";

// Images







interface TreatmentItem {
    icon: string | StaticImageData;
    bgColor: string;
    title: string;
    doctors: string;
    time: string;
}

const treatments: TreatmentItem[] = [
    {
        icon: "/assets/images/home-eight/treatment-icon1.png",
        bgColor: "bg-cyan-600/10",
        title: "Psychiatry",
        doctors: "57 Doctors",
        time: "08:45 AM",
    },
    {
        icon: "/assets/images/home-eight/treatment-icon2.png",
        bgColor: "bg-green-600/10",
        title: "Orthopedic",
        doctors: "85 Doctors",
        time: "08:45 AM",
    },
    {
        icon: "/assets/images/home-eight/treatment-icon3.png",
        bgColor: "bg-violet-600/10",
        title: "Cardiology",
        doctors: "60 Doctors",
        time: "08:45 AM",
    },
    {
        icon: "/assets/images/home-eight/treatment-icon4.png",
        bgColor: "bg-yellow-600/10",
        title: "Pediatrics",
        doctors: "120 Doctors",
        time: "08:45 AM",
    },
    {
        icon: "/assets/images/home-eight/treatment-icon5.png",
        bgColor: "bg-red-600/10",
        title: "Neurology",
        doctors: "25 Doctors",
        time: "08:45 AM",
    },
    {
        icon: "/assets/images/home-eight/treatment-icon6.png",
        bgColor: "bg-primary/10",
        title: "Gastroenterology",
        doctors: "95 Doctors",
        time: "08:45 AM",
    },
];

const AvailableTreatmentsCard = () => {
    return (
        <Card className="card h-full rounded-lg border-0 !p-0">
            <CardContent className="card-body p-0 flex flex-col justify-between gap-8">
                <div>
                    {/* Header */}
                    <div className="card-header border-b border-neutral-200 dark:border-slate-500 py-4 px-6">
                        <div className="flex items-center flex-wrap gap-2 justify-between">
                            <h6 className="font-bold text-lg mb-0">Available Treatments</h6>
                            <CommonLink />
                        </div>
                    </div>

                    {/* Body */}
                    <div className="card-body py-4 px-6">
                        <div className="flex flex-col gap-6">
                            {treatments.map((item, index) => (
                                <div
                                    key={index}
                                    className={`flex items-center justify-between gap-3 ${index === treatments.length - 1 ? "mb-0" : ""
                                        }`}
                                >
                                    {/* Left side: icon + title */}
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-10 h-10 rounded-full flex-shrink-0 ${item.bgColor} flex justify-center items-center`}
                                        >
                                            <Image src={item.icon} alt={item.title} />
                                        </div>
                                        <div className="flex-grow-1">
                                            <h6 className="text-base mb-0 font-normal">
                                                {item.title}
                                            </h6>
                                            <span className="text-sm text-gray-600 dark:text-neutral-100 font-normal">
                                                {item.doctors}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Right side: time */}
                                    <span className="text-gray-600 dark:text-neutral-100">
                                        {item.time}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default AvailableTreatmentsCard;

