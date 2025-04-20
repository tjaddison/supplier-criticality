"use client"

import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Define colors (reuse or define globally)
// const logoIconTeal = "#3CDBDD";
// const logoIconDarkBlue = "#194866";
const logoTextColor = "#2D2D2D";
// const accentColor = "#FF7D4D"; // Keep consistent if used elsewhere

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-gradient-to-br from-[#f0f9fa] via-white to-[#f0f9fa]">
      {/* Re-use the same Header component or structure */}
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="container flex h-20 items-center justify-between mx-auto px-4">
          <Link href="/" className="flex items-center space-x-3 group">
             {/* Logo SVG */}
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
             {/* Logo Text */}
             <div className="flex flex-col">
               <span className="text-4xl font-extrabold tracking-tight" style={{ color: logoTextColor }}>ProcureSci.</span>
               <span className="text-xs font-medium tracking-[0.15em] uppercase" style={{ color: logoTextColor }}>THE SCIENCE OF PROCUREMENT</span>
             </div>
          </Link>
          <nav className="flex items-center space-x-6 text-base font-semibold">
            <Link href="/solutions" className="text-[#194866] transition-colors hover:text-[#3CDBDD]">Solutions</Link>
            <Link href="/about" className="text-[#194866] transition-colors hover:text-[#3CDBDD]">About</Link>
            <Link href="/pricing" className="text-[#194866] transition-colors hover:text-[#3CDBDD]">Pricing</Link>
            <Link href="/contact" className="text-[#194866] transition-colors hover:text-[#3CDBDD]">Contact</Link>
            {/* Add other links as needed, e.g., Dashboard */}
            <Link href="/login">
              <Button className="bg-[#194866] text-white shadow-xl hover:bg-[#3CDBDD] transition-all font-bold">Login</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 py-16 md:py-24">
        <div className="container px-4 md:px-6 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#194866] mb-8 text-center">
            Privacy Policy
          </h1>
          <div className="prose prose-lg max-w-none text-[#194866]/90 space-y-6" dangerouslySetInnerHTML={{
            __html: `
              <p class="text-sm text-gray-500">Last Updated: April 19, 2025</p>

              <h2 class="text-2xl font-bold text-[#194866]">1. Introduction</h2>
              <p>ProcureSci ("us", "we", or "our") operates the ProcureSci.com website (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data. <strong>"Please replace this generic text with your actual Privacy Policy reviewed by legal counsel."</strong></p>
              <p>We use your data to provide and improve the Service. By using the Service, you agree to the collection and use of information in accordance with this policy.</p>

              <h2 class="text-2xl font-bold text-[#194866]">2. Information Collection and Use</h2>
              <p>We collect several different types of information for various purposes to provide and improve our Service to you.</p>
              <h3 class="text-xl font-semibold text-[#194866]">Types of Data Collected</h3>
              <h4>Personal Data</h4>
              <p>While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you (&ldquo;Personal Data&rdquo;). Personally identifiable information may include, but is not limited to:</p>
              <ul>
                <li>Email address</li>
                <li>First name and last name</li>
                <li>Company Name</li>
                <li>Phone number (Optional)</li>
                <li>Cookies and Usage Data</li>
              </ul>
              <h4>Usage Data</h4>
              <p>We may also collect information on how the Service is accessed and used ("Usage Data"). This Usage Data may include information such as your computer's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data.</p>
              <h4>Tracking & Cookies Data</h4>
              <p>We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.</p>

              <h2 class="text-2xl font-bold text-[#194866]">3. Use of Data</h2>
              <p>ProcureSci uses the collected data for various purposes:</p>
              <ul>
                <li>To provide and maintain our Service</li>
                <li>To notify you about changes to our Service</li>
                <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
                <li>To provide customer support</li>
                <li>To gather analysis or valuable information so that we can improve our Service</li>
                <li>To monitor the usage of our Service</li>
                <li>To detect, prevent and address technical issues</li>
                <li>To process demo requests and contact inquiries</li>
              </ul>

              <h2 class="text-2xl font-bold text-[#194866]">4. Transfer of Data</h2>
              <p>Your information, including Personal Data, may be transferred to — and maintained on — computers located outside of your state, province, country or other governmental jurisdiction where the data protection laws may differ from those from your jurisdiction. **Ensure this reflects your actual data transfer practices and legal compliance (e.g., GDPR adequacy).**</p>

              <h2 class="text-2xl font-bold text-[#194866]">5. Disclosure of Data</h2>
              <p>We may disclose your Personal Data in the good faith belief that such action is necessary to: [List specific legal reasons, e.g., comply with a legal obligation, protect rights, prevent wrongdoing, protect safety, protect against liability]. **Consult legal counsel.**</p>

              <h2 class="text-2xl font-bold text-[#194866]">6. Security of Data</h2>
              <p>The security of your data is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.</p>

              <h2 class="text-2xl font-bold text-[#194866]">7. Your Data Protection Rights (Example: GDPR)</h2>
              <p>If you are a resident of the European Economic Area (EEA), you have certain data protection rights. ProcureSci aims to take reasonable steps to allow you to correct, amend, delete, or limit the use of your Personal Data. [Detail specific rights like access, rectification, erasure, restriction, objection, portability]. **This section MUST be tailored based on applicable laws (GDPR, CCPA, etc.) and reviewed by legal counsel.**</p>

              <h2 class="text-2xl font-bold text-[#194866]">8. Service Providers</h2>
              <p>We may employ third-party companies and individuals to facilitate our Service ("Service Providers"), provide the Service on our behalf, perform Service-related services or assist us in analyzing how our Service is used. [List types of providers, e.g., hosting, analytics, email].</p>

              <h2 class="text-2xl font-bold text-[#194866]">9. Links to Other Sites</h2>
              <p>Our Service may contain links to other sites that are not operated by us. If you click a third party link, you will be directed to that third party&apos;s site. We strongly advise you to review the Privacy Policy of every site you visit.</p>

              <h2 class="text-2xl font-bold text-[#194866]">10. Children&apos;s Privacy</h2>
              <p>Our Service does not address anyone under the age of 18 (&ldquo;Children&rdquo;). We do not knowingly collect personally identifiable information from anyone under the age of 18. **Verify age threshold based on applicable laws like COPPA.**</p>

              <h2 class="text-2xl font-bold text-[#194866]">11. Changes to This Privacy Policy</h2>
              <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.</p>

              <h2 class="text-2xl font-bold text-[#194866]">12. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please <Link href="/contact" className="text-[#3CDBDD] hover:underline">contact us</Link>.</p>
            `
          }} />
        </div>
      </main>

      {/* Re-use the same Footer component or structure */}
      <footer className="w-full border-t py-10 bg-gradient-to-r from-[#194866] to-[#3CDBDD] text-white">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-lg font-semibold">© 2025 ProcureSci. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="text-lg text-white/80 transition-colors hover:text-[#B6EFF0]">Terms</Link>
            {/* Highlight Privacy link */}
            <Link href="/privacy" className="text-lg text-white font-bold border-b-2 border-white">Privacy</Link>
            <Link href="/contact" className="text-lg text-white/80 transition-colors hover:text-[#B6EFF0]">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
} 