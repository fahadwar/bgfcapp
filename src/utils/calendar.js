export function buildGoogleCalendarLink({ title, details, location, start, end }) {
  const formatDate = (date) => new Date(date).toISOString().replace(/[-:]|\.\d{3}/g, '');
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    details,
    location,
    dates: `${formatDate(start)}/${formatDate(end)}`
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function downloadIcsFile({ title, description, location, start, end }) {
  const formatDate = (date) => new Date(date).toISOString().replace(/[-:]|\.\d{3}/g, '');
  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    `DTSTART:${formatDate(start)}`,
    `DTEND:${formatDate(end)}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ];
  const blob = new Blob([icsLines.join('\n')], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${title.replace(/\s+/g, '-')}.ics`;
  anchor.click();
  setTimeout(() => {
    window.URL.revokeObjectURL(url);
  }, 1000);
}
