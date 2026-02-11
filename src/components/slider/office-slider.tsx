import {
    Carousel,
    CarouselContent,
    CarouselItem
} from "@/components/ui/carousel";




import Image, { StaticImageData } from "next/image";

interface officerSliders {
    id: number;
    image: StaticImageData;
    name: string;
    designation: string;
}

export const officerSliderData: officerSliders[] = [
    {
        id: 1,
        image: "/assets/images/home-eleven/officer-img1.png",
        name: "Mr. Bin",
        designation: "Insurance officer",
    },
    {
        id: 2,
        image: "/assets/images/home-eleven/officer-img2.png",
        name: "Md. Robiul",
        designation: "Insurance officer",
    },
    {
        id: 3,
        image: "/assets/images/home-eleven/officer-img3.png",
        name: "Mr. Doe",
        designation: "Insurance officer",
    },
    {
        id: 4,
        image: "/assets/images/home-eleven/officer-img4.png",
        name: "Mr. Jhenon",
        designation: "Insurance officer",
    },
    {
        id: 5,
        image: "/assets/images/home-eleven/officer-img2.png",
        name: "Mr. Riad",
        designation: "Insurance officer",
    },
];

function OfficeSlider() {
    return (
        <Carousel className="w-full mt-5"
            opts={{
                align: "center",
                loop: true,
            }}
        >
            <CarouselContent>
                {officerSliderData.map((card) => (
                    <CarouselItem key={card.id} className="basis-1/2 sm:basis-1/3 xl:basis-1/4">
                        <div className="officer-slider__item flex flex-col text-center items-center justify-center">
                            <div className="officer-slider__thumb w-14 h-14 rounded-full overflow-hidden flex-shrink-0 mx-8">
                                <Image src={card.image} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="officer-slider__content mt-6 min-w-max">
                                <h6 className="mb-0 text-xl">Mr. Bin</h6>
                                <span className="text-sm text-neutral-600 dark:text-neutral-300">Insurance officer</span>
                            </div>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
    );
}

export default OfficeSlider;
