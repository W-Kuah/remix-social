import { Cross2Icon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Link, Outlet } from "@remix-run/react";
import { useState } from "react";
import { AppLogo } from "~/components/app-logo";
import { Button } from "~/components/ui/button";

export default function Home() {
    const [isNavOpen, setNavOpen] = useState(false);

    return (
        <section className="w-full bg-white min-h-screen flex flex-col">
            <nav className="sticky top-0 z-10 flex w-full item-center justify-between p-4 border-b border-zinc-200 flex-wrap md:flex-nowrap">
                <Link to="/" className="flex items-center space-x-2">
                    <AppLogo className="h-8 w-8 md:h-10 md:w-10"/>
                    <h1 className="text-xl font-semibold text-zinc-900 relative right-2.5">azzup</h1>
                </Link>
                <button onClick={() => setNavOpen(!isNavOpen)} className="md:hidden">
                    {isNavOpen ? <Cross2Icon/> : <HamburgerMenuIcon />}
                </button>
                <div 
                    className={`flex md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 ${
                        isNavOpen 
                        ? "flex-col order-last w-full md:w-auto"
                        : "hidden md:flex"
                    }`}
                >
                    <Link prefetch="intent" to={`/profile/w-kuah`}>@w-kuah</Link>
                    <img 
                        alt="Profile" 
                        className="rounded-full"
                        height="40"
                        src={"https://media.licdn.com/dms/image/C5603AQHHZKGHek6vVQ/profile-displayphoto-shrink_200_200/0/1605196900942?e=1714003200&v=beta&t=xW7p245uvRWiW5NMP8z6guERhG0nGG-Zigl46TjTKv8"}
                        style={{
                            aspectRatio: "40/40",
                            objectFit: "cover",
                        }}
                        width="40"
                    />
                    <Button>Logout</Button>
                </div>
            </nav>
            <Outlet/>
        </section>
    )
}