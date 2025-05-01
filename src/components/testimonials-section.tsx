"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useInView } from "framer-motion"
import { Star } from "lucide-react"

const testimonials = [
  {
    quote:
      "Opano has transformed how our team collaborates. The intuitive interface and powerful features have boosted our productivity by 40%.",
    author: "Sarah Johnson",
    role: "Product Manager at TechCorp",
    avatar: "/woman-with-glasses.png",
  },
  {
    quote:
      "We've tried many collaboration tools, but Opano stands out with its seamless integrations and user-friendly design. It's become essential to our workflow.",
    author: "Michael Chen",
    role: "CTO at InnovateLabs",
    avatar: "/asian-man-smiling.png",
  },
  {
    quote:
      "The analytics dashboard gives us insights we never had before. We can now make data-driven decisions that have significantly improved our team's performance.",
    author: "Jessica Williams",
    role: "Operations Director at GlobalFirm",
    avatar: "/professional-woman-diverse.png",
  },
]

export default function TestimonialsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section id="testimonials" className="py-20 md:py-32 bg-gray-50">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Trusted by teams worldwide</h2>
          <p className="text-lg text-muted-foreground">
            See what our customers have to say about their experience with our platform.
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white rounded-xl p-6 shadow-md"
            >
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-[#ff6a00] text-[#ff6a00]" />
                ))}
              </div>
              <blockquote className="text-lg mb-6">"{testimonial.quote}"</blockquote>
              <div className="flex items-center gap-4">
                <Image
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.author}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <p className="font-medium">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-20 bg-white rounded-xl p-8 shadow-lg border border-gray-200"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { value: "2,500+", label: "Active Teams" },
              { value: "98%", label: "Customer Satisfaction" },
              { value: "35%", label: "Productivity Increase" },
              { value: "24/7", label: "Customer Support" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                viewport={{ once: true }}
              >
                <p className="text-4xl font-bold text-[#ff6a00] mb-2">{stat.value}</p>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
