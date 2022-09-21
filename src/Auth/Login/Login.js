
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import validator from 'validator';
import { auth, logInWithEmailAndPassword, signInWithGoogle } from '../../firebase'
import { LockClosedIcon } from '@heroicons/react/solid'
// import Input from "../../UI/input";

const HeaderPage = React.lazy(() => import('../../UI/HeaderPage'));
const ToastJs = React.lazy(() => import('../../Components/ToastJs'));
const Input = React.lazy(() => import("../../UI/Input"));

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, loading] = useAuthState(auth);
    const [showAlert, setShowAlert] = useState(false)
    const [alertColor, setAlertColor] = useState('white')
    const [alertMessage, setAlertMessage] = useState('')

    const navigate = useNavigate();

    useEffect(() => {
        if (loading) {
            // maybe trigger a loading screen
            return;
        }
        if (user) navigate("/blog")

        // eslint-disable-next-line+3
    }, [user, loading]);


    const handleLoginWithEmail = (e) => {
        e.preventDefault()
        if (email !== "" || password !== "") {
            if (!validator.isEmail(email)) {
                setShowAlert(true)
                setAlertColor('red')
                setAlertMessage('Please enter valid email')
                return false
            } else {
                logInWithEmailAndPassword(email, password, setShowAlert, setAlertMessage)
            }

        } else {
            setShowAlert(true)
            setAlertColor('red')
            setAlertMessage('Email and password can not be empty !')
        }
    }

    return (
        <>
            <HeaderPage
                heading="Login to your account"
                paragraph="Don't have an account yet? "
                linkName="Signup"
                linkUrl="/register"
            />

            <div className="min-h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">

                    <ToastJs show={showAlert} color={alertColor} message={alertMessage} />

                    <form className="mt-8 space-y-6" method="POST">
                        <input type="hidden" name="remember" defaultValue="true" />
                        <div className="rounded-md shadow-sm -space-y-px">
                            <Input id={"email-address"} label="Email address" value={email}
                                name={"email"} type="email"
                                classes="appearance-none rounded-none relative block
                                w-full px-3 py-2 border border-gray-300
                                placeholder-gray-500 text-gray-900 rounded-t-md
                                focus:outline-none focus:ring-teal-500
                                focus:border-teal-500 focus:z-10 sm:text-sm"
                                isRequired={true}
                                handleChange={(e) => setEmail(e.target.value)}
                            />
                            <Input id={"password"} label="Password" value={password}
                                name={"password"} type="password"
                                classes="appearance-none rounded-none relative block
                                w-full px-3 py-2 border border-gray-300
                                placeholder-gray-500 text-gray-900 rounded-t-md
                                focus:outline-none focus:ring-teal-500
                                focus:border-teal-500 focus:z-10 sm:text-sm"
                                isRequired={true}
                                handleChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-teal-600 focus:ring-teal-500
                                    border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                {/* <Link className="font-medium text-teal-600 hover:text-teal-500">
                                    Forgot your password?
                                </Link> */}
                                <Link to="/reset" className="font-medium text-teal-600 hover:text-teal-500">
                                    Forgot your password?
                                </Link>

                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center
                                    py-2 px-4 border border-transparent text-sm font-medium
                                    rounded-md text-white bg-teal-600 hover:bg-teal-700
                                    focus:outline-none focus:ring-2 focus:ring-offset-2
                                    focus:ring-teal-500"
                                onClick={handleLoginWithEmail}
                                data-testid="submit"
                            >
                                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                    <LockClosedIcon className="h-5 w-5 text-teal-500 group-hover:text-teal-400"
                                        aria-hidden="true" />
                                </span>
                                Sign in
                            </button>
                        </div>
                        <div>
                            <button
                                type="button"
                                className="group relative w-full flex justify-center
                                    py-2 px-4 border border-transparent text-sm font-medium
                                    rounded-md text-white bg-teal-600 hover:bg-teal-700
                                    focus:outline-none focus:ring-2 focus:ring-offset-2
                                    focus:ring-teal-500"
                                onClick={signInWithGoogle}
                                data-testid="googleSubmit"
                            >
                                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                    <LockClosedIcon className="h-5 w-5 text-teal-500 group-hover:text-teal-400"
                                        aria-hidden="true" />
                                </span>
                                Sign in with Google
                            </button>
                        </div>
                    </form>

                </div >
            </div >
        </>
    );
}
export default Login;