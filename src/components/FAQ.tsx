import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const FAQ = () => {
  const faqs = [
    {
      question: "How does FetchCart's AI work?",
      answer:
        "Our AI uses advanced machine learning algorithms to understand your shopping preferences, analyze product data across thousands of retailers, and provide personalized recommendations. It continuously learns from your interactions to improve suggestions over time.",
    },
    {
      question: "Is my personal data secure?",
      answer:
        "Absolutely. We use industry-standard encryption and security measures to protect your data. We never sell your personal information to third parties and you have full control over your privacy settings.",
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer:
        "Yes, you can cancel your subscription at any time with no questions asked. Your account will remain active until the end of your current billing period.",
    },
    {
      question: "Do you support international shopping?",
      answer:
        "Currently, we support major retailers in the US, Canada, UK, and EU. We're constantly expanding our coverage to include more regions and retailers.",
    },
    {
      question: "How accurate are the price comparisons?",
      answer:
        "Our price data is updated in real-time and sourced directly from retailer APIs and verified web scraping. We maintain 99.9% accuracy in our price tracking and comparison features.",
    },
    {
      question: "Can I integrate FetchCart with my existing tools?",
      answer:
        "Yes! Our Enterprise plan includes API access and integration capabilities with popular e-commerce platforms, productivity tools, and custom applications.",
    },
  ];

  return (
    <section
      id="faq"
      className="relative py-24 lg:py-32 overflow-hidden bg-gradient-to-br from-indigo-50 via-pink-50 to-yellow-50"
    >
      {/* Animated Colorful Background */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <motion.div
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          className="absolute -top-32 -left-32 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-pink-400 via-indigo-400 to-blue-400 opacity-30 blur-3xl"
        />
        <motion.div
          initial={{ scale: 0.7, opacity: 0.4 }}
          animate={{ scale: 1.1, opacity: 0.7 }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1,
          }}
          className="absolute top-1/2 right-0 w-[300px] h-[300px] rounded-full bg-gradient-to-tr from-yellow-300 via-pink-300 to-purple-400 opacity-30 blur-2xl"
        />
        <motion.div
          initial={{ scale: 0.9, opacity: 0.3 }}
          animate={{ scale: 1.05, opacity: 0.5 }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 0.5,
          }}
          className="absolute bottom-0 left-1/2 w-[250px] h-[250px] rounded-full bg-gradient-to-tl from-green-300 via-blue-300 to-indigo-400 opacity-20 blur-2xl"
        />
      </div>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7, type: "spring" }}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-200 via-pink-200 to-yellow-100 shadow-lg backdrop-blur-md rounded-full px-6 py-3 mb-8 border border-indigo-100"
          >
            <Sparkles className="h-5 w-5 text-pink-500 animate-bounce" />
            <span className="text-base font-semibold text-indigo-700 tracking-wide">
              Frequently Asked Questions
            </span>
          </motion.div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-700 via-pink-600 to-yellow-500 bg-clip-text text-transparent">
            Got questions? We've got answers.
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find everything you need to know about FetchCart.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + index * 0.08, duration: 0.6, type: "spring" }}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="bg-white/90 border rounded-lg px-6 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-6">
                    <span className="font-semibold bg-gradient-to-r from-indigo-600 via-pink-500 to-yellow-400 bg-clip-text text-transparent">
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;