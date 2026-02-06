import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { Calendar, Utensils, Tag, BookOpen, LogOut, Menu, Users } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    reservations: 0,
    menuItems: 0,
    discounts: 0,
    blogPosts: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [reservations, menu, discounts, blog] = await Promise.all([
          apiClient.getReservations(),
          apiClient.getMenu(),
          apiClient.getDiscountCodes(),
          apiClient.getBlogPostsAdmin(),
        ]);
        setStats({
          reservations: Array.isArray(reservations) ? reservations.length : 0,
          menuItems: Array.isArray(menu) ? menu.length : 0,
          discounts: Array.isArray(discounts) ? discounts.length : 0,
          blogPosts: Array.isArray(blog) ? blog.length : 0,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };
    fetchStats();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const cards = [
    {
      title: 'Reservations',
      count: stats.reservations,
      icon: Calendar,
      color: 'bg-blue-500/20 text-blue-400',
      route: '/admin/reservations',
    },
    {
      title: 'Menu Items',
      count: stats.menuItems,
      icon: Utensils,
      color: 'bg-orange-500/20 text-orange-400',
      route: '/admin/menu',
    },
    {
      title: 'Discount Codes',
      count: stats.discounts,
      icon: Tag,
      color: 'bg-green-500/20 text-green-400',
      route: '/admin/discounts',
    },
    {
      title: 'Blog Posts',
      count: stats.blogPosts,
      icon: BookOpen,
      color: 'bg-purple-500/20 text-purple-400',
      route: '/admin/blog',
    },
  ];

  return (
    <div className="min-h-screen bg-charcoal-dark">
      {/* Header */}
      <div className="bg-charcoal border-b border-champagne/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl text-champagne-light">Admin Dashboard</h1>
            <p className="text-champagne/60 text-sm">{user?.email}</p>
          </div>
          <motion.button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-burgundy/30 border border-champagne/20 rounded-lg text-champagne hover:bg-burgundy/50 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(card.route)}
              className="card-imperial cursor-pointer hover:border-champagne/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${card.color} flex items-center justify-center`}>
                  <card.icon className="w-6 h-6" />
                </div>
                <span className="text-3xl font-heading text-champagne-light">{card.count}</span>
              </div>
              <h3 className="text-champagne/70 text-sm">{card.title}</h3>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 card-imperial">
          <h2 className="text-champagne-light font-heading text-xl mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <motion.button
              onClick={() => navigate('/admin/reservations')}
              className="flex items-center gap-3 p-4 bg-charcoal-dark border border-champagne/20 rounded-lg hover:border-champagne/50 transition-colors text-left"
              whileHover={{ scale: 1.02 }}
            >
              <Users className="w-5 h-5 text-champagne" />
              <div>
                <p className="text-champagne-light font-medium">Manage Reservations</p>
                <p className="text-champagne/50 text-sm">View and update table bookings</p>
              </div>
            </motion.button>
            <motion.button
              onClick={() => navigate('/admin/menu')}
              className="flex items-center gap-3 p-4 bg-charcoal-dark border border-champagne/20 rounded-lg hover:border-champagne/50 transition-colors text-left"
              whileHover={{ scale: 1.02 }}
            >
              <Menu className="w-5 h-5 text-champagne" />
              <div>
                <p className="text-champagne-light font-medium">Manage Menu</p>
                <p className="text-champagne/50 text-sm">Add, edit, or remove dishes</p>
              </div>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
