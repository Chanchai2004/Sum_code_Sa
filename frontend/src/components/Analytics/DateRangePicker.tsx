import React, { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Button } from "@mui/material"; // ใช้ Material-UI สำหรับ Button component
import { CalendarToday as CalendarIcon } from "@mui/icons-material"; // ใช้ Material-UI Icons สำหรับ CalendarIcon
import Calendar from "react-calendar"; // ใช้ react-calendar สำหรับ Calendar component
import { format } from "date-fns"; // ใช้ date-fns สำหรับการจัดการวันที่
import "./DateRangPicker.css"; 
type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

interface DateRangePickerProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ dateRange, onDateRangeChange }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outlined"
          style={{
            width: "300px",
            justifyContent: "start",
            textAlign: "left",
            fontWeight: "normal",
          }}
        >
          <CalendarIcon style={{ marginRight: "8px", height: "16px", width: "16px" }} />
          {dateRange?.from ? (
            dateRange.to ? (
              <>
                {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
              </>
            ) : (
              format(dateRange.from, "LLL dd, y")
            )
          ) : (
            <span>Pick a date range</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" sideOffset={4}>
        <Calendar
          selectRange
          value={dateRange}
          onChange={(range) => onDateRangeChange(range as DateRange)}
          showDoubleView
          defaultValue={dateRange}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DateRangePicker;
