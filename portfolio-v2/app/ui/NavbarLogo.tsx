import Link from "next/link";
import Image, { StaticImageData } from "next/image";

export default function NavbarLogo({ Logo, altText, logoText, link }: { Logo: StaticImageData; altText: string; logoText: string; link: string }) {
    return (
        <Link href={link} className="group">
            <div className="relative overflow-hidden flex items-center justify-center gap-2 p-2 px-5 border bg-white border-outline rounded-full drop-shadow-lg">
                {/* Rainbow layer. Gradients can't animate directly, so we fade this layer in with opacity instead.
                    Tailwind's hover: only applies on devices with a mouse, so it won't get stuck on after a tap on a phone. */}
                <span
                    aria-hidden="true"
                    className="absolute inset-0 bg-[linear-gradient(90deg,#ef4444,#f97316,#eab308,#22c55e,#3b82f6,#8b5cf6,#ec4899)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
                {/* relative puts the icon and text on top of the rainbow layer.
                    The icon is an image, so CSS color can't change it: brightness-0 turns it black, then invert flips black to white. */}
                <Image className="relative size-6 transition duration-300 group-hover:brightness-0 group-hover:invert" src={Logo} alt={altText}></Image>
                <p className="relative transition-[color,font-weight] duration-300 group-hover:text-white group-hover:font-medium">{logoText}</p>
            </div>
        </Link>
    )
}
