import { SPORT, LEAGUE, TEAM_ID } from "@/app/utils/consts";

function EventsService() {
  const getEvents = async () => {
    const SCHEDULE_URL = `https://site.api.espn.com/apis/site/v2/sports/${SPORT}/${LEAGUE}/teams/${TEAM_ID}/schedule`;
    const response = await fetch(SCHEDULE_URL);
    return response.json();
  };

  return {
    getEvents,
  };
}

export default EventsService;