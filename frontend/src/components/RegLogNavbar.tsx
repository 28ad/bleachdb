import { Link } from 'react-router-dom';
import Logo from '../assets/images/bleachdb-logo.webp'

function RegLogNavbar() {

    const menuLinks = [
        {
            name: 'Home',
            path: '/'
        },
        {
            name: 'Sign Up',
            path: '/register'
        },
        {
            name: 'Login',
            path: '/login'
        },

    ]

    return (

        <>
            <nav className="w-full bg-white h-24 flex justify-center items-center px-4 overflow-y-hidden shadow-md">

                <div>
                    {/* <img src={Logo} className='w-64' /> */}
                    
                    {menuLinks.map((link, index) => (
                        <Link 
                        key={index}
                        to={link.path} className='text-blue-800 capitalize font-bold px-4 mx-1 py-1 cursor-pointer text-center hover:border-b-4 hover:border-red-600 transition-all duration-300 ease-in-out'>
                            {link.name}
                        </Link>
                    ))}
                </div>

            </nav>
        </>

    )
}

export default RegLogNavbar;