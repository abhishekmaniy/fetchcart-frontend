
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "How does FetchCart's AI work?",
      answer: "Our AI uses advanced machine learning algorithms to understand your shopping preferences, analyze product data across thousands of retailers, and provide personalized recommendations. It continuously learns from your interactions to improve suggestions over time."
    },
    {
      question: "Is my personal data secure?",
      answer: "Absolutely. We use industry-standard encryption and security measures to protect your data. We never sell your personal information to third parties and you have full control over your privacy settings."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription at any time with no questions asked. Your account will remain active until the end of your current billing period."
    },
    {
      question: "Do you support international shopping?",
      answer: "Currently, we support major retailers in the US, Canada, UK, and EU. We're constantly expanding our coverage to include more regions and retailers."
    },
    {
      question: "How accurate are the price comparisons?",
      answer: "Our price data is updated in real-time and sourced directly from retailer APIs and verified web scraping. We maintain 99.9% accuracy in our price tracking and comparison features."
    },
    {
      question: "Can I integrate FetchCart with my existing tools?",
      answer: "Yes! Our Enterprise plan includes API access and integration capabilities with popular e-commerce platforms, productivity tools, and custom applications."
    }
  ];

  return (
    <section id="faq" className="py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Got questions? We've got answers. Find everything you need to know about FetchCart.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-background border rounded-lg px-6"
              >
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="font-semibold">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
