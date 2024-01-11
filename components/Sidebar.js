import Link from "next/link";

const Sidebar = () => {
  return (
    <>
      {/* Barre latérale */}
      <div className="w-1/6 bg-primary">
        {/* Logo */}
        <div className="h-1/6 flex flex-col items-center justify-center">
          <h1 className="text-white font-bold text-3xl">
            Be{" "}
            <span className="bg-white text-primary py-4 px-2 rounded-md">Travel</span>
          </h1>
        </div>
        {/* Menu */}
        <div className="h-5/6 w-full flex flex-col justify-start pt-4 gap-12 items-center text-white font-bold">
          <Link
            href="/travel"
            className="w-4/6 py-4 bg-secondary rounded-full hover:bg-white hover:text-primary transition-all duration-300 ease-in-out"
          >
            <div>
              <h1 className="text-center text-lg">Voyages</h1>
            </div>
          </Link>
          <Link
            href="/profile"
            className="w-4/6 py-4 bg-secondary rounded-full hover:bg-white hover:text-primary transition-all duration-300 ease-in-out"
          >
            <div>
              <h1 className="text-center text-lg">Profil</h1>
            </div>
          </Link>
          <Link
            href="/friends"
            className="w-4/6 py-4 bg-secondary  rounded-full hover:bg-white hover:text-primary transition-all duration-300 ease-in-out"
          >
            <div>
              <h1 className="text-center text-lg">Amis</h1>
            </div>
          </Link>
          <Link
            href="/feed"
            className="w-4/6 py-4 bg-secondary  rounded-full hover:bg-white hover:text-primary transition-all duration-300 ease-in-out"
          >
            <div>
              <h1 className="text-center text-lg">Feed</h1>
            </div>
          </Link>
          <div className="w-full h-full flex justify-center items-end pb-4">
            <h1 className="text-center text-sm w-4/6 py-4 bg-secondary rounded-full hover:bg-white hover:text-primary transition-all duration-300 ease-in-out">X</h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
