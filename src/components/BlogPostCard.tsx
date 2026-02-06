import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

interface BlogPost {
  id: string;
  title_de: string;
  title_en: string;
  title_cn: string;
  content_de: string;
  content_en: string;
  content_cn: string;
  image?: string | null;
  dishId?: string | null;
  createdAt: string;
}

interface BlogPostCardProps {
  post: BlogPost;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const getTitle = () => {
    return language === 'de' ? post.title_de : language === 'en' ? post.title_en : post.title_cn;
  };

  const getExcerpt = () => {
    const content = language === 'de' ? post.content_de : language === 'en' ? post.content_en : post.content_cn;
    return content.length > 150 ? content.substring(0, 150) + '...' : content;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="card-imperial overflow-hidden cursor-pointer group"
      onClick={() => navigate(`/blog/${post.id}`)}
    >
      {/* Image with watercolor effect overlay */}
      <div className="relative h-48 overflow-hidden">
        <motion.img
          src={post.image || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800'}
          alt={getTitle()}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        />
        {/* Watercolor overlay effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-charcoal/20 to-charcoal/80" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-heading text-xl text-champagne-light mb-1">
            {getTitle()}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center gap-2 text-champagne/50 text-sm mb-3">
          <BookOpen className="w-4 h-4" />
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
        <p className="text-champagne/70 text-sm leading-relaxed mb-4">
          {getExcerpt()}
        </p>
        <div className="text-champagne/50 text-sm group-hover:text-champagne transition-colors">
          Read more →
        </div>
      </div>
    </motion.div>
  );
};

export default BlogPostCard;
