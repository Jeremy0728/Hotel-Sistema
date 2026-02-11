import Image, { StaticImageData } from "next/image";







export interface Country {
  name: string;
  users: string;
  percent: number;
  flag: StaticImageData;
  color: string;
}

export const countries: Country[] = [
  {
    name: "USA",
    users: "1,240 Users",
    percent: 80,
    flag: "/assets/images/flags/flag1.png",
    color: "bg-primary",
  },
  {
    name: "Bangladesh",
    users: "1,240 Users",
    percent: 60,
    flag: "/assets/images/flags/flag2.png",
    color: "bg-[#f86624]",
  },
  {
    name: "France",
    users: "1,240 Users",
    percent: 49,
    flag: "/assets/images/flags/flag3.png",
    color: "bg-yellow-500",
  },
  {
    name: "Germany",
    users: "1,240 Users",
    percent: 100,
    flag: "/assets/images/flags/flag4.png",
    color: "bg-green-600",
  },
  {
    name: "South Korea",
    users: "1,240 Users",
    percent: 30,
    flag: "/assets/images/flags/flag5.png",
    color: "bg-cyan-600",
  },
];

const CountryList = () => {
  return (
    <>
      {countries.map((country, index) => (
        <div
          key={index}
          className="flex items-center justify-between gap-3 mb-3 pb-2 last:mb-0 last:pb-0"
        >
          <div className="flex items-center">
            <Image
              src={country.flag}
              alt={country.name}
              className="w-10 h-10 rounded-full shrink-0 me-4"
            />
            <div className="grow">
              <h6 className="text-sm mb-0">{country.name}</h6>
              <span className="text-xs text-neutral-500 dark:text-neutral-300 font-medium">
                {country.users}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-[66px] ms-auto">
              <div className="rounded-full h-2 bg-gray-200 dark:bg-neutral-700">
                <div
                  className={`${country.color} h-2 rounded-full`}
                  style={{ width: `${country.percent}%` }}
                ></div>
              </div>
            </div>
            <span className="text-neutral-500 dark:text-neutral-300 text-xs font-semibold">
              {country.percent}%
            </span>
          </div>
        </div>
      ))}
    </>
  );
};

export default CountryList;
