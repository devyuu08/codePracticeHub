import { Suspense } from "react";
import { useLoaderData, json, defer, Await } from "react-router-dom";

import EventsList from "../components/EventsList";

function EventsPage() {
  const { events } = useLoaderData();

  return (
    <Suspense fallback={<p style={{ textAlign: "center" }}>Loading...</p>}>
      <Await resolve={events}>
        {(loadedEvents) => <EventsList events={loadedEvents} />}
      </Await>
    </Suspense>
  );
}

export default EventsPage;

async function loadEvents() {
  const response = await fetch("http://localhost:8080/events");

  if (!response.ok) {
    // return { isError: true, message: 'Could not fetch events.' };
    // throw new Response(JSON.stringify({ message: 'Could not fetch events.' }), {
    //   status: 500,
    // });
    throw json(
      { message: "Could not fetch events." },
      {
        status: 500,
      }
    );
  } else {
    const resData = await response.json();
    return resData.events;
  }
}

export function loader() {
  return defer({
    events: loadEvents(),
  });
}

// 라우터 돔 v7부터 json, defer, Await 사용 불가
// function EventsPage() {
//   const { events } = useLoaderData();

//   if (!events || events.length === 0) {
//     return <p style={{ textAlign: "center" }}>No events found.</p>;
//   }

//   return <EventsList events={events} />;
// }

// export default EventsPage;

// export async function loader() {
//   const response = await fetch("http://localhost:8080/events");
//   // return { isError: true, message: "Could not fetch events." };
//   if (!response.ok) {
//     throw new Response(JSON.stringify({ message: "Could not fetch events." }), {
//       status: 500,
//     });
//   }

//   const resData = await response.json();
//   return resData; // `events` 속성 없이 배열 그대로 반환
// }
