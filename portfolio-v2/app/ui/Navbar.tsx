import NavbarMenu from "./NavbarMenu";
import NavbarButton from "./NavbarButton";
import NavbarLogo from "./NavbarLogo";

import languageIcon from "../../public/languageIcon.svg";
import nightIcon from "../../public/moonIcon.svg";
import Logo from "../../public/catIcon.svg";


export default function Navbar() {
    return (
        <nav className="flex items-center justify-around mt-4">
            <div>
                <NavbarLogo 
                Logo={Logo}
                altText=""
                logoText="Akseli Rajahalme"
                link="/"
                />
            </div>

            <NavbarMenu />

            <div className="flex gap-3">
                <NavbarButton buttonIcon={languageIcon}
                    altText=""
                    buttonText="In finnish"
                />
                <NavbarButton buttonIcon={nightIcon}
                    altText=""
                    buttonText="Night mode"
                />
            </div>
        </nav>
    )
}