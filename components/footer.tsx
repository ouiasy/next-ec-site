import {APP_NAME} from "@/lib/constants";


const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t bottom-0">
            <div className="p-5 flex justify-center ">
                {currentYear} {APP_NAME}. ALL Rights Reserved.
            </div>

        </footer>
    );
};

export default Footer;