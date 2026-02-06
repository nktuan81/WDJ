import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { apiClient } from '@/lib/api';
import BlogPostCard from './BlogPostCard';
import { BookOpen, Filter } from 'lucide-react';

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

const CulturalBlog: React.FC = () => {
  const { t, language } = useLanguage();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDishId, setSelectedDishId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getBlogPosts(selectedDishId || undefined) as BlogPost[];
        setPosts(data);
      } catch (error) {
        console.error('Failed to fetch blog posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [selectedDishId]);

  return (
    <section id="blog" className="section-imperial py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-chinese text-2xl text-champagne/60 mb-2 block">故事背后</span>
          <h2 className="font-heading text-4xl md:text-5xl text-champagne-light mb-4">
            {language === 'de' ? 'Geschichten hinter dem Samtvorhang' : 
             language === 'en' ? 'Stories Behind the Velvet Curtain' : 
             '故事背后的故事'}
          </h2>
          <p className="text-champagne/70 text-lg max-w-2xl mx-auto">
            {language === 'de' ? 'Jedes Gericht erzählt eine Geschichte. Entdecken Sie die kulturellen Wurzeln und Legenden hinter unseren Spezialitäten.' :
             language === 'en' ? 'Every dish tells a story. Discover the cultural roots and legends behind our specialties.' :
             '每道菜都讲述一个故事。探索我们特色菜背后的文化根源和传说。'}
          </p>
          <div className="divider-imperial max-w-md mx-auto mt-6" />
        </motion.div>

        {/* Filter (if needed in future) */}
        {selectedDishId && (
          <div className="flex justify-center mb-8">
            <motion.button
              onClick={() => setSelectedDishId(null)}
              className="flex items-center gap-2 px-4 py-2 bg-charcoal/50 border border-champagne/20 rounded-lg text-champagne/70 hover:text-champagne hover:border-champagne/50 transition-colors text-sm"
            >
              <Filter className="w-4 h-4" />
              Clear filter
            </motion.button>
          </div>
        )}

        {/* Blog Posts Grid */}
        {loading ? (
          <div className="text-center text-champagne/60 py-12">
            <BookOpen className="w-12 h-12 mx-auto mb-4 animate-pulse" />
            Loading stories...
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center text-champagne/60 py-12">
            <BookOpen className="w-12 h-12 mx-auto mb-4" />
            <p>No stories available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <BlogPostCard post={post} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CulturalBlog;
