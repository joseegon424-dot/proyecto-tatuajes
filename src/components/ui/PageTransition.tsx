'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

const perspective: any = {
    initial: {
        opacity: 0,
        y: 50,
        scale: 0.98,
        filter: 'blur(5px)',
    },
    enter: {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        transition: {
            duration: 1.2,
            ease: [0.76, 0, 0.24, 1], // Custom custom bezier for cinematic effect
        }
    },
    exit: {
        opacity: 0,
        y: -50,
        scale: 0.95,
        filter: 'blur(10px)',
        transition: {
            duration: 0.8,
            ease: [0.76, 0, 0.24, 1]
        }
    }
};

export default function PageTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="inner">
            <motion.div
                key={pathname}
                initial="initial"
                animate="enter"
                exit="exit"
                variants={perspective}
                className="min-h-screen pt-24" // padding to account for fixed navbar
            >
                {children}
            </motion.div>
        </div>
    );
}
