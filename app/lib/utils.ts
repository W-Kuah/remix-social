import { Session } from "@supabase/supabase-js"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { PostWithCommentDetails, PostWithDetails } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getUserDataFromSession(session: Session) {
  // console.log(session);
  const userId = session.user.id;
  const userAvatarUrl = session.user.user_metadata.avatar_url;
  const provider = session.user.app_metadata.provider;
  let username;
  if (provider == "google") {
    username = session.user.user_metadata.email.split('@')[0];
  } else {
    username = session.user.user_metadata.username;
  }
  

  return { userId, userAvatarUrl, username, provider };
}

export function combinePostsWithLikes(
  data: PostWithDetails[] | null, 
  sessionUserId: String
) {
  const posts =
    data?.map ((post) => {
      return {
        ...post,
        isLikedByUser: !!post.likes.find(
          (like) => like.user_id === sessionUserId
        ),
        likes: post.likes,
        comments: post.comments,
        author: post.author!,
      };
    }) ?? [];
  return posts;
}

export function formatToTwitterDate(dateTimeString: string) {
  const date = new Date(dateTimeString);

  const day = date.getDate();
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = date.getMinutes();

  // Convert hours to AM/PM format
  const amPM = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Convert hours to 12-hour format

  const formattedDate = `${hours}:${
    minutes < 10 ? "0" : ""
  }${minutes} ${amPM} · ${month} ${day}, ${year}`;

  return formattedDate;
}


export function combinePostsWithLikesAndComments(
  data: PostWithCommentDetails[] | null, 
  sessionUserId: String
) {
  const posts =
    data?.map ((post) => {
      const commentsWithAvatarUrl = post.comments.map((comment) => ({
        ...comment,
        author: {
          username: comment.author!.username,
          avatarUrl: comment.author!.avatar_url,
        },
      }));

      return {
        ...post,
        isLikedByUser: !!post.likes.find(
          (like) => like.user_id === sessionUserId
        ),
        likes: post.likes,
        comments: commentsWithAvatarUrl,
        author: post.author!,
      };
    }) ?? [];
  return posts;
}