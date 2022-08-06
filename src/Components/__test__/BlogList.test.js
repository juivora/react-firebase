import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { BrowserRouter } from 'react-router-dom';
import Blogs from '../../Blog/Blogs';
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
Enzyme.configure({ adapter: new Adapter() })

describe("Test the blog list component", () => {

    test("Check if blogs are loading", async () => {


        act(() => {
            render(<BrowserRouter><Blogs /></BrowserRouter>)
        });


        const blogDiv = screen.getByTestId('bloglist')
        expect(blogDiv).toMatchSnapshot()
    })

    test("Check if user is logged in than only show edit delete button", async () => {

        act(() => {
            render(<BrowserRouter><Blogs /></BrowserRouter>)
        });


        const editDiv = screen.getByTestId('edit-delete')
        expect(editDiv).toMatchSnapshot()
    })



})