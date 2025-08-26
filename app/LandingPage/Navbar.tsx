"use client";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import * as motion from "motion/react-client";

export default function Navbar() {

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <motion.header
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        duration: 1.5,
      }}
      className="sticky top-0 z-50 w-full border-b border-black bg-[#F2EE21] shadow-lg"
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <motion.div
          initial={{
            x: -500,
            opacity: 0,
            scale: 0.5,
          }}
          animate={{
            x: 0,
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 1.5,
          }}
          className="flex items-center gap-3"
        >
          <motion.img
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 1.5,
            }}
            src="https://i.postimg.cc/y8v9yGRQ/Group-43-1.png"
            alt="SpeedyTaxi Logo"
            className="h-12 w-12 object-contain"
          />
          <span className="text-2xl font-extrabold text-black">Demo Taxi</span>
        </motion.div>

        {/* Desktop Navigation */}
        <motion.nav
          initial={{
            x: 500,
            opacity: 0,
            scale: 0.5,
          }}
          animate={{
            x: 0,
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 1.5,
          }}
          className="hidden md:flex gap-8 items-center"
        >
          {["home", "about", "gallery", "contact"].map((section) => (
            <Link
              key={section}
              href={`#${section}`}
              className="text-lg font-semibold text-black hover:text-white transition-colors duration-200"
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </Link>
          ))}
        </motion.nav>

        {/* Mobile Menu Toggle Button */}
        <motion.button
          initial={{
            x: 500,
            opacity: 0,
            scale: 0.5,
          }}
          animate={{
            x: 0,
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 1.5,
          }}
          className="md:hidden text-black"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={30} /> : <Menu size={30} />}
        </motion.button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 1.5,
          }}
          className="md:hidden bg-yellow-400 px-5 pb-4"
        >
          <nav className="flex flex-col gap-3">
            {["home", "about", "gallery", "contact"].map((section) => (
              <Link
                key={section}
                href={`#${section}`}
                className="text-base font-semibold text-black hover:text-white transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </Link>
            ))}
            {/* Theme Toggle Dropdown */}
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
}
