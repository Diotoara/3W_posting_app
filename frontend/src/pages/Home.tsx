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

  const [post,setPosts] = useState<Post[]>([]);
  const[loading,setLoading] = useState<Boolean>(true)

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

  return (
    <div>
      {/* loading */}
      {loading && <div>Fetching Posts</div>}

      <div>
        {post.map((p:Post)=>(
          <div key={p._id} >
            <div>
              @{p.user.username}
            </div>

            <div>
              {p.image && <img src={viteLogo} alt="postImg" /> }
            </div>
            <div>
              {p.text}
            </div>

            <div>
              likes : {p.likes.length}
              <br />
              comments : {p.comments.length}
              {p.comments.map((c:Comment)=>(
                <div key={c._id} >
                  {c.user.username} {" "}
                  says : "{c.text}"
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>

    </div>
  )
}

export default Home