const Footer = () => {
    const currentYear = new Date().getFullYear()
    return ( 
        <footer className='border-t'>
            <div className="p-5 flex-center">
                {currentYear} {process.env.NEXT_PUBLIC_APP_NAME}. All Rights Reserved
            </div>
        </footer>
     );
}
 
export default Footer;