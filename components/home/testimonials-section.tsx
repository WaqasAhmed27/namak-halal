import { Star, Quote } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const testimonials = [
  {
    id: 1,
    name: "Sarah M.",
    location: "Lahore",
    rating: 5,
    text: "The quality is exceptional. The warm glow transforms my bedroom into a peaceful sanctuary. Highly recommend!",
  },
  {
    id: 2,
    name: "Ahmed K.",
    location: "Karachi",
    rating: 5,
    text: "Bought one for my office desk. It not only looks beautiful but I feel more relaxed during work hours.",
  },
  {
    id: 3,
    name: "Maria T.",
    location: "Islamabad",
    rating: 5,
    text: "Gifted to my mother and she absolutely loves it. The authenticity certificate was a nice touch!",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20 px-4 bg-secondary/20">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">What Our Customers Say</h2>
          <p className="text-muted-foreground">
            Join thousands of satisfied customers who have brought warmth into their homes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-card/50 border-border">
              <CardContent className="p-6">
                <Quote className="h-8 w-8 text-primary/30 mb-4" />
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground mb-4">{testimonial.text}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{testimonial.name}</span>
                  <span>•</span>
                  <span>{testimonial.location}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
