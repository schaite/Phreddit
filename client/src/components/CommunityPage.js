import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import PostList from "./PostList.js";
import { formatTimestamp } from "./Timestamp.js";
import "../stylesheets/CommunityPage.css";

function CommunityPage() {
    const communityId = useParams();
    const [community, setCommunity] = useState(null);
    const [communityPosts, setCommunityPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const [order, setOrder] = useState("newest");
    const [postCount, setPostCount] = useState(0);
    const [error, setError] = useState(null);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch data from APIs
                const [communityRes, postsRes, communitiesRes, linkFlairsRes, commentsRes] = await Promise.all([
                    axios.get(`/api/communities/${communityId.communityId}`),
                    axios.get("/api/posts"),
                    axios.get("/api/communities"),
                    axios.get("/api/linkflairs"),
                    axios.get("/api/comments"),
                ]);
                
                const communityData = communityRes.data;
                const postsData = postsRes.data;
                const communities = communitiesRes.data;
                const linkFlairs = linkFlairsRes.data;
                const commentsData = commentsRes.data;

                const filteredPosts = communityData && Array.isArray(communityData.postIDs)
                    ? postsData.filter((post) => 
                        communityData.postIDs.some(postIdObj => postIdObj._id === post._id)
                        )
                    : [];
                // Enrich posts with community names and link flairs
                const enrichedPosts = filteredPosts.map((post) => {
                    const community = communities.find((c) => 
                        c.postIDs.some(id => id === post._id || id._id === post._id)
                    );
                    const linkFlairId = post.linkFlairID?._id || post.linkFlairID; // Safely extract the ID
                    const linkFlair = linkFlairs.find((lf) => String(lf._id) === String(linkFlairId)); // Compare IDs as strings
    
                    return {
                        ...post,
                        communityName: community ? community.name : null,
                        linkFlair: linkFlair ? linkFlair.content : null,
                        
                    };
                });

                setCommunity(communityData);
                setCommunityPosts(enrichedPosts);
                setComments(commentsData);
                setPostCount(enrichedPosts.length);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Failed to load data. Please try again later.");
            }
        };
    
        fetchData();
    }, [communityId]);

    useEffect(() => {
        if (error) {
            setTimeout(() => {
                navigate("/");
            }, 2000);
        }
    }, [error, navigate]);

    return (
        <div id="community-page" className="community-page">
            {error ? (
                <p className="error-message">{error}</p>
            ) : (
                <>
                    <div>
                        <header className="community-header-container">
                            <h1>{community ? community.name : "Loading..."}</h1>
                            <div className="sorting-buttons">
                                <button className="sort-button" onClick={() => setOrder("newest")}>Newest</button>
                                <button className="sort-button" onClick={() => setOrder("oldest")}>Oldest</button>
                                <button className="sort-button" onClick={() => setOrder("active")}>Active</button>
                            </div>
                        </header>
                        <p>{community ? community.description : "Loading description..."}</p>
                        <p>Created {community ? formatTimestamp(community.startDate) : "Loading date..."}</p>
                        <p>
                            <span className="community-stats">{postCount} posts</span><span className="community-stats">{community && community.members ? community.members.length : 0} members</span>
                        </p>
                        <hr />
                    </div>
                    {/* Div for Posts from User's Communities */}
                    {communityPosts.length > 0 && (
                        <div className="community-posts">
                            <PostList
                                posts={communityPosts}
                                order={order}
                                showCommunityName={false}
                                comments={comments}
                                pageType={"community"}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default CommunityPage;