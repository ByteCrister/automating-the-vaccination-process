'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PageHeader, Card, Grid } from '@/components/adil/citizenDashboard/ContentGrid';
import { Button } from '@/components/ui/adil/Button';
import { dashboardAPI } from '@/lib/adil/dashboard.api';
import { VaccinationRecord } from '@/types/adil/dashboard.types';
import { formatDate, getStatusColor } from '@/utils/adil/dashboard.utils';
import { VACCINE_TYPES } from '@/constants/adil/dashboard.const';
import { CheckIcon, CalendarIcon, DocumentIcon, DownloadIcon } from '@/components/adil/citizenDashboard/icons';

export default function VaccineRecordPage() {
  const [records, setRecords] = useState<VaccinationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'completed' | 'scheduled' | 'overdue'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const data = await dashboardAPI.getVaccinationRecords();
        setRecords(data);
      } catch (error) {
        console.error('Failed to fetch vaccination records:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  const filteredRecords = records.filter(record => {
    const matchesFilter = filter === 'all' || record.status === filter;
    const matchesSearch = searchTerm === '' ||
      record.vaccineType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.batchNumber && record.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckIcon className="w-5 h-5 text-green-600" />;
      case 'scheduled':
        return <CalendarIcon className="w-5 h-5 text-blue-600" />;
      case 'overdue':
        return <DocumentIcon className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'scheduled':
        return 'Scheduled';
      case 'overdue':
        return 'Overdue';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Vaccination Records"
        description="View and manage your vaccination history"
      />

      {/* Filters and Search */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by vaccine type or batch number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'completed', 'scheduled', 'overdue'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === status
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status === 'all' ? 'All' : getStatusText(status)}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Records List */}
      <Grid columns={1}>
        {filteredRecords.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No vaccination records found</h3>
              <p className="text-gray-600">
                {searchTerm || filter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Your vaccination records will appear here once you receive vaccinations.'
                }
              </p>
            </div>
          </Card>
        ) : (
          filteredRecords.map((record, index) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {getStatusIcon(record.status)}
                      <h3 className="text-lg font-semibold text-gray-900">
                        {record.vaccineType} - Dose {record.doseNumber}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                        {getStatusText(record.status)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Date:</span>
                        <div className="font-medium">{formatDate(record.vaccinationDate)}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Batch Number:</span>
                        <div className="font-medium">{record.batchNumber || 'N/A'}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Center:</span>
                        <div className="font-medium">{record.vaccinationCenter}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Healthcare Worker:</span>
                        <div className="font-medium">{record.administeredBy || 'N/A'}</div>
                      </div>
                    </div>

                    {record.nextDueDate && (
                      <div className="mt-3">
                        <span className="text-gray-600 text-sm">Next Due Date:</span>
                        <div className="text-sm font-medium text-blue-600">{formatDate(record.nextDueDate)}</div>
                      </div>
                    )}

                    {record.certificateUrl && (
                      <div className="mt-3">
                        <Button size="sm" variant="outline" className="flex items-center gap-2">
                          <DownloadIcon className="w-4 h-4" />
                          Download Certificate
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </Grid>

      {/* Summary Stats */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{records.filter(r => r.status === 'completed').length}</div>
            <div className="text-sm text-gray-600">Completed Doses</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{records.filter(r => r.status === 'scheduled').length}</div>
            <div className="text-sm text-gray-600">Scheduled</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{records.filter(r => r.status === 'overdue').length}</div>
            <div className="text-sm text-gray-600">Overdue</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {new Set(records.filter(r => r.status === 'completed').map(r => r.vaccineType)).size}
            </div>
            <div className="text-sm text-gray-600">Vaccine Types</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
