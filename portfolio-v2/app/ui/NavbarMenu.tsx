'use client'
import { useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import NavbarLink from "./NavbarLink";

const links = [
    { link: "/", linkText: "About" },
    { link: "/projects", linkText: "Projects" },
    { link: "/photography", linkText: "Photography" },
    { link: "/contact", linkText: "Contact" },
];

export default function NavbarMenu() {
    const pathname = usePathname();

    // Which link the mouse (or keyboard focus) is on. null = nothing hovered.
    const [hovered, setHovered] = useState<string | null>(null);

    // The pill follows the hovered link, and falls back to the current page.
    const target = hovered ?? pathname;

    // Refs give us the real DOM elements, so we can measure and move them.
    const menuRef = useRef<HTMLDivElement>(null);
    const pillRef = useRef<HTMLSpanElement>(null);
    const hasPlacedPill = useRef(false);

    // Runs after React updates the page but before the browser paints it,
    // so the pill is already in the right place on the first frame.
    useLayoutEffect(() => {
        const menu = menuRef.current;
        const pill = pillRef.current;
        if (!menu || !pill) return;

        function placePill() {
            const linkElement = menu!.querySelector<HTMLElement>(`[data-link="${target}"]`);

            // Not on one of these pages (e.g. a 404): hide the pill.
            if (!linkElement) {
                pill!.style.opacity = "0";
                return;
            }

            // The very first placement should not slide in from the left edge.
            if (!hasPlacedPill.current) {
                pill!.style.transition = "none";
            }

            pill!.style.opacity = "1";
            pill!.style.left = `${linkElement.offsetLeft}px`;
            pill!.style.width = `${linkElement.offsetWidth}px`;

            if (!hasPlacedPill.current) {
                pill!.getBoundingClientRect(); // forces the browser to apply the position now
                pill!.style.transition = "";   // ...then turns the animation back on
                hasPlacedPill.current = true;
            }
        }

        placePill();

        // Link widths change when the font finishes loading or the window resizes.
        const observer = new ResizeObserver(placePill);
        observer.observe(menu);
        return () => observer.disconnect();
    }, [target]);

    return (
        <div
            ref={menuRef}
            onMouseLeave={() => setHovered(null)}
            onBlur={() => setHovered(null)}
            className="relative flex gap-7 border border-outline rounded-full bg-white drop-shadow-lg"
        >
            {/* The one shared pill. It comes first in the HTML, so the links are drawn on top of it. */}
            <span
                ref={pillRef}
                aria-hidden="true"
                className="absolute inset-y-0 rounded-full bg-zinc-100 opacity-0 transition-all duration-300 ease-out"
            />

            {links.map(({ link, linkText }) => (
                <NavbarLink
                    key={link}
                    link={link}
                    linkText={linkText}
                    isActive={pathname === link}
                    onHighlight={() => setHovered(link)}
                />
            ))}
        </div>
    );
}
