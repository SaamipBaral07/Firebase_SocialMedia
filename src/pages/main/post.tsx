import { addDoc, getDocs,collection,query, where, doc, deleteDoc } from "firebase/firestore";
import { Post as IPost } from "./main"
import { auth, db } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";

interface Props{
    post:IPost
}
interface Like{
    userId:string;
    likeId:string;
}

export const Post=(props: Props)=>{
    const {post} = props;
    const [user]=useAuthState(auth);
    const[likes,setLikes]=useState<Like[] | null>(null)
    
    const likesRef=collection(db,"likes");
    const likesDoc=query(likesRef,where("postId","==",post.id))

    const getLikes = async () => {
        if (!user) return; // Prevent guests from running this function
        const data = await getDocs(likesDoc);
        setLikes(data.docs.map((doc) => ({ userId: doc.data().userId, likeId: doc.id })));
    };

    const hasUserLiked = likes?.find((like) => like.userId === user?.uid);

    useEffect(() => {
        if (user) {
            getLikes();
        }
    }, [user]);

    const addLike = async () => {
        try {
            const newDoc=await addDoc(likesRef, { userId: user?.uid, postId: post.id });
            if(user){
                setLikes((prev)=>prev?[...prev,{userId:user?.uid,likeId:newDoc.id}]:[{userId:user?.uid,likeId:newDoc.id}])
            } 
        }catch (err) {
            console.error("Error liking post:", err);
        }
    };

    const removeLike = async () => {
        try {
            const likeToDeleteQuery = query(
                likesRef,
                where("postId", "==", post.id),
                where("userId", "==", user?.uid)
            );
            const likeToDeleteData = await getDocs(likeToDeleteQuery);
            const likeId = likeToDeleteData.docs[0].id;
            const likeToDelete = doc(db, "likes", likeId);
            await deleteDoc(likeToDelete);

            setLikes((prev) => prev?.filter((like) => like.likeId !== likeId) || []);
        } catch (err) {
            console.error("Error unliking post:", err);
        }
    };

    return(
        <div className="post-container">
            <div className="title">
                <h1>{post.title}</h1>
            </div>
            <div className="body">
                <p>{post.description}</p>
            </div>
            <div className="footer">
                <p className="username">@{post.username}</p>
                <div className="like-section">
                    <button 
                        className={`like-button ${hasUserLiked ? 'liked' : ''}`}
                        onClick={hasUserLiked ? removeLike : addLike}
                    >
                        {hasUserLiked ? '👎' : '👍'}
                    </button>
                    {likes && <span className="like-count">{likes.length} likes</span>}
                </div>
            </div>
        </div>
    )
}