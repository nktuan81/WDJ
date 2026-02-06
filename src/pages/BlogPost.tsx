import Header from '@/components/Header';
import BlogPostDetail from '@/components/BlogPostDetail';

const BlogPost = () => {
  return (
    <div className="min-h-screen bg-charcoal-dark">
      <Header />
      <main>
        <BlogPostDetail />
      </main>
    </div>
  );
};

export default BlogPost;
