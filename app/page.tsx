import { Header } from "@/app/components/Header";
import { ScheduleList } from "@/app/components/ScheduleList";
import EventsService from "@/app/services/events";
export default async function Home() {
  const eventsService = EventsService();
  const { events } = await eventsService.getEvents();
 
  return (
    <div className="font-sans bg-linear-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 text-gray-900 dark:text-white min-h-screen transition-colors duration-300">
    <Header />
    <main className="container mx-auto p-6 md:p-10 max-w-7xl">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-linear-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
          Your AI powered Sports Dashboard
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Explore Lakers rosters, schedules, and breaking news with AI
        </p>
      </div>
      <ScheduleList events={events} />
    </main>
</div>
  );
}
