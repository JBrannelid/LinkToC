import { useWallPost } from "../../hooks/useWallPostForm";

const WallPost = ({ event, onSubmit, onCancel }) => {
  const {
    wallPostData,
    formError,
    handleChange,
    handleSubmit,
    handleCancel,
    isValid,
  } = useWallPost(event, onSubmit, onCancel);

  return (
    <>
      <div className="bg-bg-primary p-6 mb-6 rounded-lg shadow-md border-2 border-bg-secondary">
        <h2 className="text-xl font-semibold mb-4 text-bg-secondary"></h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* title input */}
            <div className="col-span-2">
              <label htmlFor="title" className="block mb-1 font-medium">
                <p>Title</p>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={wallPostData.title}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-400 rounded"
              />
            </div>

            {/* body input*/}
            <div className="col-span-2">
              <label htmlFor="body" className="block mb-1 font-medium">
                <p>Body</p>
              </label>
              <input
                type="text"
                id="body"
                name="body"
                value={wallPostData.body}
                onChange={handleChange}
                className="w-full p-2 border border-gray-400 rounded"
              />
            </div>

            {/* Post Time input
            <div>
              <label htmlFor="postDateTime" className="block mb-1 font-medium">
                <p>Post Time</p>
              </label>
              <input
                type="datetime-local"
                id="postDateTime"
                name="postDateTime"
                value={wallPostData.postDateTime}
                onChange={handleChange}
                className="w-full p-2 border border-gray-400 rounded"
              />
            </div> */}

            {/* Last Edited Time input */}
            <div>
              <label
                htmlFor="editedDateTime"
                className="block mb-1 font-medium"
              >
                <p>Edited Time</p>
              </label>
              <input
                type="datetime-local"
                id="editedDateTime"
                name="editedDateTime"
                value={wallPostData.editedDateTime}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-400 rounded"
              />
            </div>

            {/* Form Error Message  */}
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
                <p>Cancel</p>
              </button>

              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {event ? "Save changes" : "Create Post"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default WallPost;
