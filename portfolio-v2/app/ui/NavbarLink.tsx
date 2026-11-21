import Link from "next/link";

type NavbarLinkProps = {
    link: string;
    linkText: string;
    isActive: boolean;
    onHighlight: () => void; // a function that takes nothing and returns nothing
};

export default function NavbarLink({ link, linkText, isActive, onHighlight }: NavbarLinkProps) {
    return (
        <Link
            href={link}
            data-link={link}
            aria-current={isActive ? "page" : undefined}
            onMouseEnter={onHighlight}
            onFocus={onHighlight}
            className="relative p-2 px-9 rounded-full"
        >
            {linkText}
        </Link>
    );
}
