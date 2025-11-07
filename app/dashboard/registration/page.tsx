'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PageHeader, Card, Grid } from '@/components/adil/citizenDashboard/ContentGrid';
import { Button } from '@/components/ui/adil/Button';
import { dashboardAPI } from '@/lib/adil/dashboard.api';
import { CitizenProfile, RegistrationForm } from '@/types/adil/dashboard.types';
import { validateNID, validatePhone } from '@/utils/adil/dashboard.utils';
import { REGISTRATION_STEPS } from '@/constants/adil/dashboard.const';

export default function RegistrationPage() {
  const [profile, setProfile] = useState<CitizenProfile | null>(null);
  const [formData, setFormData] = useState<RegistrationForm>({
    personal: {
      fullName: '',
      nid: '',
      dateOfBirth: '',
      gender: 'male',
    },
    contact: {
      phone: '',
      email: '',
      address: {
        district: '',
        upazila: '',
        union: '',
      },
    },
    documents: {},
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await dashboardAPI.getProfile();
        setProfile(profileData);

        // Pre-fill form with existing data
        if (profileData) {
          setFormData({
            personal: {
              fullName: profileData.fullName,
              nid: profileData.nid,
              dateOfBirth: profileData.dateOfBirth,
              gender: profileData.gender,
            },
            contact: {
              phone: profileData.phone,
              email: profileData.email || '',
              address: profileData.address,
            },
            documents: {},
          });
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (section: keyof RegistrationForm, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleAddressChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        address: {
          ...prev.contact.address,
          [field]: value,
        },
      },
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0: // Personal
        return !!(
          formData.personal.fullName &&
          validateNID(formData.personal.nid) &&
          formData.personal.dateOfBirth &&
          formData.personal.gender
        );
      case 1: // Contact
        return !!(
          validatePhone(formData.contact.phone) &&
          formData.contact.address.district &&
          formData.contact.address.upazila
        );
      case 2: // Documents
        return true; // Optional for now
      default:
        return false;
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedProfile: Partial<CitizenProfile> = {
        ...formData.personal,
        phone: formData.contact.phone,
        email: formData.contact.email,
        address: formData.contact.address,
        registrationStatus: 'submitted',
      };

      const result = await dashboardAPI.updateProfile(updatedProfile);
      setProfile(result);
      alert('Registration updated successfully!');
    } catch (error) {
      console.error('Failed to save registration:', error);
      alert('Failed to save registration. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const steps = REGISTRATION_STEPS;
  const isCompleted = profile?.registrationStatus === 'verified';

  return (
    <div className="space-y-8">
      <PageHeader
        title="Registration"
        description="Complete your vaccination registration profile"
      />

      {/* Progress Steps */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index <= currentStep
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {index + 1}
              </div>
              <span className="ml-2 text-sm font-medium text-gray-900">{step.label}</span>
              {index < steps.length - 1 && (
                <div className="w-12 h-px bg-gray-300 mx-4" />
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Form Steps */}
      <Grid columns={1}>
        {currentStep === 0 && (
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.personal.fullName}
                  onChange={(e) => handleInputChange('personal', 'fullName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NID/BCN *
                </label>
                <input
                  type="text"
                  value={formData.personal.nid}
                  onChange={(e) => handleInputChange('personal', 'nid', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter your 17-digit NID number"
                />
                {!validateNID(formData.personal.nid) && formData.personal.nid && (
                  <p className="text-sm text-red-600 mt-1">Please enter a valid NID (10-17 digits)</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  value={formData.personal.dateOfBirth}
                  onChange={(e) => handleInputChange('personal', 'dateOfBirth', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender *
                </label>
                <select
                  value={formData.personal.gender}
                  onChange={(e) => handleInputChange('personal', 'gender', e.target.value as 'male' | 'female' | 'other')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </Card>
        )}

        {currentStep === 1 && (
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Contact Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.contact.phone}
                  onChange={(e) => handleInputChange('contact', 'phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="+880 1XX XXX XXXX"
                />
                {!validatePhone(formData.contact.phone) && formData.contact.phone && (
                  <p className="text-sm text-red-600 mt-1">Please enter a valid Bangladeshi phone number</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={formData.contact.email}
                  onChange={(e) => handleInputChange('contact', 'email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    District *
                  </label>
                  <input
                    type="text"
                    value={formData.contact.address.district}
                    onChange={(e) => handleAddressChange('district', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="District"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upazila *
                  </label>
                  <input
                    type="text"
                    value={formData.contact.address.upazila}
                    onChange={(e) => handleAddressChange('upazila', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Upazila"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Union
                  </label>
                  <input
                    type="text"
                    value={formData.contact.address.union}
                    onChange={(e) => handleAddressChange('union', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Union"
                  />
                </div>
              </div>
            </div>
          </Card>
        )}

        {currentStep === 2 && (
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Documents</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Photo (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleInputChange('documents', 'photo', e.target.files?.[0])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <p className="text-sm text-gray-500 mt-1">Upload a recent passport-size photo</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NID Document (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => handleInputChange('documents', 'nidDocument', e.target.files?.[0])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <p className="text-sm text-gray-500 mt-1">Upload a copy of your NID</p>
              </div>
            </div>
          </Card>
        )}

        {currentStep === 3 && (
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Review & Submit</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Personal Information</h4>
                  <dl className="space-y-1 text-sm">
                    <div><dt className="inline text-gray-600">Name:</dt> <dd className="inline ml-2">{formData.personal.fullName}</dd></div>
                    <div><dt className="inline text-gray-600">NID:</dt> <dd className="inline ml-2">{formData.personal.nid}</dd></div>
                    <div><dt className="inline text-gray-600">DOB:</dt> <dd className="inline ml-2">{formData.personal.dateOfBirth}</dd></div>
                    <div><dt className="inline text-gray-600">Gender:</dt> <dd className="inline ml-2 capitalize">{formData.personal.gender}</dd></div>
                  </dl>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
                  <dl className="space-y-1 text-sm">
                    <div><dt className="inline text-gray-600">Phone:</dt> <dd className="inline ml-2">{formData.contact.phone}</dd></div>
                    <div><dt className="inline text-gray-600">Email:</dt> <dd className="inline ml-2">{formData.contact.email || 'Not provided'}</dd></div>
                    <div><dt className="inline text-gray-600">Address:</dt> <dd className="inline ml-2">{formData.contact.address.district}, {formData.contact.address.upazila}</dd></div>
                  </dl>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <p className="text-sm text-yellow-800">
                  By submitting this registration, you confirm that all information provided is accurate and complete.
                  Your data will be used solely for vaccination program purposes.
                </p>
              </div>
            </div>
          </Card>
        )}
      </Grid>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
        >
          Previous
        </Button>

        <div className="flex gap-3">
          {currentStep < steps.length - 1 ? (
            <Button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!validateStep(currentStep)}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSave}
              disabled={saving || isCompleted}
            >
              {saving ? 'Saving...' : isCompleted ? 'Completed' : 'Submit Registration'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
