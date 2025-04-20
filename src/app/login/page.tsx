"use client"

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Use next/navigation for App Router
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from 'lucide-react';

// Define colors (reuse or define globally)
// const logoIconTeal = "#3CDBDD";
// const logoIconDarkBlue = "#194866";
const logoTextColor = "#2D2D2D";
const accentColor = "#FF7D4D";

export default function LoginPage() {
  // Pre-fill state with mock credentials
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState(''); // Keep error state in case needed later
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous errors (though none should occur with this logic)

    // --- Direct Navigation ---
    // Directly navigate to the dashboard without checking credentials
    console.log('Login button clicked, redirecting to dashboard...');
    router.push('/dashboard');
    // --- End Direct Navigation ---

    /* --- Previous Dummy Credentials Check (Commented out) ---
    if (email === 'test@example.com' && password === 'password') {
      console.log('Login successful, redirecting...');
      router.push('/dashboard'); // Redirect to dashboard
    } else {
      setError('Invalid email or password.');
    }
    --- End Dummy Check --- */
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gradient-to-br from-[#f0f9fa] via-white to-[#f0f9fa]">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="container flex h-20 items-center justify-between mx-auto px-4">
          <Link href="/" className="flex items-center space-x-3 group">
            {/* Updated SVG Logo */}
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
            {/* Login Button */}
            <Link href="/login">
              <Button className="bg-[#194866] text-white shadow-xl hover:bg-[#3CDBDD] transition-all font-bold">Login</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content - Login Form */}
      <main className="flex-1 flex items-center justify-center py-12 md:py-24">
        <Card className="w-full max-w-md shadow-2xl border-2 border-[#194866]/20 bg-white/90">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-[#194866]">Login</CardTitle>
            <CardDescription className="text-[#194866]/80">Access your ProcureSci dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#194866] font-semibold">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  required
                  value={email} // Value is controlled by state
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-[#194866]/30 focus:border-[#3CDBDD] focus:ring-[#3CDBDD]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#194866] font-semibold">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password} // Value is controlled by state
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-[#194866]/30 focus:border-[#3CDBDD] focus:ring-[#3CDBDD]"
                />
              </div>
              {/* Error message display (kept for potential future use) */}
              {error && (
                <p className="text-sm font-medium text-red-600">{error}</p>
              )}
              <Button type="submit" className={`w-full h-12 text-lg font-bold bg-[${accentColor}] text-white shadow-lg hover:bg-[#FF6A33] transition-all`}>
                Login
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center text-sm">
             <p className="text-[#194866]/70">
               Don&apos;t have an account?{' '} {/* Escaped apostrophe */}
               <Link href="/contact" className={`font-semibold text-[${accentColor}] hover:underline`}>
                 Request Access
               </Link>
             </p>
           </CardFooter>
        </Card>
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
  );
} 