import { useState } from "react";
import { useCalendar } from "../context/CalendarContext";
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react'
import CalendarRender from "./CalendarRender";
import NotesRender from "./NotesRender";
import useImageTheme from "../hooks/useImageTheme";

const getOppositeRgb = (rgbString) => {
    if (!rgbString) return "255 255 255";

    return rgbString
        .split(' ')
        .map(num => 205 - parseInt(num))
        .join(' ');
};

const MONTH_IMAGES = [
    "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1518623489648-a173ef7824f3?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1501426026826-31c667bdf23d?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1478147427282-58a87a120781?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1455582916367-25f75bfc6710?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1000&auto=format&fit=crop"
];

export default function CalendarLayout() {
    const {
        isMounted, currentDate, currentTime, startDate, setHoverDate,
        clearSelection, prevMonth, nextMonth, notesThisMonth
    } = useCalendar();

    const currentImageUrl = MONTH_IMAGES[currentDate.getMonth()];
    const dynamicRgb = useImageTheme(currentImageUrl);

    const oppositeRgb = getOppositeRgb(dynamicRgb);
    const [calKey, setCalKey] = useState(0);
    const [imgKey, setImgKey] = useState(0);

    const getGreeting = () => {
        const h = currentTime.getHours();
        if (h < 12) return "Good Morning";
        if (h < 18) return "Good Afternoon";
        return "Good Evening";
    };

    const handlePrevMonth = () => {
        prevMonth();
        setCalKey(k => k + 1);
        setImgKey(k => k + 1);
    };

    const handleNextMonth = () => {
        nextMonth();
        setCalKey(k => k + 1);
        setImgKey(k => k + 1);
    };

    if (!isMounted) return null;

    return (
        <div
            style={{
                '--theme-color': dynamicRgb,
                '--theme-opposite': oppositeRgb
            }}
            className="w-full max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row lg:h-175 border border-gray-100">
            <div className="lg:w-1/4 relative min-h-62.5 lg:min-h-full bg-slate-900 overflow-hidden flex flex-col justify-between group">
                <div key={imgKey} className="absolute inset-0 bg-cover bg-center hero-img group-hover:scale-110 opacity-60" style={{ backgroundImage: `url('${MONTH_IMAGES[currentDate.getMonth()]}')` }} />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-slate-900/40 to-slate-900/20 mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent"></div>

                <div className="relative z-10 p-6 lg:p-8 flex justify-between items-start anim-greeting">
                    <div>
                        <p className="text-[rgb(var(--theme-opposite))] text-xs font-bold tracking-widest uppercase mb-1 drop-shadow-md">
                            {getGreeting()}
                        </p>
                        <p className="text-[rgba(var(--theme-opposite))] text-sm font-medium drop-shadow-md">
                            {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                </div>

                <div
                    key={`month-${calKey}`}
                    className="relative z-10 p-6 lg:p-8 text-white w-full anim-month-fade"
                >
                    <h2 className="text-4xl lg:text-5xl font-black tracking-tight mb-1 uppercase drop-shadow-md">
                        {currentDate.toLocaleString('en-US', { month: 'long' })}
                    </h2>
                    <div className="flex items-center justify-between">
                        <span className="text-2xl lg:text-3xl  font-extrabold drop-shadow-sm">{currentDate.getFullYear()}</span>
                        {startDate && (
                            <button
                                onClick={clearSelection}
                                className="transition-transform hover:-translate-y-px active:scale-95 text-xs bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 hover:border-white/30 shadow-xs cursor-pointer"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="lg:flex-1 p-6 sm:p-8 flex flex-col border-b lg:border-b-0 lg:border-r border-gray-100">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-[rgba(var(--theme-color),0.1)] border border-[rgba(var(--theme-color),0.2)] text-[rgb(var(--theme-color))] shadow-sm">
                            <Sparkles className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-[rgba(var(--theme-opposite))] uppercase tracking-wide">
                                {currentDate.toLocaleString('en-US', { month: 'long' })} Overview
                            </h3>
                            <p className="text-xs text-[rgba(var(--theme-color))] font-medium">
                                {notesThisMonth} {notesThisMonth === 1 ? 'note' : 'notes'} logged
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 bg-gray-50 rounded-full p-1 border border-gray-100">
                        <button
                            aria-label="Previous Month"
                            onClick={handlePrevMonth}
                            className="active:scale-90 p-1.5 rounded-full hover:bg-white hover:shadow-sm text-gray-600 transition-all cursor-pointer"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>

                        <span
                            className="font-bold text-sm min-w-22.5 text-center text-gray-800 uppercase tracking-wider"
                        >
                            {currentDate.toLocaleString('en-US', { month: 'short', year: 'numeric' })}
                        </span>

                        <button
                            aria-label="Next Month"
                            onClick={handleNextMonth} className="active:scale-90 p-1.5 rounded-full hover:bg-white hover:shadow-sm text-gray-600 transition-all cursor-pointer"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>

                    </div>
                </div>

                <div className="grid grid-cols-7 gap-2 mb-4 text-center">
                    {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                        <div key={day} className="text-xs font-bold text-gray-400 tracking-wider">{day}</div>
                    ))}
                </div>

                <div key={calKey} className="grid grid-cols-7 gap-2" onMouseLeave={() => setHoverDate(null)}>
                    <CalendarRender />
                </div>
            </div>

            <div className="lg:w-[30%] p-6 sm:p-8 bg-gray-50/50 flex flex-col h-full overflow-y-hidden">
                <NotesRender />
            </div>
        </div>
    );
}