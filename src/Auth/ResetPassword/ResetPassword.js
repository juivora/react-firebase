// import { Toast } from "bootstrap";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, sendPasswordReset } from "../../firebase";
import { LockClosedIcon } from '@heroicons/react/solid'

const HeaderPage = React.lazy(() => import('../../UI/HeaderPage'));
const ToastJs = React.lazy(() => import('../../Components/ToastJs'));

function ResetPassword() {
    const [email, setEmail] = useState("");
    const [user, loading, error] = useAuthState(auth);
    const [showAlert, setShowAlert] = useState(false)
    const [alertColor, setAlertColor] = useState('white')
    const [alertMessage, setAlertMessage] = useState('')
    const navigate = useNavigate();
    useEffect(() => {
        if (loading) return;
        if (user) navigate("/dashboard");
    }, [user, loading]);

    return (
        <>
            <HeaderPage
                heading="Reset Password"
                paragraph="Don't have an account yet? "
                linkName="Signup"
                linkUrl="/register"
            />
            <div className="min-h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <ToastJs show={showAlert} color={alertColor} message={alertMessage} />
                <div className="max-w-md w-full space-y-8">
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email-address" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                // required
                                className="appearance-none rounded-none relative block
                                                w-full px-3 py-2 border border-gray-300
                                                placeholder-gray-500 text-gray-900 rounded-t-md
                                                focus:outline-none focus:ring-teal-500
                                                focus:border-teal-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
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
                            onClick={() => sendPasswordReset(email)}
                            data-testid="submit"
                        >
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                <LockClosedIcon className="h-5 w-5 text-teal-500 group-hover:text-teal-400"
                                    aria-hidden="true" />
                            </span>
                            Send password reset email
                        </button>
                    </div>

                </div>
            </div>

        </>
    );
}
export default ResetPassword;