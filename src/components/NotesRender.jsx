import { StickyNote, AlignLeft, Info, Lock } from 'lucide-react';
import { useCalendar } from '../context/CalendarContext';
import RangeToggle from './RangeMode';

const formatDisplayDate = (date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export default function NotesRender() {
    const { todayTime, toDateKey, startDate, endDate, notesDict, updateNote } = useCalendar();

    const handleNotesChange = (e) => {
        if (!startDate || endDate || startDate.getTime() < todayTime) {
            return;
        }
        const dateKey = toDateKey(startDate);
        updateNote(dateKey, e.target.value);
    };

    const getDatesInRange = (start, end) => {
        const dates = [];
        let current = new Date(start);
        while (current <= end) {
            dates.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }
        return dates;
    };


    if (!startDate && !endDate) {
        return (
            <div className="flex flex-col h-full anim-fade-in">
                <div className="flex justify-end mb-4">
                    <RangeToggle />
                </div>
                <div className="flex flex-col items-center justify-center grow text-center p-6 text-gray-400">
                    <AlignLeft className="h-12 w-12 mb-4 opacity-20" />
                    <p className="text-sm">Select a date on the calendar to view or add notes.</p>
                </div>
            </div>
        );
    }

    if (startDate && !endDate) {
        const dateKey = toDateKey(startDate);
        const currentNote = notesDict[dateKey] || "";
        const isPastDate = startDate.getTime() < todayTime;

        return (
            <div className="flex flex-col h-full anim-fade-in">
                <div className="flex items-start justify-between mb-4 border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-2 text-gray-800 font-bold">
                        {isPastDate 
                            ? <Lock className="h-4 w-4 text-gray-400" /> 
                            : <StickyNote className="h-5 w-5 text-yellow-500" />
                        }
                        <span>
                            {formatDisplayDate(startDate)}
                        </span>
                    </div>
                    <RangeToggle />
                </div>

                {isPastDate ? (
                    <div className="grow w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600 whitespace-pre-wrap wrap-break-word overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] shadow-inner">
                        {currentNote}
                    </div>
                ) : (
                    <textarea
                        value={currentNote}
                        onChange={handleNotesChange}
                        placeholder="e.g., Graph algorithms practice, upcoming CF rounds..."
                        className="grow w-full p-4 bg-yellow-50/50 border border-yellow-100 rounded-xl resize-none outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-yellow-50 text-sm text-gray-700 transition-all placeholder:text-gray-400"
                    />
                )}

                <p className="text-xs mt-3 text-right font-medium">
                    {isPastDate 
                        ? <span className="text-gray-400">Read-only record</span> 
                        : <span className="text-gray-400">Notes autosave automatically</span>
                    }
                </p>
            </div>
        );
    }

    if (startDate && endDate) {
        const rangeDates = getDatesInRange(startDate, endDate);
        const datesWithNotes = rangeDates.filter(d => notesDict[toDateKey(d)]);

        return (
            <div className="flex flex-col h-full anim-slide-right">
                <div className="flex items-start justify-between mb-4 border-b border-gray-100 pb-4">
                    <div>
                        <h3 className="text-gray-800 font-bold flex items-center gap-2">
                            <AlignLeft className="h-5 w-5 text-[rgb(var(--theme-color))]" />
                            Range Overview
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 font-medium">
                            {formatDisplayDate(startDate)} — {formatDisplayDate(endDate)}
                        </p>
                    </div>
                    <RangeToggle />
                </div>

                <div className="grow overflow-y-auto space-y-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {datesWithNotes.length === 0 ? (
                        <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg text-gray-500 text-sm anim-fade-in">
                            <Info className="h-4 w-4" />
                            No notes found in this timeframe.
                        </div>
                    ) : (
                        datesWithNotes.map((date, i) => (
                            <div
                                key={toDateKey(date)}
                                style={{ animationDelay: `${i * 60}ms` }}
                                className="range-card p-3 bg-white border border-gray-100 shadow-sm rounded-lg relative flex flex-col"
                            >
                                {date.getTime() < todayTime && <Lock className="absolute top-3 right-3 h-3 w-3 text-gray-300 shrink-0" />}
                                
                                <span className="text-xs font-bold text-[rgb(var(--theme-color))] block mb-2 shrink-0">
                                    {formatDisplayDate(date)}
                                </span>
                                
                                <div className="max-h-32 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                    <p className="text-sm text-gray-700 whitespace-pre-wrap wrap-break-word">
                                        {notesDict[toDateKey(date)]}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        );
    }
}