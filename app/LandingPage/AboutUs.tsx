// import Image from "next/image";
import * as motion from "motion/react-client"

export default function AboutUs() {
  return (
    <>
      <section
        id="about"
        className="w-full  py-12 md:py-24 lg:py-32 flex justify-center items-center"
      >
        <div className="max-w-6xl w-full px-4 md:px-6">
          <div className="items-center justify-center">
            <div className="space-y-4 text-center lg:text-left">
              <motion.h2
                 initial={{ opacity: 0, y: -50 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.2 }}
                 viewport={{ once: true }}
               className="text-3xl font-bold text-center tracking-tighter md:text-4xl">
                About Us
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: -50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4}}
                viewport={{ once: true }}
                 className="text-muted-foreground md:text-xl">
                Locally owned Salmon Arm Taxi is a major part of transportation
                services in Salmon Arm all year around. By emphasizing on
                quality and service, Salmon Arm Taxi has been providing
                contractual transportation services to many local and national
                companies.
              </motion.p>
              <div className="space-y-1 text-base md:text-lg text-gray-800 gap-3 text-center ">
                <motion.p
                 initial={{ opacity: 0, y: -50 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.6 }}
                 viewport={{ once: true }}
                 className="gap-3">
                  <strong>Email:</strong>
                  <a
                    href="mailto:salmonarmtaxi@yahoo.ca"
                    className="ml-1 text-yellow-600 hover:underline"
                  >
                    salmonarmtaxi@yahoo.ca
                  </a>
                </motion.p>
                <motion.p
                 initial={{ opacity: 0, y: -50 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.8 }}
                 viewport={{ once: true }}>
                  <strong>Contact:</strong>
                  <a
                    href="tel:+12508321111"
                    className="ml-1 text-yellow-600 hover:underline"
                  >
                    +1 (250) 832-1111
                  </a>
                </motion.p>
              </div>
            </div>

            {/* Uncomment below if adding image */}
            {/* <div className="flex justify-center">
        <img
          src="https://i.postimg.cc/Y9MJSmtD/salmon-logo-final.jpg"
          alt="Professional taxi service"
          className="w-48 h-48 sm:rounded-full object-cover"
        />
      </div> */}
          </div>
        </div>
      </section>
    </>
  );
}
