// Helper to find the most recent date in nested comments
export const getMostRecentCommentDate = (post, comments) => {
    if (!post.commentIDs || post.commentIDs.length === 0) {
        return new Date(0); // Return a very old date for posts without comments
    }

    const findLatestCommentDate = (commentIDs) => {
        let latestDate = new Date(post.postedDate); // Start with the post's date
        commentIDs.forEach((commentObject) => {
            const comment = comments.find(c => c._id === commentObject._id); // Match by _id
            if (comment) {
                const commentDate = new Date(comment.commentedDate);
                if (commentDate > latestDate) {
                    latestDate = commentDate;
                }
                if (comment.commentIDs && comment.commentIDs.length > 0) {
                    // Recursively check nested replies
                    const nestedLatestDate = findLatestCommentDate(comment.commentIDs);
                    if (nestedLatestDate > latestDate) {
                        latestDate = nestedLatestDate;
                    }
                }
            }
        });
        return latestDate;
    };
    return findLatestCommentDate(post.commentIDs);
};


// Sort posts based on the selected order
export const sortPosts = (posts, order, comments) => {
    let sortedPosts = [...posts];
    if (order === 'newest') {
        return sortedPosts.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
    } else if (order === 'oldest') {
        return sortedPosts.sort((a, b) => new Date(a.postedDate) - new Date(b.postedDate));
    } else if (order === 'active') {
        return sortedPosts.sort((a, b) => {
            const mostRecentCommentA = getMostRecentCommentDate(a, comments);
            const mostRecentCommentB = getMostRecentCommentDate(b, comments);
            return (
                mostRecentCommentB - mostRecentCommentA || // Sort by most recent activity
                new Date(b.postedDate) - new Date(a.postedDate) // Tie-breaker by post date
            );
        });
    }
    return sortedPosts;
};


// Count the total number of comments recursively, including nested replies
export const countTotalComments = (commentIDs, comments) => {
    let totalComments = 0;

    if (!Array.isArray(commentIDs) || !Array.isArray(comments)) return 0;

    commentIDs.forEach(commentObject => {
        const comment = comments.find(c => c._id === commentObject._id); // Compare using _id field
        if (comment) {
            totalComments += 1; // Count the current comment
            if (comment.commentIDs && comment.commentIDs.length > 0) {
                // Recursively count nested comments
                totalComments += countTotalComments(comment.commentIDs, comments);
            }
        }
    });

    return totalComments;
};
