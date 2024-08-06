import {
  ChevronDown,
  NotificationsOutline,
  PersonCircle,
  SearchOutline,
  SettingsOutline,
  ShareSocialOutline,
} from "react-ionicons";

const Navbar = () => {
  return (
    <div className="fixed left-[60px] top-0 flex h-[70px] w-[calc(100%-60px)] items-center justify-between border-b border-slate-300 bg-[#fff] pl-2 pr-6 md:left-[230px] md:w-[calc(100%-230px)]">
      <div className="flex cursor-pointer items-center gap-3">
        <PersonCircle color="#fb923c" width={"28px"} height={"28px"} />
        <span className="whitespace-nowrap text-sm font-semibold text-orange-400 md:text-lg">
          Board Name
        </span>
        <ChevronDown color="#fb923c" width={"16px"} height={"16px"} />
      </div>
      <div className="flex w-[130px] items-center gap-2 rounded-lg bg-gray-100 px-3 py-[10px] md:w-[800px]">
        <SearchOutline color={"#999"} />
        <input
          type="text"
          placeholder="Search"
          className="w-full bg-gray-100 text-[15px] outline-none"
        />
      </div>
      <div className="hidden items-center gap-4 md:flex">
        <div className="grid cursor-pointer place-items-center rounded-full bg-gray-100 p-2">
          <ShareSocialOutline color={"#444"} />
        </div>
        <div className="grid cursor-pointer place-items-center rounded-full bg-gray-100 p-2">
          <SettingsOutline color={"#444"} />
        </div>
        <div className="grid cursor-pointer place-items-center rounded-full bg-gray-100 p-2">
          <NotificationsOutline color={"#444"} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
