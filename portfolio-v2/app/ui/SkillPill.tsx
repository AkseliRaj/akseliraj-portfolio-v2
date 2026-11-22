export default function SkillPill ({skillName}: {skillName: string} ) {
    return (
        <p className="py-1 px-4 rounded-full bg-gray-300 whitespace-nowrap">{skillName}</p>
    )
}