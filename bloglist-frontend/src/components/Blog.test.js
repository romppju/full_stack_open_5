import React from "react"
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from "./Blog"

const blog = {
    title: 'Test blog title',
    author: 'Test Blogger',
    url: 'www.testblog.com',
    likes: 100
}

const user = {
    username: 'testUsername',
    name: 'testName',
    token: 'testToken'
}

test('renders title only', () => {
    const {container} = render(<Blog blog={blog} loggedUser={user}/>)

    const titleElement = screen.getByText('Test blog title')
    expect(titleElement).toBeDefined()

    const info = container.querySelector('.info')
    expect(info).not.toBeVisible()
})

test('all info is shown once "view" is clicked', async () => {
   
    
    const {container} = render(<Blog blog={blog} loggedUser={user}/>)
    
    const testUser = userEvent.setup()
    const button = screen.getByText('view')
    await testUser.click(button)

    const info = container.querySelector('.info')
    expect(info).toBeVisible()
})

test('like button calls correct handler', async () => {
    const likeHandler = jest.fn() 
    render(<Blog blog={blog} loggedUser={user} handleLikeClick={likeHandler}/>)
    
    const testUser = userEvent.setup()
    const viewButton = screen.getByText('view')
    await testUser.click(viewButton)
     
    const likeButton = screen.getByText('like')
    await testUser.click(likeButton)
    await testUser.click(likeButton)

    expect(likeHandler.mock.calls).toHaveLength(2)    
})
