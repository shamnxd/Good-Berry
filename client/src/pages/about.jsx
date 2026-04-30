import { Button } from "@/components/ui/button";
import {BadgeDollarSign, CheckCircle, HeartHandshake, Leaf, TreePine, Truck, Users } from "lucide-react";
import MESSAGES from '../constants/messages';


export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-[1400px] px-4 py-12 space-y-16 mt-10">
      {/* Hero Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[#90c846]">
            <Leaf size={36} />
            <h1 className="text-4xl font-bold">Goodberry</h1>
          </div>
          <p className="text-2xl font-semibold">
            Nourishing Lives with Nature&apos;s Goodness
          </p>
          <p className="text-gray-600 text-lg">
            At Goodberry, we&apos;re passionate about bringing you the purest natural products
            straight from nature&apos;s bounty. Our commitment to quality ensures every
            product enhances your well-being while preserving the environment.
          </p>
        </div>
      </div>
      
      {/* Why Choose Us */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold text-center">Why Choose Goodberry</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { icon: CheckCircle, title: MESSAGES.NATURAL_100, text: 'No artificial additives or preservatives' },
            { icon: TreePine, title: MESSAGES.ECO_FRIENDLY, text: 'Sustainable packaging and practices' },
            { icon: Truck, title: MESSAGES.FAST_DELIVERY, text: 'Fresh products to your doorstep' },
            { icon: BadgeDollarSign, title: MESSAGES.FAIR_PRICING, text: 'Quality you can afford' },
          ].map((item, index) => (
            <div key={index} className="flex gap-4">
              <item.icon size={32} className="text-[#90c846] flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-gray-600">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Team CTA */}
      <div className="p-8 text-center bg-white rounded-xl shadow-sm space-y-4">
        <Users size={48} className="mx-auto text-[#90c846]" />
        <h2 className="text-2xl font-bold">Meet Our Naturalists</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Our team of food scientists and nutrition experts work tirelessly to maintain
          the highest standards of quality and nutritional value in every product.
        </p>
        <Button className="primary text-white px-6 py-3 rounded-lg font-medium transition-colors">
          Contact Our Team
        </Button>
      </div>
    </div>
  );
}
