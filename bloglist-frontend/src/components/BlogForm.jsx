import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({createBlog}) => {
    const [newTitle, setNewTitle] = useState('')
    const [newAuthor, setNewAuthor] = useState('')
    const [newUrl, setNewUrl] = useState('')

    const addBlog = (event) => {
      event.preventDefault()
      createBlog({
        title: newTitle,
        author: newAuthor,
        url: newUrl,
      })

      setNewTitle('')
      setNewAuthor('')
      setNewUrl('')
    }

    return (
        <div>
          <h2>Create new</h2>
          <form onSubmit={addBlog}>
            <div>
              title:
              <input type='text' name='Title' value={newTitle}
              onChange={event => setNewTitle(event.target.value)}
              placeholder='blog title' id='title'/>            
            </div>
            <div>
              author:
              <input type='text' name='Author' value={newAuthor}
              onChange={event => setNewAuthor(event.target.value)}
              placeholder='blog author' id='author'/>            
            </div>
            <div>
              url:
              <input type='text' name='Url' value={newUrl}
              onChange={event => setNewUrl(event.target.value)}
              placeholder='blog url' id='url'/>            
            </div>
            <button id='createButton' type='submit'>create</button>
          </form>
        </div>       
    )
}

BlogForm.propTypes = { 
  createBlog: PropTypes.func.isRequired
}

export default BlogForm