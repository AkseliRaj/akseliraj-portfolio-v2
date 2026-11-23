import ClipboardButton from "./ui/ClipboardButton";
import SocialLink from "./ui/SocialLink";
import SkillPill from "./ui/SkillPill";
import PhysicsLetters from "./ui/PhysicsLetters";

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
        <div className="relative grid grid-cols-3 grid-rows-[auto_minmax(320px,1fr)] gap-5 bg-white border border-outline min-h-screen drop-shadow-lg rounded-t-4xl mx-10">

            <div className="p-18 flex flex-col gap-5">
                <div>
                    <h1 className="text-4xl mb-4">Akseli Rajahalme</h1>
                    <p>Helsinki based programmer & designer who emphasizes user experience in their work. </p>
                    <p>Currently working as a web developer & the head of marketing in AR Isännöinti Oy.</p>
                </div>
                <div className="flex flex-col gap-1">
                    <div className="flex flex-row gap-4">
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

            <div className="p-18 flex flex-col gap-5">
                <h1 className="text-4xl">Technologies</h1>
                <div className="flex flex-wrap gap-3">
                    {technologies.map((technology) => (
                        <SkillPill key={technology} skillName={technology} />
                    ))}
                </div>
            </div>

            <div className="p-18 text-end flex flex-col gap-4">
                <h1 className="text-4xl">Experience & Studies</h1>
                <div>
                    <p>AR Isännöinti Oy: <span className="font-bold">Web developer, Marketing director</span></p>
                    <p>2023 - Present</p>
                </div>
                <div>
                    <p>Metropolia Ammattikorkeakoulu: <span className="font-bold">Tieto- ja viestintätekniikka, insinööri</span> (Avoin AMK)</p>
                    <p>2026 - Present</p>
                </div>
                <div>
                    <p>Oulu Ammattikorkeakoulu: <span className="font-bold">Tietojenkäsittelyn tradenomi tutkinto</span></p>
                    <p>2022 - 2025</p>
                </div>
            </div>

            {/* Empty row so the letters have room to land below the columns */}
            <div className="col-span-3" />

            {/* Physics layer covers the whole white container; only the letters catch clicks */}
            <div className="absolute inset-0 z-10 rounded-t-4xl overflow-hidden pointer-events-none">
                <PhysicsLetters />
            </div>
        </div>
    )
}