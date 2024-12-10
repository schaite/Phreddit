import React from "react";
import { useNavigate } from "react-router-dom";
import "../stylesheets/Home.css";
import { formatTimestamp } from "./Timestamp.js";
import { countTotalComments } from "./helper.js";

function Post({ post, showCommunityName, comments}) {
    const totalComments = countTotalComments(post.commentIDs, comments);
    const navigate = useNavigate();
    const handlePostClick = () => {
        navigate(`/post/${post._id}`); // Navigate to post details
    };
    return (
        <div className="post" onClick={handlePostClick}> {/* Use click handler */}
            <p>
                {showCommunityName && <strong>{post.communityName}</strong>}
                {showCommunityName && " | "}
                {post.postedBy.displayName} | {formatTimestamp(post.postedDate)}
            </p>
            <h4>{post.title}</h4>
            {post.linkFlair && <span className="link-flair">{post.linkFlair}</span>}
            <p>{post.content.substring(0, 80)}...</p>
            <p>
                <span className="post-stat">{post.views} Views</span> 
                <span className="post-stat">{totalComments} Comments</span>  
                <span className="post-stat">{post.vote} Upvotes</span>
            </p>
        </div>
    );
}

export default Post;

