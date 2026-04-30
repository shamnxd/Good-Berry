import { Button } from '@/components/ui/button';
import { Phone, Mailbox, MapPin, Clock, Instagram, Facebook, Twitter } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="container mx-auto max-w-[1400px] px-4 py-12 space-y-16 mt-10">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-[#90c846]">Get in Touch</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          We&apos;d love to hear from you! Whether you have a question about our products,
          need support, or just want to share your feedback, our team is ready to help.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Information */}
        <div className="space-y-8">
          <div className="bg-green-50 p-8 rounded-xl space-y-6">
            <h2 className="text-2xl font-bold text-[#90c846]">Contact Details</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <Phone className="text-[#90c846] mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold">Phone</h3>
                  <p className="text-gray-600">+91 96566 33324</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mailbox className="text-[#90c846] mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-gray-600">support@goodberry.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin className="text-[#90c846] mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold">Address</h3>
                  <p className="text-gray-600">
                    123 Nature&apos;s Way<br />
                    Green Valley, CA 98765
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="text-[#90c846] mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold">Hours</h3>
                  <p className="text-gray-600">
                    Mon-Fri: 9 AM - 6 PM PST<br />
                    Sat: 10 AM - 4 PM PST
                  </p>
                </div>
              </div>
            </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-[#90c846]">Follow Us</h3>
            <div className="flex gap-6">
              <a href="#" className="text-gray-600 hover:text-[#90c846] transition-colors">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-gray-600 hover:text-[#90c846] transition-colors">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-gray-600 hover:text-[#90c846] transition-colors">
                <Twitter size={24} />
              </a>
            </div>
          </div>
        </div>
          </div>

        {/* Contact Form */}
        <div className="bg-white p-8 rounded-xl shadow-sm">
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                rows={4}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              ></textarea>
            </div>

            <Button
              type="submit"
              className="w-full text-white py-3 px-6 rounded-lg font-medium transition-colors"
            >
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}