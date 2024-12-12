import React, { useEffect, useState, useCallback} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import PostList from "./PostList.js";
import "../stylesheets/Home.css";

function SearchPage({isLoggedIn, userId}) {
    const [userCommunityPosts, setUserCommunityPosts] = useState([]);
    const [otherPosts, setOtherPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const [order, setOrder] = useState("newest");
    const [postCount, setPostCount] = useState(0);
    const [query, setQuery] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    const searchPostAndComments = useCallback(async (queryParam) => {
        try {
            // Fetch all posts, comments, and communities for enrichment
            const [postsRes, commentsRes, communitiesRes, linkFlairsRes, userCommunitiesRes] = await Promise.all([
                axios.get("/api/posts"),
                axios.get("/api/comments"),
                axios.get("/api/communities"),
                axios.get("/api/linkflairs"),
                isLoggedIn 
                        ? axios.get(`/api/communities/user-communities/${userId}`) 
                        : Promise.resolve({data : []}),
            ]);
    
            const posts = postsRes.data;
            const commentsData = commentsRes.data;
            const communities = communitiesRes.data;
            const linkFlairs = linkFlairsRes.data;
            const userCommunities = userCommunitiesRes.data;
    
            // Search logic: match posts by title, content, or comments (including nested replies)
            const searchTerms = queryParam.toLowerCase().split(" ");
    

            // Helper function to find matching comments recursively, including nested replies
            const findMatchingComments = (commentIDs) => {
                const matches = [];
                commentIDs.forEach(commentID => {
                    const comment = commentsData.find(c => c._id === commentID._id);
                    if (comment) {
                        // Check if the comment matches the search terms
                        if (searchTerms.some(term => comment.content.toLowerCase().includes(term))) {
                            matches.push(comment);
                        }
                        // Recursively search nested replies
                        if (comment.commentIDs && comment.commentIDs.length > 0) {
                            matches.push(...findMatchingComments(comment.commentIDs));
                        }
                    }
                });
                return matches;
            };

            // Match posts by title or content
            const matchingPosts = posts.filter(post => {
                const postTitle = post.title.toLowerCase();
                const postContent = post.content.toLowerCase();
                return searchTerms.some(term => postTitle.includes(term) || postContent.includes(term));
            });

            // Match posts by comments (including nested replies)

            const postsWithMatchingComments = posts.filter(post =>
                findMatchingComments(post.commentIDs).length > 0
            );

            // Combine and remove duplicates
            const combinedResults = [...new Set([...matchingPosts, ...postsWithMatchingComments])];

            // Enrich posts with community and link flair data
            const enrichedResults = combinedResults.map(post => {
                const community = communities.find((c) => 
                    c.postIDs.some(id => id === post._id || id._id === post._id)
                );
                const linkFlairId = post.linkFlairID?._id || post.linkFlairID; // Safely extract the ID
                const linkFlair = linkFlairs.find((lf) => String(lf._id) === String(linkFlairId)); // Compare IDs as strings
                return {
                    ...post,
                    communityName: community ? community.name : null,
                    linkFlair: linkFlair ? linkFlair.content : null,
                    comments: commentsData.filter(c => c.postID === post._id)
                };
            });

            const userCommunityPostIDs = userCommunities
                    .flatMap((community) => community.postIDs) // Collect all postIDs from user's communities
                    .map((id) => (id._id ? id._id : id)); // Normalize ID format

                const userPosts = enrichedResults.filter((post) =>
                    userCommunityPostIDs.includes(post._id)
                );
                const remainingPosts = enrichedResults.filter((post) =>
                    !userCommunityPostIDs.includes(post._id)
                );

                setUserCommunityPosts(userPosts);
                setOtherPosts(remainingPosts);
                setComments(commentsData);
                setPostCount(enrichedResults.length);
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
        }, [isLoggedIn,userId]);

        useEffect(() => {
            const searchParams = new URLSearchParams(location.search);
            const queryParam = searchParams.get("query");
            setQuery(queryParam);
    
            if (queryParam) {
                searchPostAndComments(queryParam);
            }
        }, [searchPostAndComments]);

    useEffect(() => {
        if (error) {
            setTimeout(() => {
                navigate("/");
            }, 2000);
        }
    }, [error, navigate]);

    return (
        <div id="home" className="home">
            <header className="header-container">
                <h1>
                    {postCount > 0
                        ? `Results for: "${query}"`
                        : `No results found for: "${query}"`}
                </h1>
                <div className="sorting-buttons">
                    <button className="sort-button" onClick={() => setOrder("newest")}>
                        Newest
                    </button>
                    <button className="sort-button" onClick={() => setOrder("oldest")}>
                        Oldest
                    </button>
                    <button className="sort-button" onClick={() => setOrder("active")}>
                        Active
                    </button>
                </div>
            </header>
            {error ? (
                <p className="error-message">{error}</p>
            ) : (
                <>
                    <p id="post-count" className="post-count">{postCount} posts</p>
                    <hr className="separator" />

                    {/* Div for Posts from User's Communities */}
                    {isLoggedIn && userCommunityPosts.length > 0 && (
                        <div className="user-community-posts">
                            <h2>My Community Posts</h2>
                            <PostList
                                posts={userCommunityPosts}
                                order={order}
                                showCommunityName={true}
                                comments={comments}
                                pageType={"search"}
                            />
                        </div>
                    )}

                    {/* Div for Other Posts */}
                    {otherPosts.length > 0 && (
                        <div className="other-posts" >
                            <h2>Posts You Might Like</h2>
                            <PostList
                                posts={otherPosts}
                                order={order}
                                showCommunityName={true}
                                comments={comments}
                                pageType={"search"}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default SearchPage;