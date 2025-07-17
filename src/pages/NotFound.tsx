import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <motion.img
        src="/assets/404-illustration.svg"
        alt="Not Found"
        initial={{ x: '100vw' }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 80 }}
        className="w-96 h-auto mb-8"
      />

      <motion.h1
        className="text-5xl font-extrabold mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        404 — Page Not Found
      </motion.h1>

      <motion.p
        className="mb-8 text-center text-gray-400 max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Oops! We can’t seem to find the page you’re looking for. It might have been moved or deleted.
      </motion.p>

      <Button
        asChild
        className="bg-pink-500 hover:bg-pink-600"
      >
        <Link to="/">Go Home</Link>
      </Button>
    </div>
  );
}
