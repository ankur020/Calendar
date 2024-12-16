import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "./components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function App() {
  const [selectedDate, setSelectedDate] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventName, setEventName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [desc, setDesc] = useState("");
  const [error, setError] = useState("");
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem("events") || "[]");
    setEvents(storedEvents);
  }, []);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
    setError("");
  };

  const saveEventsToLocalStorage = (newEvents) => {
    localStorage.setItem("events", JSON.stringify(newEvents));
  };

  const handleSaveEvent = () => {
    if (!selectedDate) {
      setIsModalOpen(false);
      setError("Please Refresh the page and select the date");
      return;
    }
    if (!eventName || !startTime || !endTime) {
      setError("Please fill out all fields!");
      return;
    }
    if (startTime >= endTime) {
      setError("Start time must be earlier than end time!");
      return;
    }

    if (editingEvent) {
      // Update the existing event
      const updatedEvents = events.map((event) =>
        event === editingEvent
          ? { ...event, name: eventName, startTime, endTime, desc }
          : event
      );
      setEvents(updatedEvents);
      saveEventsToLocalStorage(updatedEvents);
      setEditingEvent(null);
    } else {
      // Create new event
      const newEvent = {
        date: selectedDate?.toLocaleDateString(),
        name: eventName,
        startTime,
        endTime,
        desc,
      };
      const updatedEvents = [...events, newEvent];
      setEvents(updatedEvents);
      saveEventsToLocalStorage(updatedEvents);
    }

    setIsModalOpen(false);
    setEventName("");
    setStartTime("");
    setDesc("");
    setEndTime("");
    setError("");
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setEventName(event.name);
    setStartTime(event.startTime);
    setEndTime(event.endTime);
    setDesc(event.desc);
    setIsModalOpen(true);
  };

  const handleDeleteEvent = (eventToDelete) => {
    const updatedEvents = events.filter((event) => event !== eventToDelete);
    setEvents(updatedEvents);
    saveEventsToLocalStorage(updatedEvents);
  };

  const getFilteredEvents = () => {
    if (!searchQuery) return events;
    return events.filter(
      (event) =>
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.startTime.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.endTime.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="p-4 flex flex-col flex-wrap">
      <h1 className="text-xl font-bold mb-4">Calendar with Add Event</h1>
      <div className="flex flex-row justify-center items-start gap-10 flex-wrap">
        <div className="">
          <Calendar
            selected={selectedDate}
            onSelect={handleDateClick}
            mode="single"
            className="rounded-md border"
          />
        </div>
        {/* Events List */}
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-xl font-bold mb-4 flex justify-center">Events</h2>
          <div className="w-full">
            <input
              type="text"
              placeholder="Search Event"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
          <div className="mt-5">
            {getFilteredEvents().filter(
              (event) => event.date === selectedDate?.toLocaleDateString()
            )?.length > 0 ? (
              <div
                div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {getFilteredEvents()
                  .filter(
                    (event) => event.date === selectedDate?.toLocaleDateString()
                  )
                  .map((event, index) => (
                    <div
                      key={index}
                      className="border rounded-md p-4 bg-white shadow-md hover:shadow-lg"
                    >
                      <div className="">
                        <p className="text-sm font-semibold">
                          Date: {event.date}
                        </p>
                        <p className="text-lg font-bold">{event.name}</p>
                        <p className="text-sm">Start Time: {event.startTime}</p>
                        <p className="text-sm">End Time: {event.endTime}</p>
                        {event.desc?.length > 0 ? (
                          <p className="text-sm">Description: {event.desc}</p>
                        ) : (
                          <></>
                        )}
                      </div>
                      <div className="flex space-x-2 mt-2">
                        <button
                          onClick={() => handleEditEvent(event)}
                          className="p-2 bg-yellow-500 text-white rounded-md"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event)}
                          className="p-2 bg-red-500 text-white rounded-md"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-gray-500">No events added yet.</p>
            )}
          </div>
          {selectedDate && (
            <Button className="mt-5" onClick={() => setIsModalOpen(true)}>
              Add Event
            </Button>
          )}
        </div>
      </div>

      {/* Event Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Event</DialogTitle>
          </DialogHeader>
          {/* Add Event */}
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Selected Date: {selectedDate?.toLocaleDateString() || ""}
            </p>
            <h3 className="text-lg font-semibold mb-2">
              {editingEvent ? "Edit Event" : "Add New Event"}
            </h3>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <input
              type="text"
              placeholder="Event Name"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            />
            <div className="flex gap-5">
              <div className="w-full">
                <span>Start Time</span>
                <input
                  type="time"
                  placeholder="Start Time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
              <div className="w-full">
                <span>End Time</span>
                <input
                  type="time"
                  placeholder="End Time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
            </div>
            <input
              type="text"
              placeholder="Description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            />
            <button
              onClick={handleSaveEvent}
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              {editingEvent ? "Update Event" : "Save Event"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
