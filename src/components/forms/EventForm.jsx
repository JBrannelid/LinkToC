import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { format } from "../../utils/calendarUtils";
import FormProvider from "./formBuilder/FormProvider";
import FormInput from "./formBuilder/FormInput";
import TimePicker from "./formBuilder/TimePicker";
import Button from "../ui/Button";

// Component for creating or editing an event
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
    console.log("Form submitted with data:", data); // Loggar data när formuläret skickas

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
      userIdFk: event?.userIdFk, // Pass userIdFk when submit a excisting event
    });
  };

  return (
    <div className="flex flex-col fixed inset-0 z-100 bg-background">
      <div className="relative flex items-center justify-center bg-primary-light py-5 px-4">
        <div className="absolute left-4">
          <Button
            type="primary"
            size="large"
            variant="icon"
            className="border-0 text-primary"
            aria-label="Close"
            onClick={onCancel}
          >
            <X strokeWidth={4} />
          </Button>
        </div>
        <h2 className="text-xl text-center uppercase">{title}</h2>
      </div>

      <div className="h-5" />

      <FormProvider
        methods={methods}
        onSubmit={handleSubmit}
        footer={{ showFooter: false }}
        className="flex flex-col flex-1"
      >
        <div className="bg-white rounded-2xl border border-primary py-4 px-6">
          <div className="flex flex-col items-start gap-2">
            {/* Date */}
            <div>
              <span>{formattedDate}</span>
            </div>

            {/* Start */}
            <div>
              <TimePicker
                name="startTime"
                label="Start"
                validation={{ required: "Starttid krävs" }}
              />
            </div>

            {/* End */}
            <div>
              <TimePicker
                name="endTime"
                label="Slut&nbsp;"
                validation={{ required: "Sluttid krävs" }}
              />
            </div>
          </div>
        </div>

        <div className="h-5" />

        <div className="bg-white p-3 rounded-lg">
          <FormInput
            name="title"
            placeholder="Skriv in aktivitetens namn..."
            validation={{
              required: "Titel krävs",
              maxLength: {
                value: 50,
                message: "Max 50 tecken",
              },
            }}
          />
        </div>

        <div className="flex-1 px-4 py-6">
          <Button
            type="submit"
            className="w-9/10 mx-auto bg-primary"
            // Explicitly calling handleSubmit because htmlType="submit" doesn't work with React Hook Form.
            onClick={(e) => {
              e.preventDefault();
              methods.handleSubmit(handleSubmit)();
            }}
          >
            Lägg till
          </Button>

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
        </div>
      </FormProvider>
    </div>
  );
};

export default EventForm;
