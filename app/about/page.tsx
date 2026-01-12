import Image from "next/image"
import Link from "next/link"
import { Starfield } from "@/components/ui/starfield"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mountain, Heart, Shield, Sparkles, ArrowRight } from "lucide-react"

export const metadata = {
    title: "About Us | Namak Halal - Himalayan Salt Lamps",
    description: "Learn about Namak Halal and our commitment to bringing authentic Himalayan salt lamps from Khewra to your home.",
}

const values = [
    {
        icon: Mountain,
        title: "Authentic Origins",
        description: "Every lamp is hand-carved from genuine salt crystals sourced directly from the ancient Khewra Salt Mine.",
    },
    {
        icon: Heart,
        title: "Crafted with Care",
        description: "Our skilled artisans pour their expertise into every piece, creating unique works of natural art.",
    },
    {
        icon: Shield,
        title: "Quality Guaranteed",
        description: "We stand behind every product with our 100% authenticity guarantee and dedicated customer support.",
    },
    {
        icon: Sparkles,
        title: "Natural Beauty",
        description: "We celebrate the natural variations in each lamp, making every piece one-of-a-kind.",
    },
]

export default function AboutPage() {
    return (
        <>
            <Starfield />
            <Header />
            <main className="min-h-screen pt-24 pb-16">
                {/* Hero Section */}
                <section className="container mx-auto px-4 mb-20">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                            Bringing the Ancient Light of{" "}
                            <span className="text-primary">Khewra</span> to Your Home
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                            Namak Halal is dedicated to sharing the natural beauty and warmth of authentic
                            Himalayan salt lamps, sourced directly from the world-renowned Khewra Salt Mine.
                        </p>
                    </div>
                </section>

                {/* Story Section */}
                <section className="container mx-auto px-4 mb-20">
                    <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                            <Image
                                src="/himalayan-salt-lamp-glowing-amber.jpg"
                                alt="Himalayan salt lamp with warm amber glow"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                        </div>
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Our Story</h2>
                            <div className="space-y-4 text-muted-foreground">
                                <p>
                                    The Khewra Salt Mine, nestled in Pakistan's Punjab region, is one of the oldest
                                    and largest salt mines in the world. For centuries, this ancient deposit has
                                    yielded the purest pink Himalayan salt, formed over 250 million years ago.
                                </p>
                                <p>
                                    At Namak Halal, we work directly with local artisans who have inherited the
                                    craft of salt carving from generations before them. Each lamp is hand-carved
                                    with skill and reverence, transforming raw salt crystals into beautiful
                                    functional art.
                                </p>
                                <p>
                                    Our name, "Namak Halal," reflects our commitment to honest, ethical practices.
                                    In Urdu, it means "worthy of one's salt" – a promise of integrity, quality,
                                    and authenticity in everything we do.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="container mx-auto px-4 mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">What We Stand For</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Our values guide everything we do, from sourcing to shipping
                        </p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        {values.map((value, index) => (
                            <Card key={index} className="bg-card/50 border-border text-center">
                                <CardContent className="pt-8 pb-6">
                                    <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                        <value.icon className="h-7 w-7 text-primary" />
                                    </div>
                                    <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                                    <p className="text-sm text-muted-foreground">{value.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Mission Section */}
                <section className="container mx-auto px-4 mb-20">
                    <div className="max-w-4xl mx-auto bg-card/50 border border-border rounded-2xl p-8 md:p-12 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Our Mission</h2>
                        <p className="text-lg text-muted-foreground mb-8">
                            To bring the authentic beauty and natural warmth of Himalayan salt lamps to homes
                            around the world, while supporting the artisan communities of Khewra and promoting
                            sustainable, ethical practices in everything we do.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button asChild size="lg">
                                <Link href="/shop">
                                    Explore Our Collection
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="bg-transparent">
                                <Link href="/contact">Get In Touch</Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="container mx-auto px-4">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
                        {[
                            { number: "250M+", label: "Years of Salt Formation" },
                            { number: "100%", label: "Authentic Khewra Salt" },
                            { number: "5,000+", label: "Happy Customers" },
                            { number: "30", label: "Day Satisfaction Guarantee" },
                        ].map((stat, index) => (
                            <div key={index} className="text-center p-6">
                                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.number}</div>
                                <div className="text-sm text-muted-foreground">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}
