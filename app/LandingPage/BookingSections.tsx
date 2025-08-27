import { useState } from "react";
import * as motion from "motion/react-client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function BookingSection() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    pickup: "",
    dropoff: "",
    date: "",
    time: "",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Here you would send the form data to your backend or email service
    setSubmitted(true);
  }

  return (
    <section
      id="booking"
      className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 flex justify-center items-center"
    >
        {/* <motion.h2
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-6"
        >
            Book a Ride
        </motion.h2> */}
      <div className="w-full max-w-7xl bg-white rounded-lg shadow-lg p-8 flex flex-col md:flex-row gap-10">
        {/* Booking Form (Left) */}
        <div className="w-full md:w-1/2">
          <motion.h2
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-6 text-center md:text-left"
          >
            Book a Ride
          </motion.h2>
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-green-600 text-center text-lg font-semibold"
            >
              Thank you! Your booking request has been received.
            </motion.div>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <Label
                  className="block text-sm font-medium mb-1"
                  htmlFor="name"
                >
                  Name
                </Label>
                <Input
                  required
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <Label
                  className="block text-sm font-medium mb-1"
                  htmlFor="phone"
                >
                  Phone Number
                </Label>
                <Input
                  required
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="(123) 456-7890"
                />
              </div>
              <div>
                <Label
                  className="block text-sm font-medium mb-1"
                  htmlFor="pickup"
                >
                  Pickup Location
                </Label>
                <Input
                  required
                  id="pickup"
                  name="pickup"
                  type="text"
                  value={form.pickup}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Enter pickup address"
                />
              </div>
              <div>
                <Label
                  className="block text-sm font-medium mb-1"
                  htmlFor="dropoff"
                >
                  Dropoff Location
                </Label>
                <Input
                  required
                  id="dropoff"
                  name="dropoff"
                  type="text"
                  value={form.dropoff}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Enter dropoff address"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label
                    className="block text-sm font-medium mb-1"
                    htmlFor="date"
                  >
                    Date
                  </Label>
                  <Input
                    required
                    id="date"
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
                <div className="flex-1">
                  <Label
                    className="block text-sm font-medium mb-1"
                    htmlFor="time"
                  >
                    Time
                  </Label>
                  <Input
                    required
                    id="time"
                    name="time"
                    type="time"
                    value={form.time}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
              </div>
              <div>
                <Label
                  className="block text-sm font-medium mb-1"
                  htmlFor="notes"
                >
                  Additional Notes (optional)
                </Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Any special instructions?"
                  rows={3}
                />
              </div>
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded transition-colors"
              >
                Book Now
              </motion.button>
            </form>
          )}
        </div>
        {/* Right Side Text */}
        <div className="hidden md:flex w-full md:w-1/2 flex-col justify-center pl-8">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-gray-700 text-lg space-y-4"
          >
            <h3 className="text-2xl font-bold text-yellow-500 mb-2">
              Why Book With Us?
            </h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>24/7 reliable taxi service in your area</li>
              <li>Clean, well-maintained vehicles and professional drivers</li>
              <li>Easy online booking and quick response</li>
              <li>Safe, comfortable, and affordable rides</li>
              <li>Local experts who know the best routes</li>
            </ul>
            <p className="mt-4">
              Need a ride right now or want to schedule in advance? Fill out the
              form and our team will confirm your booking as soon as possible.
            </p>
            <p>
              For urgent bookings, please call us directly at{" "}
              <span className="font-semibold text-yellow-600">
                +1 (245) 823-2222
              </span>
              .
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
