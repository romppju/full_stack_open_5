import { useState } from "react"

const Blog = ({
    blog,
    handleLikeClick,
    handleRemoveClick,
    loggedUser
  }) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = {display: visible? 'none': ''}
  const showWhenVisible = {display: visible? '': 'none'}
  
  const creatorId = blog.user? blog.user.id: null
  const showRemove = {display: loggedUser.id === creatorId? '': 'none'}
  
  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      <div className='blog'>
        {blog.title}
        <button style={hideWhenVisible} onClick={toggleVisibility}>
          view</button>
        <button style={showWhenVisible} onClick={toggleVisibility}>
          hide</button>
        <div className="info" style={showWhenVisible}>
          <p>{blog.url}</p>
          <p className='likes'>
            likes {blog.likes}
            <button onClick={() => handleLikeClick(blog)}
            className='likeButton'>like</button>
          </p>
          <p>{blog.author}</p>
          <button style={showRemove}
          onClick={() => handleRemoveClick(blog)}>remove</button>
        </div>
      </div>
    </div>
  )
}

export default Blog