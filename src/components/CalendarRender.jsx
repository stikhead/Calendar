import { useCalendar } from "../context/CalendarContext";

const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();

export default function CalendarRender() {
    const {currentDate, notesDict, startDate, endDate, hoverDate, todayTime, setEndDate, setHoverDate, toDateKey, clearSelection, setStartDate } = useCalendar();
    const currentDateYear = currentDate.getFullYear();
    const currentDateMonth =  currentDate.getMonth();
    const daysInMonth = getDaysInMonth(currentDateYear, currentDateMonth);
    const firstDay = getFirstDayOfMonth(currentDateYear, currentDateMonth);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
        days.push(
            <div 
                key={`empty-start-${i}`}
                className="p-2 min-h-17.5">
            </div>
        );
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const cellDate = new Date(currentDateYear, currentDateMonth, day);
        cellDate.setHours(0, 0, 0, 0);

        const cellTime = cellDate.getTime();
        const dateKey = toDateKey(cellDate);
        const hasNote = !!notesDict[dateKey];

        const isStart = startDate?.getTime() === cellTime;
        const isActualEnd = endDate?.getTime() === cellTime;
        const isHoverEnd = !endDate && hoverDate?.getTime() === cellTime;
        const isEnd = isActualEnd || isHoverEnd;

        const isPast = cellTime < todayTime;
        const isDisabled = isPast && !hasNote;

        const handleDateClick = (day) => {
            const clickedDate = new Date(currentDateYear, currentDateMonth, day);
            clickedDate.setHours(0, 0, 0, 0);

            const clickedTime = clickedDate.getTime();

            if (startDate && endDate && clickedTime === startDate.getTime()) { 
                clearSelection();
                return;
            }

            if (startDate && endDate && clickedTime >= startDate.getTime() && clickedTime <=endDate.getTime()) { 
                clearSelection();
                setStartDate(clickedDate);
                setEndDate(null);
                return;
            }

            if (!startDate || (startDate && endDate)) {
                clearSelection();
                setStartDate(clickedDate);
                setEndDate(null);
            } else if (startDate && !endDate) {
                if (clickedTime === startDate.getTime()) {
                    clearSelection();
                } else if (clickedTime < startDate.getTime()) { 
                    clearSelection();
                    setStartDate(clickedDate);
                    setHoverDate(null);
                } else {
                    setEndDate(clickedDate); 
                }
            }
        };

        const handleDateHover = (day) => {
            if (startDate && !endDate) {
                const hovered = new Date(currentDateYear, currentDateMonth, day);
                hovered.setHours(0, 0, 0, 0);

                setHoverDate((hovered.getTime() >= startDate.getTime()) ? hovered : null);
            }
        };

        let inRange = false;
        if (startDate && endDate) {
            inRange = cellTime > startDate.getTime() && cellTime < endDate.getTime();
        } else if (startDate && hoverDate && !endDate) {
            inRange = cellTime > startDate.getTime() && cellTime <= hoverDate.getTime();
        }

        const isToday = cellTime === todayTime;

        let cardStyle = "";
        if (isDisabled) {
            cardStyle = "border-gray-100 bg-gray-50/50 opacity-40 cursor-not-allowed";
        } else if (isStart || isEnd) {
            cardStyle = "bg-[rgba(var(--theme-color),0.2)] border-[rgba(var(--theme-color),0.3)] shadow-sm ring-1 ring-[rgba(var(--theme-color),0.3)] cursor-pointer";
        } else if (inRange) {
            cardStyle = "bg-[rgba(var(--theme-color),0.2)] border-[rgba(var(--theme-color),0.3)] cursor-pointer";
        } else {
            cardStyle = "border-gray-100 bg-white hover:border-[rgba(var(--theme-color),0.4)] hover:bg-[rgba(var(--theme-color),0.05)] cursor-pointer transition-colors duration-200";
        }

        const staggerDelay = `${Math.min((day - 1) * 18, 300)}ms`;

        days.push(
            <button
                key={day}
                type="button"
                disabled={isDisabled}
                onMouseEnter={() => !isDisabled && handleDateHover(day)}
                onClick={() => !isDisabled && handleDateClick(day)}
                style={{ animationDelay: staggerDelay }}
                className={`cal-day-enter group relative flex flex-col items-center justify-center p-2 sm:p-3 rounded-xl border-2 min-h-17.5 ${cardStyle}`}
            >
                <span className={`text-sm sm:text-base font-bold transition-colors mb-1 ${isStart || isEnd ? "text-[rgb(var(--theme-color))]" : (isDisabled ? "text-gray-400" : "text-gray-700 group-hover:text-[rgb(var(--theme-color))]")
                    }`}>
                    {day}
                </span>

                <div className="flex gap-1 mt-1 h-1.5">
                    {hasNote && (
                        <span className={`h-1.5 w-1.5 rounded-full ${isDisabled ? 'bg-gray-400' : 'bg-yellow-500 notes-dot-pulse'}`} />
                    )}
                </div>

                {isToday && (
                    <div className="absolute -top-1 -right-1">
                        <div className="h-3 w-3 rounded-full bg-[rgb(var(--theme-color))] border-2 border-white today-dot-pulse" />
                    </div>
                )}
            </button>
        );
    }

    const totalCellsUsed = firstDay + daysInMonth;
    const remainingCells = 42 - totalCellsUsed;
    for (let i = 0; i < remainingCells; i++) {
        days.push(
            <div 
                key={`empty-end-${i}`}
                className="p-2 min-h-17.5">
            </div>);
    }

    return days;
};