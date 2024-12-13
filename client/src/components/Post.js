import React from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import "../stylesheets/Home.css";
import "../stylesheets/Post.css";
import { formatTimestamp } from "./Timestamp.js";
import { countTotalComments } from "./helper.js";

function Post({ post, showCommunityName, comments, pageType}) {
    const totalComments = countTotalComments(post.commentIDs, comments);
    const navigate = useNavigate();
    const handlePostClick = () => {
        navigate(`/post/${post._id}`); // Navigate to post details
    };
    const postStatClass = `post-stat ${
        pageType === "home"
            ? "post-stat-home"
            : pageType === "community"
            ? "post-stat-community"
            : pageType === "search"
            ? "post-stat-search"
            : ""
    }`;
    return (
        <div className="post" onClick={handlePostClick}> {/* Use click handler */}
            <p>
                {showCommunityName && <strong>{post.communityName}</strong>}
                {showCommunityName && " | "}
                {post.postedBy.displayName} | {formatTimestamp(post.postedDate)}
            </p>
            <h4>{post.title}</h4>
            {post.linkFlair && <span className="link-flair">{post.linkFlair}</span>}
            <p>{post.content.substring(0, 80)}{post.content.length>80?"...":''}</p>
            <p>
                <span className={postStatClass}>{post.views} Views</span> 
                <span className={postStatClass}>{totalComments} Comments</span>  
                <span className={postStatClass}>{post.vote} Upvotes</span>
            </p>
        </div>
    );
}

Post.propTypes = {
    post: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        communityName: PropTypes.string,
        postedBy: PropTypes.shape({
            displayName: PropTypes.string.isRequired,
        }).isRequired,
        postedDate: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        linkFlair: PropTypes.string,
        content: PropTypes.string.isRequired,
        views: PropTypes.number.isRequired,
        vote: PropTypes.number.isRequired,
        commentIDs: PropTypes.arrayOf(
            PropTypes.shape({
                _id: PropTypes.string.isRequired,
            })
        ),
    }).isRequired,
    showCommunityName: PropTypes.bool.isRequired,
    comments: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string.isRequired,
        })
    ).isRequired,
    pageType: PropTypes.oneOf(['home', 'community', 'search']).isRequired,
};


export default Post;

