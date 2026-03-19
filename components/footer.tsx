"use client"

import Link from "next/link"
import { useState } from "react"
import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const footerLinks = {
  shop: [
    { label: "New Arrivals", href: "#" },
    { label: "Best Sellers", href: "#" },
    { label: "Electronics", href: "#" },
    { label: "Accessories", href: "#" },
    { label: "Sale", href: "#" },
  ],
  support: [
    { label: "Contact Us", href: "#" },
    { label: "FAQs", href: "#" },
    { label: "Shipping Info", href: "#" },
    { label: "Returns", href: "#" },
    { label: "Track Order", href: "#" },
  ],
  company: [
    { label: "About Us", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Press", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Affiliate Program", href: "#" },
  ],
  legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Refund Policy", href: "#" },
  ],
}

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Youtube, href: "#", label: "YouTube" },
]

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pb-20 md:pb-0">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-10 md:py-16">
        {/* Mobile: Accordion style */}
        <div className="md:hidden space-y-4">
          {/* Brand Section */}
          <div className="pb-6 border-b border-primary-foreground/10">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary-foreground rounded-full flex items-center justify-center">
                <span className="text-primary font-serif text-lg font-black">A</span>
              </div>
              <span className="font-serif text-2xl font-black italic tracking-tighter">Arey Beta</span>
            </Link>
            <p className="text-primary-foreground/70 text-sm mb-4">
              Your one-stop destination for premium lifestyle products at unbeatable prices.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors duration-300"
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Accordion Links */}
          <AccordionSection title="Shop" links={footerLinks.shop} />
          <AccordionSection title="Support" links={footerLinks.support} />
          <AccordionSection title="Company" links={footerLinks.company} />

          {/* Contact Info */}
          <div className="pt-4 border-t border-primary-foreground/10">
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3 text-sm text-primary-foreground/70">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span>Mumbai, Maharashtra, India</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>+91 77095 63712 (Harsh Redasni)</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>contact@areybeta.in</span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="pt-4">
            <h4 className="text-sm font-semibold mb-3">We Accept</h4>
            <div className="flex flex-wrap gap-2">
              {["Visa", "MC", "UPI", "COD"].map((method) => (
                <div 
                  key={method}
                  className="bg-primary-foreground/10 rounded px-3 py-1.5 text-xs font-medium"
                >
                  {method}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop: Grid layout */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-primary-foreground rounded-full flex items-center justify-center transition-transform duration-300 hover:rotate-12">
                <span className="text-primary font-serif text-lg font-black">A</span>
              </div>
              <span className="font-serif text-2xl font-black italic tracking-tighter">Arey Beta</span>
            </Link>
            <p className="text-primary-foreground/70 mb-6 max-w-xs leading-relaxed">
              Your one-stop destination for premium lifestyle products at unbeatable prices. Curated for the modern India.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-4 text-sm text-primary-foreground/70">
              <div className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-full bg-primary-foreground/5 flex items-center justify-center group-hover:bg-primary-foreground/10 transition-colors">
                  <MapPin className="h-4 w-4" />
                </div>
                <span>Mumbai, Maharashtra, India</span>
              </div>
              <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.open('tel:+917709563712')}>
                <div className="w-8 h-8 rounded-full bg-primary-foreground/5 flex items-center justify-center group-hover:bg-primary-foreground/10 transition-colors">
                  <Phone className="h-4 w-4" />
                </div>
                <span className="group-hover:text-primary-foreground transition-colors">+91 77095 63712 (Harsh Redasni)</span>
              </div>
              <div className="flex items-center gap-3 group underline-offset-4 hover:underline cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-primary-foreground/5 flex items-center justify-center group-hover:bg-primary-foreground/10 transition-colors">
                  <Mail className="h-4 w-4" />
                </div>
                <span className="group-hover:text-primary-foreground transition-colors">contact@areybeta.in</span>
              </div>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-semibold mb-4">Shop</h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href} 
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href} 
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href} 
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Social */}
          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <div className="flex gap-3 mb-6">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors duration-300"
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                )
              })}
            </div>
            
            {/* Payment Methods */}
            <h4 className="text-sm font-semibold mb-3">We Accept</h4>
            <div className="flex flex-wrap gap-2">
              {["Visa", "MC", "UPI", "COD"].map((method) => (
                <div 
                  key={method}
                  className="bg-primary-foreground/10 rounded px-3 py-1 text-xs font-medium"
                >
                  {method}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <p className="text-xs md:text-sm text-primary-foreground/60 font-medium">
              © 2026 Arey Beta. Designed for India.
            </p>
            <div className="flex items-center gap-4 md:gap-6 flex-wrap justify-center">
              {footerLinks.legal.map((link) => (
                <Link 
                  key={link.label}
                  href={link.href} 
                  className="text-xs md:text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

function AccordionSection({ title, links }: { title: string, links: { label: string, href: string }[] }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-primary-foreground/10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4"
      >
        <h3 className="font-semibold">{title}</h3>
        <ChevronDown className={cn(
          "h-5 w-5 transition-transform duration-300",
          isOpen && "rotate-180"
        )} />
      </button>
      <div className={cn(
        "overflow-hidden transition-all duration-300",
        isOpen ? "max-h-48 pb-4" : "max-h-0"
      )}>
        <ul className="space-y-3">
          {links.map((link) => (
            <li key={link.label}>
              <Link 
                href={link.href} 
                className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors duration-300"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
