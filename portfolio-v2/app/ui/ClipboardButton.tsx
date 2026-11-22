'use-client'
import Image from "next/image"
import clipboardIcon from "../../public/copyIcon.svg"

export default function ClipboardButton({ textToCopy }: { textToCopy: string }) {

    return (
        <button className="transition hover:scale-105 active:scale-95" aria-label={`Copy ${textToCopy}`}>
            <Image className="size-4" src={clipboardIcon} alt="" />
        </button>
    )
}