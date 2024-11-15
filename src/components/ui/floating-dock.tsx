"use client"

import { cn } from "@/lib/utils"
import { IconLayoutNavbarCollapse } from "@tabler/icons-react"
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion"
import Link from "next/link"
import { useRef, useState } from "react"

export const FloatingDock = ({
  items,
  desktopClassName,
  mobileClassName,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[]
  desktopClassName?: string
  mobileClassName?: string
}) => {
  return (
    <>
      <FloatingDockDesktop items={items} className={desktopClassName} />
      <FloatingDockMobile items={items} className={mobileClassName} />
    </>
  )
}

const FloatingDockMobile = ({
  items,
  className,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[]
  className?: string
}) => {
  const [open, setOpen] = useState(false)
  return (
    <div className={cn("relative block md:hidden", className)}>
      <AnimatePresence>
        {open && (
          <motion.div
            layoutId="nav"
            className="absolute right-full mr-4 inset-y-0 flex flex-col gap-3"
          >
            {items.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: 20 }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: 20,
                  transition: {
                    delay: idx * 0.05,
                  },
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30, delay: (items.length - 1 - idx) * 0.05 }}
              >
                <Link
                  href={item.href}
                  key={item.title}
                  className="h-12 w-12 rounded-xl bg-neutral-800 flex items-center justify-center transition-all hover:bg-neutral-700 hover:scale-110"
                >
                  <div className="h-5 w-5 text-neutral-200">{item.icon}</div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen(!open)}
        className="h-12 w-12 rounded-xl bg-neutral-800 flex items-center justify-center transition-all hover:bg-neutral-700"
      >
        <IconLayoutNavbarCollapse className="h-6 w-6 text-neutral-200" />
      </button>
    </div>
  )
}

const FloatingDockDesktop = ({
  items,
  className,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
  className?: string;
}) => {
  const mouseY = useMotionValue(Infinity);
  return (
    <motion.div
      onMouseMove={(e) => mouseY.set(e.pageY)}
      onMouseLeave={() => mouseY.set(Infinity)}
      className={cn(
        "my-auto hidden md:flex w-20 flex-col gap-6 items-center rounded-3xl bg-neutral-900/80 backdrop-blur-md py-6 px-4",
        className
      )}
    >
      {items.map((item) => (
        <IconContainer mouseY={mouseY} key={item.title} {...item} />
      ))}
    </motion.div>
  );
};

function IconContainer({
  mouseY,
  title,
  icon,
  href,
}: {
  mouseY: MotionValue
  title: string
  icon: React.ReactNode
  href: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  const distance = useTransform(mouseY, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { y: 0, height: 0 }
    return val - bounds.y - bounds.height / 2
  })

  const widthTransform = useTransform(distance, [-100, 0, 100], [48, 64, 48])
  const heightTransform = useTransform(distance, [-100, 0, 100], [48, 64, 48])

  const widthTransformIcon = useTransform(distance, [-100, 0, 100], [24, 32, 24])
  const heightTransformIcon = useTransform(distance, [-100, 0, 100], [24, 32, 24])

  const width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 300,
    damping: 20,
  })
  const height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 300,
    damping: 20,
  })

  const widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 300,
    damping: 20,
  })
  const heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 300,
    damping: 20,
  })

  const [hovered, setHovered] = useState(false)

  return (
    <Link href={href}>
      <motion.div
        ref={ref}
        style={{ width, height }}
        whileHover={{ x: 5 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="aspect-square rounded-xl bg-neutral-800 flex items-center justify-center relative transition-colors hover:bg-neutral-700"
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, x: 10, y: "-50%" }}
              animate={{ opacity: 1, x: 0, y: "-50%" }}
              exit={{ opacity: 0, x: 5, y: "-50%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="px-3 py-1.5 whitespace-pre rounded-md bg-neutral-700 text-neutral-100 absolute top-1/2 -translate-y-1/2 -right-28 w-fit text-sm font-medium"
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          style={{ width: widthIcon, height: heightIcon }}
          className="flex items-center justify-center text-neutral-200"
        >
          {icon}
        </motion.div>
      </motion.div>
    </Link>
  )
}
