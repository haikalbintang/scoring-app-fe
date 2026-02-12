import Image from "next/image";

const Navbar = () => {
  return (
    <aside className="w-20 lg:w-64 shrink-0 h-screen border-r bg-background flex items-start lg:items-center justify-center">
      <Image
        src="/champion.png"
        alt="Champion Logo"
        width={200}
        height={200}
        className="-rotate-90 lg:rotate-0 w-96 h-3 lg:w-40 lg:h-auto translate-y-18 lg:translate-y-0 transition-transform duration-300"
        priority
      />
    </aside>
  );
};

export default Navbar;
