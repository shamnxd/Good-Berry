import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { background, product } from "@/assets/hero"
import { useNavigate } from "react-router-dom"

const banners = [
  {
    id: 1,
    backgroundImage: background,
    productImage: product,
    title: "SOUR\nGREEN APPLE\nICE CREAM",
    subtitle: "IT IS A LONG ESTABLISHED FACT THAT A READER WILL",
  },
  // {
  //   id: 2,
  //   backgroundImage: "/src/assets/hero/organic-slide-bg-2.jpg",
  //   productImage: "/src/assets/hero/organic-slide-2-img-535x487.png",
  //   title: "ORGANIC\nSUN DRIED\nEXOTIC FRUITS",
  //   subtitle: "IT IS A LONG ESTABLISHED FACT THAT A READER WILL",
  // },
  // {
  //   id: 3,
  //   backgroundImage: "/src/assets/hero/organic-slide-bg-3.jpg",
  //   productImage: "/src/assets/hero/organic-slide-3-img-535x487.png",
  //   title: "JUICE\nIS THE BEST\nDRINK FOR YOU",
  //   subtitle: "IT IS A LONG ESTABLISHED FACT THAT A READER WILL",
  // },
]

export default function HeroBanner() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % banners.length)
      }, 10000) // Change banner every 10 seconds

      return () => clearInterval(interval)
    }
  }, [])

  const banner = banners[currentBanner]

  return (
    <section className="relative overflow-hidden" style={{ height: "100vh" }}>
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
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 mx-auto max-w-7xl h-full">
        <div className="banner-content grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8 h-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="banner-flex flex items-center justify-center"
          >
            <img src={banner.productImage || "/placeholder.svg"} alt="Product" className="mt-12 max-w-full h-auto max-h-[487px] banner-img" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="hero flex flex-col justify-center text-right p-12 pl-0"
          >
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl whitespace-pre-line">
              {banner.title}
            </h1>
            <p className="mt-4 text-lg text-white/90">{banner.subtitle}</p>
            <div className="banner-buttons  mt-8 flex gap-4 justify-center pr-12">
              <Button
                size="lg"
                className="hidden md:block border-2 bg-transparent text-white hover:bg-white/90 hover:text-black rounded-full h-12"
                onClick={() => navigate("/shop")}
              >
                SHOP NOW
              </Button>
              <Button size="lg" className="bg-[#83ac2b] hover:bg-[#7AB32E] text-white rounded-full h-12" onClick={() => navigate("/shop")}>
                VIEW MORE
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

