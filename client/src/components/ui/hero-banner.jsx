import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { background, product } from "@/assets/hero"
import { useNavigate } from "react-router-dom"
import MESSAGES from '../../constants/messages';


const banners = [
  {
    id: 1,
    backgroundImage: background,
    productImage: product,
    title: MESSAGES.SOUR_NGREEN_APPLE_NICE_CREAM,
    subtitle: MESSAGES.IT_IS_A_LONG_ESTABLISHED_FACT_THAT_A_READER_WILL,
  },
  {
    id: 2,
    backgroundImage: "/src/assets/hero/organic-slide-bg-2.jpg",
    productImage: "/src/assets/hero/organic-slide-2-img-535x487.png",
    title: MESSAGES.ORGANIC_NSUN_DRIED_NEXOTIC_FRUITS,
    subtitle: MESSAGES.IT_IS_A_LONG_ESTABLISHED_FACT_THAT_A_READER_WILL,
  },
  {
    id: 3,
    backgroundImage: "/src/assets/hero/organic-slide-bg-3.jpg",
    productImage: "/src/assets/hero/organic-slide-3-img-535x487.png",
    title: MESSAGES.JUICE_NIS_THE_BEST_NDRINK_FOR_YOU,
    subtitle: MESSAGES.IT_IS_A_LONG_ESTABLISHED_FACT_THAT_A_READER_WILL,
  },
]

export default function HeroBanner() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % banners.length)
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [])

  const banner = banners[currentBanner]

  return (
    <>
      {/* Mobile Design (Matching Image) - Only visible on small screens */}
      <section className="block sm:hidden bg-white px-4 py-4 pt-20">
        <div className="relative h-[270px] w-full rounded-[1.6rem] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={banner.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0"
            >
              {/* Background Image */}
              <img
                src={banner.backgroundImage || "/placeholder.svg"}
                alt="Background"
                className="w-full h-full object-cover"
              />
              
              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-black/10" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Content Overlay - Side by Side Layout */}
              <div className="absolute inset-0 flex flex-row items-center p-6 gap-2 text-left">
                {/* Left Side: Product Image */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: -20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="w-1/2 flex justify-center"
                >
                  <img 
                    src={banner.productImage} 
                    alt="Product" 
                    className="w-full h-auto max-h-[280px] object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.4)]" 
                  />
                </motion.div>

                {/* Right Side: Text & Actions */}
                <div className="w-1/2 flex flex-col items-start justify-center">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-1 mb-4"
                  >
                    <span className="text-white/90 text-[10px] font-bold tracking-[0.2em] uppercase">
                      New Arrivals
                    </span>
                    <h1 className="text-white text-xl font-black leading-tight uppercase tracking-tight">
                      {banner.title.split('\n').join(' ')}
                    </h1>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Button
                      onClick={() => navigate("/shop")}
                      className="bg-white/20 backdrop-blur-lg border border-white/30 text-white rounded-full px-5 h-9 text-[10px] font-bold hover:bg-white/40 transition-all shadow-lg uppercase"
                    >
                      Shop Now
                    </Button>
                  </motion.div>
                </div>
                
                {/* Pagination Dots (Positioned at Bottom Center) */}
                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
                  {banners.map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        currentBanner === i ? 'bg-[#8CC63F] w-4' : 'bg-white/40 w-1.5'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Desktop & Tablet Design (Restored to Original) - Hidden on mobile */}
      <section className="hidden sm:flex relative overflow-hidden h-screen items-center">
        <AnimatePresence initial={false}>
          <motion.div
            key={banner.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <img
              src={banner.backgroundImage || "/placeholder.svg"}
              alt="Background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/10" />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="w-full lg:w-1/2 flex items-center justify-center lg:order-2"
            >
              <img 
                src={banner.productImage || "/placeholder.svg"} 
                alt="Product" 
                className="w-[350px] lg:w-full max-w-[500px] h-auto object-contain drop-shadow-2xl" 
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left lg:order-1"
            >
              <h1 className="text-4xl lg:text-7xl font-bold tracking-tight text-white font-signika leading-tight whitespace-pre-line uppercase">
                {banner.title}
              </h1>
              <p className="mt-4 text-lg lg:text-xl text-white/90 max-w-md">
                {banner.subtitle}
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Button
                  size="lg"
                  className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-black rounded-full px-10 h-14 text-base font-bold transition-all duration-300 uppercase tracking-wider"
                  onClick={() => navigate("/shop")}
                >
                  Shop Now
                </Button>
                <Button 
                  size="lg" 
                  className="bg-[#8CC63F] hover:bg-[#7AB32E] text-white rounded-full px-10 h-14 text-base font-bold shadow-lg transition-all duration-300 uppercase tracking-wider" 
                  onClick={() => navigate("/shop")}
                >
                  View More
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}

