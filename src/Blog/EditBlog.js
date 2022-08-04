import { collection, addDoc, Timestamp, getDoc, doc, updateDoc } from 'firebase/firestore'
import React, { useDebugValue, useEffect, useState } from "react";
import { storage, db, auth } from '../firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import HeaderPage from '../UI/HeaderPage';
import ToastJs from '../Components/ToastJs';
import Modal from '../UI/Modal';
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, useParams } from "react-router-dom";

export default function Editblog() {
    const { id } = useParams()
    const [blog, setBlog] = useState({})
    const [user, loading] = useAuthState(auth);
    const [showAlert, setShowAlert] = useState(false)
    const [newImage, setNewImage] = useState('')
    const [alertColor, setAlertColor] = useState('white')
    const [alertMessage, setAlertMessage] = useState('')
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        id: "",
        title: "",
        description: "",
        imageUrl: "",
        createdAt: Timestamp.now().toDate(),
    })



    useEffect(() => {

        const docRef = doc(db, "blogs", id);
        getDoc(docRef).then(docSnap => {
            if (docSnap.exists()) {
                setFormData(docSnap.data())

                const blogUserId = docSnap.data().postedBy.id
                if (!auth.currentUser) {
                    navigate("/blog")
                } else {
                    if (blogUserId != auth.currentUser.uid) {
                        navigate("/blog")
                    }
                }
            } else {
                console.log("No such document!");
                navigate("/blog")
            }
        })

        if (loading) {
            // maybe trigger a loading screen
            return;
        }
        console.log("auth.currentUser", auth.currentUser)

        // eslint-disable-next-line+3
    }, [user, loading]);

    const [progress, setProgress] = useState(0)

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleImageChange = e => {
        setNewImage(e.target.files[0])
        setFormData({ ...formData, imageUrl: e.target.files[0] })
    }

    const handlePublish = () => {
        if (!formData.title || !formData.description || !formData.imageUrl) {
            alert('Please fill all the fields')
            return;
        }
        if (newImage !== '') {
            const storageRef = ref(storage, `images/${Date.now()}${formData.imageUrl.name}`)
            const uploadImage = uploadBytesResumable(storageRef, formData.imageUrl)
            uploadImage.on("state_changed",
                (snapshot) => {
                    const progressPercent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
                    setProgress(progressPercent)
                },
                (err) => {
                    console.log(err)
                },
                () => {

                    getDownloadURL(uploadImage.snapshot.ref)
                        .then((url) => {
                            const blogRef = doc(db, "blogs", id);

                            updateDoc(blogRef, {
                                title: formData.title,
                                description: formData.description,
                                imageUrl: url,
                                // createdAt: Timestamp.now().toDate()
                            })
                                .then(() => {
                                    setAlertColor('blue')
                                    setAlertMessage('Blog updated successfully')
                                    setShowAlert(true)
                                    setProgress(0)
                                    navigate('/blog')
                                })
                                .catch(err => {
                                    setAlertColor('red')
                                    setAlertMessage('Error while updating blog')
                                    setShowAlert(true)
                                    // toast('Error while adding blog', { type: "error" })
                                    setProgress(0)
                                })
                        })
                }
            )
        } else {
            const blogRef = doc(db, "blogs", id);
            updateDoc(blogRef, {
                title: formData.title,
                description: formData.description,
            }).then(() => {
                setAlertColor('blue')
                setAlertMessage('Blog updated successfully')
                setShowAlert(true)
                setProgress(0)
                navigate('/blog')
            })
                .catch(err => {

                    setAlertColor('red')
                    setAlertMessage('Error while updating blog')
                    setShowAlert(true)
                    // toast('Error while adding blog', { type: "error" })
                    setProgress(0)
                })
        }

    }

    return (
        <>
            <ToastJs show={showAlert} color={alertColor} message={alertMessage} />
            {console.log(formData)}
            <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">

                <div className="max-w-md w-full space-y-8">
                    <HeaderPage
                        heading="Edit blog"

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
                            // value={blog.title}
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
                    {formData.imageUrl &&
                        <div className="mt-2 mb-4 prose prose-slate prose-a:relative prose-a:z-10 dark:prose-dark line-clamp-2">
                            <img src={formData.imageUrl} className="rounded-md border-slate-800 scale-75" />
                        </div>
                    }
                    <label htmlFor='' className="sr-only" >Image</label>
                    <input
                        // allows you to reach into your file directory and upload image to the browser
                        type="file"
                        name="imageUrl"
                        accept="image/*"
                        className="appearance-none rounded-none relative block
                          w-full px-3 py-2 border border-gray-300
                          placeholder-gray-500 text-gray-900 rounded-t-md
                          focus:outline-none focus:ring-teal-500
                          focus:border-teal-500 focus:z-10 sm:text-sm"
                        onChange={(e) => handleImageChange(e)}
                    />
                    {progress === 0 ? null : (
                        <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
                            <div className="bg-teal-600 text-xs font-medium text-teal-100 text-center p-0.5 leading-none rounded-full"
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
        </>)
}
