import { Separator } from "@radix-ui/react-separator";
import { json, redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigation } from "@remix-run/react";
import { InfiniteVirtualList } from "~/components/infinite-virtual-list";
import { PostSearch } from "~/components/post-search";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { WritePost } from "~/components/write-post";
import { getAllPostsWithDetails } from "~/lib/database.server";
import { getSupabaseWithSessionAndHeaders } from "~/lib/supabase.server";
import { combinePostsWithLikes, getUserDataFromSession } from "~/lib/utils";

export const loader = async ({ request } : LoaderFunctionArgs) => {
    const { headers, supabase, serverSession } = 
    await getSupabaseWithSessionAndHeaders({
        request,
    });

    if (!serverSession) {
        return redirect("/login", { headers });
    }
    
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const query = searchParams.get("query");
    const page = Number(searchParams.get("page")) || 1;

    const { data, totalPages } = await getAllPostsWithDetails({ dbClient: supabase, page: isNaN(page) ? 1 : page });

    const { 
        userId: sessionUserId, 
        // username , 
        // userAvatarUrl 
    } = getUserDataFromSession(serverSession);

    const posts = combinePostsWithLikes(data, sessionUserId);

    return json({ query, posts, totalPages }, { headers });
}


export default function gitposts() {
    const { query, posts, totalPages } = useLoaderData<typeof loader>();
    const navigation = useNavigation();
    const post = posts[0];

    console.log("My post ", post);

    const isSearching = Boolean(
        navigation.location && 
            new URLSearchParams(navigation.location.search).has("query")
    );

    return (
        <div className="w-full max-w-xl px-4 flex flex-col">
            <Tabs defaultValue="view-posts" className="my-2">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="view-posts">View Posts</TabsTrigger>
                    <TabsTrigger value="write-post">Write Posts</TabsTrigger>
                </TabsList> 
                <TabsContent value="view-posts">
                    <PostSearch isSearching={isSearching} searchQuery={query}/>
                    <Separator/>
                    <InfiniteVirtualList incomingPosts={posts} totalPages={totalPages}/>
                </TabsContent>
                <TabsContent value="write-post">
                    <WritePost sessionUserId="1234" postId="12334"/>
                </TabsContent>
            </Tabs>
        </div>
    );
}
    