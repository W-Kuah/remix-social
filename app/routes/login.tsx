import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, useOutletContext } from "@remix-run/react"
import { AppLogo } from "~/components/app-logo";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Github } from "lucide-react";
import { User } from "lucide-react";
import { SupabaseOutletContext } from "~/lib/supabase";
import { getSupabaseWithSessionAndHeaders } from "~/lib/supabase.server";
import { Provider } from "@supabase/supabase-js";

export let loader = async ({ request }: LoaderFunctionArgs) => {
    const { headers, serverSession } = await getSupabaseWithSessionAndHeaders({
        request,
    });

    if (serverSession) {
        return redirect("/gitposts", { headers });
    }

    return json({ success: true }, { headers });
};

export default function Login() {
    const { supabase, domainUrl } = useOutletContext<SupabaseOutletContext>();

    const handleSignIn = async (provider: Provider) => {
        await supabase.auth.signInWithOAuth({
            provider: provider,
            options: {
                redirectTo: `${domainUrl}/resources/auth/callback`,
            },
        });
    };


    return (
        <section className="w-full bg-white min-h-screen flex flex-col">
        <nav className="flex items-center space-x-2 p-4">
            <Link to="/">
                <AppLogo className="h-8 w-8 md:h-10 md:w-10"/>
            </Link>
            <h1 className="text-xl font-semibold text-zinc-900 relative right-2.5">azzup</h1>
        </nav>
        <div className="container flex flex-col justify-start items-center px-4 md:px-6 flex-1 mt-24">
            <div className="flex flex-col items-center space-y-4 text-center p-4">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">
                Login in using <br />
                <span className="px-1 font-extrabold bg-gradient-to-r from-orange-700 via-green-500 to-purple-400 text-transparent bg-clip-text bg-300% animate-gradient">
                Github
                </span>{" "}
                or
                {" "}<span className="px-1 font-extrabold bg-gradient-to-r from-blue-400 via-red-700 to-yellow-600 text-transparent bg-clip-text bg-300% animate-gradient">
                Google
                </span>{" "}
                <br />
                and discover more
            </h1>

            <p className="text-gray-500 mt-2">
                Ready to show everyone Wazzup?
            </p>
            </div>
            <Card className="relative group overflow-hidden rounded-lg">
            <CardContent className="p-1 bg-gradient-to-r from-orange-700 via-purple-500 to-green-400  bg-300% animate-gradient">
                <Button onClick={() => handleSignIn('github' as Provider) }>
                    <Github className="mr-2 h-4 w-4"/>
                        Github
                </Button>
            </CardContent>
            </Card>
            <Card className="relative group overflow-hidden rounded-lg">
            <CardContent className="p-1 bg-gradient-to-r from-blue-400 via-red-700 to-yellow-600 bg-300% animate-gradient">
                <Button onClick={() => handleSignIn('google' as Provider) }>
                    <User className="mr-2 h-4 w-4"/>
                        Google
                </Button>
            </CardContent>
            </Card>
        </div>
        </section>
    );
}
