import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarIcon } from "@radix-ui/react-icons";
import { addDays, format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from 'react';

type Props = {
  onAdd: () => void;
};

export default function AddTodoForm({ onAdd }: Props) {
  const [content, setContent] = useState('');
  const [date, setDate] = React.useState<Date>();
  const [priority, setPriority] = useState('medium');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedDate = date ? format(date, "EEE MMM dd yyyy HH:mm:ss") : null;
    console.log('Submitting todo:', { content, submitDate: formattedDate, priority }); // Debugging
    await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, submitDate: formattedDate, priority }),
    });
    setContent('');
    setDate(undefined);
    setPriority('medium');
    onAdd();
  };

  return (
    <form onSubmit={handleSubmit} className='px-2'>
      <div className='p-2'>
        <Input
          type="text"
          width={"200px"}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter a new todo"
          required
          className='w-full '
        />
        <div className='flex justify-end space-x-4 py-2 mr-5'>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[150px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                {date ? format(date, "PPP") : <span>Select date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="flex w-auto flex-col space-y-2 p-2 "
            >
              <Select
                onValueChange={(value) =>
                  setDate(addDays(new Date(), parseInt(value)))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="0">Today</SelectItem>
                  <SelectItem value="1">Tomorrow</SelectItem>
                  <SelectItem value="3">In 3 days</SelectItem>
                  <SelectItem value="7">In a week</SelectItem>
                </SelectContent>
              </Select>
              <div className="rounded-md border">
                <Calendar mode="single"  selected={date} onSelect={setDate} />
              </div>
            </PopoverContent>
          </Popover>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" className='bg-blue-600 ml-2'>
            Save
          </Button>
        </div>
      </div>
    </form>
  );
}