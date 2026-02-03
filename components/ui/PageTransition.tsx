'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface PageTransitionProps {
    children: React.ReactNode;
    className?: string;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children, className = "" }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                duration: 0.5
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default PageTransition;
