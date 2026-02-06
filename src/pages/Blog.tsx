import Header from '@/components/Header';
import CulturalBlog from '@/components/CulturalBlog';
import ContactSection from '@/components/ContactSection';

const Blog = () => {
  return (
    <div className="min-h-screen bg-charcoal-dark">
      <Header />
      <main>
        <CulturalBlog />
      </main>
      <ContactSection />
    </div>
  );
};

export default Blog;
