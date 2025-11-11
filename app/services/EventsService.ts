import { SPORT, LEAGUE, TEAM_ID } from "@/app/utils/consts";
import { ScheduleEvent } from "@/app/types";

function EventsService() {
  const getEvents = async () => {
    const SCHEDULE_URL = `https://site.api.espn.com/apis/site/v2/sports/${SPORT}/${LEAGUE}/teams/${TEAM_ID}/schedule`;
    const response = await fetch(SCHEDULE_URL, { cache: 'no-store' });
    const data = await response.json();
    
    // Filter out events that are more than 2 weeks ago
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    
    const recentEvents = (data.events as ScheduleEvent[]).filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate >= twoWeeksAgo;
    });
    
    return {
      ...data,
      events: recentEvents,
    };
  };

  return {    
    getEvents,
  };
}

export default EventsService;