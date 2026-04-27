import { logodark } from "@/assets/images";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-white !max-w-[1400px] mx-auto pt-16 pb-4 lg:px-4">
      <div className="container lg:px-0 px-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <img className="h-8" src={logodark} alt="Logo" />
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed">
              Condimentum adipiscing vel neque dis nam parturient orci at
              scelerisque neque dis nam parturient. Ipsum sdilo tde molrt
              person ole epar dis na virgsias
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>451 Wall Street, UK, London</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>Phone: (064) 332-1233</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Email: support@goodberry.com</span>
              </div>
            </div>
          </div>

          {/* Our Stores */}
          <div>
            <h3 className="text-lg font-semibold mb-4">OUR STORES</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-600 hover:text-gray-900 text-sm">India</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-gray-900 text-sm">New York</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-gray-900 text-sm">Edinburgh</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-gray-900 text-sm">Los Angeles</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-gray-900 text-sm">Chicago</Link></li>
            </ul>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">USEFUL LINKS</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-600 hover:text-gray-900 text-sm">Privacy Policy</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-gray-900 text-sm">Returns</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-gray-900 text-sm">Terms & Conditions</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-gray-900 text-sm">Contact Us</Link></li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4">ABOUT</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-600 hover:text-gray-900 text-sm">Instagram profile</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-gray-900 text-sm">Facebook profile</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-gray-900 text-sm">LinkedIn profile</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-gray-900 text-sm">Contact Us</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-gray-900 text-sm">Latest News</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-4  border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              WILDSPRING © 2024 CREATED BY SPECZ1N
            </p>
            <div className="flex items-center gap-2">
              <img src="/src/assets/images/payments.png" className="h-auto w-auto" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}