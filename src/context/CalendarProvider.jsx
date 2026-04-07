import { useMemo, useState } from "react";
import useCalendarEffects from "../hooks/useCalendarState";
import { CalendarContext } from "./CalendarContext";

export function CalendarProvider({ children }) {

    const [isMounted, setIsMounted] = useState(false);
    const [todayTime, setTodayTime] = useState(0);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentTime, setCurrentTime] = useState(new Date());

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [hoverDate, setHoverDate] = useState(null);
    const [notesDict, setNotesDict] = useState({});
    
    const currentDateYear = currentDate.getFullYear();
    const currentDateMonth = currentDate.getMonth();
    useCalendarEffects({
        setTodayTime,
        setCurrentDate,
        setStartDate,
        setIsMounted,
        setNotesDict,
        setCurrentTime
    });

    const toDateKey = (date) => {
        if (!date) return "";
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    const updateNote = (dateKey, text) => {
        const newNotesDict = {
            ...notesDict,
            [dateKey]: text 
        };

        if (text.trim() === ""){
            delete newNotesDict[dateKey];
        }
        
        setNotesDict(newNotesDict);
        localStorage.setItem("calendar-daily-notes", JSON.stringify(newNotesDict));
    };

    const clearSelection = () => {
        setStartDate(null);
        setEndDate(null);
        setHoverDate(null);
    };

    const nextMonth = () => setCurrentDate(new Date(currentDateYear, currentDateMonth + 1, 1));
    const prevMonth = () => setCurrentDate(new Date(currentDateYear, currentDateMonth - 1, 1));

    const notesThisMonth = useMemo(() => {
        const currentMonthPrefix = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
        return Object.keys(notesDict).filter(key => key.startsWith(currentMonthPrefix)).length;
    }, [currentDate, notesDict]);

  

    return (
        <CalendarContext.Provider value={{ isMounted, todayTime, currentTime, currentDate, notesThisMonth,
        startDate, setStartDate, endDate, setEndDate, hoverDate, setHoverDate,
        notesDict, updateNote, clearSelection, nextMonth, prevMonth, toDateKey
}}>
            {children}
        </CalendarContext.Provider>
    );
}