import { async } from '@firebase/util'
import { render, screen } from '@testing-library/react'
import Login from '../../Auth/Login/Login'
import validator from 'validator';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';

const originalError = console.error
beforeAll(() => {
    console.error = (...args) => {
        if (/useHref() may be used only in the context of a <Router> component/.test(args[0])) {
            return
        }

        originalError.call(console, ...args)
    }
    console.error = (...args) => {
        if (/useNavigate() may be used only in the context of a <Router> compnent./.test(args[0])) {
            return
        }
        originalError.call(console, ...args)
    }
})

afterAll(() => {
    console.error = originalError
})

describe("Test the login component", () => {
    test("render the login form with two button", async () => {
        render(<BrowserRouter><Login /></BrowserRouter>)
        const buttonList = await screen.findAllByRole("button")
        expect(buttonList).toHaveLength(2)
    })

    test("should failed on email validation", () => {
        const testEmail = 'jui.com';
        expect(validator.isEmail(testEmail)).not.toBe(true)
    })

    test("email input field should accept email", () => {
        act(() => {
            render(<BrowserRouter><Login /></BrowserRouter>)
        })
        const email = screen.getByPlaceholderText('Email address')
        userEvent.type(email, 'jui')
        expect(email.value).not.toMatch('jui@gmail.com')
    })

    test("password input should have type password", () => {
        render(<BrowserRouter><Login /></BrowserRouter>)
        const password = screen.getByPlaceholderText('Password')
        expect(password).toHaveProperty('type', 'password')
    })

    // test("able to submit the form", () => {
    //     const { getByTestId } = render(<BrowserRouter><Login /></BrowserRouter>)
    //     const submitBtn = getByTestId("submit")
    //     const emailInputNode = screen.getByPlaceholderText('Email address')
    //     const passwordInputNode = screen.getByPlaceholderText('Password')

    //     userEvent.type(emailInputNode, 'jui@gmail.com')
    //     userEvent.type(passwordInputNode, '123456')
    //     userEvent.click(submitBtn)



    //     // expect(emailInputNode.value).toMatch('')
    // })
})