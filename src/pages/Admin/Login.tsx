import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Lock, Mail } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Login successful!');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error('Login failed', {
        description: error instanceof Error ? error.message : 'Invalid credentials',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal-dark flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="card-imperial p-8">
          <div className="text-center mb-8">
            <h1 className="font-heading text-3xl text-champagne-light mb-2">
              味道佳 Admin
            </h1>
            <p className="text-champagne/60">Weidaojia Restaurant Management</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-champagne/70 text-sm mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-champagne/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-charcoal-dark border border-champagne/20 rounded-lg py-3 pl-11 pr-4 text-champagne-light placeholder:text-champagne/30 focus:outline-none focus:border-champagne/50 transition-colors"
                  placeholder="admin@weidaojia.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-champagne/70 text-sm mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-champagne/40" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-charcoal-dark border border-champagne/20 rounded-lg py-3 pl-11 pr-4 text-champagne-light placeholder:text-champagne/30 focus:outline-none focus:border-champagne/50 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full btn-imperial rounded-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.99 }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </motion.button>
          </form>

          <p className="text-champagne/40 text-xs text-center mt-6">
            Default: admin@weidaojia.com / admin123
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
