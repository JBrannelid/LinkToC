import { useEventForm } from "../../hooks/useEventForm";

const EventForm = ({ event, onSubmit, onCancel }) => {
  const {
    formData,
    formError,
    handleChange,
    handleSubmit,
    handleCancel,
    isValid,
  } = useEventForm(event, onSubmit, onCancel);

  return (
    <div className="bg-bg-primary p-6 mb-6 rounded-lg shadow-md border-2 border-bg-secondary">
      <h2 className="text-xl font-semibold mb-4 text-bg-secondary">
        {event ? "Redigera händelse" : "Lägg till händelse"}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Title input */}
          <div className="col-span-2">
            <label htmlFor="title" className="block mb-1 font-medium">
              <p>Titel</p>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-400 rounded"
            />
          </div>

          {/* Start time input */}
          <div>
            <label htmlFor="startDateTime" className="block mb-1 font-medium">
              <p>Starttid</p>
            </label>
            <input
              type="datetime-local"
              id="startDateTime"
              name="startDateTime"
              value={formData.startDateTime}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-400 rounded"
            />
          </div>

          {/* End time input */}
          <div>
            <label htmlFor="endDateTime" className="block mb-1 font-medium">
              <p>Sluttid</p>
            </label>
            <input
              type="datetime-local"
              id="endDateTime"
              name="endDateTime"
              value={formData.endDateTime}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-400 rounded"
            />
          </div>
        </div>

        {/* Form Error message - Expand (col-span-2) */}
        {formError && (
          <div className="col-span-2 text-red-500 mt-1">{formError}</div>
        )}

        {/* Form Buttons */}
        <div className="flex justify-end mt-6 space-x-3">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
          >
            <p>Avbryt</p>
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {event ? "Spara ändringar" : "Skapa händelse"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
