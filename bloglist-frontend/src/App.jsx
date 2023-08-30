import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification]
  = useState({success: true, message: null})

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )         
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  },[])

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNotification({success: false, message: 'invalid username or password'})
      setTimeout(() => {
        setNotification({success: true, message: null})
      }, 5000)
    }
  }
  
  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    blogService.setToken(null)
  }

  const handleCreateClick = async (newBlog) => {
    try {
      blogFormRef.current.toggleVisibility()
      const data = await blogService.create(newBlog)
      setBlogs(blogs.concat(data))

      const updatedBlogs = await blogService.getAll()
      setBlogs(updatedBlogs)
      
      setNotification({success:true, message:'New blog added'})
      setTimeout(() => {setNotification({success:true, message:null})}, 5000)
    } catch (exception) {
      setNotification({success: false, message: 'failed to add new blog'})
      setTimeout(() => {
        setNotification({success: true, message: null})
      }, 5000)
    }    
  }

  const handleLike = async (blog) => {
    const newBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user
    }

    try {
      await blogService.update(blog.id, newBlog)
      const updatedBlogs = await blogService.getAll()
      setBlogs(updatedBlogs)
    } catch (exception) {
      setNotification({success: false, message: 'update failed'})
      setTimeout(() => {
        setNotification({success: true, message: null})
      }, 5000)
    }
  }

  const handleRemove = async (blog) => {
    if (window.confirm(`Remove "${blog.title}"?`)) {
      try {
        await blogService.remove(blog.id)
        const updatedBlogs = await blogService.getAll()
        setBlogs(updatedBlogs)
      } catch (exception) {
        setNotification({success: false, message: 'removal failed'})
        setTimeout(() => {
          setNotification({success: true, message: null})
        }, 5000)
      }
    }  
  }
  
  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification notif={notification}/>
        <form onSubmit={handleLogin}>
          <div>
            username
            <input type='text' value={username} name='Username'
            id='username'
            onChange={({target}) => setUsername(target.value)}/>
          </div>
          <div>
            password
            <input type='password' value={password} name='Password'
            id='password'
            onChange={({target}) => setPassword(target.value)}/>
          </div>
          <button id='loginButton' type='submit'>login</button>
        </form>
      </div>
    )

  } else {
    return (
      <div>
        <h2>blogs</h2>
        <Notification notif={notification}/>
        <div>{user.username} logged in
          <button type='button' onClick={handleLogout}>logout</button>
        </div>
        <Togglable buttonLabel='create new blog' ref={blogFormRef}>
          <BlogForm createBlog={handleCreateClick}/>
        </Togglable>
        {blogs
          .sort((a, b) => b.likes - a.likes)
          .map(blog => 
          <Blog key={blog.id} blog={blog} handleLikeClick={handleLike}
          handleRemoveClick={handleRemove} loggedUser={user}/>
        )}                             
      </div>      
    )
  }
}

const Notification = ({notif}) => {
  const notificationStyle = {
    color: 'green',
    fontSize: 16
  }
  
  if (!notif.success) {
    notificationStyle.color = 'red'
  } 
  
  if (notif.message === null) {
    return null
  }

  return (
    <div style={notificationStyle}>
      {notif.message}
    </div>
  )
}


export default App