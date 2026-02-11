"use client";

import Image from "next/image";
import Link from "next/link";
import LanguageSelect from "../shared/language-select";
import MessageDropdown from "../shared/message-dropdown";
import { ModeToggle } from "../shared/mode-toggle";
import ProfileDropdown from "../shared/profile-dropdown";
import SearchBox from "../shared/search-box";
import HotelSwitcher from "../shared/hotel-switcher";
import { SidebarTrigger } from "../ui/sidebar";
import NotificationDropdown from "./../shared/notification-dropdown";

const Header = () => {
  return (
    <header className="dashboard-header relative z-30 flex w-full max-w-full shrink-0 border-b border-neutral-200 bg-white px-3 py-2.5 transition-[width,height] ease-linear dark:border-slate-700 dark:bg-[#273142] sm:px-4 md:px-6 group-has-data-[collapsible=icon]/sidebar-wrapper:h-18">
      <div className="flex w-full min-w-0 items-center justify-between gap-2 md:gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-2 md:gap-3">
          <SidebarTrigger className="-ms-1 p-0 size-[unset] cursor-pointer" />
          <Link href="/dashboard" className="shrink-0">
            <Image
              src="/assets/images/logo-icon.png"
              alt="Logo"
              width={28}
              height={28}
              priority
              className="rounded-sm"
            />
          </Link>
          <div className="min-w-0 flex-1">
            <SearchBox
              className="w-full md:w-[320px] lg:w-[420px] lg:max-w-[520px]"
              placeholder="Buscar huesped, reserva o habitacion..."
              mobileIconOnly
            />
          </div>
        </div>

        <div className="shrink-0">
          <HotelSwitcher />
        </div>

        <div className="flex max-w-full items-center gap-2 shrink-0">
          <div className="hidden md:flex items-center gap-2">
            <ModeToggle />
            <LanguageSelect />
            <MessageDropdown />
          </div>
          <NotificationDropdown />
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
};

export default Header;
