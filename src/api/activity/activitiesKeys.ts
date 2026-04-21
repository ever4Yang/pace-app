const activitiesKeys = {
  timeline: () => ['activities', 'timeline'],
  locations: (activityId: string | undefined) => ['activities', 'locations', activityId],
  mapSnapshot: (activityId: string | undefined, theme: 'light' | 'dark') => [
    'activities',
    'mapSnapshot',
    activityId,
    theme,
  ],
  create: () => ['activities', 'create'],
  update: () => ['activities', 'update'],
  delete: () => ['activities', 'delete'],
};

export default activitiesKeys;
