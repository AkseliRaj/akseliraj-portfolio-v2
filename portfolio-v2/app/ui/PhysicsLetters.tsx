'use client'
import { useEffect, useRef } from "react"
import Image from "next/image"
import Matter from "matter-js"

const LETTER_IMAGES: Record<string, string> = {
    A: "/letters/Pixel.png",
    E: "/letters/Letter-E.png",
    H: "/letters/Letter-H.png",
    I: "/letters/Letter-I.png",
    J: "/letters/Letter-J.png",
    K: "/letters/letter-K.png",
    L: "/letters/Letter-L.png",
    M: "/letters/Letter-M.png",
    R: "/letters/Letter-R.png",
    S: "/letters/Letter-S.png",
}

const NAME = "Akseli Rajahalme"
const WORDS = NAME.toUpperCase().split(" ")
const LETTERS = WORDS.join("").split("")

const MAX_SIZE = 140
const MIN_SIZE = 72
const WALL = 200
const MAX_SPEED = 40

// Lives at module level so letter positions survive client-side page navigation
let savedState: { x: number; y: number; angle: number }[] | null = null

export default function PhysicsLetters() {
    const containerRef = useRef<HTMLDivElement>(null)
    const letterRefs = useRef<(HTMLDivElement | null)[]>([])

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const { Engine, Runner, Bodies, Body, Composite, Constraint, Sleeping, Events } = Matter

        // Only start once the container has a real size. During page navigation it can
        // briefly measure 0x0, which would squash every letter into the top-left corner.
        const hasSize = () => container.clientWidth > 0 && container.clientHeight > 0

        const setup = () => {
            const engine = Engine.create({ enableSleeping: true })
            engine.gravity.y = 1.2

            let width = container.clientWidth
            let height = container.clientHeight

            const size = Math.max(MIN_SIZE, Math.min(MAX_SIZE, width / 10))
            const radius = size / 2

            // Walls (thick so fast drags can't tunnel through)
            const makeWalls = () => [
                Bodies.rectangle(width / 2, height + WALL / 2, width + WALL * 2, WALL, { isStatic: true }),
                Bodies.rectangle(width / 2, -WALL / 2, width + WALL * 2, WALL, { isStatic: true }),
                Bodies.rectangle(-WALL / 2, height / 2, WALL, height + WALL * 2, { isStatic: true }),
                Bodies.rectangle(width + WALL / 2, height / 2, WALL, height + WALL * 2, { isStatic: true }),
            ]
            let walls = makeWalls()
            Composite.add(engine.world, walls)

            // Lay the letters out so they spell the name (wrapping whole words onto new rows
            // when they don't fit), resting on the bottom of the container. The last row sits on the floor
            const maxPerRow = Math.max(1, Math.floor(width / size))
            const rows: string[][] = [[]]
            WORDS.forEach((word) => {
                const row = rows[rows.length - 1]
                const needed = (row.length ? row.length + 1 : 0) + word.length
                if (row.length && needed > maxPerRow) rows.push([word])
                else row.push(word)
            })

            const positions: { x: number; y: number }[] = []
            rows.forEach((row, rowIndex) => {
                const slots = row.join(" ").length
                const startX = Math.max(radius, (width - slots * size) / 2 + radius)
                let slot = 0
                row.forEach((word, wordIndex) => {
                    if (wordIndex > 0) slot++
                    for (let i = 0; i < word.length; i++) {
                        positions.push({
                            x: Math.min(width - radius, startX + slot * size),
                            y: height - radius - (rows.length - 1 - rowIndex) * size,
                        })
                        slot++
                    }
                })
            })

            const clampX = (x: number) => Math.min(Math.max(x, radius), width - radius)
            const clampY = (y: number) => Math.min(Math.max(y, radius), height - radius)

            // Restore where the letters were left last time, otherwise drop them in fresh
            const restored = savedState?.length === LETTERS.length ? savedState : null
            const bodies = positions.map(({ x, y }, i) => {
                const saved = restored?.[i]
                return Bodies.circle(
                    saved ? clampX(saved.x) : x,
                    saved ? clampY(saved.y) : y,
                    radius,
                    {
                        restitution: 0.4,
                        friction: 0.1,
                        frictionAir: 0.01,
                        density: 0.002,
                        angle: saved ? saved.angle : (Math.random() - 0.5) * 0.6,
                    }
                )
            })
            Composite.add(engine.world, bodies)

            // Dragging with pointer events
            let drag: { constraint: Matter.Constraint; pointerId: number } | null = null

            const toLocal = (e: PointerEvent) => {
                const rect = container.getBoundingClientRect()
                // Clamp so the drag never pulls a letter towards a point outside the container
                return {
                    x: Math.min(Math.max(e.clientX - rect.left, 0), width),
                    y: Math.min(Math.max(e.clientY - rect.top, 0), height),
                }
            }

            const cleanups: (() => void)[] = []

            letterRefs.current.forEach((el, i) => {
                if (!el) return
                const body = bodies[i]

                const onDown = (e: PointerEvent) => {
                    if (drag) return
                    e.preventDefault()
                    el.setPointerCapture(e.pointerId)
                    const point = toLocal(e)
                    Sleeping.set(body, false)
                    const constraint = Constraint.create({
                        pointA: point,
                        bodyB: body,
                        pointB: { x: point.x - body.position.x, y: point.y - body.position.y },
                        stiffness: 0.2,
                        damping: 0.1,
                        length: 0,
                    })
                    Composite.add(engine.world, constraint)
                    drag = { constraint, pointerId: e.pointerId }
                    el.style.cursor = "grabbing"
                }

                const onMove = (e: PointerEvent) => {
                    if (!drag || drag.pointerId !== e.pointerId) return
                    const point = toLocal(e)
                    drag.constraint.pointA = point
                    Sleeping.set(body, false)
                }

                const onUp = (e: PointerEvent) => {
                    if (!drag || drag.pointerId !== e.pointerId) return
                    Composite.remove(engine.world, drag.constraint)
                    drag = null
                    el.style.cursor = ""
                }

                el.addEventListener("pointerdown", onDown)
                el.addEventListener("pointermove", onMove)
                el.addEventListener("pointerup", onUp)
                el.addEventListener("pointercancel", onUp)
                cleanups.push(() => {
                    el.removeEventListener("pointerdown", onDown)
                    el.removeEventListener("pointermove", onMove)
                    el.removeEventListener("pointerup", onUp)
                    el.removeEventListener("pointercancel", onUp)
                })
            })

            // Sync DOM elements with the physics bodies
            const render = () => {
                bodies.forEach((body, i) => {
                    const el = letterRefs.current[i]
                    if (!el) return
                    el.style.width = `${size}px`
                    el.style.height = `${size}px`
                    el.style.transform =
                        `translate(${body.position.x - radius}px, ${body.position.y - radius}px) rotate(${body.angle}rad)`
                    el.style.opacity = "1"
                })
            }
            // Safety net: cap speed (prevents tunnelling through walls) and pull back any letter
            // that still ends up outside the container
            const keepInBounds = () => {
                bodies.forEach((body) => {
                    if (body.speed > MAX_SPEED) {
                        const scale = MAX_SPEED / body.speed
                        Body.setVelocity(body, { x: body.velocity.x * scale, y: body.velocity.y * scale })
                    }
                    const { x, y } = body.position
                    const cx = clampX(x)
                    const cy = clampY(y)
                    if (cx !== x || cy !== y) {
                        Body.setPosition(body, { x: cx, y: cy })
                        Body.setVelocity(body, {
                            x: cx !== x ? 0 : body.velocity.x,
                            y: cy !== y ? 0 : body.velocity.y,
                        })
                    }
                })
            }

            render()
            Events.on(engine, "afterUpdate", keepInBounds)
            Events.on(engine, "afterUpdate", render)

            // Keep walls in sync with the container size
            const resizeObserver = new ResizeObserver(() => {
                // Ignore the container being hidden (e.g. while navigating away)
                if (!hasSize()) return
                width = container.clientWidth
                height = container.clientHeight
                Composite.remove(engine.world, walls)
                walls = makeWalls()
                Composite.add(engine.world, walls)
                bodies.forEach((body) => {
                    const x = clampX(body.position.x)
                    const y = clampY(body.position.y)
                    if (x !== body.position.x || y !== body.position.y) {
                        Body.setPosition(body, { x, y })
                        Sleeping.set(body, false)
                    }
                })
            })
            resizeObserver.observe(container)

            const runner = Runner.create()
            Runner.run(runner, engine)

            return () => {
                savedState = bodies.map((body) => ({ x: body.position.x, y: body.position.y, angle: body.angle }))
                cleanups.forEach((fn) => fn())
                resizeObserver.disconnect()
                Runner.stop(runner)
                Events.off(engine, "afterUpdate", keepInBounds)
                Events.off(engine, "afterUpdate", render)
                Composite.clear(engine.world, false)
                Engine.clear(engine)
            }
        }

        let teardown: (() => void) | null = null
        const waitForSize = new ResizeObserver(() => {
            if (teardown || !hasSize()) return
            waitForSize.disconnect()
            teardown = setup()
        })
        if (hasSize()) teardown = setup()
        else waitForSize.observe(container)

        return () => {
            waitForSize.disconnect()
            teardown?.()
        }
    }, [])

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full overflow-hidden select-none pointer-events-none"
            role="img"
            aria-label={`Interactive letters spelling ${NAME}`}
        >
            {LETTERS.map((letter, i) => (
                <div
                    key={i}
                    ref={(el) => { letterRefs.current[i] = el }}
                    className="absolute top-0 left-0 opacity-0 cursor-grab touch-none will-change-transform pointer-events-auto"
                >
                    <Image
                        src={LETTER_IMAGES[letter]}
                        alt=""
                        width={124}
                        height={124}
                        draggable={false}
                        className="w-full h-full pointer-events-none"
                    />
                </div>
            ))}
        </div>
    )
}
