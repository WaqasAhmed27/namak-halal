import Image from "next/image"
import Link from "next/link"
import { ArrowRight, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

export function OriginSection() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
            <Image src="/khewra-salt-mine-pakistan-underground-orange-glow.jpg" alt="Khewra Salt Mine, Pakistan" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            <div className="absolute bottom-6 left-6 flex items-center gap-2 text-foreground">
              <MapPin className="h-5 w-5 text-primary" />
              <span className="font-medium">Khewra, Punjab, Pakistan</span>
            </div>
          </div>

          {/* Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              From the Heart of the <span className="text-primary">Khewra Mines</span>
            </h2>
            <div className="space-y-4 text-muted-foreground mb-8">
              <p>
                The Khewra Salt Mine is the world&apos;s second-largest salt mine, with a history dating back over 2,000
                years. Located in the Punjab region of Pakistan, this ancient mine produces the purest Himalayan pink
                salt known to humankind.
              </p>
              <p>
                Each of our lamps is carved from salt crystals formed over 250 million years ago, during the Precambrian
                era. The distinctive pink color comes from trace minerals including iron, magnesium, and potassium.
              </p>
              <p>
                We work directly with skilled artisans in Khewra who have passed down their craft through generations,
                ensuring every lamp is carved with care and authenticity.
              </p>
            </div>
            <Button asChild variant="outline" className="group bg-transparent">
              <Link href="/about">
                Learn More About Our Story
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
