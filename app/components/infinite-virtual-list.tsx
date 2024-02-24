import { Virtuoso } from "react-virtuoso";
import { CombinedPostsWithAuthorAndLikes } from "~/lib/types";
import { MemoizedPostListItem } from "./memoized-post-list-item";
import { useInfinitePosts } from "./use-infinite-posts";
import { PostSkeleton } from "./post";

export function InfiniteVirtualList({
    totalPages,
    incomingPosts
}: {
    totalPages: number
    incomingPosts: CombinedPostsWithAuthorAndLikes;
}) {
    const { posts, loadMore, hasMorePages } = useInfinitePosts({
        incomingPosts,
        totalPages,
    });

    return (
        <Virtuoso
            data={posts}
            useWindowScroll
            initialTopMostItemIndex={0}
            endReached={loadMore}
            initialItemCount={5}
            overscan={500}
            itemContent={(index, post) => {
                if(!post) {
                    return <div></div>
                }

                return <MemoizedPostListItem post={post} index={index} />
            }}
            components={{
                Footer:() => {
                    if (!hasMorePages) {
                        return null;
                    }

                    return <PostSkeleton />;
                },
            }}
        ></Virtuoso>
    );
};