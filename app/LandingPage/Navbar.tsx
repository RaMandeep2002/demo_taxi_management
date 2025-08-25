"use client";
import Link from "next/link";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useState } from "react";
import * as motion from "motion/react-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";

export default function Navbar() {
  const { setTheme } = useTheme();
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

          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="relative w-12 h-12 flex items-center justify-center rounded-full border border-zinc-900 dark:border-gray-300 bg-transparent dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-fuchsia-950 transition-colors shadow"
                  aria-label="Toggle theme" 
                >
                  <Sun className="h-[1.5rem] w-[1.5rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.5rem] w-[1.5rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
            <div className="mt-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="relative w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-300 bg-transparent dark:bg-transparent hover:bg-gray-100 dark:hover:bg-fuchsia-950 transition-colors shadow"
                    aria-label="Toggle theme"
                  >
                    <Sun className="h-[1.5rem] w-[1.5rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.5rem] w-[1.5rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
}
