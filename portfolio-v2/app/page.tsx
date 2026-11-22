import ClipboardButton from "./ui/ClipboardButton";
import SocialLink from "./ui/SocialLink";
import SkillPill from "./ui/SkillPill";

import InstagramIcon from "../public/InstagramIcon.svg";
import GithubIcon from "../public/githubIcon.svg";

const technologies = [
    "React",
    "Wordpress",
    "Javascript",
    "Figma",
    "Photoshop",
    "Unity",
    "Unreal Engine",
    "Blender",
    "Premiere pro",
    "Tailwind",
    "Nextjs",
    "Firebase",
];

export default function About() {
    return (
        <div className="grid grid-cols-3 gap-5 bg-white border border-outline h-screen drop-shadow-lg rounded-t-4xl mx-10 mt-5">

            <div className="p-18 gap-6">
                <div className="mb-5">
                    <h1 className="text-4xl mb-4">Akseli Rajahalme</h1>
                    <p>Helsinki based programmer & designer who emphasizes user experience in their work. </p>
                    <p>Currently working as a web developer & the head of marketing in AR Isännöinti Oy.</p>
                </div>
                <div className="mb-5">
                    <div className="flex flex-row gap-4 mb-1">
                        <p className="font-bold">akseli.rajahalme@gmail.com</p>
                        <ClipboardButton textToCopy="akseli.rajahalme@gmail.com" />
                    </div>
                    <div className="flex flex-row gap-4">
                        <p className="font-bold">+358 044 993 7101</p>
                        <ClipboardButton textToCopy="+358 044 993 7101" />
                    </div>
                </div>
                <div className="flex flex-row gap-4">
                    <SocialLink
                        icon={InstagramIcon}
                        linkText="Instagram"
                        link="https://www.instagram.com/askeli.png"
                    />
                    <SocialLink
                        icon={GithubIcon}
                        linkText="Github"
                        link="https://github.com/AkseliRaj"
                    />
                </div>
            </div>

            <div className="p-18">
                <h1 className="text-4xl mb-5">Technologies</h1>
                <div className="flex flex-wrap gap-3">
                    {technologies.map((technology) => (
                        <SkillPill key={technology} skillName={technology} />
                    ))}
                </div>
            </div>

            <div className="p-18 text-end">
                <h1 className="text-4xl mb-4">Experience & Studies</h1>
            </div>
        </div>
    )
}