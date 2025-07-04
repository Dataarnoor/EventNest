"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PlusCircle, Edit, Trash, Eye } from "lucide-react";
import { Navbar } from "@/components/navbar"; // Add this import

export default function MyEventsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  interface Event {
    _id: string;
    title: string;
    description: string;
    date: string;
    venue: string;
    expectedAttendance: number;
  }

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session || session.user.userType !== 'college') {
      router.push('/signin');
      return;
    }

    fetch('/api/events/my-events')
      .then(res => res.json())
      .then(data => {
        if (data.events) {
          setEvents(data.events);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch events:', err);
        setLoading(false);
      });
  }, [session, router]);

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const res = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete event');
      }

      // Update the events list after successful deletion
      setEvents(prevEvents => prevEvents.filter(event => event._id !== eventId));
    } catch (error) {
      console.error('Failed to delete event:', error);
      alert('Failed to delete event. Please try again.');
    }
  };

  const handleViewEvent = (eventId: string) => {
    window.open(`/sponsorships#${eventId}`, '_blank');
  };

  const handleEditEvent = async (eventId: string) => {
    try {
      // First fetch the event details
      const res = await fetch(`/api/events/${eventId}`);
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch event details');
      }

      // Store event details in localStorage for the edit page
      localStorage.setItem('editEventData', JSON.stringify(data.event));
      router.push(`/event/edit/${eventId}`);
    } catch (error) {
      console.error('Failed to prepare event for editing:', error);
      alert('Failed to edit event. Please try again.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar /> {/* Add the navbar */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          {/* Link to go back */}
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold">My Events</h1>
          </div>
          <Link href="/event/create">
            <button className="flex items-center px-4 py-2 bg-green-400 text-black rounded-lg hover:bg-green-500">
              <PlusCircle className="h-5 w-5 mr-2" />
              Create New Event
            </button>
          </Link>
        </div>

        <div className="grid gap-6">
          {events.map((event) => (
            <div key={event._id} className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold mb-2">{event.title}</h2>
                  <p className="text-gray-400">{event.description}</p>
                  <div className="flex gap-4 mt-4 text-sm text-gray-400">
                    <span>Date: {new Date(event.date).toLocaleDateString()}</span>
                    <span>Venue: {event.venue}</span>
                    <span>Expected Attendance: {event.expectedAttendance}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    className="p-2 hover:text-green-400"
                    onClick={() => handleViewEvent(event._id)}
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  <button 
                    className="p-2 hover:text-blue-400"
                    onClick={() => handleEditEvent(event._id)}
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button 
                    className="p-2 hover:text-red-400"
                    onClick={() => handleDeleteEvent(event._id)}
                  >
                    <Trash className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
