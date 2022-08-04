import { async } from '@firebase/util'
import { render, screen } from '@testing-library/react'

import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { BrowserRouter } from 'react-router-dom';
import AddBlog from '../../Blog/AddBlog';

describe("Test the add blog component", () => {
    test("Check title is not empty", async () => {
        act(() => {
            render(<BrowserRouter><AddBlog /></BrowserRouter>)
        });

        const title = screen.getByPlaceholderText('Title')
        userEvent.type(title, '')
        expect(title.value).not.toBeNull()
        // expect(passedBrowserValidation(view, "name")).toBeTruthy();
    })

    test("Check description is not empty", async () => {
        act(() => {
            render(<BrowserRouter><AddBlog /></BrowserRouter>)
        });

        const description = screen.getByPlaceholderText('Description')
        userEvent.type(description, '')
        expect(description.value).not.toBeNull()
        // expect(passedBrowserValidation(view, "name")).toBeTruthy();
    })

})