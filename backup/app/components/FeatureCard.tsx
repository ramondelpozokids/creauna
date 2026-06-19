'use client';

import { motion } from 'framer-motion';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

export default function FeatureCard({ icon, title, description, delay = 0 }: FeatureCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.05 }}
      viewport={{ once: true }}
      className="group p-6 rounded-3xl border bg-white hover:shadow-lg hover:border-gray-300 transition-all duration-300"
    >
      <div className="w-12 h-12 flex items-center justify-center bg-blue-100 text-blue-600 rounded-2xl mb-5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
        {icon}
      </div>
      <h3 className="font-semibold text-xl mb-2">{title}</h3>
      <p className="text-gray-600 leading-relaxed text-[15px]">{description}</p>
    </motion.div>
  );
}
