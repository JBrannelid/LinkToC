import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, Plus } from "lucide-react";
import { format } from "../../utils/calendarUtils";
import FormProvider from "./formBuilder/FormProvider";
import FormInput from "./formBuilder/FormInput";
import TimePicker from "./formBuilder/TimePicker";

// Component for creating or editing an event
// Props:
//   event     - Event data to edit; if null, the form is for a new event
//   onSubmit  - Function to handle form submission
//   onCancel  - Function to handle cancellation
//   title     - Title displayed at the top of the form
//   date      - Currently selected date
//   stables   - List of stables for selection if the user have multiple stables

const DEFAULT_STABLE_ID = 2;

const EventForm = ({
  event,
  onSubmit,
  onCancel,
  title = "",
  date = new Date(),
  stables = [],
}) => {
  const methods = useForm({
    defaultValues: {
      title: "",
      description: "",
      startTime: "08:00",
      endTime: "09:00",
      stableId: DEFAULT_STABLE_ID,
    },
  });

  const formattedDate = format(date, "yyyy-MM-dd");

  useEffect(() => {
    const getTime = (dateInput, targetHour) => {
      const newDate = new Date(dateInput);
      newDate.setHours(targetHour, 0, 0);
      return format(newDate, "HH:mm");
    };

    if (event) {
      const start = new Date(event.startDateTime);
      const end = new Date(event.endDateTime);

      methods.reset({
        title: event.title || "",
        description: event.content || "",
        startTime: format(start, "HH:mm"),
        endTime: format(end, "HH:mm"),
        stableId: event.stableIdFk || DEFAULT_STABLE_ID,
      });
    } else {
      methods.reset({
        title: "",
        description: "",
        startTime: getTime(date, 8),
        endTime: getTime(date, 9),
        stableId: DEFAULT_STABLE_ID,
      });
    }
  }, [event, date, methods]);

  const handleSubmit = (data) => {
    const [startHour, startMinute] = data.startTime.split(":").map(Number);
    const [endHour, endMinute] = data.endTime.split(":").map(Number);

    const start = new Date(date);
    start.setHours(startHour, startMinute);

    const end = new Date(date);
    end.setHours(endHour, endMinute);

    onSubmit?.({
      title: data.title,
      content: data.description,
      id: event?.id,
      startDateTime: start.toISOString(),
      endDateTime: end.toISOString(),
      stableIdFk: data.stableId || event?.stableIdFk || DEFAULT_STABLE_ID,
    });
  };

  return (
    <div className="flex flex-col fixed inset-0 z-100 bg-white">
      <div className="bg-gray-100">
        <div className="flex items-center px-4 py-4 mt-10">
          <button
            onClick={onCancel}
            className="p-2 text-green-800"
            aria-label="Stäng"
          >
            <X className="h-6 w-6" />
          </button>
          <h2 className="text-xl font-semibold mx-auto">{title}</h2>
          <div className="w-8" />
        </div>
      </div>

      <div className="h-5" />

      <FormProvider
        methods={methods}
        onSubmit={handleSubmit}
        footer={{ showFooter: false }}
        className="flex flex-col flex-1"
      >
        <div className="bg-white py-6 px-4 space-y-4">
          <TimePicker
            name="startTime"
            label="Tid"
            date={formattedDate}
            validation={{ required: "Starttid krävs" }}
          />
          <TimePicker
            name="endTime"
            label="Tid"
            date={formattedDate}
            validation={{ required: "Sluttid krävs" }}
          />
        </div>

        <div className="h-20" />

        <div className="bg-gray-100 flex-1 px-4 py-6">
          <div className="flex items-center mb-4">
            <h3 className="text-lg font-medium">Beskrivning</h3>
            <button
              type="submit"
              className="bg-gray-200 hover:bg-gray-300 transition-colors text-black px-4 py-1 rounded-full flex items-center ml-auto"
            >
              Lägg till <Plus className="ml-1 w-5 h-5" />
            </button>
          </div>

          <div className="border-t opacity-20 mb-10" />

          {stables.length > 0 && (
            <select
              {...methods.register("stableId")}
              className="w-full p-2 border border-gray-300 rounded-md mb-6"
            >
              {stables.map(({ id, name }) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
          )}

          <div className="bg-red-50 p-5 rounded-lg">
            <FormInput
              name="title"
              placeholder="Skriv in din aktivitet..."
              validation={{
                required: "Titel krävs",
                maxLength: {
                  value: 50,
                  message: "Max 50 tecken",
                },
              }}
            />
          </div>
        </div>
      </FormProvider>
    </div>
  );
};

export default EventForm;
