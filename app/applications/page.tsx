"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

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
  status: string;
  createdAt: string;
}

export default function ApplicationsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session || session.user.userType !== 'college') {
      router.push('/signin');
      return;
    }

    fetch('/api/applications/college-applications')
      .then(res => res.json())
      .then(data => {
        if (data.applications) {
          setApplications(data.applications);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch applications:', err);
        setLoading(false);
      });
  }, [session, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Sponsorship Applications</h1>
        
        {applications.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No applications received yet.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {applications.map((app) => (
              <div key={app._id} className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold">{app.event.title}</h2>
                    <p className="text-green-400">{app.sponsor.companyName}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-sm bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">
                    {app.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-400">
                  <p>Contact: {app.sponsor.contactPerson}</p>
                  <p>Email: {app.sponsor.email}</p>
                  <p>Package: {app.package}</p>
                  <p>Applied: {new Date(app.createdAt).toLocaleDateString()}</p>
                </div>
                
                <p className="text-gray-300 mt-4">{app.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
