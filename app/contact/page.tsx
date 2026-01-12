"use client"

import { useState } from "react"
import { Starfield } from "@/components/ui/starfield"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react"

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1500))

        setIsSubmitting(false)
        setIsSubmitted(true)
    }

    return (
        <>
            <Starfield />
            <Header />
            <main className="min-h-screen pt-24 pb-16">
                <div className="container mx-auto px-4 max-w-6xl">
                    {/* Page Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            Get In Touch
                        </h1>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Have a question or need assistance? We'd love to hear from you.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Contact Form */}
                        <Card className="bg-card/50 border-border">
                            <CardHeader>
                                <CardTitle className="text-foreground">Send us a message</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {isSubmitted ? (
                                    <div className="text-center py-12">
                                        <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                                            <Send className="h-8 w-8 text-green-500" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-foreground mb-2">Message Sent!</h3>
                                        <p className="text-muted-foreground">
                                            Thank you for reaching out. We'll get back to you within 24 hours.
                                        </p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Name</Label>
                                                <Input
                                                    id="name"
                                                    placeholder="Your name"
                                                    required
                                                    className="bg-background"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    placeholder="your@email.com"
                                                    required
                                                    className="bg-background"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="subject">Subject</Label>
                                            <Input
                                                id="subject"
                                                placeholder="How can we help?"
                                                required
                                                className="bg-background"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="message">Message</Label>
                                            <Textarea
                                                id="message"
                                                placeholder="Tell us more about your inquiry..."
                                                rows={5}
                                                required
                                                className="bg-background resize-none"
                                            />
                                        </div>

                                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                                            {isSubmitting ? "Sending..." : "Send Message"}
                                        </Button>
                                    </form>
                                )}
                            </CardContent>
                        </Card>

                        {/* Contact Information */}
                        <div className="space-y-6">
                            <Card className="bg-card/50 border-border">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <MapPin className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-foreground mb-1">Our Location</h3>
                                            <p className="text-muted-foreground">
                                                Khewra Salt Range<br />
                                                Punjab, Pakistan
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-card/50 border-border">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <Mail className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-foreground mb-1">Email Us</h3>
                                            <p className="text-muted-foreground">
                                                <a href="mailto:info@namakhalal.pk" className="hover:text-primary transition-colors">
                                                    info@namakhalal.pk
                                                </a>
                                            </p>
                                            <p className="text-muted-foreground">
                                                <a href="mailto:support@namakhalal.pk" className="hover:text-primary transition-colors">
                                                    support@namakhalal.pk
                                                </a>
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-card/50 border-border">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <Phone className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-foreground mb-1">Call Us</h3>
                                            <p className="text-muted-foreground">
                                                <a href="tel:+923001234567" className="hover:text-primary transition-colors">
                                                    +92 300 123 4567
                                                </a>
                                            </p>
                                            <p className="text-muted-foreground">
                                                <a href="tel:+923009876543" className="hover:text-primary transition-colors">
                                                    +92 300 987 6543
                                                </a>
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-card/50 border-border">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <Clock className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-foreground mb-1">Business Hours</h3>
                                            <p className="text-muted-foreground">Monday - Saturday: 9:00 AM - 8:00 PM</p>
                                            <p className="text-muted-foreground">Sunday: 10:00 AM - 6:00 PM</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
