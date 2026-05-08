'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { DayItinerary } from '@/types/trip';

interface CalendarButtonProps {
  day: DayItinerary;
  destination: string;
}

/**
 * Generates a Google Calendar event for an entire day of the itinerary.
 * Supports the "Add to Calendar" requirement.
 */
export const CalendarButton = ({ day, destination }: CalendarButtonProps): React.JSX.Element => {
  const handleAddToCalendar = () => {
    const title = `TravelAI: Day ${day.day} in ${destination}`;
    const dateStr = day.date.replace(/-/g, '');
    const dates = `${dateStr}/${dateStr}`;
    const details = day.activities
      .map(a => `${a.time} - ${a.name} (${a.location})`)
      .join('%0A');

    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${dates}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(destination)}&sf=true&output=xml`;
    
    window.open(url, '_blank');
  };

  return (
    <Button 
      variant="secondary" 
      size="sm" 
      onClick={handleAddToCalendar}
      aria-label={`Add Day ${day.day} to Google Calendar`}
      className="text-[10px] font-bold uppercase py-1 h-auto"
    >
      📅 Add to Calendar
    </Button>
  );
};
