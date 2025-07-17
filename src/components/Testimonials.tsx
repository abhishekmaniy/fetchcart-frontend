
import { Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Fashion Enthusiast",
      avatar: "SJ",
      content: "FetchCart has completely transformed how I shop online. The AI recommendations are spot-on, and I've saved hundreds of dollars with their price tracking.",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Tech Professional",
      avatar: "MC",
      content: "As someone who researches extensively before buying, FetchCart's comparison features are a game-changer. It saves me hours of manual searching.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Small Business Owner",
      avatar: "ER",
      content: "The enterprise features help me source products for my business efficiently. The API integration is seamless and the support team is fantastic.",
      rating: 5
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-secondary/20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            What Our Users Say
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied customers who have revolutionized their shopping experience.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-background p-8 rounded-xl shadow-sm border"
            >
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold mr-4">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-muted-foreground text-sm">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
