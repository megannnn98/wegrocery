"use client";

import { useState } from "react";
import { Input } from "./input";

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

type Props = {
  /** Form field name: submitted as a "YYYY-MM-DDTHH:mm" wall-clock string. */
  name: string;
  /** Initial value in the same "YYYY-MM-DDTHH:mm" shape (or empty). */
  defaultValue?: string;
  required?: boolean;
};

/**
 * Replacement for <input type="datetime-local">, whose 12-hour AM/PM clock
 * follows the browser language, not the site's. The time is a 24-hour
 * "HH:mm" text field; the date keeps the native picker. The pair is mirrored
 * to a hidden input, so the server action reads the same string as before.
 */
export function DateTimeField({ name, defaultValue = "", required }: Props) {
  const [date, setDate] = useState(defaultValue.slice(0, 10));
  const [time, setTime] = useState(defaultValue.slice(11, 16));
  const valid = /^\d{4}-\d{2}-\d{2}$/.test(date) && TIME_PATTERN.test(time);

  return (
    <div className="flex gap-2">
      <Input type="date" required={required} value={date} onChange={(e) => setDate(e.target.value)} />
      <Input
        type="text"
        inputMode="numeric"
        autoComplete="off"
        placeholder="00:00"
        maxLength={5}
        pattern="([01][0-9]|2[0-3]):[0-5][0-9]"
        required={required}
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="max-w-28"
      />
      <input type="hidden" name={name} value={valid ? `${date}T${time}` : ""} />
    </div>
  );
}
