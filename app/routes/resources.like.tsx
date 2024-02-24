import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { Star } from "lucide-react";
import { deleteLike, insertLike } from "~/lib/database.server";
import { getSupabaseWithSessionAndHeaders } from "~/lib/supabase.server";

export async function action({ request }: ActionFunctionArgs) {
    const { supabase, headers, serverSession } = 
    await getSupabaseWithSessionAndHeaders({
        request,
    });
    if (!serverSession) {
        return redirect("login", { headers });
    }

    const formData = await request.formData();
    const action = formData.get("action");
    const postId = formData.get("postId")?.toString();
    const userId = formData.get("userId")?.toString();

    if (!userId || !postId) {
        return json(
            { error: "User or Tweet Id missing"},
            { status: 400, headers}
        );
    }

    if(action === "like" ) {
        const { error } = await insertLike({dbClient: supabase, userId, postId });

        if (error) {
            return json({ error: "Failed to like" }, { status: 500, headers });
        }
    } else {
        const { error } = await deleteLike({dbClient: supabase, userId, postId });

        if (error) {
            return json({ error: "Failed to like" }, { status: 500, headers });
        }
    }

    return json({ ok: true, error: null }, { headers });
}




type LikeProps = {
    likedByUser: boolean;
    likes: number;
    postId: string;
    sessionUserId: string;
};

export function Like({ likedByUser, likes, postId, sessionUserId }: LikeProps) {
    const fetcher = useFetcher();

    return (
        <fetcher.Form action="/resources/like" method="post">
            <input type="hidden" name="postId" value={postId} />
            <input type="hidden" name="userId" value={sessionUserId} />
            <input 
                type="hidden" 
                name="action" 
                value={likedByUser ? "unlike" : "like"} 
            />
            <button className="group flex items-center focus:outline-none">
                <Star 
                    className={`w-4 h-4 group-hover:text-blue-400 fill-current ${
                        likedByUser ?  "text-blue-700" : "text-gray-500"
                    }`}
                />
                <span 
                    className={`ml-2 text-sm group-hover:text-blue-400 ${
                        likedByUser ?  "text-blue-700" : "text-gray-500"
                    }`}
                >
                    {likes}
                </span>
            </button>
        </fetcher.Form>
    );
}