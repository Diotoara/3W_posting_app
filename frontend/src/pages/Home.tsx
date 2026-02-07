import "./Home.css"
import { useEffect, useState, useCallback } from "react"
import { comment, createPost, getPosts, like } from "../api/axios";

interface Comment {
  user: { _id: string, username: string },
  text: string,
  _id: string
}

interface Post {
  _id: string,
  user: { _id: string, username: string },
  text?: string,
  image?: string,
  likes: string[],
  comments: Comment[],
  createdAt: string
}

const Home = () => {
  const [expanderPostId, setExpandedPostId] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true)
  const [text, setText] = useState("");
  const [image, setImage] = useState<string>()
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Memoized load function to prevent unnecessary re-renders
  const loadPosts = useCallback(async (pageNum: number) => {
    try {
      setLoading(true);
      const { data } = await getPosts(pageNum, 5);

      if (pageNum === 1) {
        setPosts(data.posts);
      } else {
        setPosts((prev) => [...prev, ...data.posts]);
      }

      setHasMore(data.currentPage < data.numberOfPages);
    } catch (error) {
      console.error("Fetch failed:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial load and user sync
    loadPosts(1);
    
    const storedProfile = localStorage.getItem("profile");
    const storedId = localStorage.getItem("userId");
    if (storedProfile) {
      setUser({ username: storedProfile, _id: storedId });
    }
  }, [loadPosts]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image too large! Please choose a file under 5MB.");
        e.target.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  const handleLike = async (id: string) => {
    if (!user) return alert("Please login to like!");
    try {
      const { data } = await like(id);
      setPosts(posts.map((p) => (p._id === id ? data : p)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleComment = async (postId: string, commentText: string) => {
    if (!commentText.trim()) return;
    try {
      const { data } = await comment(postId, commentText);
      setPosts(posts.map((p) => (p._id === postId ? data : p)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitPost = async () => {
    if (!text && !image) return alert("Add text or an image!");
    try {
      setError(null);
      await createPost({ text, image });
      setText("");
      setImage("");
      setPage(1); // Reset page to 1
      loadPosts(1); // Refresh feed
    } catch (err: any) {
      setError(err.response?.status === 413 ? "File too large." : "Post failed.");
    }
  }

  const toggleComments = (postId: string) => {
    setExpandedPostId(expanderPostId === postId ? null : postId)
  }

  return (
    <div className="feed-container">
      <h1 className="feed-title">T45K Universe</h1>

      <div className={`create-post ${!user ? "disabled-overlay" : ""}`} onClick={() => !user && alert("Please login!")}>
        <textarea
          className="search-input"
          placeholder={user ? `What's on your mind, ${user.username}?` : "Login to post..."}
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={!user}
        />

        {user && image && (
          <div className="preview-container">
            <img src={image} alt="preview" className="image-preview" />
            <button className="remove-btn" onClick={() => setImage("")}>✕</button>
          </div>
        )}

        <div className="create-post-actions">
          <label className={`action-item ${!user ? "disabled-action" : ""}`}>
            <span>📷 Photo</span>
            <input type="file" accept="image/*" hidden onChange={handleImageChange} disabled={!user} />
          </label>
          {error && <p className="error-text" style={{ color: 'red', fontSize: '12px' }}>{error}</p>}
          <button className="post-submit-btn" onClick={handleSubmitPost} disabled={!user || (!text && !image)}>
            Post to Planet
          </button>
        </div>
      </div>

      <div className="posts-list">
        {posts.map((p) => (
          <div key={p._id} className="post-card">
            <header className="post-header">
              <div className="avatar">{p.user.username[0].toUpperCase()}</div>
              <div className="header-text">
                <span className="username">@{p.user.username}</span>
                <span className="post-date">{new Date(p.createdAt).toLocaleDateString()}</span>
              </div>
            </header>

            <div className="post-main-body">
              {p.text && <p className="post-text">{p.text}</p>}
              {p.image && <div className="post-image-container"><img src={p.image} alt="post" /></div>}

              <footer className="post-footer">
                <div className="stats">
                  {/* Like Section */}
                  <span 
                    className={`like-btn ${p.likes.includes(user?._id) ? "liked" : ""}`} 
                    onClick={() => handleLike(p._id)}
                  >
                    <strong>{p.likes.length}</strong>
                  </span>
                  
                  {/* Comment Section - Added 💬 icon */}
                  <span className="comment-btn" onClick={() => toggleComments(p._id)}>
                    <span>💬</span>
                    <strong>{p.comments.length}</strong>
                  </span>
                </div>

                {expanderPostId === p._id && (
                  <div className="comments-area">
                    <div className="comments-list">
                      {p.comments.map((c) => (
                        <div key={c._id} className="comment-bubble">
                          <span className="comment-user">@{c.user.username}</span>
                          <span className="comment-text">{c.text}</span>
                        </div>
                      ))}
                    </div>
                    <input
                      type="text"
                      className="comment-input"
                      placeholder="Add a comment..."
                      disabled={!user}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleComment(p._id, e.currentTarget.value);
                          e.currentTarget.value = "";
                        }
                      }}
                    />
                  </div>
                )}
              </footer>
            </div>
          </div>
        ))}

        {loading && (
          <div className="skeleton-container">
            {[1, 2].map((n) => (
              <div key={n} className="post-card skeleton-card skeleton-pulse" style={{height: '200px', marginBottom: '20px'}}></div>
            ))}
          </div>
        )}

        {hasMore && !loading && (
          <button className="load-more-btn" onClick={() => {
            const nextPage = page + 1;
            setPage(nextPage);
            loadPosts(nextPage);
          }}>
            Load More Posts
          </button>
        )}
        
        {!hasMore && posts.length > 0 && <p className="end-message">You've reached the end! 🌌</p>}
      </div>
    </div>
  )
}

export default Home