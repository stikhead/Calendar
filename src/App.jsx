"use client";
import { CalendarProvider } from "./context/CalendarProvider";
import CalendarLayout from "./components/CalendarLayout";
export default function WallCalendar() {
    return (
        <CalendarProvider>
            <CalendarLayout/>
        </CalendarProvider>
    );
}