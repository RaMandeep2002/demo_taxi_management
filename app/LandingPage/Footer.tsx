import { Mail, PhoneCall } from "lucide-react";
import Link from "next/link";
import * as motion from "motion/react-client"
import Image from "next/image";


export default function Footer(){
    return(
         <footer className="w-full border-t  bg-gray-100">
        <div className="container mx-auto px-4 md:px-6 lg:px-28">
          <div className="flex flex-col gap-8 py-8 md:py-12 lg:py-16">
            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              className="space-y-4">
                <div className="flex items-center gap-2">
                  <Image
                    src="/fotter_logo.svg"
                    alt="Demo Taxi Logo"
                    width={40}
                    height={40}
                    className="h-10 w-10 object-contain rounded-full"
                  />
                  <span className="text-lg font-bold">Demo Taxi</span>
                </div>
                <p className="text-base text-muted-foreground">
                Locally owned Demo Taxi is a major part of transportation services in [Your place] all year around. By emphasizing on quality and service, Demo Taxi has been providing contractual transportation services to many local and national companies.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.6 }}
                 viewport={{ once: true }}
              className="space-y-4">
                <h3 className="text-lg font-semibold">Quick Links</h3>
                <ul className="space-y-2 text-base">
                  <li>
                    <Link
                      href="#home"
                      className="text-muted-foreground hover:text-yellow-500 transition-colors"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#about"
                      className="text-muted-foreground hover:text-yellow-500 transition-colors"
                    >
                      About Us
                    </Link>
                  </li>
                  {/* <li>
                    <Link
                      href="#gallery"
                      className="text-muted-foreground hover:text-yellow-500 transition-colors"
                    >
                      Our Fleet
                    </Link>
                  </li> */}
                  {/* <li>
                    <Link
                      href="#app"
                      className="text-muted-foreground hover:text-yellow-500 transition-colors"
                    >
                      Download App
                    </Link>
                  </li> */}
                </ul>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: -50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              id="contact" className="space-y-4">
                <h3 className="text-lg font-semibold">Contact Us</h3>
                <ul className="space-y-2 text-base">
                  <li className="flex items-center gap-2">
                    <PhoneCall className="h-4 w-4 text-yellow-500" />
                    <span className="text-muted-foreground">
                    <a
                    href="tel:"
                 className="ml-1 hover:underline hover:text-yellow-500"
                  >
             +1 (245) 823-2222
                  </a>
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-yellow-500" />
                    <span className="text-muted-foreground">
                    <a
                    href="mailto:salmonarmtaxi@yahoo.ca"
                    className="ml-1 hover:underline hover:text-yellow-500"
                  >
                    demotaxi@gmail.com
                  </a>
                    </span>
                  </li>
                  {/* <li className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-yellow-500 mt-1" />
                    <span className="text-muted-foreground">
                      123 Taxi Street, City Center, NY 10001
                    </span>
                  </li> */}
                </ul>
              </motion.div>
              {/* <div className="space-y-4">
                <h3 className="text-lg font-semibold">Follow Us</h3>
                <div className="flex gap-4">
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-yellow-500 transition-colors"
                  >
                    <Facebook className="h-6 w-6" />
                    <span className="sr-only">Facebook</span>
                  </Link>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-yellow-500 transition-colors"
                  >
                    <Twitter className="h-6 w-6" />
                    <span className="sr-only">Twitter</span>
                  </Link>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-yellow-500 transition-colors"
                  >
                    <Instagram className="h-6 w-6" />
                    <span className="sr-only">Instagram</span>
                  </Link>
                </div>
              </div> */}
            </div>
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground">
                © {new Date().getFullYear()} Demo Taxi. All rights reserved.
              </p>
              {/* <div className="flex gap-4 text-xs text-muted-foreground">
                <Link href="#" className="hover:underline">
                  Privacy Policy
                </Link>
                <Link href="#" className="hover:underline">
                  Terms of Service
                </Link>
              </div> */}
            </motion.div>
          </div>
        </div>
      </footer>
    )
}