import { getDocs, collection } from "firebase/firestore";
import { db, auth } from "../../config/firebase";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Post } from "./post";
import "./styles.css"; // Import the CSS file

export interface Post{
    id:string;
    title:string;
    userId:string;
    description:string;
    username:string;
}

export const Main = () => {
    const [postList, setPostsList] = useState<Post[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [user] = useAuthState(auth);
    const postRef = collection(db, "post");

    // Example likes state and getLikes function
    const [likes, setLikes] = useState<{ userId: string; likeId: string }[]>([]);
    const likesDoc = collection(db, "likes");

    const getPosts = async () => {
        try {
            const data = await getDocs(postRef);
            setPostsList(data.docs.map((doc) =>
                ({ ...doc.data(), id: doc.id })) as Post[]);
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
        }
    };

    const getLikes = async () => {
        if (!user) return; // Prevent guests from running this function
        try {
            const data = await getDocs(likesDoc);
            setLikes(data.docs.map((doc) => ({ userId: doc.data().userId, likeId: doc.id })));
        } catch (error) {
            console.error("Error fetching likes:", error);
        }
    };

    useEffect(() => {
        getPosts();
    }, []);

    useEffect(() => {
        if (user) {
            getLikes();
        }
    }, [user]);

    if (loading) {
        return (
            <div className="main-container">
                <div className="loading">Loading posts...</div>
            </div>
        );
    }

    return (
        <div className="main-container">
            <h1>Social Feed</h1>
            {postList && postList.length > 0 ? (
                postList.map((post) => (
                    <Post key={post.id} post={post} />
                ))
            ) : (
                <div className="empty-state">
                    <h3>No posts yet</h3>
                    <p>Be the first to share something!</p>
                </div>
            )}
        </div>
    );
}
