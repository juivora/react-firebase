import { collection, addDoc, Timestamp } from 'firebase/firestore'
import React, { useDebugValue, useEffect, useState } from "react";
import { storage, db, auth } from '../firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import HeaderPage from '../UI/HeaderPage';
import ToastJs from '../Components/ToastJs';
import Modal from '../UI/Modal';
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import blogService from '../services/blog.service';



function AddBlog() {
    const [user, loading] = useAuthState(auth);
    const allInputs = { imgUrl: '' }
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        postedBy: user,
        title: "",
        description: "",
        image: "",
        createdAt: Timestamp.now().toDate(),

    })
    const [showAlert, setShowAlert] = useState(false)
    const [alertColor, setAlertColor] = useState('white')
    const [alertMessage, setAlertMessage] = useState('')

    useEffect(() => {
        if (loading) {
            // maybe trigger a loading screen
            return;
        }

        if (!user) navigate("/")

        // eslint-disable-next-line+3
    }, [user, loading]);

    const [progress, setProgress] = useState(0)

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleImageChange = e => {
        setFormData({ ...formData, image: e.target.files[0] })
    }

    const handlePublish = (e) => {
        e.preventDefault()
        const regexp = /^\S*$/;
        const { title, description } = formData;
        if (!regexp.test(title) || !regexp.test(description)) {
            setShowAlert(true)
            setAlertColor('red')
            setAlertMessage('Please fill all the fields !')
            return;
        }
        if (!formData.title || !formData.description || !formData.image) {
            setShowAlert(true)
            setAlertColor('red')
            setAlertMessage('Please fill all the fields !')
            return;
        }

        const storageRef = ref(storage, `images/${Date.now()}${formData.image.name}`)
        const uploadImage = uploadBytesResumable(storageRef, formData.image)
        const blogRef = collection(db, "blogs");

        uploadImage.on("state_changed",
            (snapshot) => {
                const progressPercent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
                setProgress(progressPercent)
            },
            (err) => {
                console.log(err)
            },
            () => {
                setFormData({
                    title: "",
                    description: "",
                    image: ""
                })


                getDownloadURL(uploadImage.snapshot.ref)
                    .then((url) => {

                        addDoc(blogRef, {
                            // postedBy: blogRef.whereEqualTo("postedBy", user?.uid),
                            postedBy: { name: auth.currentUser.displayName, id: auth.currentUser.uid },
                            title: formData.title,
                            description: formData.description,
                            imageUrl: url,
                            createdAt: Timestamp.now().toDate()
                        })
                            .then(() => {
                                <Modal />

                                setProgress(0)
                                navigate('/blog')
                            })
                            .catch(err => {

                                setProgress(0)
                            })
                    })
            }
        )

    }

    return (

        <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <ToastJs show={showAlert} color={alertColor} message={alertMessage} />
                <HeaderPage
                    heading="Add new blog"

                />
                <div className="rounded-md shadow-sm -space-y-px">
                    <div>
                        <label htmlFor='title' className="sr-only">Title</label>
                        <input type="text" name="title" value={formData.title}
                            id="title"
                            onChange={(e) => handleChange(e)}
                            className="appearance-none rounded-none relative block
                                w-full px-3 py-2 border border-gray-300
                                placeholder-gray-500 text-gray-900 rounded-t-md
                                focus:outline-none focus:ring-teal-500
                                focus:border-teal-500 focus:z-10 sm:text-sm"
                            placeholder="Title"
                        />
                    </div>
                </div>
                <div className="rounded-md shadow-sm -space-y-px">
                    <div>
                        <label htmlFor='description' className="sr-only">Description</label>
                        <textarea name="description" value={formData.description}
                            className="appearance-none rounded-none relative block
                          w-full px-3 py-2 border border-gray-300
                          placeholder-gray-500 text-gray-900 rounded-t-md
                          focus:outline-none focus:ring-teal-500
                          focus:border-teal-500 focus:z-10 sm:text-sm"
                            onChange={(e) => handleChange(e)}
                            placeholder="Description"
                            id="description" />
                    </div>
                </div>
                <label htmlFor='' className="sr-only">Image</label>
                <input
                    // allows you to reach into your file directory and upload image to the browser
                    type="file"
                    name="image"
                    accept="image/*"
                    className="appearance-none rounded-none relative block
                          w-full px-3 py-2 border border-gray-300
                          placeholder-gray-500 text-gray-900 rounded-t-md
                          focus:outline-none focus:ring-teal-500
                          focus:border-teal-500 focus:z-10 sm:text-sm"
                    onChange={(e) => handleImageChange(e)}
                />
                {progress === 0 ? null : (
                    <div class="w-full bg-gray-200 rounded-full dark:bg-gray-700">
                        <div class="bg-teal-600 text-xs font-medium text-teal-100 text-center p-0.5 leading-none rounded-full"
                            style={{ width: `${progress}%` }} >
                            {progress}%
                        </div>
                    </div>
                )}

                <button type="submit"
                    className="group relative w-full flex justify-center
                py-2 px-4 border border-transparent text-sm font-medium
                rounded-md text-white bg-teal-600 hover:bg-teal-700
                focus:outline-none focus:ring-2 focus:ring-offset-2
                focus:ring-teal-500" onClick={handlePublish}>Publish</button>
            </div>


        </div>
    );
}


export default AddBlog
