'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { PageHeader, Card, Grid } from '@/components/adil/citizenDashboard/ContentGrid';
import { Button } from '@/components/ui/adil/Button';
import { dashboardAPI } from '@/lib/adil/dashboard.api';
import { CitizenProfile, VaccinationRecord, VaccineCard } from '@/types/adil/dashboard.types';
import { generateQRCodeData } from '@/utils/adil/dashboard.utils';
import { QRIcon, DownloadIcon } from '@/components/adil/citizenDashboard/icons';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';

export default function DigitalCardPage() {
  const [profile, setProfile] = useState<CitizenProfile | null>(null);
  const [records, setRecords] = useState<VaccinationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileData, recordsData] = await Promise.all([
          dashboardAPI.getProfile(),
          dashboardAPI.getVaccinationRecords()
        ]);

        setProfile(profileData);
        setRecords(recordsData.filter(r => r.status === 'completed'));

        // Generate QR code
        if (profileData) {
          const qrData = generateQRCodeData(profileData, recordsData);
          const qrUrl = await QRCode.toDataURL(qrData, {
            width: 200,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            }
          });
          setQrCodeUrl(qrUrl);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const downloadPDF = async () => {
    if (!profile || !qrCodeUrl) return;

    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Header
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Digital Vaccination Card', pageWidth / 2, 30, { align: 'center' });

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Ministry of Health, Bangladesh', pageWidth / 2, 45, { align: 'center' });

      // Citizen Information
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Citizen Information', 20, 70);

      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Name: ${profile.fullName}`, 20, 85);
      pdf.text(`NID: ${profile.nid}`, 20, 95);
      pdf.text(`Date of Birth: ${new Date(profile.dateOfBirth).toLocaleDateString()}`, 20, 105);
      pdf.text(`Phone: ${profile.phone}`, 20, 115);

      // Vaccination Records
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Vaccination Records', 20, 140);

      let yPosition = 155;
      records.forEach((record, index) => {
        if (yPosition > pageHeight - 60) {
          pdf.addPage();
          yPosition = 30;
        }

        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`${index + 1}. ${record.vaccineType} - Dose ${record.doseNumber}`, 20, yPosition);
        pdf.text(`   Date: ${new Date(record.vaccinationDate).toLocaleDateString()}`, 30, yPosition + 8);
        pdf.text(`   Center: ${record.vaccinationCenter}`, 30, yPosition + 16);
        if (record.batchNumber) {
          pdf.text(`   Batch: ${record.batchNumber}`, 30, yPosition + 24);
        }
        yPosition += 35;
      });

      // QR Code
      if (qrCodeUrl) {
        const qrImage = new Image();
        qrImage.src = qrCodeUrl;
        qrImage.onload = () => {
          pdf.addImage(qrImage, 'PNG', pageWidth - 80, pageHeight - 80, 60, 60);
          pdf.text('Scan QR Code', pageWidth - 80, pageHeight - 85);

          // Footer
          pdf.setFontSize(8);
          pdf.setFont('helvetica', 'normal');
          pdf.text(`Generated on: ${new Date().toLocaleString()}`, 20, pageHeight - 20);
          pdf.text('This is an official digital vaccination certificate', 20, pageHeight - 15);

          pdf.save(`vaccination-card-${profile.nid}.pdf`);
        };
      } else {
        pdf.save(`vaccination-card-${profile.nid}.pdf`);
      }
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const printCard = () => {
    window.print();
  };

  const shareCard = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Vaccination Card',
          text: 'Digital vaccination certificate from Bangladesh Ministry of Health',
          url: window.location.href
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Not Found</h2>
        <p className="text-gray-600">Please complete your registration first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Digital Vaccine Card"
        description="Your official digital vaccination certificate"
      />

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <Button onClick={downloadPDF} className="flex items-center gap-2">
          <DownloadIcon className="w-5 h-5" />
          Download PDF
        </Button>
        <Button variant="outline" onClick={printCard} className="flex items-center gap-2">
          <QRIcon className="w-5 h-5" />
          Print Card
        </Button>
        <Button variant="outline" onClick={shareCard} className="flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
          Share Card
        </Button>
      </div>

      {/* Digital Card Preview */}
      <Card className="print:shadow-none print:border-none">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-lg border-2 border-green-200 print:bg-white print:border print:border-gray-300">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Digital Vaccination Card</h1>
            <p className="text-lg text-gray-600">Ministry of Health, Bangladesh</p>
            <div className="w-16 h-1 bg-green-600 mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Citizen Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Citizen Information</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Full Name:</span>
                  <span className="font-medium">{profile.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">NID:</span>
                  <span className="font-medium">{profile.nid}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date of Birth:</span>
                  <span className="font-medium">{new Date(profile.dateOfBirth).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium">{profile.phone}</span>
                </div>
                {profile.email && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{profile.email}</span>
                  </div>
                )}
              </div>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center justify-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Verification QR Code</h2>
              {qrCodeUrl ? (
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <img
                    src={qrCodeUrl}
                    alt="Vaccination verification QR code"
                    className="w-48 h-48"
                  />
                </div>
              ) : (
                <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                  <QRIcon className="w-12 h-12 text-gray-400" />
                </div>
              )}
              <p className="text-sm text-gray-600 mt-2 text-center">
                Scan this QR code to verify vaccination records
              </p>
            </div>
          </div>

          {/* Vaccination Records */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Vaccination Records</h2>
            {records.length === 0 ? (
              <p className="text-gray-600">No completed vaccinations found.</p>
            ) : (
              <div className="space-y-4">
                {records.map((record, index) => (
                  <div key={record.id} className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {record.vaccineType} - Dose {record.doseNumber}
                        </h3>
                        <div className="text-sm text-gray-600 mt-1">
                          <p>Date: {new Date(record.vaccinationDate).toLocaleDateString()}</p>
                          <p>Center: {record.vaccinationCenter}</p>
                          {record.batchNumber && <p>Batch: {record.batchNumber}</p>}
                          {record.administeredBy && <p>Healthcare Worker: {record.administeredBy}</p>}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Completed
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
            <p>This is an official digital vaccination certificate issued by the Ministry of Health, Bangladesh.</p>
            <p className="mt-1">Generated on: {new Date().toLocaleString()}</p>
          </div>
        </div>
      </Card>

      {/* Instructions */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">How to Use Your Digital Card</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">For Verification</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Present the QR code to healthcare providers</li>
              <li>• Use for international travel requirements</li>
              <li>• Share with employers or educational institutions</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Important Notes</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Keep this card secure and confidential</li>
              <li>• Report any discrepancies immediately</li>
              <li>• Regular updates will be available here</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
