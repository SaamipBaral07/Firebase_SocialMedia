import {useForm} from "react-hook-form";
import * as yup from "yup";
import {yupResolver} from '@hookform/resolvers/yup'
import {addDoc,collection} from "firebase/firestore"
import {auth, db} from "../../config/firebase"
import { useAuthState } from "react-firebase-hooks/auth";
import "./CreateForm.css";
import { useNavigate } from "react-router-dom";

export interface CreateFormData{
    title:string;
    description:string;
}

export const CreateForm=()=>{
     const [user] = useAuthState(auth);

     const navigate=useNavigate();
     
    const schema=yup.object().shape({
        title:yup.string().required("YOU MUST ADD A TITLE"),
        description:yup.string().required("You must write description.."),
    });
    
    const {register,handleSubmit,
        formState:{errors},
    }=useForm<CreateFormData>({
        resolver:yupResolver(schema),
    });

    const postRef=collection(db,"post");

    const onCreatePost= async (data:CreateFormData)=>{
        console.log(data)
        await addDoc(postRef,{
            ...data,
            username:user?.displayName,
            userId:user?.uid,
        });
        navigate("/");
    }
    
    return(
        <div className="form-container">
            <div className="form-header">
                <h2 className="form-title">Create New Post</h2>
                <p className="form-subtitle">Share your thoughts with the community</p>
            </div>
            
            <form onSubmit={handleSubmit(onCreatePost)} className="create-form">
                <div className="form-group">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input 
                        id="title"
                        placeholder="Enter your post title" 
                        {...register("title")}
                        className={`form-input ${errors.title ? 'error' : ''}`}
                    />
                    {errors.title && (
                        <p className="error-message">{errors.title?.message}</p>
                    )}
                </div>
                
                <div className="form-group">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea 
                        id="description"
                        placeholder="Write your post description..." 
                        {...register("description")}
                        className={`form-textarea ${errors.description ? 'error' : ''}`}
                        rows={6}
                    />
                    {errors.description && (
                        <p className="error-message">{errors.description?.message}</p>
                    )}
                </div>
                
                <button type="submit" className="submit-button">
                    <span className="button-text">Create Post</span>
                </button>
            </form>
        </div>
    )
}