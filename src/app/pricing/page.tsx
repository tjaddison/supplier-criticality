"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Check, ArrowRight, Building, Building2 as Buildings, Building as BuildingSkyscraper } from 'lucide-react'

// Define colors (reuse from other pages)
const logoTextColor = "#2D2D2D"
const accentColor = "#FF7D4D"

export default function PricingPage() {

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gradient-to-br from-[#f0f9fa] via-white to-[#f0f9fa]">
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="container flex h-20 items-center justify-between mx-auto px-4">
          <Link href="/" className="flex items-center space-x-3 group">
            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
               width="45" height="45" // Applied previous dimensions
               viewBox="0 0 464 342" enableBackground="new 0 0 464 342" xmlSpace="preserve"
               className="transition-transform group-hover:scale-105" // Applied previous classes
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
            <div className="flex flex-col">
              <span className="text-4xl font-extrabold tracking-tight" style={{ color: logoTextColor }}>ProcureSci.</span>
              <span className="text-xs font-medium tracking-[0.15em] uppercase" style={{ color: logoTextColor }}>THE SCIENCE OF PROCUREMENT</span>
            </div>
          </Link>
          <nav className="flex items-center space-x-6 text-base font-semibold">
            <Link href="/solutions" className="text-[#194866] transition-colors hover:text-[#3CDBDD]">Solutions</Link>
            <Link href="/about" className="text-[#194866] transition-colors hover:text-[#3CDBDD]">About</Link>
            <Link href="/pricing" className="text-[#194866] font-bold border-b-2 border-[#3CDBDD]">Pricing</Link>
            <Link href="/contact" className="text-[#194866] transition-colors hover:text-[#3CDBDD]">Contact</Link>
            <a href="/auth/login">
              <Button className="bg-[#194866] text-white shadow-xl hover:bg-[#3CDBDD] transition-all font-bold">Login</Button>
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Pricing Hero Section */}
        <section className="w-full py-20 bg-gradient-to-br from-[#E5F9FA] to-white text-center">
          <div className="container px-4 md:px-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#194866] mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-[#194866]/80 mb-10">
              Choose the plan that fits your organization&apos;s needs. Scale as you grow.
            </p>
            
            <div className="text-center mb-8">
              <p className="text-lg font-semibold text-[#194866]">
                All plans are billed annually
              </p>
            </div>

            {/* Pricing Tiers */}
            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
              {/* Free Tier */}
              <div className="relative flex flex-col p-6 bg-white border rounded-2xl shadow-lg overflow-hidden">
                <div className="text-center mb-6">
                  <div className="mb-3 flex justify-center">
                    <Building className="h-8 w-8 text-[#194866]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#194866]">Free</h3>
                  <div className="mt-3 text-3xl font-bold text-[#194866]">$0<span className="text-sm font-normal text-[#194866]/60"> forever</span></div>
                  <p className="mt-2 text-sm text-[#194866]/70">1-5 suppliers</p>
                </div>

                <ul className="space-y-3 mb-6 flex-1">
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-[#3CDBDD] mr-2 mt-0.5" />
                    <span className="text-sm text-[#194866]">Up to 5 suppliers</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-[#3CDBDD] mr-2 mt-0.5" />
                    <span className="text-sm text-[#194866]">Basic analytics</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-[#3CDBDD] mr-2 mt-0.5" />
                    <span className="text-sm text-[#194866]">Standard reporting</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-[#3CDBDD] mr-2 mt-0.5" />
                    <span className="text-sm text-[#194866]">Email support</span>
                  </li>
                </ul>

                <Button className="w-full bg-[#194866] hover:bg-[#3CDBDD]">
                  Get Started
                </Button>
              </div>
              
              {/* Tier 1 */}
              <div className="relative flex flex-col p-6 bg-white border border-[#3CDBDD] rounded-2xl shadow-xl overflow-hidden">
                <div className="absolute top-0 right-0">
                  <div className="bg-[#FF7D4D] text-white text-xs font-bold px-3 py-1 uppercase">
                    Popular
                  </div>
                </div>

                <div className="text-center mb-6">
                  <div className="mb-3 flex justify-center">
                    <Buildings className="h-8 w-8 text-[#3CDBDD]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#194866]">Tier 1</h3>
                  <div className="mt-3 text-3xl font-bold text-[#194866]">
                    $20k
                    <span className="text-sm font-normal text-[#194866]/60">/year</span>
                  </div>
                  <p className="mt-2 text-sm text-[#194866]/70">6-200 suppliers</p>
                </div>

                <ul className="space-y-3 mb-6 flex-1">
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-[#3CDBDD] mr-2 mt-0.5" />
                    <span className="text-sm text-[#194866]">6-200 suppliers</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-[#3CDBDD] mr-2 mt-0.5" />
                    <span className="text-sm text-[#194866]">Advanced analytics</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-[#3CDBDD] mr-2 mt-0.5" />
                    <span className="text-sm text-[#194866]">Custom reporting</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-[#3CDBDD] mr-2 mt-0.5" />
                    <span className="text-sm text-[#194866]">Priority support</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-[#3CDBDD] mr-2 mt-0.5" />
                    <span className="text-sm text-[#194866]">Risk assessment</span>
                  </li>
                </ul>

                <Link href="/contact">
                  <Button className="w-full bg-[#3CDBDD] hover:bg-[#194866]">
                    Contact Sales
                  </Button>
                </Link>
              </div>
              
              {/* Tier 2 */}
              <div className="relative flex flex-col p-6 bg-white border rounded-2xl shadow-lg overflow-hidden">
                <div className="text-center mb-6">
                  <div className="mb-3 flex justify-center">
                    <Buildings className="h-8 w-8 text-[#194866]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#194866]">Tier 2</h3>
                  <div className="mt-3 text-3xl font-bold text-[#194866]">
                    $35k
                    <span className="text-sm font-normal text-[#194866]/60">/year</span>
                  </div>
                  <p className="mt-2 text-sm text-[#194866]/70">201-500 suppliers</p>
                </div>

                <ul className="space-y-3 mb-6 flex-1">
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-[#3CDBDD] mr-2 mt-0.5" />
                    <span className="text-sm text-[#194866]">201-500 suppliers</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-[#3CDBDD] mr-2 mt-0.5" />
                    <span className="text-sm text-[#194866]">Enhanced analytics</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-[#3CDBDD] mr-2 mt-0.5" />
                    <span className="text-sm text-[#194866]">Advanced reporting</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-[#3CDBDD] mr-2 mt-0.5" />
                    <span className="text-sm text-[#194866]">Priority support</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-[#3CDBDD] mr-2 mt-0.5" />
                    <span className="text-sm text-[#194866]">Risk management</span>
                  </li>
                </ul>

                <Link href="/contact">
                  <Button className="w-full bg-[#194866] hover:bg-[#3CDBDD]">
                    Contact Sales
                  </Button>
                </Link>
              </div>

              {/* Tier 3 */}
              <div className="relative flex flex-col p-6 bg-white border rounded-2xl shadow-lg overflow-hidden">
                <div className="text-center mb-6">
                  <div className="mb-3 flex justify-center">
                    <BuildingSkyscraper className="h-8 w-8 text-[#194866]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#194866]">Tier 3</h3>
                  <div className="mt-3 text-3xl font-bold text-[#194866]">
                    $50k
                    <span className="text-sm font-normal text-[#194866]/60">/year</span>
                  </div>
                  <p className="mt-2 text-sm text-[#194866]/70">501-1500 suppliers</p>
                </div>

                <ul className="space-y-3 mb-6 flex-1">
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-[#3CDBDD] mr-2 mt-0.5" />
                    <span className="text-sm text-[#194866]">501-1500 suppliers</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-[#3CDBDD] mr-2 mt-0.5" />
                    <span className="text-sm text-[#194866]">Enterprise analytics</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-[#3CDBDD] mr-2 mt-0.5" />
                    <span className="text-sm text-[#194866]">Custom reporting</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-[#3CDBDD] mr-2 mt-0.5" />
                    <span className="text-sm text-[#194866]">Account manager</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-[#3CDBDD] mr-2 mt-0.5" />
                    <span className="text-sm text-[#194866]">API access</span>
                  </li>
                </ul>

                <Link href="/contact">
                  <Button className="w-full bg-[#194866] hover:bg-[#3CDBDD]">
                    Contact Sales
                  </Button>
                </Link>
              </div>

              {/* Tier 4 - Enterprise */}
              <div className="relative flex flex-col p-6 bg-white border rounded-2xl shadow-lg overflow-hidden">
                <div className="text-center mb-6">
                  <div className="mb-3 flex justify-center">
                    <BuildingSkyscraper className="h-8 w-8 text-[#194866]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#194866]">Tier 4</h3>
                  <div className="mt-3 text-2xl font-bold text-[#194866]">
                    Enterprise
                  </div>
                  <p className="mt-2 text-sm text-[#194866]/70">1501+ suppliers</p>
                  <p className="text-xs text-[#194866]/60">(contact for info)</p>
                </div>

                <ul className="space-y-3 mb-6 flex-1">
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-[#3CDBDD] mr-2 mt-0.5" />
                    <span className="text-sm text-[#194866]">1501+ suppliers</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-[#3CDBDD] mr-2 mt-0.5" />
                    <span className="text-sm text-[#194866]">Full enterprise suite</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-[#3CDBDD] mr-2 mt-0.5" />
                    <span className="text-sm text-[#194866]">Custom integrations</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-[#3CDBDD] mr-2 mt-0.5" />
                    <span className="text-sm text-[#194866]">Dedicated support</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-[#3CDBDD] mr-2 mt-0.5" />
                    <span className="text-sm text-[#194866]">SLA guarantees</span>
                  </li>
                </ul>

                <Link href="/contact">
                  <Button className="w-full bg-[#194866] hover:bg-[#3CDBDD]">
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="w-full py-20 bg-white">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-extrabold text-center mb-12 text-[#194866]">Frequently Asked Questions</h2>
            
            <div className="max-w-3xl mx-auto space-y-6">
              {/* FAQ Item 1 */}
              <div className="bg-[#F9FDFD] border border-[#E0F7F8] rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-[#194866] mb-2">Can I change plans later?</h3>
                <p className="text-[#194866]/80">
                  Yes, you can upgrade or downgrade your plan at any time. Changes to your subscription will take effect at your next annual billing cycle.
                </p>
              </div>
              
              {/* FAQ Item 2 */}
              <div className="bg-[#F9FDFD] border border-[#E0F7F8] rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-[#194866] mb-2">Is there a free trial for paid plans?</h3>
                <p className="text-[#194866]/80">
                  Start with our Free tier to manage up to 5 suppliers at no cost. For larger supplier bases, contact our sales team for a personalized demo to see how ProcureSci can benefit your specific needs.
                </p>
              </div>
              
              {/* FAQ Item 3 */}
              <div className="bg-[#F9FDFD] border border-[#E0F7F8] rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-[#194866] mb-2">What payment methods do you accept?</h3>
                <p className="text-[#194866]/80">
                  We accept all major credit cards including Visa, Mastercard, and American Express. For Enterprise customers, we also offer invoicing with net-30 payment terms.
                </p>
              </div>
              
              {/* FAQ Item 4 */}
              <div className="bg-[#F9FDFD] border border-[#E0F7F8] rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-[#194866] mb-2">Do you offer discounts for non-profits or educational institutions?</h3>
                <p className="text-[#194866]/80">
                  Yes, we offer special pricing for non-profit organizations, educational institutions, and startups. Please contact our sales team to learn more about our discount programs.
                </p>
              </div>
              
              {/* FAQ Item 5 */}
              <div className="bg-[#F9FDFD] border border-[#E0F7F8] rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-[#194866] mb-2">How does data security work with ProcureSci?</h3>
                <p className="text-[#194866]/80">
                  We take data security seriously. All your data is encrypted both in transit and at rest. We use industry-standard security practices, and our infrastructure is hosted on secure AWS servers. We are compliant with major data protection regulations.
                </p>
              </div>
            </div>
            
            {/* Contact for more questions */}
            <div className="text-center mt-10">
              <p className="text-[#194866]/80 mb-4">Still have questions about our pricing or features?</p>
              <Link href="/contact">
                <Button className="bg-[#194866] hover:bg-[#3CDBDD] transition-all">
                  Contact Our Team
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="w-full py-20 bg-gradient-to-r from-[#194866] to-[#3CDBDD] text-white">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-4xl font-extrabold mb-4">Ready to Transform Your Procurement?</h2>
            <p className="max-w-xl mx-auto text-lg text-[#B6EFF0] mb-8">
              Get started today or contact our sales team for a personalized demo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className={`inline-flex h-14 px-10 py-4 text-xl font-bold bg-[${accentColor}] text-white border-2 border-[${accentColor}] shadow-xl hover:bg-[#FF6A33] transition-all rounded-xl`}>
                  Request a Demo
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
              </Link>
              <Link href="/login">
                <Button className="inline-flex h-14 px-10 py-4 text-xl font-bold bg-transparent text-white border-2 border-white shadow-xl hover:bg-white/10 transition-all rounded-xl">
                  Sign Up Free
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t py-10 bg-gradient-to-r from-[#194866] to-[#3CDBDD] text-white">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-lg font-semibold">© 2025 ProcureSci. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="text-lg text-white/80 transition-colors hover:text-[#B6EFF0]">Terms</Link>
            <Link href="/privacy" className="text-lg text-white/80 transition-colors hover:text-[#B6EFF0]">Privacy</Link>
            <Link href="/contact" className="text-lg text-white/80 transition-colors hover:text-[#B6EFF0]">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
} 