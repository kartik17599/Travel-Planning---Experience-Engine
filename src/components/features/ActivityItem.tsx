'use client';

import React from 'react';
import { Activity } from '@/types/trip';
import { CATEGORY_ICONS } from '@/utils/constants';

interface ActivityItemProps {
  activity: Activity;
}

/**
 * Renders an individual activity card.
 * React.memo used for performance optimization as requested.
 * @param {ActivityItemProps} props - Component properties
 * @returns {JSX.Element} - Rendered activity
 */
export const ActivityItem = React.memo(({ activity }: ActivityItemProps): JSX.Element => {
  return (
    <div className="flex gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg border border-border shadow-sm mb-3">
      <div className="text-2xl" aria-hidden="true">
        {CATEGORY_ICONS[activity.category]}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h4 className="font-bold">{activity.name}</h4>
          <span className="text-sm font-medium text-primary">
            {activity.startTime} - {activity.endTime}
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {activity.description}
        </p>
        <div className="flex justify-between items-center mt-3 pt-3 border-t border-border">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            {activity.location.name}
          </span>
          <span className="text-sm font-bold">
            ${activity.estimatedCost}
          </span>
        </div>
      </div>
    </div>
  );
});

ActivityItem.displayName = 'ActivityItem';
