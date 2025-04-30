import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTranslation } from "@/hooks/use-translation";

interface DateRangePickerProps {
  className?: string;
  value?: DateRange;
  onChange: (date: DateRange | undefined) => void;
}

export function DateRangePicker({
  className,
  value,
  onChange,
}: DateRangePickerProps) {
  const { t, language } = useTranslation();
  
  const [date, setDate] = React.useState<DateRange | undefined>(
    value || {
      from: new Date(),
      to: addDays(new Date(), 7),
    }
  );
  
  // Update the internally managed date when the external value changes
  React.useEffect(() => {
    if (value) {
      setDate(value);
    }
  }, [value]);
  
  // Handle changes to the date range
  const handleSelect = (newDate: DateRange | undefined) => {
    setDate(newDate);
    onChange(newDate);
  };
  
  // Format the date for display
  const formatDate = (date: Date | undefined) => {
    if (!date) return "";
    return format(date, "PPP");
  };
  
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {language === 'ar' ? (
                    <>
                      {formatDate(date.to)} - {formatDate(date.from)}
                    </>
                  ) : (
                    <>
                      {formatDate(date.from)} - {formatDate(date.to)}
                    </>
                  )}
                </>
              ) : (
                formatDate(date.from)
              )
            ) : (
              <span>{t('selectDateRange')}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}