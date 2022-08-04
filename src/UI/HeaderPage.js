import { Link } from 'react-router-dom';

export default function HeaderPage({
    heading,
    paragraph,
    linkName,
    linkUrl = "#"
}) {
    return (
        <div className="mb-10">
            <div className="flex justify-center">
                <img
                    alt=""
                    className="h-14 w-14"
                    src="https://ik.imagekit.io/htpnvdqc8/kisspng-customer-experience-computer-icons-5aff5f7b63d4a9.7527770115266855634089_9wRKEASCFR.jpg?ik-sdk-version=javascript-1.4.3&updatedAt=1658740589852" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                {heading}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 mt-5">
                {paragraph} {' '}
                <Link to={linkUrl} className="font-medium text-teal-600 hover:text-teal-500">
                    {linkName}
                </Link>
            </p>
        </div>
    )
}