import Image, { StaticImageData } from "next/image";








export interface TopPerformer {
  id: number;
  name: string;
  image: StaticImageData;
  phone: string;
  order: string;
}

export const topPerformers: TopPerformer[] = [
  {
    id: 1,
    name: "Dianne Russell",
    image: "/assets/images/users/user2.png",
    phone: "017******58",
    order: "60",
  },
  {
    id: 2,
    name: "Wade Warren",
    image: "/assets/images/users/user1.png",
    phone: "017******58",
    order: "35",
  },
  {
    id: 3,
    name: "Albert Flores",
    image: "/assets/images/users/user3.png",
    phone: "017******58",
    order: "55",
  },
  {
    id: 4,
    name: "Bessie Cooper",
    image: "/assets/images/users/user4.png",
    phone: "017******58",
    order: "60",
  },
  {
    id: 5,
    name: "Arlene McCoy",
    image: "/assets/images/users/user5.png",
    phone: "017******58",
    order: "55",
  },
  {
    id: 6,
    name: "Arlene McCoy",
    image: "/assets/images/users/user6.png",
    phone: "017******58",
    order: "50",
  },
];

const TopCustomerList = () => {
  return (
    <>
      {topPerformers.map((topPerformer, index) => {
        return (
          <div className="flex items-center justify-between gap-2" key={index}>
            <div className="flex items-center gap-3">
              <Image
                src={topPerformer.image}
                alt={topPerformer.name}
                className="w-10 h-10 rounded-sm shrink-0 overflow-hidden"
              />
              <div className="grow">
                <h6 className="text-base mb-0 font-medium">
                  {topPerformer.name}
                </h6>
                <span className="text-sm text-neutral-500 dark:text-neutral-300 font-medium">
                  {topPerformer.phone}
                </span>
              </div>
            </div>
            <span className="text-neutral-600 dark:text-neutral-100 text-base font-medium">
              Orders: {topPerformer.order}
            </span>
          </div>
        );
      })}
    </>
  );
};

export default TopCustomerList;
