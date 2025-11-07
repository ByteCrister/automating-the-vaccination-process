"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const detailsData = [
  {
    id: 1,
    image: "/adil/landingPageImg/landingPageImg1.jpg",
    title: "Immunization Campaign",
    description:
      "Healthcare workers ensuring children receive essential vaccines for a healthy future.",
  },
  {
    id: 2,
    image: "/adil/landingPageImg/landingPageImg2.jpg",
    title: "Community Awareness Program",
    description:
      "Raising awareness among families to improve vaccination participation and child health.",
  },
  {
    id: 3,
    image: "/adil/landingPageImg/landingPageImg3.jpg",
    title: "Child Health Monitoring",
    description:
      "Regular health checkups and counseling sessions conducted by trained professionals.",
  },
  {
    id: 4,
    image: "/adil/landingPageImg/landingPageImg4.webp",
    title: "Mobile Vaccination Unit",
    description:
      "Reaching remote villages with mobile vaccination vans ensuring no child is left behind.",
  },
];

export function DetailsCard() {
  return (
    <motion.section
      className="relative py-16 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      {/* Subtle decorative gradient blob */}
      <motion.div
        className="absolute -top-20 -left-20 w-80 h-80 bg-blue-200 rounded-full blur-3xl opacity-40"
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 0.4 }}
        transition={{ duration: 1, delay: 0.2 }}
        viewport={{ once: true }}
        animate={{ scale: [1, 1.1, 1], transition: { duration: 6, repeat: Infinity, ease: "easeInOut" } }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-200 rounded-full blur-3xl opacity-30"
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 0.3 }}
        transition={{ duration: 1, delay: 0.4 }}
        viewport={{ once: true }}
        animate={{ scale: [1, 1.1, 1], transition: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 3 } }}
      />

      <motion.div
        className="relative max-w-7xl mx-auto px-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        viewport={{ once: true }}
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-extrabold text-center mb-12 text-gray-800"
        >
          Our Vaccination Initiatives
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          {detailsData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.6 }}
              viewport={{ once: true }}
              className="group relative bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100"
            >
              <motion.div
                className="overflow-hidden rounded-t-3xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  width={600}
                  height={400}
                  className="w-full h-56 object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
              </motion.div>

              <motion.div
                className="p-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 + 0.1 * index }}
                viewport={{ once: true }}
              >
                <motion.h3
                  className="text-xl font-semibold mb-2 text-gray-900"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 + 0.1 * index }}
                  viewport={{ once: true }}
                >
                  {item.title}
                </motion.h3>
                <motion.p
                  className="text-gray-600 text-sm leading-relaxed"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.4 + 0.1 * index }}
                  viewport={{ once: true }}
                >
                  {item.description}
                </motion.p>
              </motion.div>

              {/* Gradient accent line */}
              <motion.div
                className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-indigo-400 via-sky-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
