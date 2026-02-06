import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { apiClient } from '@/lib/api';
import { ArrowLeft, BookOpen } from 'lucide-react';

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

const BlogPostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await apiClient.getBlogPost(id) as BlogPost;
        setPost(data);
      } catch (error) {
        console.error('Failed to fetch blog post:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-charcoal-dark flex items-center justify-center">
        <div className="text-center text-champagne/60">
          <BookOpen className="w-12 h-12 mx-auto mb-4 animate-pulse" />
          <p>Loading story...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-charcoal-dark flex items-center justify-center">
        <div className="text-center text-champagne/60">
          <p>Story not found</p>
          <button
            onClick={() => navigate('/blog')}
            className="mt-4 px-4 py-2 bg-burgundy/30 border border-champagne/20 rounded-lg text-champagne hover:bg-burgundy/50 transition-colors"
          >
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  const getTitle = () => {
    return language === 'de' ? post.title_de : language === 'en' ? post.title_en : post.title_cn;
  };

  const getContent = () => {
    return language === 'de' ? post.content_de : language === 'en' ? post.content_en : post.content_cn;
  };

  // Split content into paragraphs for graphic novel style
  const paragraphs = getContent().split('\n\n').filter(p => p.trim());

  return (
    <div className="min-h-screen bg-charcoal-dark">
      {/* Hero Image */}
      <div className="relative h-96 overflow-hidden">
        <motion.img
          src={post.image || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200'}
          alt={getTitle()}
          className="w-full h-full object-cover"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8 }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-charcoal/40 to-charcoal-dark" />
        
        {/* Back Button */}
        <motion.button
          onClick={() => navigate('/blog')}
          className="absolute top-6 left-6 w-12 h-12 bg-charcoal/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-champagne/20 hover:bg-charcoal transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeft className="w-5 h-5 text-champagne" />
        </motion.button>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-heading text-4xl md:text-5xl text-champagne-light mb-2"
          >
            {getTitle()}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-champagne/60 text-sm"
          >
            {new Date(post.createdAt).toLocaleDateString()}
          </motion.div>
        </div>
      </div>

      {/* Content - Graphic Novel Style */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="space-y-8">
          {paragraphs.map((paragraph, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Watercolor-style decoration */}
              <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-champagne/20 via-champagne/10 to-transparent" />
              
              <div className="pl-8">
                <p className="text-champagne/80 text-lg leading-relaxed mb-4">
                  {paragraph}
                </p>
              </div>

              {/* Decorative element between paragraphs */}
              {index < paragraphs.length - 1 && (
                <div className="flex items-center gap-4 my-8">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-champagne/20 to-transparent" />
                  <div className="w-2 h-2 rounded-full bg-champagne/30" />
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-champagne/20 to-transparent" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Back to Blog Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <motion.button
            onClick={() => navigate('/blog')}
            className="px-6 py-3 bg-burgundy/30 border border-champagne/20 rounded-lg text-champagne hover:bg-burgundy/50 transition-colors flex items-center gap-2 mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Stories
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default BlogPostDetail;
