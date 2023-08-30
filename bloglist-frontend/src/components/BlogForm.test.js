import React from "react"
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from "./BlogForm"

test('create button calls handler with correct information', async () => {
    const createHandler = jest.fn()
       
    render(<BlogForm
        createBlog={createHandler}    
    />)

    const titleInput = screen.getByPlaceholderText('blog title')
    const authorInput = screen.getByPlaceholderText('blog author')
    const urlInput = screen.getByPlaceholderText('blog url')
    const createButton = screen.getByText('create')
    
    const testUser = userEvent.setup()
    
    await testUser.type(titleInput, 'Test Title')
    await testUser.type(authorInput, 'Test Author')
    await testUser.type(urlInput, 'Test Url')   
    await testUser.click(createButton)

    expect(createHandler.mock.calls[0][0].title).toBe('Test Title')
    expect(createHandler.mock.calls[0][0].author).toBe('Test Author')
    expect(createHandler.mock.calls[0][0].url).toBe('Test Url')

    expect(createHandler.mock.calls).toHaveLength(1)
})