type EventPageProps = {
  params: {
    id: string;
  };
};

export default function EventPage({ params }: EventPageProps) {
  return <div>Event details for {params.id}</div>;
}
