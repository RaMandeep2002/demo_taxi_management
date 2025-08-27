import { Check } from "lucide-react";
import * as motion from "motion/react-client";

export default function WelcomeSection() {
  return (
    <>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            {/* Image First on Large Screens */}
            <motion.div
              //  initial={{ opacity: 0, y: -50 }}
              //  whileInView={{ opacity: 1, y: 0 }}
              //  transition={{ duration: 0.6 }}
              //  viewport={{ once: true }}
              className="order-2 lg:order-2 space-y-4"
            >
              <motion.h2
                initial={{ opacity: 0, y: -50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                viewport={{ once: true }}
                className="text-3xl font-bold tracking-tighter md:text-4xl"
              >
                Welcome to Demo Taxi
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: -50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
                className="text-muted-foreground md:text-xl"
              >
                Locally owned Demo Taxi is a major part of transportation
                services in [Your Place] all year around.By emphasizing on quality
                and service Demo Taxi has been providing contractual
                transportation services to many local and national companies.
              </motion.p>
              <motion.ul
                initial={{ opacity: 0, y: -50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="space-y-4 mt-6"
              >
                <li className="flex items-start gap-3">
                  <div className="w-8 flex justify-center">
                    <Check
                      className="text-yellow-500 bg-yellow-200 p-1 rounded-full"
                      width={32}
                      height={32}
                    />
                  </div>
                  <span className="text-lg text-zinc-700">
                    Well maintained cabs, cleaned inside, outside after every
                    shift.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                   <div className="w-8 flex justify-center">
                    <Check
                      className="text-yellow-500 bg-yellow-200 p-1 rounded-full"
                      width={32}
                      height={32}
                    />
                  </div>
                  <span className="text-lg text-zinc-700">
                    Regularly maintained by Red Seal Certified mechanic.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                   <div className="w-8 flex justify-center">
                    <Check
                      className="text-yellow-500 bg-yellow-200 p-1 rounded-full"
                      width={32}
                      height={32}
                    />
                  </div>
                  <span className="text-lg text-zinc-700">
                    Our cabs go through at least 6 inspections semi-annually.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                   <div className="w-8 flex justify-center">
                    <Check
                      className="text-yellow-500 bg-yellow-200 p-1 rounded-full"
                      width={32}
                      height={32}
                    />
                  </div>
                  <span className="text-lg text-zinc-700">
                    The technologically advanced cloud-based dispatch system.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                   <div className="w-8 flex justify-center">
                    <Check
                      className="text-yellow-500 bg-yellow-200 p-1 rounded-full"
                      width={32}
                      height={32}
                    />
                  </div>
                  <span className="text-lg text-zinc-700">
                    Increased automation through IVR and ABOP system to cut the
                    wait time for the calls.
                  </span>
                </li>
              </motion.ul>

              <motion.p
                initial={{ opacity: 0, y: -50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-muted-foreground md:text-xl"
              >
                With 24 hours taxi and delivery service, our distinctive Yellow
                colors taxi can be spotted throughout the city. You can count on
                Demo Taxi excellent 24 hours service for your car break
                down, you vehicle needs a charge boost, you need food or liquor
                delivered, package or parcel delivered local or out of town.
              </motion.p>
            </motion.div>
            <div className="order-1 lg:order-1 space-y-4">
              <motion.img
                initial={{ opacity: 0, y: -50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                src="https://i.postimg.cc/4y0ZwYFG/Group-39-1.png"
                alt="Professional taxi service"
                className="mx-auto w-58 md:w-58 overflow-hidden object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
