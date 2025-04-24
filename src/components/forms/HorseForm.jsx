import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, Plus } from "lucide-react";
import { format } from "../../utils/calendarUtils";
import FormProvider from "./formBuilder/FormProvider";
import FormInput from "./formBuilder/FormInput";
import TimePicker from "./formBuilder/TimePicker";

// Component for creating or editing an Horse
// Props:
//   event     - Event data to edit; if null, the form is for a new event
//   onSubmit  - Function to handle form submission
//   onCancel  - Function to handle cancellation
//   title     - Title displayed at the top of the form
//   date      - Currently selected date
//   stables   - List of stables for selection if the user have multiple stables