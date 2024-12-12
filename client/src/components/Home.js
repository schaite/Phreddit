import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import PostList from "./PostList.js";
import "../stylesheets/Home.css";

function Home({isLoggedIn, userId}) {
    const [results, setResults] = useState([]);
    const [userCommunityPosts, setUserCommunityPosts] = useState([]);
    const [otherPosts, setOtherPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const [order, setOrder] = useState("newest");
    const [postCount, setPostCount] = useState(0);
    const [query, setQuery] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();


    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch data from APIs
                const [postsRes, communitiesRes, linkFlairsRes, commentsRes, userCommunitiesRes] = await Promise.all([
                    axios.get("/api/posts"),
                    axios.get("/api/communities"),
                    axios.get("/api/linkflairs"),
                    axios.get("/api/comments"),
                    isLoggedIn 
                        ? axios.get(`/api/communities/user-communities/${userId}`) 
                        : Promise.resolve({data : []}),
                ]);
    
                const postsData = postsRes.data;
                const communities = communitiesRes.data;
                const linkFlairs = linkFlairsRes.data;
                const commentsData = commentsRes.data;
                const userCommunities = userCommunitiesRes.data;

                // Enrich posts with community names and link flairs
                const enrichedPosts = postsData.map((post) => {
                    const community = communities.find((c) => 
                        c.postIDs.some(id => id === post._id || id._id === post._id)
                    );
                    const linkFlairId = post.linkFlairID?._id || post.linkFlairID; // Safely extract the ID
                    const linkFlair = linkFlairs.find((lf) => String(lf._id) === String(linkFlairId)); // Compare IDs as strings
    
                    return {
                        ...post,
                        communityName: community ? community.name : null,
                        linkFlair: linkFlair ? linkFlair.content : null,
                        postedBy: post.postedBy ? post.postedBy : { displayName: "Unknown User" },
                        
                    };
                });
                const userCommunityPostIDs = userCommunities
                    .flatMap((community) => community.postIDs) // Collect all postIDs from user's communities
                    .map((id) => (id._id ? id._id : id)); // Normalize ID format

                const userPosts = enrichedPosts.filter((post) =>
                    userCommunityPostIDs.includes(post._id)
                );
                const remainingPosts = enrichedPosts.filter((post) =>
                    !userCommunityPostIDs.includes(post._id)
                );

                setUserCommunityPosts(userPosts);
                setOtherPosts(remainingPosts);
                setComments(commentsData);
                setPostCount(enrichedPosts.length);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Failed to load data. Please try again later.");
            }
        };
    
        fetchData();
    }, [isLoggedIn,userId]);

    useEffect(() => {
        if (error) {
            setTimeout(() => {
                navigate("/");
            }, 2000);
        }
    }, [error, navigate]);

    useEffect(() => {
        if (location.pathname === "/home") {
            setOrder("newest");
        }
    }, [location]);

    return (
        <div id="home" className="home">
            <header className="header-container">
                <h1>All Posts</h1>
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
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default Home;