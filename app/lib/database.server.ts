import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "database.types";

export async function getAllPostsWithDetails ({
    dbClient,
    page,
    limit = 10,
}: {
    dbClient: SupabaseClient<Database>,
    page: number;
    limit?: number;
}) {
    let postQuery = dbClient
        .from("posts")
        .select("*, author: profiles(*), likes(user_id), comments(*)", { 
            count: "exact",
        })
        .order("created_at", {ascending: false})
        .range((page - 1) * limit, page * limit -1);

    const {data, error, count } = await postQuery

    if (error) {
        console.log("Error occured at getAllPostWithDetails", error);
    }
    return {
        data, 
        error, 
        totalPosts: count, 
        limit, 
        totalPages: count ? Math.ceil(count/limit) : 1,
    };
}