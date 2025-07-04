"use client";

import { useEffect, useState } from "react";

type EventPageProps = {
  params: {
    id: string;
  };
};

type Event = {
  _id: string;
  title: string;
  description: string;
  date: string;
  // ...add other fields as needed
};

export default function EventPage({ params }: EventPageProps) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      const res = await fetch(`/api/events/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setEvent(data.event);
      }
      setLoading(false);
    };
    fetchEvent();
  }, [params.id]);

  if (loading) return <div>Loading...</div>;
  if (!event) return <div>Event not found.</div>;

  return (
    <div>
      <h1>{event.title}</h1>
      <p>{event.description}</p>
      <p>Date: {new Date(event.date).toLocaleDateString()}</p>
      {/* Add more event details as needed */}
    </div>
  );
}
