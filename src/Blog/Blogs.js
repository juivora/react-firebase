import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { collection, deleteDoc, doc, onSnapshot, orderBy, query } from 'firebase/firestore'
import { auth, db } from '../firebase'

const Modal = React.lazy(() => import('../UI/Modal'));
const SearchBlog = React.lazy(() => import('./SearchBlog'));
const ToastJs = React.lazy(() => import('../Components/ToastJs'));

export default function Blogs() {
    const [id, setId] = useState()
    const [blogs, setBlogs] = useState([])
    const [displayConfirmationModal, setDisplayConfirmationModal] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState(null);
    const [showAlert, setShowAlert] = useState(false)
    const [search, setSearch] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        const blogRef = collection(db, "blogs")
        const q = query(blogRef, orderBy("createdAt", "desc"))

        onSnapshot(q, (snapshot) => {
            let blogs = snapshot.docs.map(doc => ({
                id: doc.id,
                userStatus: 0,
                ...doc.data()
            }))



            blogs = blogs.filter(
                blog => {
                    return (
                        blog
                            .title
                            .toLowerCase()
                            .includes(search.toLowerCase()) ||
                        blog
                            .description
                            .toLowerCase()
                            .includes(search.toLowerCase())
                    );
                })

            // blogs = blogs.filter(blog => {
            //     const userRef = collection(db, "users")
            //     const userQ = query(userRef, where('uid', '==', blog.postedBy.id))
            //     return (onSnapshot(userQ, (snapshot) => {
            //         snapshot.docs.map(doc => {
            //             return blog.userStatus = doc.data().status
            //         })
            //     }))
            // })


            console.log(blogs)
            setBlogs(blogs)

        })
    }, [search])

    const showDeleteModal = (id) => {
        setId(id)
        setDeleteMessage(`Are you sure you want to delete the blog `);
        setDisplayConfirmationModal(true);
    };

    const submitDelete = () => {
        setBlogs(blogs.filter((blog) => blog.id !== id))
        setDisplayConfirmationModal(false);
        const blogDoc = doc(db, "blogs", id)
        deleteDoc(blogDoc)
        setShowAlert(true)

    }

    const editBlog = id => {
        navigate('/blog/edit/' + id)
    }

    const searchValue = (search) => {
        setSearch(search)
    }

    return (
        <div>
            <SearchBlog placeholder={'Search Blogs...'} searchValue={searchValue} />
            <div className='relative sm:pb-12 sm:ml-[calc(2rem+1px)] md:ml-[calc(3.5rem+1px)] lg:ml-[max(calc(14.5rem+1px),calc(100%-48rem))]'>

                <div className="hidden absolute top-3 bottom-0 right-full mr-7 md:mr-[3.25rem] w-px bg-slate-200 dark:bg-slate-800 sm:block"></div>
                <div className="space-y-16" data-testid='bloglist'>
                    <ToastJs show={showAlert} color="blue" message="Blog deleted successfully" />
                    {
                        blogs.length === 0 ? (
                            <div>
                                <div className="text-sm lg:flex-grow">
                                    <a href="/blog" className="block mt-4 lg:inline-block lg:mt-0 text-black-200 hover:text-black">
                                        <p>No Blogs found</p>
                                    </a>
                                </div>

                            </div>
                        ) : (
                            blogs.map(({ id, title, description, imageUrl, createdAt, postedBy, userStatus }) => {
                                return <div key={id} className='mt-3 mr-3'>
                                    {console.log('userstatus', userStatus)}
                                    <article className="relativse group">
                                        {/* <div className="absolute -inset-y-2.5 -inset-x-4 md:-inset-y-4 md:-inset-x-6 sm:rounded-2xl group-hover:bg-slate-50/70 dark:group-hover:bg-slate-800/50"></div> */}
                                        <svg viewBox="0 0 9 9" className="hidden absolute right-full mr-6 top-2 text-slate-200 dark:text-slate-600 md:mr-12 w-[calc(0.5rem+1px)] h-[calc(0.5rem+1px)] overflow-visible sm:block">
                                            <circle cx="4.5" cy="4.5" r="4.5" stroke="currentColor" className="fill-white dark:fill-slate-900" strokeWidth="2"></circle>
                                        </svg>
                                        <div className="relative">
                                            <div className='flex flex-row'>
                                                <h3 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-200 pt-8 lg:pt-0 basis-4/5">
                                                    {title}
                                                </h3>

                                                {/* {userStatus == 1 &&
                                                    <div>
                                                        <svg className="h-8 w-8 text-green-500" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <circle cx="12" cy="12" r="9" /></svg>
                                                    </div>
                                                } */}
                                                {auth.currentUser && postedBy.id == auth.currentUser.uid &&
                                                    (
                                                        <div data-testid='edit-delete'>
                                                            <button className='basis-1/6' onClick={() => showDeleteModal(id)}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                                                </svg>
                                                            </button>
                                                            <button className='basis-1/6' onClick={() => editBlog(id)}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    )}
                                            </div>

                                            <div className="mt-2 mb-4 prose prose-slate prose-a:relative prose-a:z-10 dark:prose-dark line-clamp-2">
                                                <img src={imageUrl} className="rounded-md border-slate-800 scale-75" />
                                            </div>
                                            <div className="mt-2 mb-4 prose prose-slate prose-a:relative prose-a:z-10 dark:prose-dark line-clamp-2">
                                                <p>{description}</p>
                                            </div>
                                            <dl className="absolute left-0 top-0 lg:left-auto lg:right-full lg:mr-[calc(6.5rem+1px)]">
                                                <dt className="sr-only">Date</dt>
                                                <dd className="whitespace-nowrap text-sm leading-6 dark:text-slate-400">
                                                    <time dateTime="2022-06-23T19:40:00.000Z">June 24, 2022</time>
                                                </dd>
                                            </dl>
                                        </div>
                                        <span className="flex items-center text-sm text-sky-500 font-medium">
                                            <svg className="relative mt-px overflow-visible ml-2.5 text-sky-300 dark:text-sky-700" width="3" height="6" viewBox="0 0 3 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M0 0L3 3L0 6"></path></svg>
                                        </span>

                                        <div className='test'>
                                            <p>
                                                {createdAt.toDate().toDateString()}
                                            </p>
                                        </div>
                                    </article>
                                </div>
                            })
                        )
                    }

                    <Modal show={displayConfirmationModal} confirmModal={submitDelete} id={id} message={deleteMessage} title={`Blog Delete`} />


                </div>
            </div >
        </div>
    )
}
