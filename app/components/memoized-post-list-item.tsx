import { CombinedPostWithAuthorAndLikes } from "~/lib/types";
import { Post } from "./post";
import { formatToTwitterDate } from "~/lib/utils";
import { ViewLikes } from "./view-likes";
import { ViewComments } from "./view-comments";
import { memo } from "react";

export const MemoizedPostListItem = memo(
    ({
        post, 
        index
    }: {
        post: CombinedPostWithAuthorAndLikes, 
        index: number
    }) => {
        return (
            <Post
            avatarUrl={post.author.avatar_url}
            name={post.author.name}
            username={post.author.username}
            title={post.title}
            userId={post.author.id}
            id={post.id}
            dateTimeString={formatToTwitterDate(post.created_at)}
        >
            <ViewLikes 
                likes={post.likes.length}
                likedByUser={post.isLikedByUser}
                pathname={`/profile/w-kuah`}
            />
            <ViewComments 
                comments={post.comments.length}
                pathname={`/profile/w-kuah`}/>
            </Post>
        );
    }
);
MemoizedPostListItem.displayName = "MemoizedPostListItem";