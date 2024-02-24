import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "database.types";

export async function getAllPostsWithDetails ({
    dbClient
}: {dbClient: SupabaseClient<Database>}) {
    let postQuery = dbClient
        .from("posts")
        .select("*, author: profiles(*), likes(user_id), comments(*)")
        .order("created_at", {ascending: false});

    const {data, error} = await postQuery

    if (error) {
        console.log("Error occured at getAllPostWithDetails", error);
    }
    return {data, error};
}