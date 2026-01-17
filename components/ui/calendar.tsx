"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "./button";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-4 w-full",
        month: "flex flex-col gap-4 w-full",
        month_caption: "flex justify-center pt-1 relative items-center w-full mb-4",
        caption_label: "text-lg md:text-xl font-semibold",
        nav: "flex items-center gap-1",
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "size-8 md:size-9 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-1 rounded-xl",
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "size-8 md:size-9 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-1 rounded-xl",
        ),
        month_grid: "w-full border-collapse",
        weekdays: "flex w-full",
        weekday:
          "text-muted-foreground rounded-md flex-1 font-medium text-sm md:text-base py-2 text-center",
        week: "flex w-full mt-2",
        day: "relative text-center text-sm md:text-base focus-within:relative focus-within:z-20 flex-1 flex items-center justify-center p-1",
        day_button: cn(
          "inline-flex items-center justify-center whitespace-nowrap font-medium transition-all duration-200 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
          "size-10 md:size-11 lg:size-12 p-0 rounded-xl hover:bg-orange-100 hover:text-orange-600 dark:hover:bg-orange-500/20 dark:hover:text-orange-400 focus:outline-none focus:ring-0 focus-visible:ring-0 border-0 outline-none cursor-pointer",
        ),
        range_start:
          "rounded-l-xl rounded-r-none",
        range_end:
          "rounded-r-xl rounded-l-none",
        selected:
          "!bg-orange-500 !text-white !opacity-100 hover:!bg-orange-600 hover:!text-white focus:!bg-orange-600 focus:!text-white !rounded-xl",
        today: "!bg-orange-100 !text-orange-600 dark:!bg-orange-500/20 dark:!text-orange-400 !rounded-xl font-semibold",
        outside:
          "text-muted-foreground/40 !bg-transparent",
        disabled: "text-muted-foreground opacity-50",
        range_middle:
          "!bg-orange-100 dark:!bg-orange-500/20 !text-orange-600 !rounded-none",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className, ...props }) =>
          orientation === "left" ? (
            <ChevronLeft className={cn("size-4", className)} {...props} />
          ) : (
            <ChevronRight className={cn("size-4", className)} {...props} />
          ),
      }}
      {...props}
    />
  );
}

export { Calendar };
