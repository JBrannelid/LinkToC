import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { format } from "../../utils/calendarUtils";
import FormProvider from "./formBuilder/FormProvider";
import FormInput from "./formBuilder/FormInput";
import TimePicker from "./formBuilder/TimePicker";
import Button from "../ui/Button";
import { useAppContext } from "../../context/AppContext";
import ModalHeader from "../layout/ModalHeader";

const EventForm = ({
  event,
  onSubmit,
  onCancel,
  onDeleteEvent,
  title = "",
  date = new Date(),
  stables = [],
}) => {
  const { currentStable } = useAppContext();

  const methods = useForm({
    defaultValues: {
      title: "",
      description: "",
      startTime: "00:00",
      endTime: "00:00",
      stableId: currentStable?.id,
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
        stableId: event.stableIdFk || currentStable?.id,
      });
    } else {
      methods.reset({
        title: "",
        description: "",
        startTime: getTime(date, 8),
        endTime: getTime(date, 9),
        stableId: currentStable?.id,
      });
    }
  }, [event, date, methods, currentStable]);

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
      stableIdFk: data.stableId || event?.stableIdFk || currentStable?.id,
      userIdFk: event?.userIdFk,
    });
  };

  const handleDelete = () => {
    if (event && event.id && typeof onDeleteEvent === "function") {
      onDeleteEvent(event.id);
      onCancel();
    } else {
      onCancel();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white md:bg-black/40 shadow-md flex flex-col md:items-center md:justify-center">
      <div className="w-full h-full md:h-auto md:w-xl overflow-y-auto bg-background shadow-md rounded flex flex-col relative">
        <div className="bg-primary-light pb-5">
          <ModalHeader
            // title={title}
            showCloseBtn={true}
            onCloseClick={onCancel}
            className="bg-primary-light"
            render="left"
          />
          <h1 className="text-center text-xl uppercase mt-5">{title}</h1>
        </div>

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
                  validation={{ required: "Start time is required" }}
                />
              </div>

              {/* End */}
              <div>
                <TimePicker
                  name="endTime"
                  label="End&nbsp;"
                  validation={{ required: "Endtime is required" }}
                />
              </div>
            </div>
          </div>

          <div className="h-5" />

          <div className="bg-white p-3 rounded-lg">
            <FormInput
              name="title"
              placeholder="Enter name of activity..."
              validation={{
                required: "Titel is required",
                maxLength: {
                  value: 50,
                  message: "Max 50 characters",
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
              {event ? "Update" : "Add"}
            </Button>

            {event && (
              <Button
                type="danger"
                className="w-9/10 mx-auto mt-2"
                onClick={(e) => {
                  e.preventDefault();
                  handleDelete();
                }}
              >
                Delete
              </Button>
            )}

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
    </div>
  );
};

export default EventForm;
