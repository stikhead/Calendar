import { useCalendar } from "../context/CalendarContext";

export default function RangeToggle (){
    const { setIsRangeMode, isRangeMode, clearSelection } = useCalendar();
    return (
        <button 
            onClick={() => {
                setIsRangeMode(!isRangeMode);
                clearSelection(); 
            }}
            className="flex items-center gap-2 group cursor-pointer shrink-0"
        >
            <span className={`text-xs font-bold tracking-wider transition-colors ${isRangeMode ? 'text-[rgb(var(--theme-color))]' : 'text-gray-400 group-hover:text-gray-600'}`}>
                RANGE
            </span>
            <div className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-300 ${isRangeMode ? 'bg-[rgb(var(--theme-color))]' : 'bg-gray-200'}`}>
                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${isRangeMode ? 'translate-x-4.5' : 'translate-x-1'}`} />
            </div>
        </button>
    );
}