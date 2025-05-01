"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"

export default function PricingSection() {
  const [annual, setAnnual] = useState(true)

  const plans = [
    {
      name: "Starter",
      price: annual ? 12 : 15,
      description: "Perfect for small teams just getting started",
      features: [
        "Up to 5 team members",
        "Basic collaboration tools",
        "5GB storage",
        "Email support",
        "Basic analytics",
      ],
      popular: false,
      buttonText: "Get Started",
    },
    {
      name: "Professional",
      price: annual ? 29 : 39,
      description: "Ideal for growing teams with advanced needs",
      features: [
        "Up to 20 team members",
        "Advanced collaboration tools",
        "25GB storage",
        "Priority email & chat support",
        "Advanced analytics",
        "Custom integrations",
        "Team management",
      ],
      popular: true,
      buttonText: "Get Started",
    },
    {
      name: "Enterprise",
      price: annual ? 79 : 99,
      description: "For large organizations with complex requirements",
      features: [
        "Unlimited team members",
        "Enterprise-grade security",
        "Unlimited storage",
        "24/7 phone, email & chat support",
        "Advanced analytics & reporting",
        "Custom integrations",
        "Dedicated account manager",
        "Single sign-on (SSO)",
        "Custom branding",
      ],
      popular: false,
      buttonText: "Contact Sales",
    },
  ]

  return (
    <section id="pricing" className="py-20 md:py-32 bg-white">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Simple, transparent pricing</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Choose the plan that's right for your team. All plans include a 14-day free trial.
          </p>

          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm ${!annual ? "text-muted-foreground" : "font-medium"}`}>Monthly</span>
            <Switch checked={annual} onCheckedChange={setAnnual} className="data-[state=checked]:bg-[#ff6a00]" />
            <span className={`text-sm ${annual ? "text-muted-foreground" : "font-medium"}`}>
              Annual <span className="text-[#ff6a00] font-medium">Save 20%</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative rounded-xl p-6 ${
                plan.popular ? "border-2 border-[#ff6a00] shadow-lg" : "border border-gray-200 shadow-sm"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#ff6a00] text-white text-xs font-medium px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground mb-4">{plan.description}</p>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground ml-2">/ month</span>
                </div>
                {annual && (
                  <p className="text-sm text-muted-foreground mt-1">Billed annually (${plan.price * 12}/year)</p>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div
                      className={`h-5 w-5 rounded-full ${plan.popular ? "bg-[#ff6a00]/20 text-[#ff6a00]" : "bg-green-100 text-green-600"} flex items-center justify-center flex-shrink-0 mt-0.5`}
                    >
                      <Check className="h-3 w-3" />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                className={`w-full ${
                  plan.popular
                    ? "bg-[#ff6a00] hover:bg-[#ff6a00]/90 text-white"
                    : "bg-white text-[#1d1c1d] border border-[#bbbbbb] hover:bg-gray-50"
                }`}
              >
                <Link href="/signup">{plan.buttonText}</Link>
              </Button>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground">
            Need a custom plan?{" "}
            <Link href="#contact" className="text-[#ff6a00] font-medium hover:underline">
              Contact us
            </Link>{" "}
            for enterprise pricing.
          </p>
        </div>
      </div>
    </section>
  )
}
