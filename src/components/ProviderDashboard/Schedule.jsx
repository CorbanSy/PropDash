import BookingList from "./BookingList";

export default function Schedule() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold mb-2">Schedule</h1>
      <p className="text-slate-500 text-sm">
        Manage your availability and view upcoming bookings.
      </p>

      <div className="mt-6">
        <BookingList />
      </div>
    </div>
  );
}
