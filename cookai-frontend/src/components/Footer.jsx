import React from 'react'
import { Link } from 'react-router-dom'
import { ChefHat, Mail, MapPin, Sparkles } from 'lucide-react'

const footerSections = [
  {
    title: 'Explore',
    links: [
      { label: 'Home', href: '/' },
      { label: 'Recipes', href: '/recommendations' },
      { label: 'Kitchen Chat', href: '/chat' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Profile', href: '/profile' },
      { label: 'Sign in', href: '/login' },
      { label: 'Create account', href: '/signup' },
    ],
  },
]

const Footer = () => {
  return (
    <footer className="relative mt-10 overflow-hidden border-t border-[color:var(--border-soft)] bg-[rgba(247,239,228,0.72)]">
      <div className="floating-orb bottom-[-6rem] right-[-5rem] h-52 w-52 bg-accent-300/20" />
      <div className="mx-auto grid max-w-[88rem] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.6fr,1fr,1fr] lg:px-8">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--brand)_0%,var(--highlight)_100%)] text-white shadow-glass">
              <ChefHat className="h-6 w-6" />
            </div>
            <div>
              <p className="eyebrow">CookAI</p>
              <p className="font-display text-3xl leading-none">Recipes with warmth, not friction.</p>
            </div>
          </div>

          <p className="max-w-xl text-base leading-8 text-[color:var(--text-secondary)]">
            Discover dishes from the ingredients already in your kitchen, save the ones you love, and cook with an
            assistant that feels more like a thoughtful companion than a tool.
          </p>

          <div className="flex flex-wrap items-center gap-3 text-sm text-[color:var(--text-secondary)]">
            <span className="meta-pill"><MapPin className="h-4 w-4" /> Built for home cooks everywhere</span>
            <span className="meta-pill"><Sparkles className="h-4 w-4" /> Thoughtful AI, grounded in real recipes</span>
          </div>
        </div>

        {footerSections.map((section) => (
          <div key={section.title}>
            <p className="eyebrow mb-4">{section.title}</p>
            <div className="grid gap-3">
              {section.links.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-sm font-medium text-[color:var(--text-secondary)] transition-colors hover:text-[color:var(--brand-deep)]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="soft-divider mx-auto max-w-[88rem]" />

      <div className="mx-auto flex max-w-[88rem] flex-col gap-4 px-4 py-6 text-sm text-[color:var(--text-muted)] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>CookAI is designed to help you cook with confidence, care, and a little more appetite.</p>
        <div className="flex items-center gap-4">
          <a href="mailto:hello@cookai.com" className="transition-colors hover:text-[color:var(--brand-deep)]">
            <Mail className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
