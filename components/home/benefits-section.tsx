import { Sparkles, Shield, Leaf, Award } from "lucide-react"

const benefits = [
  {
    icon: Sparkles,
    title: "Air Purification",
    description: "Salt lamps release negative ions that help neutralize pollutants and allergens in your environment.",
  },
  {
    icon: Shield,
    title: "EMF Reduction",
    description: "May help reduce electromagnetic radiation from electronic devices in your home or office space.",
  },
  {
    icon: Leaf,
    title: "Natural Wellness",
    description: "The warm amber glow promotes relaxation, reduces stress, and improves sleep quality naturally.",
  },
  {
    icon: Award,
    title: "Authentic Quality",
    description: "Each lamp is hand-carved from genuine Khewra salt, certified for purity and authenticity.",
  },
]

export function BenefitsSection() {
  return (
    <section className="py-12 md:py-20 px-3 md:px-4 bg-secondary/30">
      <div className="container mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2 md:mb-4 tracking-tight">
            Why Choose Himalayan Salt Lamps?
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Beyond their stunning beauty, our salt lamps offer numerous benefits for your home and wellbeing
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="text-center group">
              <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-lg bg-primary/10 mb-3 md:mb-4 group-hover:bg-primary/20 transition-colors">
                <benefit.icon className="h-5 w-5 md:h-7 md:w-7 text-primary" />
              </div>
              <h3 className="text-sm md:text-lg font-bold text-foreground mb-1 md:mb-2">{benefit.title}</h3>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
