import "./Home.css"

import { useEffect, useState } from "react"
import { getPosts } from "../api/axios";
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
  const [post,setPosts] = useState<Post[]>([]);
  const [loading,setLoading] = useState<Boolean>(true)

  useEffect(()=>{
    const loadPost = async() => {
      try {
        setLoading(true)
        const {data} = await getPosts();
        setPosts(data)
      } catch (error) {
        console.log("fetch failed :",error)
      } finally{
        setLoading(false)
      }
    }
    loadPost();
  },[])

  const toggleComments = (postId :string) => {
    setExpandedPostId(expanderPostId === postId ? null : postId)
  }

  return (
    <div className="feed-container" >
      <h1 className="feed-title" > Aryan Planet</h1>

      {/* create Post */}
      <div className="create-post" >
        <input className="search-input" placeholder="whats on your mind today.." />
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
                  <span><strong>{p.likes.length}</strong></span>
                  <span onClick={() => toggleComments(p._id)}>
                    <strong>{p.comments.length}</strong>
                  </span>
                </div>
              </footer>
            </div>

            {/* Comments section appears below the post content, spanning full width of card */}
            {expanderPostId === p._id && (
              <div className="comments-area">
                <h4 className="comments-title">Comments</h4>
                <div className="comments-list">
                  {p.comments.length > 0 ? (
                    p.comments.map((c: Comment) => (
                      <div key={c._id} className="comment-bubble">
                        <span className="comment-user">@{c.user.username}</span>
                        <span className="comment-text">{c.text}</span>
                      </div>
                    ))
                  ) : (
                    <p className="no-comments">No Comments yet. Be the first!</p>
                  )}
                </div>
              </div>
             )}
          </div>
        ))}
      </div>

    </div>
  )
}

export default Home