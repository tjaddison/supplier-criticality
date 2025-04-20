"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  ArrowRight, BarChart2, Zap, DollarSign, Users, TrendingUp, Star, HeartHandshake, Lightbulb, ShieldCheck, Globe2, UserCheck, Trophy, Building2, Briefcase, UserCircle
} from 'lucide-react'

// Define logo colors based on the image
const logoIconTeal = "#3CDBDD"; // Teal from the icon
const logoIconDarkBlue = "#194866"; // Dark blue from the icon
const logoTextColor = "#2D2D2D"; // Dark brown/black from the text

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-gradient-to-br from-[#f0f9fa] via-white to-[#f0f9fa]">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="container flex h-20 items-center justify-between mx-auto px-4">
          <Link href="/" className="flex items-center space-x-3 group">
            {/* SVG Logo Icon */}
            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
              width="45" height="45"
              viewBox="0 0 464 342" enableBackground="new 0 0 464 342" xmlSpace="preserve"
              className="transition-transform group-hover:scale-105"
            >
              <path fill="#FEFFFF" opacity="1.000000" stroke="none"
                d="
              M336.000000,343.000000
                C224.034576,343.000000 112.569160,343.000000 1.051868,343.000000
                C1.051868,229.069946 1.051868,115.139877 1.051868,1.000000
                C78.239288,1.000000 155.478775,1.000000 232.718246,1.000000
                C310.027588,1.000000 387.336945,1.000000 464.823151,1.000000
                C464.823151,114.999771 464.823151,228.999863 464.823151,343.000000
                C422.139923,343.000000 379.319977,343.000000 336.000000,343.000000
              M282.609009,239.294495
                C308.418152,239.301193 334.227325,239.329773 360.036285,239.264404
                C361.720520,239.260132 363.402924,238.535263 365.620636,237.667282
                C371.003113,224.055740 376.380280,210.442093 381.768982,196.833023
                C404.492828,139.444260 427.223541,82.058228 449.935547,24.664780
                C451.012421,21.943533 451.934540,19.161034 453.181519,15.706773
                C450.639923,15.706773 448.843231,15.706771 447.046539,15.706773
                C374.718842,15.706850 302.391022,15.759755 230.063736,15.587185
                C225.282944,15.575779 223.014282,17.039614 221.315048,21.425974
                C211.460648,46.863766 201.255005,72.165527 191.411011,97.607262
                C190.082047,101.041954 188.406708,101.982040 184.910217,101.961220
                C160.412994,101.815384 135.913101,102.017067 111.417664,101.762047
                C106.947166,101.715500 104.936646,103.305618 103.461639,107.232491
                C99.016922,119.065598 94.306358,130.799255 89.660568,142.556351
                C66.365372,201.509506 43.054688,260.456543 19.768360,319.413208
                C19.019539,321.309082 18.475508,323.285889 17.798775,325.337830
                C19.022299,325.594055 19.505806,325.783905 19.989367,325.784058
                C94.483368,325.805481 168.977448,325.837341 243.471039,325.664612
                C245.114914,325.660797 247.580353,323.658661 248.264832,322.008789
                C254.321396,307.409943 260.027039,292.665985 265.905670,277.992676
                C271.098663,265.030731 276.380310,252.104294 282.609009,239.294495
                z"/>
              <path fill="#37E2EB" opacity="1.000000" stroke="none"
                d="
              M281.622803,239.162170
                C276.380310,252.104294 271.098663,265.030731 265.905670,277.992676
                C260.027039,292.665985 254.321396,307.409943 248.264832,322.008789
                C247.580353,323.658661 245.114914,325.660797 243.471039,325.664612
                C168.977448,325.837341 94.483368,325.805481 19.989367,325.784058
                C19.505806,325.783905 19.022299,325.594055 17.798775,325.337830
                C18.475508,323.285889 19.019539,321.309082 19.768360,319.413208
                C43.054688,260.456543 66.365372,201.509506 89.660568,142.556351
                C94.306358,130.799255 99.016922,119.065598 103.461639,107.232491
                C104.936646,103.305618 106.947166,101.715500 111.417664,101.762047
                C135.913101,102.017067 160.412994,101.815384 184.910217,101.961220
                C188.406708,101.982040 190.082047,101.041954 191.411011,97.607262
                C201.255005,72.165527 211.460648,46.863766 221.315048,21.425974
                C223.014282,17.039614 225.282944,15.575779 230.063736,15.587185
                C302.391022,15.759755 374.718842,15.706850 447.046539,15.706773
                C448.843231,15.706771 450.639923,15.706773 453.181519,15.706773
                C451.934540,19.161034 451.012421,21.943533 449.935547,24.664780
                C427.223541,82.058228 404.492828,139.444260 381.768982,196.833023
                C376.380280,210.442093 371.003113,224.055740 365.182037,237.539764
                C359.126221,211.427765 353.502777,185.444656 347.893921,159.458389
                C343.873688,140.832382 339.872864,122.202164 335.569672,102.209274
                C334.344696,105.042107 333.603638,106.638306 332.955780,108.271454
                C321.187042,137.938904 309.380463,167.591507 297.691132,197.290222
                C292.216003,211.200684 286.971710,225.202011 281.622803,239.162170
                z"/>
              <path fill="#16455E" opacity="1.000000" stroke="none"
                d="
              M282.115906,239.228333
                C286.971710,225.202011 292.216003,211.200684 297.691132,197.290222
                C309.380463,167.591507 321.187042,137.938904 332.955780,108.271454
                C333.603638,106.638306 334.344696,105.042107 335.569672,102.209274
                C339.872864,122.202164 343.873688,140.832382 347.893921,159.458389
                C353.502777,185.444656 359.126221,211.427765 364.914795,237.778915
                C363.402924,238.535263 361.720520,239.260132 360.036285,239.264404
                C334.227325,239.329773 308.418152,239.301193 282.115906,239.228333
                z"/>
            </svg>
            {/* Logo Text and Tagline */}
            <div className="flex flex-col">
              <span
                className="text-4xl font-extrabold tracking-tight"
                style={{ color: logoTextColor }}
              >
                ProcureSci.
              </span>
              <span
                className="text-xs font-medium tracking-[0.15em] uppercase"
                style={{ color: logoTextColor }}
              >
                THE SCIENCE OF PROCUREMENT
              </span>
            </div>
          </Link>
          <nav className="flex items-center space-x-6 text-base font-semibold">
            <Link href="/solutions" className="text-[#194866] transition-colors hover:text-[#3CDBDD]">Solutions</Link>
            <Link href="/about" className="text-[#194866] transition-colors hover:text-[#3CDBDD]">About</Link>
            <Link href="/pricing" className="text-[#194866] transition-colors hover:text-[#3CDBDD]">Pricing</Link>
            <Link href="/dashboard">
              <Button className="bg-[#194866] text-white shadow-xl hover:bg-[#3CDBDD] transition-all font-bold">Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-24 md:py-36 xl:py-48 bg-gradient-to-br from-[#194866] to-[#3CDBDD] overflow-hidden shadow-2xl">
          <div className="absolute inset-0 pointer-events-none">
            {/* Decorative SVGs */}
            <svg className="absolute top-0 left-0 w-96 h-96 opacity-30" viewBox="0 0 400 400" fill="none">
              <circle cx="200" cy="200" r="200" fill="url(#heroGradient)" />
              <defs>
                <linearGradient id="heroGradient" x1="0" y1="0" x2="400" y2="400" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#B6EFF0" />
                  <stop offset="1" stopColor="#194866" />
                </linearGradient>
              </defs>
            </svg>
            <svg className="absolute bottom-0 right-0 w-80 h-80 opacity-20" viewBox="0 0 320 320" fill="none">
              <circle cx="160" cy="160" r="160" fill="#3CDBDD" />
            </svg>
          </div>
          <div className="container relative z-10 px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-[1fr_500px] lg:gap-20 xl:grid-cols-[1fr_550px] items-center">
              <div className="flex flex-col justify-center space-y-8 animate-fadein">
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-tight text-white drop-shadow-2xl">
                  <span className="block">Procurement</span>
                  <span className="block">intelligence that <span className="text-[#B6EFF0]">sparks action</span></span>
                </h1>
                <p className="max-w-[600px] text-white md:text-2xl font-medium drop-shadow">
                  Standardized, scalable supplier segmentation with tools that help procurement teams <span className="font-semibold text-[#B6EFF0]">prioritize</span>, <span className="font-semibold text-white">strategize</span>, and <span className="font-semibold text-[#B6EFF0]">act</span>.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/contact">
                    <Button className="inline-flex h-14 px-8 py-3 text-xl font-bold bg-[#FF7D4D] text-white shadow-2xl hover:bg-[#FF6A33] transition-all rounded-xl">
                      Request a Demo
                      <ArrowRight className="ml-2 h-6 w-6" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-[500px] aspect-square overflow-hidden rounded-3xl border-4 border-[#B6EFF0] bg-white/80 shadow-2xl flex items-center justify-center backdrop-blur-lg animate-fadein-slow">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#E5F9FA] via-white to-white opacity-60" />
                  <p className="text-3xl text-[#194866] font-extrabold drop-shadow">Dashboard Preview</p>
                </div>
              </div>
            </div>
          </div>
          {/* SVG Wave Divider */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
            <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill="#f0f9fa" fillOpacity="1" d="M0,32L48,37.3C96,43,192,53,288,69.3C384,85,480,107,576,101.3C672,96,768,64,864,53.3C960,43,1056,53,1152,69.3C1248,85,1344,107,1392,117.3L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
            </svg>
          </div>
        </section>

        {/* Featured In / Trusted By */}
        <section className="w-full py-8 bg-gradient-to-r from-[#E5F9FA] via-white to-white border-b">
          <div className="container flex flex-wrap items-center justify-center gap-8">
            <span className="text-lg font-bold text-[#194866] flex items-center gap-2"><Building2 className="h-6 w-6" /> Trusted by Fortune 500</span>
            <span className="text-lg font-bold text-[#194866] flex items-center gap-2"><Briefcase className="h-6 w-6" /> Used by Top Procurement Teams</span>
            <span className="text-lg font-bold text-[#194866] flex items-center gap-2"><Trophy className="h-6 w-6" /> Industry Award Winner</span>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full py-16 bg-gradient-to-br from-[#E5F9FA] to-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl text-[#194866]">
                Data-driven results for modern procurement
              </h2>
              <p className="max-w-[900px] text-[#194866] md:text-xl/relaxed">
                In an industry facing growing workloads, rising prices, and talent gaps, ProcureSci helps you do more with less.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 rounded-2xl bg-white/90 border-2 border-[#3CDBDD] p-10 shadow-2xl hover:scale-105 transition-transform duration-300">
                <Zap className="h-12 w-12 text-[#3CDBDD] animate-bounce" />
                <h3 className="text-4xl font-extrabold text-[#194866]">30%</h3>
                <p className="text-center text-[#194866] font-semibold">Time saved on supplier-related activities</p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-2xl bg-white/90 border-2 border-[#194866] p-10 shadow-2xl hover:scale-105 transition-transform duration-300">
                <DollarSign className="h-12 w-12 text-[#194866] animate-pulse" />
                <h3 className="text-4xl font-extrabold text-[#194866]">15%</h3>
                <p className="text-center text-[#194866] font-semibold">Cost savings by focusing on high-value suppliers</p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-2xl bg-white/90 border-2 border-[#FF7D4D] p-10 shadow-2xl hover:scale-105 transition-transform duration-300">
                <TrendingUp className="h-12 w-12 text-[#FF7D4D] animate-bounce" />
                <h3 className="text-4xl font-extrabold text-[#194866]">10-20%</h3>
                <p className="text-center text-[#194866] font-semibold">Increase in supplier innovation</p>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="w-full py-20 bg-gradient-to-br from-[#E5F9FA] to-white">
          <div className="container px-4 md:px-6">
            <h2 className="text-4xl font-extrabold text-center mb-12 text-[#194866]">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-10">
              <div className="flex flex-col items-center space-y-4 bg-white/90 rounded-2xl p-8 shadow-lg border-2 border-[#194866]">
                <span className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#194866] to-[#3CDBDD] text-white text-3xl font-bold shadow-lg">1</span>
                <h3 className="text-xl font-bold text-[#194866]">Macro View</h3>
                <p className="text-center text-[#194866]">See all suppliers, ranked by importance to operations.</p>
              </div>
              <div className="flex flex-col items-center space-y-4 bg-white/90 rounded-2xl p-8 shadow-lg border-2 border-[#3CDBDD]">
                <span className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#3CDBDD] to-[#194866] text-white text-3xl font-bold shadow-lg">2</span>
                <h3 className="text-xl font-bold text-[#194866]">Micro View</h3>
                <p className="text-center text-[#194866]">Drill down to specific suppliers and compare dynamically.</p>
              </div>
              <div className="flex flex-col items-center space-y-4 bg-white/90 rounded-2xl p-8 shadow-lg border-2 border-[#FF7D4D]">
                <span className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#FF7D4D] to-[#194866] text-white text-3xl font-bold shadow-lg">3</span>
                <h3 className="text-xl font-bold text-[#194866]">Eisenhower Matrix</h3>
                <p className="text-center text-[#194866]">Visualize supplier priority and condition for action.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="w-full py-20 bg-gradient-to-br from-[#E5F9FA] to-white">
          <div className="container px-4 md:px-6">
            <div className="max-w-2xl mx-auto text-center">
              <div className="inline-block px-8 py-6 rounded-2xl bg-white/90 shadow-2xl border-2 border-[#194866]">
                <p className="text-2xl md:text-3xl font-semibold text-[#194866] italic">
                  &quot;ProcureSci gave us the clarity and tools to transform our supplier relationships. We saved time, cut costs, and our team is more strategic than ever.&quot;
                </p>
                <div className="mt-4 flex flex-col items-center">
                  <span className="font-bold text-[#194866]">Director of Procurement</span>
                  <span className="text-[#3CDBDD] text-sm">Fortune 500 Company</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-20 bg-gradient-to-r from-[#194866] to-[#3CDBDD] text-white shadow-2xl">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-8 text-center">
              <h2 className="text-5xl font-extrabold tracking-tighter sm:text-6xl md:text-7xl drop-shadow-2xl">
                Ready to Transform Your Procurement Strategy?
              </h2>
              <p className="max-w-[900px] md:text-2xl/relaxed text-[#B6EFF0] font-semibold">
                Join other procurement leaders who have streamlined their operations, reduced costs, and improved supplier relationships.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/contact">
                  <Button className="inline-flex h-14 px-10 py-4 text-xl font-bold bg-[#FF7D4D] text-white border-2 border-[#FF7D4D] shadow-2xl hover:bg-[#FF6A33] transition-all rounded-xl">
                    Request a Demo
                    <ArrowRight className="ml-2 h-6 w-6" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t py-10 bg-gradient-to-r from-[#194866] to-[#3CDBDD] text-white">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-lg font-semibold">© 2024 ProcureSci. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="text-lg text-white/80 transition-colors hover:text-[#B6EFF0]">Terms</Link>
            <Link href="/privacy" className="text-lg text-white/80 transition-colors hover:text-[#B6EFF0]">Privacy</Link>
            <Link href="/contact" className="text-lg text-white/80 transition-colors hover:text-[#B6EFF0]">Contact</Link>
          </div>
        </div>
      </footer>
      <style jsx global>{`
        @keyframes fadein {
          from { opacity: 0; transform: translateY(40px);}
          to { opacity: 1; transform: none;}
        }
        .animate-fadein {
          animation: fadein 1.2s cubic-bezier(.4,0,.2,1) both;
        }
        .animate-fadein-slow {
          animation: fadein 2s cubic-bezier(.4,0,.2,1) both;
        }
      `}</style>
    </div>
  )
} 