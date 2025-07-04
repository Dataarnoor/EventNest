"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, ExternalLink, Clock, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { Navbar } from "@/components/navbar"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Application {
  _id: string;
  event: {
    _id?: string;
    title?: string;
    date?: string;
    venue?: string;
  } | null;
  status: 'pending' | 'accepted' | 'rejected';
  package: string;
  message: string;
  createdAt: string;
}

export default function MySponsorshipsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session || session.user.userType !== 'sponsor') {
      router.push('/signin');
      return;
    }

    const fetchApplications = async () => {
      try {
        const res = await fetch('/api/applications/my-applications');
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch applications');
        }

        console.log('Fetched applications:', data);
        setApplications(data.applications || []);
      } catch (error) {
        console.error('Failed to fetch applications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [session, router]);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20';
      case 'accepted':
        return 'bg-green-400/10 text-green-400 border-green-400/20';
      case 'rejected':
        return 'bg-red-400/10 text-red-400 border-red-400/20';
      default:
        return 'bg-gray-400/10 text-gray-400 border-gray-400/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'accepted':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const handleDeleteApplication = async (applicationId: string) => {
    if (!confirm('Are you sure you want to delete this application? This action cannot be undone.')) {
      return;
    }

    try {
      const res = await fetch(`/api/applications/${applicationId}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        throw new Error('Failed to delete application');
      }

      // Remove the deleted application from state
      setApplications(applications.filter(app => app._id !== applicationId));
    } catch (error) {
      console.error('Failed to delete application:', error);
      alert('Failed to delete application. Please try again.');
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">
      Loading applications...
    </div>;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Link href="/sponsorships" className="inline-flex items-center text-gray-400 hover:text-green-400 mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </Link>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Applications</h1>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-12 bg-gray-900 border-2 border-gray-800 rounded-xl">
            <p className="text-gray-400 text-lg">No applications yet.</p>
            <button 
              onClick={() => router.push('/sponsorships')}
              className="mt-4 px-6 py-2 bg-green-400 text-black rounded-lg hover:bg-green-500"
            >
              Browse Events
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {applications.map((app) => (
              <div key={app._id} className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold mb-2">
                      {app.event?.title || 'Event Unavailable'}
                    </h2>
                    <div className="flex gap-4 text-sm text-gray-400">
                      <span>Date: {app.event?.date ? new Date(app.event.date).toLocaleDateString() : 'N/A'}</span>
                      <span>Venue: {app.event?.venue || 'N/A'}</span>
                      <span>Package: {app.package || 'N/A'}</span>
                    </div>
                  </div>
                  <div className={`px-3 py-1 border rounded-full flex items-center gap-2 ${getStatusBadgeClass(app.status)}`}>
                    {getStatusIcon(app.status)}
                    <span className="capitalize">{app.status}</span>
                  </div>
                </div>

                <p className="text-gray-400 mt-4 mb-6">{app.message || 'No message provided'}</p>

                <div className="flex gap-3">
                  <button
                    onClick={() => router.push(`/event/${app.event?._id || ''}`)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-700 rounded-lg hover:bg-gray-800"
                    disabled={!app.event?._id}
                  >
                    <Eye className="h-4 w-4" />
                    View Event
                  </button>
                  <button
                    onClick={() => window.open(`/sponsorships#${app.event?._id || ''}`, '_blank')}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-700 rounded-lg hover:bg-gray-800"
                    disabled={!app.event?._id}
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open in New Tab
                  </button>
                  {app.status === 'pending' && (
                    <button
                      onClick={() => handleDeleteApplication(app._id)}
                      className="flex items-center gap-2 px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                      Cancel Application
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
