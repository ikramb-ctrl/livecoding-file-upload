import React, {useState, useEffect} from "react";
import "../styles.css";
import Axios from 'axios'

const baseURL = process.env.REACT_APP_API_BASE_URL
const axios = Axios.create({baseURL})

function App() {
  const [posts, setPosts] = useState([])
  const [title, setTitle] = useState('An awesome blog post')
  const [mainPicture, setMainPicture] = useState(null)
  const [content, setContent] = useState("blog post content")

  useEffect(() => {
    axios.get('/posts').then(res => res.data).then(data => setPosts(data))
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('content', content);
    formData.append('title', title);
    formData.append("main_picture", mainPicture);
    axios.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
    })
    .then(res => res.data)
    .then(data => setPosts([...posts, {content, title, main_picture_url: data.main_picture_url}]))
  }

  return (
    <div className="App">
      <h2>New Post</h2>

      <form onSubmit={handleSubmit}>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)}/>
        <br/>
        <textarea onChange={e => setContent(e.target.value)} value={content}>
        </textarea>
        <br/>
        <input type="file" onChange={e => setMainPicture(e.target.files[0])}/>
        <br/>
        <input type="submit" value="create new post"/>
      </form>

      <h2>Post List</h2>

      {posts.map(post => {
        return (
          <div className="post" key={post.id}>
            <h2>{post.title}</h2>
            {post.main_picture_url && <img src={baseURL + '/' + post.main_picture_url}/>}
            <p>{post.content}</p>
          </div>
        )
      })}
    </div>
  );
}

export default App;
