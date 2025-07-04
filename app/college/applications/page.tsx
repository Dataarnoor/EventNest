"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast"

interface Application {
  _id: string;
  sponsor: {
    companyName: string;
    email: string;
    contactPerson: string;
  };
  event: {
    title: string;
    date: string;
    venue: string;
  };
  package: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export default function CollegeApplicationsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!session || session.user.userType !== 'college') {
      router.push('/signin');
      return;
    }

    // Remove the polling for notifications since we only want them on home page
    fetchApplications();
  }, [session, router]);

  const fetchApplications = async () => {
    try {
      const res = await fetch('/api/applications/college-applications');
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch applications');
      }

      // Validate and transform the data
      const validApplications = data.applications?.map((app: any) => ({
        _id: app._id,
        sponsor: {
          companyName: app.sponsor?.companyName || 'Unknown Company',
          email: app.sponsor?.email || 'No email provided',
          contactPerson: app.sponsor?.contactPerson || 'No contact person'
        },
        event: {
          title: app.event?.title || 'Untitled Event',
          date: app.event?.date || new Date().toISOString(),
          venue: app.event?.venue || 'No venue specified'
        },
        package: app.package || 'No package specified',
        message: app.message || 'No message provided',
        status: app.status || 'pending',
        createdAt: app.createdAt || new Date().toISOString()
      })) || [];

      console.log('Processed applications:', validApplications);
      setApplications(validApplications);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationStatus = async (applicationId: string, status: 'accepted' | 'rejected') => {
    try {
      const res = await fetch(`/api/applications/${applicationId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        throw new Error('Failed to update application status');
      }

      toast({
        title: "Application Updated",
        description: `Application ${status} successfully`,
        variant: status === 'accepted' ? 'success' : 'destructive',
      });

      // Refresh applications list
      fetchApplications();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive",
      });
      console.error('Error updating application:', error);
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Sponsorship Applications</h1>
        </div>
        
        {applications.length === 0 ? (
          <div className="text-center py-12 bg-gray-900 border-2 border-gray-800 rounded-xl">
            <p className="text-gray-400 text-lg">No applications received yet.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {applications.map((app) => (
              <div key={app._id} className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold mb-2">{app.event.title}</h2>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-400">
                      <span className="flex items-center">
                        From: {app.sponsor.companyName}
                      </span>
                      <span className="flex items-center">
                        Package: {app.package}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      Applied: {new Date(app.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 ${
                    app.status === 'pending' ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20' :
                    app.status === 'accepted' ? 'bg-green-400/10 text-green-400 border border-green-400/20' :
                    'bg-red-400/10 text-red-400 border border-red-400/20'
                  }`}>
                    {app.status === 'pending' && <Clock className="h-4 w-4" />}
                    {app.status === 'accepted' && <CheckCircle className="h-4 w-4" />}
                    {app.status === 'rejected' && <XCircle className="h-4 w-4" />}
                    <span className="capitalize">{app.status}</span>
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
                  <h3 className="text-sm font-semibold mb-2 text-gray-300">Sponsor Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div className="flex">
                      <span className="min-w-[120px] text-gray-400">Contact:</span>
                      <span className="text-gray-300">{app.sponsor.contactPerson}</span>
                    </div>
                    <div className="flex">
                      <span className="min-w-[120px] text-gray-400">Email:</span>
                      <span className="text-gray-300 break-all">{app.sponsor.email}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-semibold mb-2 text-gray-300">Message</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{app.message}</p>
                </div>

                {app.status === 'pending' && (
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleApplicationStatus(app._id, 'accepted')}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-black font-medium"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Accept Application
                    </Button>
                    <Button
                      onClick={() => handleApplicationStatus(app._id, 'rejected')}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-black font-medium"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject Application
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
