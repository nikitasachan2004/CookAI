import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChefHat, Heart, Github, Twitter, Mail, MapPin } from 'lucide-react'

/**
 * Footer component with links, social media, and branding
 * Features responsive design and smooth animations
 */
const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '/#features' },
        { label: 'Recipes', href: '/recommendations' },
        { label: 'AI Chat', href: '/chat' },
        { label: 'API', href: '/api' },
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Blog', href: '/blog' },
        { label: 'Careers', href: '/careers' },
        { label: 'Contact', href: '/contact' },
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', href: '/help' },
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Cookie Policy', href: '/cookies' },
      ]
    }
  ]

  const socialLinks = [
    { icon: Github, href: 'https://github.com/cookai', label: 'GitHub' },
    { icon: Twitter, href: 'https://twitter.com/cookai', label: 'Twitter' },
    { icon: Mail, href: 'mailto:hello@cookai.com', label: 'Email' },
  ]

  return (
    <footer className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center space-x-2 mb-4">
                <ChefHat className="h-8 w-8 text-primary-500" />
                <span className="text-2xl font-bold gradient-text">CookAI</span>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                Discover perfect recipes with AI-powered recommendations. 
                Cook smarter, eat better, and enjoy every meal with personalized 
                culinary suggestions tailored just for you.
              </p>
              
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <MapPin className="h-4 w-4" />
                <span>Made with {' '}</span>
                <Heart className="h-4 w-4 text-red-500" />
                <span>{' '} for food lovers worldwide</span>
              </div>
            </motion.div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
            >
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 
                               transition-colors duration-200 text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-sm text-gray-500 dark:text-gray-400"
            >
              © {currentYear} CookAI. All rights reserved.
            </motion.p>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center space-x-4"
            >
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 text-gray-400 hover:text-primary-500 transition-colors duration-200 
                             hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                    aria-label={social.label}
                  >
                    <Icon className="h-5 w-5" />
                  </motion.a>
                )
              })}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-secondary-400 to-accent-400 rounded-full blur-3xl" />
      </div>
    </footer>
  )
}

export default Footer