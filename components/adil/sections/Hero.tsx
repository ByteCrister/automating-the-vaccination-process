import { Button } from '@/components/ui/adil/Button';
import { Container } from '@/components/ui/adil/Container';
import { Shield, Calendar, MapPin, FileCheck } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative pt-24 md:pt-32 pb-16 md:pb-24 overflow-hidden bg-white">
      {/* Background Decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <Container>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6 md:space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
              <Shield className="w-4 h-4" />
              <span>Official Government Portal</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
              Protect Your Family with Safe Vaccination
            </h1>

            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Access vaccination schedules, find nearby centers, and keep your family healthy with Bangladesh's comprehensive immunization program.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button href="/schedule" variant="primary" size="lg">
                Schedule Vaccination
              </Button>
              <Button href="/centers" variant="outline" size="lg">
                Find Centers
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-6 pt-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <FileCheck className="w-4 h-4 text-green-600" />
                </div>
                <span>50M+ Vaccinated</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-blue-600" />
                </div>
                <span>5,000+ Centers</span>
              </div>
            </div>
          </div>

          {/* Hero Image/Illustration */}
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4 p-8">
                  <div className="w-32 h-32 mx-auto bg-white rounded-full shadow-lg flex items-center justify-center">
                    <Shield className="w-16 h-16 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">Your Health,</p>
                  <p className="text-2xl font-bold text-blue-600">Our Priority</p>
                </div>
              </div>
            </div>
            
            {/* Floating Cards */}
            <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-4 hidden lg:block">
              <div className="flex items-center gap-3">
                <Calendar className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-xs text-gray-500">Next Dose</p>
                  <p className="font-semibold text-sm">15 Dec 2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
