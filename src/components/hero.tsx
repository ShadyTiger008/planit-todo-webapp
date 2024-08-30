import Link from "next/link";
import CommonButton from "./common-button";

const Hero = () => {
  return (
    <div className="relative h-[102vh] w-full overflow-hidden bg-[url('/bg.jpeg')] bg-cover text-white">
      <div className="mx-auto flex h-full w-[90%] max-w-[1450px] items-center justify-center pt-[82px]">
        <div className="grid items-center gap-6 md:grid-cols-2">
          <img
            alt="product image"
            className="order-last mx-auto min-w-[400px] rounded-xl max-sm:px-5 md:h-[500px] md:min-w-[800px]"
            src="/hero.png"
          />
          <div className="flex flex-col justify-center space-y-4 max-md:items-center max-md:text-center sm:max-w-[90%] lg:max-w-none">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Visualize Success Daily
              </h2>
              <p className="w-full md:max-w-[500px] text-base text-gray-300 sm:text-lg md:text-xl">
                Take control of your projects with our simple yet powerful
                Kanban board.
              </p>
            </div>
            <Link href="/sign-up">
              <CommonButton text="Start planning now &#8594;" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
