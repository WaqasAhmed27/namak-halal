import { Starfield } from "@/components/ui/starfield"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export const metadata = {
    title: "FAQ | Namak Halal - Himalayan Salt Lamps",
    description: "Frequently asked questions about our authentic Himalayan salt lamps from Khewra.",
}

const faqs = [
    {
        question: "What are Himalayan salt lamps?",
        answer: "Himalayan salt lamps are decorative lights carved from pink Himalayan salt crystals mined from the Khewra Salt Mine in Pakistan. When lit, they emit a warm, amber glow and are believed to have air-purifying and mood-enhancing properties. Each lamp is unique in shape, color, and pattern due to the natural formation of the salt crystals."
    },
    {
        question: "What are the benefits of salt lamps?",
        answer: "Salt lamps are known for creating a calming ambiance with their warm glow, which can help reduce stress and improve mood. Many users report better sleep quality when using them as night lights. They also serve as beautiful natural decor pieces that add warmth to any room. Some believe they help purify the air by releasing negative ions, though scientific evidence for this is limited."
    },
    {
        question: "How do I care for my salt lamp?",
        answer: "Keep your salt lamp in a dry environment as salt naturally attracts moisture. If your lamp becomes damp, simply wipe it with a dry cloth and leave it on for a few hours to dry out. We recommend keeping the lamp on for at least 16 hours a day to prevent moisture buildup. Avoid placing near water sources, humidifiers, or in very humid rooms like bathrooms."
    },
    {
        question: "Why is my salt lamp sweating or leaking?",
        answer: "Salt is hygroscopic, meaning it attracts water molecules from the air. In humid conditions, your lamp may appear to 'sweat' or have water droplets on its surface. This is completely normal! Simply keep the lamp on to evaporate the moisture, and place it on a protective dish or tray to protect your furniture."
    },
    {
        question: "How long will my salt lamp last?",
        answer: "With proper care, your Himalayan salt lamp can last for many years – even decades. The salt crystal itself won't expire or lose its properties. You may need to replace the bulb periodically (we recommend 15-25 watt bulbs), but the salt itself is incredibly durable."
    },
    {
        question: "Are your salt lamps authentic?",
        answer: "Yes! All our salt lamps are 100% authentic, hand-carved from genuine Himalayan pink salt sourced directly from the Khewra Salt Mine in Pakistan – the world's second-largest salt mine. Each lamp comes with a certificate of authenticity. We never sell synthetic or fake salt products."
    },
    {
        question: "What shipping options do you offer?",
        answer: "We offer nationwide delivery across Pakistan with standard shipping (5-7 business days) and express shipping (2-3 business days) options. International shipping is available to select countries. All orders are carefully packaged to ensure your salt lamp arrives safely."
    },
    {
        question: "What is your return policy?",
        answer: "We offer a 30-day satisfaction guarantee. If you're not completely happy with your purchase, you can return it within 30 days for a full refund or exchange. The product must be in its original condition. Please contact our customer service team to initiate a return."
    },
    {
        question: "Do salt lamps come with bulbs?",
        answer: "Yes, all our salt lamps come complete with a high-quality cord, bulb, and base – ready to use right out of the box. We include clear instructions for setup and care."
    },
    {
        question: "What size salt lamp should I get?",
        answer: "The ideal size depends on your room. For bedrooms and small spaces (up to 100 sq ft), mini to small lamps work great. Medium lamps are perfect for living rooms and offices (100-200 sq ft). Large and extra-large lamps make stunning statement pieces for bigger spaces (200+ sq ft). You can also combine multiple smaller lamps for a beautiful effect."
    },
]

export default function FAQPage() {
    return (
        <>
            <Starfield />
            <Header />
            <main className="min-h-screen pt-24 pb-16">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Page Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            Frequently Asked Questions
                        </h1>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Everything you need to know about our authentic Himalayan salt lamps
                        </p>
                    </div>

                    {/* FAQ Accordion */}
                    <Accordion type="single" collapsible className="space-y-4">
                        {faqs.map((faq, index) => (
                            <AccordionItem
                                key={index}
                                value={`item-${index}`}
                                className="bg-card/50 border border-border rounded-lg px-6 data-[state=open]:border-primary/50"
                            >
                                <AccordionTrigger className="text-left text-foreground hover:text-primary py-6">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>

                    {/* Contact CTA */}
                    <div className="mt-16 text-center p-8 bg-card/50 border border-border rounded-lg">
                        <h2 className="text-2xl font-bold text-foreground mb-3">Still have questions?</h2>
                        <p className="text-muted-foreground mb-6">
                            Our team is here to help. Reach out and we'll get back to you within 24 hours.
                        </p>
                        <a
                            href="/contact"
                            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                            Contact Us
                        </a>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
