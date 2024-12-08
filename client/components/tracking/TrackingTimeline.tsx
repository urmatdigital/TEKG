import React from 'react';
import { CheckCircle2, Circle, Truck, Package, MapPin } from 'lucide-react';

export type ShipmentStatus = 'processing' | 'in_transit' | 'delivered' | 'pending';

interface TrackingEvent {
  id: string;
  status: string;
  location: string;
  timestamp: string;
  description: string;
}

interface TrackingTimelineProps {
  events: TrackingEvent[];
  currentStatus: ShipmentStatus;
}

export const TrackingTimeline: React.FC<TrackingTimelineProps> = ({
  events,
  currentStatus,
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return Package;
      case 'in_transit':
        return Truck;
      case 'delivered':
        return MapPin;
      default:
        return Circle;
    }
  };

  return (
    <div className="space-y-8">
      {events.map((event, index) => {
        const Icon = getStatusIcon(event.status);
        const isCompleted = index === 0 || index < events.length - 1;

        return (
          <div key={event.id} className="relative">
            {index !== events.length - 1 && (
              <div
                className={`absolute left-6 top-6 h-full w-px ${
                  isCompleted ? 'bg-primary' : 'bg-muted'
                }`}
              />
            )}
            <div className="flex gap-4">
              <div
                className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full ${
                  isCompleted ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <Icon
                  className={`h-6 w-6 ${
                    isCompleted ? 'text-primary-foreground' : 'text-muted-foreground'
                  }`}
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">{event.status}</h3>
                  {isCompleted && (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{event.location}</p>
                <time className="text-sm text-muted-foreground">
                  {event.timestamp}
                </time>
                <p className="mt-1">{event.description}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
