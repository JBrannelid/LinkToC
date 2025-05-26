import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import FormInput from "./formBuilder/FormInput";
import FormProvider from "./formBuilder/FormProvider";
import TimePicker from "./formBuilder/TimePicker";
import { useAppContext } from "../../context/AppContext";
import { format } from "../../utils/calendarUtils";
import ModalHeader from "../layout/ModalHeader";
import Button from "../ui/Button";
import ConfirmationModal from "../ui/ConfirmationModal";
import LoadingSpinner from "../ui/LoadingSpinner";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  // Time fields for validation
  const watchedStartTime = methods.watch("startTime");
  const _watchedEndTime = methods.watch("endTime");

  // Helper function to convert time string to minutes for comparison
  const timeToMinutes = (timeString) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    return hours * 60 + minutes;
  };

  // Validation function for end time
  const validateEndTime = (endTime) => {
    if (!watchedStartTime || !endTime) return true;

    const startMinutes = timeToMinutes(watchedStartTime);
    const endMinutes = timeToMinutes(endTime);

    if (endMinutes <= startMinutes) {
      return "End time must be after start time";
    }
    return true;
  };

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

  const handleSubmit = async (data) => {
    if (isSubmitting) return;

    const [startHour, startMinute] = data.startTime.split(":").map(Number);
    const [endHour, endMinute] = data.endTime.split(":").map(Number);

    const start = new Date(date);
    start.setHours(startHour, startMinute);

    const end = new Date(date);
    end.setHours(endHour, endMinute);

    // Additional frontend validation before submission
    if (end <= start) {
      methods.setError("endTime", {
        type: "manual",
        message: "End time must be after start time",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit?.({
        title: data.title,
        content: data.description,
        id: event?.id,
        startDateTime: start.toISOString(),
        endDateTime: end.toISOString(),
        stableIdFk: data.stableId || event?.stableIdFk || currentStable?.id,
        userIdFk: event?.userIdFk,
      });
    } catch (error) {
      console.error("Error submitting event:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    if (!event?.id || typeof onDeleteEvent !== "function") {
      onCancel();
      return;
    }

    setIsDeleting(true);

    try {
      await onDeleteEvent(event.id);
      setShowDeleteConfirmation(false);
      onCancel();
    } catch (error) {
      console.error("Error deleting event:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white md:bg-black/40 shadow-md flex flex-col md:items-center md:justify-center">
      <div className="w-full h-full md:h-auto md:w-xl overflow-y-auto bg-background shadow-md rounded flex flex-col relative">
        {/* Loading Overlay */}
        {isSubmitting && (
          <div className="absolute inset-0 bg-black/20 z-10 flex items-center justify-center rounded">
            <div className="bg-white rounded-lg p-4 shadow-lg flex items-center space-x-3">
              <LoadingSpinner size="medium" className="text-primary" />
              <span className="text-sm">Saving...</span>
            </div>
          </div>
        )}

        <div className="bg-primary-light pb-5">
          <ModalHeader
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

              {/* Start Time */}
              <div>
                <TimePicker
                  name="startTime"
                  label="Start"
                  validation={{ required: "Start time is required" }}
                />
              </div>

              {/* End Time with validation */}
              <div>
                <TimePicker
                  name="endTime"
                  label="End"
                  validation={{
                    required: "End time is required",
                    validate: validateEndTime,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="h-5" />

          <div className=" p-3 rounded-lg">
            <FormInput
              name="title"
              placeholder="Enter activity name..."
              className="bg-white border border-primary rounded-lg"
              validation={{
                required: "Title is required",
                maxLength: {
                  value: 50,
                  message: "Maximum 50 characters",
                },
              }}
            />
          </div>

          <div className="flex-1 px-4 py-6">
            <Button
              type="submit"
              className="w-9/10 mx-auto bg-primary"
              disabled={isSubmitting}
              onClick={(e) => {
                e.preventDefault();
                methods.handleSubmit(handleSubmit)();
              }}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <LoadingSpinner size="small" className="text-white" />
                  <span>Saving...</span>
                </div>
              ) : event ? (
                "Update"
              ) : (
                "Add"
              )}
            </Button>

            {event && (
              <Button
                type="danger"
                className="w-9/10 mx-auto mt-2"
                disabled={isSubmitting || isDeleting}
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
                disabled={isSubmitting || isDeleting}
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

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={showDeleteConfirmation}
          onClose={() => setShowDeleteConfirmation(false)}
          onConfirm={handleConfirmDelete}
          loading={isDeleting}
          title="Delete Event"
          confirmButtonText="Delete"
          cancelButtonText="Cancel"
          confirmButtonType="danger"
          cancelButtonType="secondary"
        >
          Are you sure you want to delete this event? This cannot be undone.
        </ConfirmationModal>
      </div>
    </div>
  );
};

export default EventForm;
