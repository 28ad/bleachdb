import Logo from '../assets/images/bleachdb-logo.webp'

function RegLogNavbar() {

    return (

        <>
            <nav className="w-full bg-blue-800 h-24 flex justify-center items-center px-4 overflow-y-hidden border-b border-blue-400">

                <div>
                    <img src={Logo} className='w-64' />
                </div>

            </nav>
        </>

    )
}

export default RegLogNavbar;