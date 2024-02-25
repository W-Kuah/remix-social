import { CombinedPostWithAuthorAndLikes } from "~/lib/types";
import { Post } from "./post";
import { formatToTwitterDate } from "~/lib/utils";
import { ViewLikes } from "./view-likes";
import { ViewComments } from "./view-comments";
import { memo } from "react";
import { useLocation } from "@remix-run/react";

export const MemoizedPostListItem = memo(
    ({
        post, 
        index
    }: {
        post: CombinedPostWithAuthorAndLikes, 
        index: number
    }) => {
        const location = useLocation();
        let pathnameWithSearchQuery = "";

        if (location.search) {
            pathnameWithSearchQuery = `${location.pathname}/${post.id}${location.search}`;
        } else {
            pathnameWithSearchQuery = `${location.pathname}/${post.id}`;
        }
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
                    pathname={pathnameWithSearchQuery}
                />
                <ViewComments 
                    comments={post.comments.length}
                    pathname={pathnameWithSearchQuery}/>
            </Post>
        );
    }
);
MemoizedPostListItem.displayName = "MemoizedPostListItem";