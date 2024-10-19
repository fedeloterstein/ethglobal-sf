import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PiggyBankIcon, ScaleIcon, ShieldCheckIcon, TrendingUpIcon } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl mb-4">
            Secure Your Future with Long-Term Savings
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            A simple and secure way to save for retirement using USDC, with the benefits of DeFi yields.
          </p>
        </section>

        <section className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PiggyBankIcon className="h-6 w-6 text-blue-600 mr-2" />
                Long-Term Savings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Start saving for your future today with a secure, USDC-based retirement fund.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUpIcon className="h-6 w-6 text-green-600 mr-2" />
                DeFi Yields
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Benefit from secure DeFi protocols to grow your savings over time.</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShieldCheckIcon className="h-6 w-6 text-purple-600 mr-2" />
                Inheritance Planning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Designate a beneficiary wallet to ensure your savings are protected.</CardDescription>
            </CardContent>
          </Card>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">The Power of Long-Term Investing</h2>
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-center mb-6">
              <ScaleIcon className="h-12 w-12 text-blue-600 mr-4" />
              <h3 className="text-2xl font-semibold text-gray-900">Saving vs. Investing: 20 Year Comparison</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-center">
                <h4 className="text-xl font-semibold text-gray-700 mb-4">Traditional Savings</h4>
                <p className="text-4xl font-bold text-blue-600 mb-2">$24,000</p>
                <p className="text-gray-600">Assuming $100 monthly savings with 1% annual interest</p>
              </div>
              <div className="text-center">
                <h4 className="text-xl font-semibold text-gray-700 mb-4">SecureRetire Investment</h4>
                <p className="text-4xl font-bold text-green-600 mb-2">$46,200</p>
                <p className="text-gray-600">Assuming $100 monthly investment with 7% annual return</p>
              </div>
            </div>
            <p className="mt-6 text-sm text-gray-500 text-center">
              This is a hypothetical example and does not represent any specific investment. Your actual results may
              vary.
            </p>
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Start Investing?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Join SecureRetire today and take the first step towards a secure financial future.
          </p>
          <Button size="lg" className="text-lg px-8 py-4">
            <Link href={"/dashboard"}>Log In to Get Started</Link>
          </Button>
        </section>
      </main>
    </div>
  );
}
