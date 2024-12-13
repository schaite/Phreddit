import axios from 'axios';
import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';
import { formatTimestamp } from "./Timestamp";
import '../stylesheets/PostPage.css';
import { countTotalComments } from './helper';
import CommentsList from './CommentsList';

function PostPage({isLoggedIn}) {
    const navigate = useNavigate();
    const {postID} = useParams();
    const [post, setPost] = useState(null);
    const [communityName, setCommunityName] = useState('');
    const [linkFlair, setLinkFlair] = useState('');
    const [comments, setComments] = useState([]);
    const [totalComments, setTotalComments] = useState(0);
    const error = useState(null)[0];

    // Fetch post data and increment views
    useEffect(() => {
        const fetchPostData = async () => {
            if (!postID) return;

            try {
                const postRes = await axios.get(`/api/posts/${postID}`);
                const postData = postRes.data;

                // Increment post views
                await axios.put(`/api/posts/${postID}`, { views: postData.views + 1 });
                setPost(postData);

                // Fetch comments data
                const commentsRes = await axios.get(`/api/comments`);
                setComments(commentsRes.data);
                
                // Count total comments
                const totalCommentCount = countTotalComments(postData.commentIDs, commentsRes.data);
                setTotalComments(totalCommentCount);
            } catch (error) {
                console.error("Error fetching post data:", error);
            }
        };

        fetchPostData();
    }, [postID]);

    // Fetch related data (community name and link flair)
    useEffect(() => {
        const fetchRelatedData = async () => {
            if (!post) return;

            try {
                const [communitiesRes, linkFlairsRes] = await Promise.all([
                    axios.get('/api/communities'),
                    axios.get('/api/linkflairs')
                ]);
                // Find the community containing the postID
                const community = communitiesRes.data.find((c) =>
                    c.postIDs.some((post) => post._id === postID)
                  );                 
                setCommunityName(community ? community.name : '');

                // Find and set the link flair content
                const flair = linkFlairsRes.data.find(lf => lf._id === post.linkFlairID);
                setLinkFlair(flair ? flair.content : '');
            } catch (error) {
                console.error("Error fetching related data:", error);
            }
        };

        fetchRelatedData();
    }, [post, postID]);   

    const handleVote = async (type) => {
   
        try {
            const response = await axios.put(`/api/posts/${postID}/vote`, {
                type,
                userId: JSON.parse(localStorage.getItem("user")).id,
            });
    
            // Update the local post state with the new vote count
            setPost((prevPost) => ({
                ...prevPost,
                vote: response.data.vote,
            }));
        } catch (error) {
            console.error("Error while voting:", error);
            alert(error.response?.data?.message || "An error occurred while voting.");
        }
    };
    

    if (error) {
        return (
            <div className="error-message">
                <p>{error}</p>
                <button className="error-button" onClick={() => navigate("/")}>
                    Go Back to Welcome Page
                </button>
            </div>
        );
    }

    if (!post) return <div>Loading...</div>;

    return (
        <div className="post-page">
            <div className="post-header">
                <p><strong>{communityName}</strong> | {formatTimestamp(post.postedDate)}</p>
                <p>Posted By: {post.postedBy.displayName}</p>
                <h1>{post.title}</h1>
                {linkFlair && <span className="link-flair">{linkFlair}</span>}
                <p className="post-content">{post.content}</p>
                <p className="post-stats">
                    <span className="post-stat-item">{post.views} Views</span> 
                    <span className="post-stat-item">{totalComments} Comments</span>  
                    <span className="post-stat-item">{post.vote} Upvotes</span>
                </p>
                {isLoggedIn ? (
                    <div className="post-buttons">
                        <button
                            className="upvote-button"
                            onClick={() => handleVote("upvote")}
                        >
                            Upvote
                        </button>
                        <button
                            className="downvote-button"
                            onClick={() => handleVote("downvote")}
                        >
                            Downvote
                        </button>
                        <button className = "add-comment-button" onClick={() => navigate(`/post/${postID}/new-comment`)}>
                            Add a Comment
                        </button>
                    </div>
                ) : (
                    ''
                )}
                <hr className="separator"/>
                <div id="comment-section">
                    {post.commentIDs.length > 0 ? (
                        <CommentsList 
                            commentIDs={post.commentIDs} 
                            comments={comments} 
                            postID={postID} 
                            isLoggedIn={isLoggedIn}
                        />
                    ) : (
                        <p>No Comments yet</p>
                    )}
                </div>
            </div>
        </div>
    );
}

PostPage.propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
};

export default PostPage;