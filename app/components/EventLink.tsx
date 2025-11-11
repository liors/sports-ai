'use client';
import { useEffect, useRef, useState } from 'react';
import useIntersectionObserver from '@react-hook/intersection-observer';
import * as Popover from '@radix-ui/react-popover';
import { HiVideoCamera } from 'react-icons/hi';
import { ScheduleEvent } from '@/app/types';

interface VideoLink {
  link: string;
}

function EventLink({ event }: { event: ScheduleEvent }) {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const hasFetchedRef = useRef(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [links, setLinks] = useState<VideoLink[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isIntersecting } = useIntersectionObserver(elementRef as React.RefObject<HTMLElement>, {
    threshold: 0.1, // Trigger when 10% of the element is visible
  });

  const handleOpen = () => {
    // Clear any pending close timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleClose = () => {
    // Delay closing by 200ms
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      closeTimeoutRef.current = null;
    }, 200);
  };

  useEffect(() => {
    if (isIntersecting && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      const getEventLink = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`/api?gameId=${event.name}`);
          const data = await response.json();
          if (Array.isArray(data)) {
            setLinks(data);
          }
        } catch (error) {
          console.error('Failed to fetch links:', error);
        } finally {
          setIsLoading(false);
        }
      };
      getEventLink();
    }
  }, [isIntersecting, event.id, event.name]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <span
          className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full bg-brand-blue-100 dark:bg-brand-blue-900/30 text-brand-blue-600 dark:text-brand-blue-300 cursor-pointer hover:bg-brand-blue-200 dark:hover:bg-brand-blue-900/50 transition-colors"
          ref={elementRef}
          onMouseEnter={handleOpen}
          onMouseLeave={handleClose}
        >
          <HiVideoCamera className="w-4 h-4" />
          watch full game
        </span>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="z-50 w-80 rounded-lg bg-white dark:bg-gray-800 p-4 shadow-lg border border-gray-200 dark:border-gray-700"
          sideOffset={5}
          onMouseEnter={handleOpen}
          onMouseLeave={handleClose}
        >
          {isLoading ? (
            <div className="text-sm text-gray-600 dark:text-gray-400">Loading links...</div>
          ) : links.length > 0 ? (
            <div className="space-y-2">
              <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Available Links:
              </div>
              {links.map((item, index) => (
                <a
                  key={index}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-brand-blue-600 dark:text-brand-blue-400 hover:text-brand-blue-800 dark:hover:text-brand-blue-300 hover:underline break-all"
                >
                  {item.link}
                </a>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-600 dark:text-gray-400">No links available</div>
          )}
          <Popover.Arrow className="fill-white dark:fill-gray-800" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export default EventLink;

