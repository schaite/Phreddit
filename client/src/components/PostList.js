import React from "react";
import Post from "./Post";
import { sortPosts } from "./helper.js";

function PostList({ posts, order, showCommunityName, comments, pageType}) {
    const sortedPosts = sortPosts(posts, order, comments);
    return (
        <div id="post-list">
            {sortedPosts.map((post) => (
                <Post
                    key={post._id}
                    post={post}
                    showCommunityName={showCommunityName}
                    comments={comments}
                    pageType={pageType}
                />
            ))}
        </div>
    );
}

export default PostList;

