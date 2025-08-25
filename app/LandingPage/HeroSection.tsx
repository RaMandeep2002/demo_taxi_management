"use client"
import { Cursor, useTypewriter } from 'react-simple-typewriter'
import * as motion from "motion/react-client"
export default function HeroSection() {
  const [text] = useTypewriter({
    words: ["Welcome To Demo Taxi..."],
    loop: true,
    delaySpeed: 2000,

  })
    return (  
      <motion.section
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        duration: 1.5,
      }}
        id="home"
        className="relative w-full py-12 md:py-24 lg:py-32 bg-cover bg-center bg-no-repeat"
        // style={{
        //   backgroundImage: "url('https://i.postimg.cc/C1mmWRWy/Whats-App-Image-2025-03-26-at-13-07-52.jpg')",
        // }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-amber-300 z-10" />
  
        {/* Content */}
        <div className="relative z-20 px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl text-black tracking-wide">
              <span className="mr-3">{text}<Cursor cursorColor='#F7AB0A' cursorStyle="_" /></span>
              {/* Welcome To Salmon Arm Taxi */}
              </h1>
              <motion.p
                initial={{ opacity: 0, y: -50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                 className="mx-auto max-w-[700px] text-black md:text-xl">
                Fast, reliable, and comfortable taxi service available 24/7. Book your ride now and experience the
                difference.
              </motion.p>
            </div>
          </div>
        </div>
      </motion.section>
    );
  }
  