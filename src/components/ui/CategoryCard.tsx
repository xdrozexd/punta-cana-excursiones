import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface CategoryCardProps {
  icon: React.ReactElement;
  title: string;
  to: string;
  delay: number;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ icon, title, to, delay }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, delay }
    },
  };

  return (
    <motion.div variants={cardVariants}>
      <Link 
        to={to}
        className="group block text-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transform transition-all duration-300 ease-in-out border border-gray-100"
      >
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-caribbean-100 text-caribbean-600 mb-4 group-hover:bg-caribbean-500 group-hover:text-white transition-colors duration-300">
          {React.cloneElement(icon, { className: 'h-8 w-8' })}
        </div>
        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-caribbean-600 transition-colors duration-300">
          {title}
        </h3>
      </Link>
    </motion.div>
  );
};
