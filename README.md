# Arey Beta: Premium Lifestyle E-Commerce Platform

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Shadcn UI](https://img.shields.io/badge/Shadcn_UI-Latest-black?style=for-the-badge&logo=shadcnui)

**Arey Beta** is a high-performance, modern e-commerce platform built for the Indian market. It features a curated selection of premium lifestyle products, gadgets, and fashion accessories (₹300 - ₹1000 range) with a focus on speed, accessibility, and a seamless mobile shopping experience.

---

## ✨ Key Features

### 🛍️ Shopping Experience
- **Dynamic Product Catalog**: 6+ categories including Electronics, Watches, Bags, Accessories, Eyewear, and Home.
- **Smart Product Discovery**: Instant search dropdown and category-based browsing with intuitive icons.
- **Premium Product Cards**: Detailed product info including ratings, review counts, and dynamic "New" or "Trending" badges.
- **Interactive Galleries**: Smooth product image carousels powered by Embla Carousel.

### 🛒 Cart & Checkout
- **Real-time Cart Management**: Powered by SWR for instant UI updates, quantity adjustments, and subtotal calculations.
- **Mobile-Optimized Drawer**: A slide-out cart drawer for easy access on any device.
- **Promotional System**: Advanced discount engine supporting multiple coupon codes (e.g., `FIRST100`, `SAVE10`, `FLAT50`, `MEGA20`).
- **Shipping Thresholds**: Dynamic "Free Shipping" tracker (for orders over ₹499).

### 🔐 User & Security
- **Unified Auth Page**: Seamless toggle between Login and Signup modes with Zod-based form validation.
- **Member Benefits**: Tiered rewards and exclusive discounts displayed clearly to registered users.
- **Newsletter Subscription**: Integrated newsletter signup for marketing and customer retention.

### 🎨 Design & UX
- **Responsive First**: Pixel-perfect design from mobile to desktop.
- **Theme Support**: Native Dark/Light mode support with `next-themes`.
- **Modern UI Components**: Built on top of Shadcn UI for accessible, high-quality interface elements.
- **Rich Feedback**: Integrated toast notifications (`sonner`) for all user actions.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/)
- **Programming Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) (Radix UI)
- **State Management**: [SWR](https://swr.vercel.app/) & React Hooks
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animation/Carousels**: [Embla Carousel](https://www.embla-carousel.com/)

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [pnpm](https://pnpm.io/) (recommended)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/arey-beta.git
   cd arey-beta
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Run the development server:
   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Project Structure

```text
/app              # Next.js App Router (pages/layouts)
/components       # Reusable React components
  /ui             # Low-level Shadcn UI primitives
/hooks            # Custom React hooks (use-mobile, use-toast)
/lib              # Core logic & state (cart-store, search-store, utils)
/public           # Static assets (images, icons)
/styles           # Global CSS and Tailwind configurations
```

---

## 📈 Roadmap

- [ ] Global State Persistence (Local Storage for Cart)
- [ ] Payment Gateway Integration (Razorpay/Stripe)
- [ ] User Dashboard & Order History
- [ ] Multi-currency support
- [ ] Admin Dashboard for Inventory Management

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

Developed with ❤️ by [Darshan Purohit](https://github.com/darshanpurohit20), [Harsh Redasni](https://github.com/redasaniharsh), and [Chandan Singh](https://github.com/chandan22468)


