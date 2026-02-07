import "./Home.css"

import { useEffect, useState } from "react"
import { comment, createPost, getPosts, like } from "../api/axios";
import viteLogo from '/vite.svg'

interface Comment{
  user : {
    _id : string,
    username : string,
  },
  text : string,
  _id : string
}

interface Post{
    _id : string,
    user : {
      _id : string,
      username : string
    },
    text? : string,
    image? : string,
    likes : string[],
    comments : Comment[],
    createdAt : string
  }

const Home = () => {  
  const [expanderPostId,setExpandedPostId] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null);
  const [post,setPosts] = useState<Post[]>([]);
  const [loading,setLoading] = useState<Boolean>(true)
  const [text,setText] = useState("");
  const [image,setImage] = useState<string>()

  const handleImageChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(file){
      const reader = new FileReader();
      reader.onloadend=()=>{
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }
  const handleLike = async (id: string) => {
  if (!user) return alert("Please login to like posts!");
  try {
    const { data } = await like(id);
    // Update the specific post in the state so the heart count jumps immediately
    setPosts(post.map((p) => (p._id === id ? data : p)));
  } catch (err) {
    console.error("Like failed", err);
  }
};

const handleComment = async (postId: string, text: string) => {
  if (!text.trim()) return;
  try {
    const { data } = await comment(postId, text);
    // Update state to show the new comment immediately
    setPosts(post.map((p) => (p._id === postId ? data : p)));
  } catch (err) {
    console.error("Comment failed", err);
  }
};

  const handleSubmitPost=async()=>{
    if(!text && !image) return alert("Please add some text or image");
    try {
      await createPost({text,image});
      setText("");
      setImage("");
      const { data } = await getPosts();
      setPosts(data);
    } catch (error) {
      
    }
  }

  useEffect(() => {
  const loadPost = async () => {
    try {
      setLoading(true);
      const { data } = await getPosts();
      setPosts(data);

      const storedProfile = localStorage.getItem("profile");
      const storedId = localStorage.getItem("userId");

      if (storedProfile) {
        
        setUser({ 
          username: storedProfile, 
          _id: storedId 
        });
      }
    } catch (error) {
      console.log("fetch failed :", error);
    } finally {
      setLoading(false);
    }
  };
  loadPost();
  }, []);
  const toggleComments = (postId :string) => {
    setExpandedPostId(expanderPostId === postId ? null : postId)
  }

  return (
    <div className="feed-container" >
      <h1 className="feed-title" > T45K Universe</h1>

      {/* create Post */}
      {/* create Post Section */}
      <div 
        className={`create-post ${!user ? "disabled-overlay" : ""}`}
        onClick={() => !user && alert("Please login to share your thoughts on TASK Universe!")}
      >
        <div className="input-group">
          <textarea 
            className="search-input" 
            placeholder={user ? `What's on your mind today, ${user.username} ?` : "Please login to post..."}
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={!user} // This blocks typing
          />
        </div>

        {/* Image Preview - only show if user is logged in and has an image */}
        {user && image && (
          <div className="preview-container">
            <img src={image} alt="preview" className="image-preview" />
            <button className="remove-btn" onClick={() => setImage("")}>✕</button>
          </div>
        )}

        <div className="create-post-actions">
          <label className={`action-item ${!user ? "disabled-action" : ""}`}>
            <span>📷 Photo</span>
            <input 
              type="file" 
              accept="image/*" 
              hidden 
              onChange={handleImageChange} 
              disabled={!user}
            />
          </label>
          
          <button 
            className="post-submit-btn" 
            onClick={handleSubmitPost}
            disabled={!user || (!text && !image)}
          >
            Post to Planet
          </button>
        </div>
      </div>

      {/* loading */}
      {loading && 
        <div className="loading-state" >
          <div className="spinner" ></div>
          Fetching Posts {<br/>} add skeleton
        </div>
      }
      
      
      {/* allposts */}
      <div className="posts-list" >
        {post.map((p:Post)=>(
          <div key={p._id} className="post-card">
            <header className="post-header">
              <div className="avatar">{p.user.username[0].toUpperCase()}</div>
              <div className="header-text">
                <span className="username">@{p.user.username}</span>
                {" "}
                <span className="post-date">{new Date(p.createdAt).toLocaleDateString()}</span>
              </div>
            </header>

            <div className="post-main-body">
              <div className="post-content">
                <p className="post-text">{p.text}</p>
              </div>
              
              {p.image && (
                <div className="post-image-container">
                  <img src={p.image} alt="postImg" />
                </div>
              )}

              <footer className="post-footer">
                <div className="stats">
                  <span 
                    className={`like-btn ${p.likes.includes(user?._id) ? "liked" : ""}`} 
                    onClick={() => handleLike(p._id)}
                  >
                    <strong>{p.likes.length}</strong>
                  </span>
                  
                  <span onClick={() => toggleComments(p._id)}>
                    <strong>{p.comments.length}</strong>
                  </span>
                </div>

                {/* 2. Updated Comments Area */}
                {expanderPostId === p._id && (
                  <div className="comments-area">
                    <h4 className="comments-title">Comments</h4>
                    <div className="comments-list">
                      {p.comments.map((c: Comment) => (
                        <div key={c._id} className="comment-bubble">
                          <span className="comment-user">@{c.user.username}</span>
                          <span className="comment-text">{c.text}</span>
                        </div>
                      ))}
                    </div>

                    {/* NEW: Comment Input Field */}
                    <div className="comment-input-wrapper">
                      <input 
                        type="text" 
                        placeholder={user ? "Write a comment..." : "Login to comment"}
                        disabled={!user}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleComment(p._id, e.currentTarget.value);
                            e.currentTarget.value = ""; // Clear input after sending
                          }
                        }}
                      />
                    </div>
                  </div>
                )}
              </footer>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

export default Home