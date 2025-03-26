'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-4">
              HireSmart
            </h1>
            <p className="text-2xl font-semibold mb-6 text-blue-100">
              Big Talent, Small Business
            </p>
            <p className="text-xl mb-8 text-blue-50">
              Connect with skilled professionals who can help your business grow. 
              Whether you're looking for developers, designers, or marketing experts, 
              we've got you covered.
            </p>
            <div className="space-x-4">
              <Link 
                href="/auth?mode=register" 
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Get Started
              </Link>
              <Link 
                href="/auth" 
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose HireSmart?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-blue-600 text-2xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">Precision Matching</h3>
              <p className="text-gray-600">
                Our smart matching system connects you with candidates who perfectly fit your needs.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-blue-600 text-2xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Quick Process</h3>
              <p className="text-gray-600">
                Find and hire the right talent in days, not weeks. Streamlined process for faster results.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-blue-600 text-2xl mb-4">💎</div>
              <h3 className="text-xl font-semibold mb-2">Quality Talent</h3>
              <p className="text-gray-600">
                Access a pool of verified professionals with proven track records.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Find Your Perfect Match?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of businesses that have found their ideal candidates through HireSmart.
          </p>
          <Link 
            href="/auth?mode=register" 
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Start Your Search Today
          </Link>
        </div>
      </section>
    </main>
  );
} 