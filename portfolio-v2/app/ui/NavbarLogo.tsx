import Link from "next/link";
import Image, { StaticImageData } from "next/image";

export default function NavbarLogo({ Logo, altText, logoText, link }: { Logo: StaticImageData; altText: string; logoText: string; link: string }) {
    return (
        <Link href={link}>
            <div className="flex items-center justify-center gap-2 p-2 px-5 border bg-white border-outline rounded-full drop-shadow-lg">
                <Image className="size-6" src={Logo} alt={altText}></Image>
                <p>{logoText}</p>
            </div>
        </Link>
    )
}