import React from "react";
import Post from "./Post";
import PropTypes from "prop-types";
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

PostList.propTypes = {
    posts: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string.isRequired, // Assuming _id is a string
        })
    ).isRequired,
    order: PropTypes.string.isRequired,
    showCommunityName: PropTypes.bool.isRequired,
    comments: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string.isRequired, // Assuming comments also have _id
        })
    ).isRequired,
    pageType: PropTypes.string.isRequired,
};

export default PostList;

