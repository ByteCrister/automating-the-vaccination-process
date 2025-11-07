'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PageHeader, Card, Grid } from '@/components/adil/citizenDashboard/ContentGrid';
import { Button } from '@/components/ui/adil/Button';
import { HelpIcon, PhoneIcon, EmailIcon, ChatIcon, DocumentIcon, SearchIcon } from '@/components/adil/citizenDashboard/icons';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  {
    id: '1',
    question: 'How do I register for vaccination?',
    answer: 'To register for vaccination, go to the Registration page and fill out the required information including your NID, personal details, and contact information. Once submitted, your application will be reviewed and you\'ll receive a confirmation.',
    category: 'Registration'
  },
  {
    id: '2',
    question: 'How can I book a vaccination appointment?',
    answer: 'Navigate to the Appointments page and click "Book New Appointment". Select your preferred vaccination center and time slot. You\'ll receive a confirmation email and SMS with your appointment details.',
    category: 'Appointments'
  },
  {
    id: '3',
    question: 'What documents do I need to bring for vaccination?',
    answer: 'Please bring your original NID card, appointment confirmation (printed or digital), and any previous vaccination certificates if applicable. Wear comfortable clothing with short sleeves.',
    category: 'Vaccination'
  },
  {
    id: '4',
    question: 'How do I download my digital vaccination certificate?',
    answer: 'Go to the Digital Card page where you can view and download your vaccination certificate as a PDF. The certificate includes a QR code for verification purposes.',
    category: 'Certificates'
  },
  {
    id: '5',
    question: 'What should I do if I miss my appointment?',
    answer: 'If you miss your appointment, contact your vaccination center immediately. You can reschedule through the Appointments page or call the helpline for assistance.',
    category: 'Appointments'
  },
  {
    id: '6',
    question: 'How do I update my contact information?',
    answer: 'Currently, contact information updates need to be done through the registration process or by contacting support. We\'re working on adding self-service profile updates.',
    category: 'Account'
  },
  {
    id: '7',
    question: 'What vaccines are available in the program?',
    answer: 'The program includes COVID-19 vaccines, routine childhood vaccinations, and other preventive vaccines as recommended by the Ministry of Health.',
    category: 'Vaccination'
  },
  {
    id: '8',
    question: 'How do I report side effects after vaccination?',
    answer: 'Report any side effects through the helpline (16263) or visit your nearest health facility. Serious side effects should be reported immediately.',
    category: 'Safety'
  }
];

const categories = ['All', 'Registration', 'Appointments', 'Vaccination', 'Certificates', 'Account', 'Safety'];

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFAQ = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Help & Support"
        description="Find answers to common questions and get support"
      />

      {/* Search and Contact Options */}
      <Card>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Quick Contact */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <PhoneIcon className="w-5 h-5" />
              Call Helpline
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <ChatIcon className="w-5 h-5" />
              Live Chat
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <EmailIcon className="w-5 h-5" />
              Email Support
            </Button>
          </div>
        </div>
      </Card>

      {/* Category Filter */}
      <Card>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </Card>

      {/* FAQs */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Frequently Asked Questions
          {selectedCategory !== 'All' && ` - ${selectedCategory}`}
        </h2>

        {filteredFAQs.length === 0 ? (
          <Card>
            <div className="text-center py-8">
              <HelpIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600">
                Try adjusting your search terms or browse all categories.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                }}
              >
                Clear Filters
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="cursor-pointer" onClick={() => toggleFAQ(faq.id)}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          {faq.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {faq.question}
                      </h3>
                    </div>
                    <div className="ml-4">
                      <svg
                        className={`w-5 h-5 text-gray-500 transition-transform ${
                          expandedFAQ === faq.id ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {expandedFAQ === faq.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-gray-200"
                    >
                      <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Contact Information */}
      <Grid columns={1} className="md:grid-cols-2">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contacts</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <PhoneIcon className="w-5 h-5 text-red-600" />
              <div>
                <p className="font-medium">National Helpline</p>
                <p className="text-gray-600">16263 (24/7)</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <PhoneIcon className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium">COVID-19 Helpline</p>
                <p className="text-gray-600">333</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <PhoneIcon className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium">IEDCR</p>
                <p className="text-gray-600">10655</p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Resources</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <DocumentIcon className="w-5 h-5 text-purple-600" />
              <div>
                <p className="font-medium">Ministry of Health Website</p>
                <p className="text-gray-600">www.mohfw.gov.bd</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <DocumentIcon className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium">DGHS Portal</p>
                <p className="text-gray-600">www.dghs.gov.bd</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <EmailIcon className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium">Support Email</p>
                <p className="text-gray-600">support@vaccine.gov.bd</p>
              </div>
            </div>
          </div>
        </Card>
      </Grid>

      {/* Still Need Help */}
      <Card>
        <div className="text-center">
          <HelpIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Still need help?</h3>
          <p className="text-gray-600 mb-6">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="flex items-center gap-2">
              <ChatIcon className="w-5 h-5" />
              Start Live Chat
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <PhoneIcon className="w-5 h-5" />
              Call Support
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <EmailIcon className="w-5 h-5" />
              Send Email
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
