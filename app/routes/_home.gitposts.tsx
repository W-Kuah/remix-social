import { Separator } from "@radix-ui/react-separator";
import { json, redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigation } from "@remix-run/react";
import { Post } from "~/components/post";
import { PostSearch } from "~/components/post-search";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { ViewComments } from "~/components/view-comments";
import { ViewLikes } from "~/components/view-likes";
import { WritePost } from "~/components/write-post";
import { getSupabaseWithSessionAndHeaders } from "~/lib/supabase.server";

export const loader = async ({ request } : LoaderFunctionArgs) => {
    const { headers, serverSession } = 
    await getSupabaseWithSessionAndHeaders({
        request,
    });

    if (!serverSession) {
        return redirect("/login", { headers });
    }
    
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const query = searchParams.get("query");

    return json({ query }, { headers });
}


export default function gitposts() {
    const { query } = useLoaderData<typeof loader>();
    const navigation = useNavigation();

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
                    <Separator/>
                    <PostSearch isSearching={isSearching} searchQuery={query}/>
                    <Post
                        avatarUrl={"https://media.licdn.com/dms/image/C5603AQHHZKGHek6vVQ/profile-displayphoto-shrink_200_200/0/1605196900942?e=1714003200&v=beta&t=xW7p245uvRWiW5NMP8z6guERhG0nGG-Zigl46TjTKv8"}
                        name="Warren Kuah"
                        username="w-kuah"
                        title={"## markdown title"}
                        userId="12345"
                        id="56789"
                        dateTimeString="30, Nov 2024"
                    >
                        <ViewLikes 
                            likes={69}
                            likedByUser={true}
                            pathname={`/profile/w-kuah`}
                        />
                        <ViewComments comments={420} pathname={`/profile/w-kuah`}/>
                    </Post>
                </TabsContent>
                <TabsContent value="write-post">
                    <WritePost sessionUserId="1234" postId="12334"/>
                </TabsContent>
            </Tabs>
        </div>
    );
}
    