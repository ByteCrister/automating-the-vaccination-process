import { Button } from '@/components/ui/adil/Button';
import { Container } from '@/components/ui/adil/Container';
import { ArrowRight } from 'lucide-react';

export function CTA() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <Container>
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-8 md:p-12 lg:p-16 text-center text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold">
              Ready to Get Started?
            </h2>
            <p className="text-lg md:text-xl text-blue-50">
              Join millions of Bangladeshi families in protecting their loved ones. Schedule your vaccination today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                href="/register"
                variant="secondary"
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                Create Account
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                href="/schedule"
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10"
              >
                Schedule Now
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
