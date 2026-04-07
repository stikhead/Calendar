"use client";

import { useEffect } from "react";

export default function useCalendarEffects({setTodayTime, setCurrentDate, setStartDate, setIsMounted, setNotesDict, setCurrentTime }) {
    const fetch = () => {
        const now = new Date();
        const normalized = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        setTodayTime(normalized.getTime());
        setCurrentDate(new Date(now.getFullYear(), now.getMonth(), 1));
        setStartDate(normalized);
        setIsMounted(true);

        const savedNotes = localStorage.getItem("calendar-daily-notes");
        if (savedNotes) {
            try { 
                setNotesDict(JSON.parse(savedNotes)); 
            } catch (e) { 
                console.error("Failed to parse notes", e); 
            }
        }

        const timer = setInterval(() => setCurrentTime(new Date()), 60000);

        return () => clearInterval(timer);
    }
    useEffect(() => {
        return fetch();
    }, []); 
}