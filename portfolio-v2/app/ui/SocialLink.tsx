import Image, { StaticImageData } from "next/image";

type SocialLinkProps = {
    icon: StaticImageData;
    linkText: string;
    link: string;
};

// A pill-shaped link to an external site (Instagram, GitHub...) that opens in a new tab.
export default function SocialLink({ icon, linkText, link }: SocialLinkProps) {
    return (
        <a
            href={link}
            target="_blank"            // open in a new tab
            rel="noopener noreferrer"  // stops the new tab from getting access to this page
            className="flex items-center justify-center gap-2 p-2 px-5 border bg-white border-outline rounded-full drop-shadow-lg transition hover:bg-gray-100 active:scale-97"
        >
            {/* alt is empty because the text next to the icon already says what the link is */}
            <Image className="size-4" src={icon} alt="" />
            <span>{linkText}</span>
        </a>
    );
}
