import Image, { StaticImageData } from "next/image";

export default function NavbarButton({ buttonText, altText, buttonIcon }: {buttonText: string; altText: string; buttonIcon: StaticImageData} ) {
    {/* Will add onclick event here later, focusing on the styling for now. */}
    return (
        <button className="flex items-center justify-center gap-2 p-2 px-5 border bg-white border-outline rounded-full drop-shadow-lg">
            <Image className="size-4" src={buttonIcon} alt={altText} /> {buttonText}
        </button>
    )
}