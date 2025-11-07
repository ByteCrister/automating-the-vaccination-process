import Link from 'next/link';
import { Facebook, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { Container } from '@/components/ui/adil/Container';

interface FooterProps {
  columns?: Array<{
    title: string;
    links: Array<{ label: string; href: string }>;
  }>;
  socialLinks?: Array<{
    name: string;
    href: string;
    icon: 'facebook' | 'twitter' | 'linkedin' | 'email';
  }>;
  contactInfo?: {
    phone?: string;
    email?: string;
    address?: string;
  };
}

const iconMap = {
  facebook: Facebook,
  twitter: Twitter,
  linkedin: Linkedin,
  email: Mail,
};

export function Footer({ columns = [], socialLinks = [], contactInfo }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <Container className="py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Left */}
          <div>
            <h3 className="font-semibold text-white text-lg mb-4">For any Assistance Regarding Registration:</h3>
            <div className="flex gap-4">
              <div>
                <img src="/adil/hello.png" alt="VaxEPI" width={160} height={40} className="mb-4" />
              </div>
              <div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <a
                        href="tel:16263"
                        className="hover:text-green-400 transition-colors"
                      >
                        16263
                      </a>
                      <span className="text-gray-400"> [Shastho Batayon]</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <a
                      href="mailto:vaxepi@mis.dghs.gov.bd"
                      className="text-sm hover:text-green-400 transition-colors"
                    >
                      vaxepi@mis.dghs.gov.bd
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Mid */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white text-base font-extrabold">V</span>
              </div>
              <span className="font-bold text-xl text-white">VaxEPI</span>
            </div>
            <p className="text-sm leading-relaxed">
              Official Government Immunization Portal of Bangladesh. Protecting families through safe and effective vaccination programs.
            </p>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex gap-3 pt-2">
                {socialLinks.map((social) => {
                  const Icon = iconMap[social.icon];
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                      aria-label={social.name}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right */}
          <div>
            <h3 className="font-semibold text-white text-lg mb-4">Partner Organizations</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <img src="/adil/footerImg/mis_logo 1.png" alt="MIS" width={60} height={40} />
                <img src="/adil/footerImg/gavi.png" alt="GAVI" width={80} height={40} />
                <img src="/adil/footerImg/unicef_logo.png" alt="UNICEF" width={80} height={40} />
                <img src="/adil/footerImg/WHO-11.svg" alt="WHO" width={80} height={40} />
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <Container className="py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p>© {currentYear} VaxEPI. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-blue-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-blue-400 transition-colors">
                Terms of Service
              </Link>
              <Link href="/accessibility" className="hover:text-blue-400 transition-colors">
                Accessibility
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}