import {
  useUpdateEventMutation,
  useCreateNewEventMutation,
} from "../redux/api/eventApi";
import { Stack, Button, ModalBody, ModalFooter } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { InputControl } from "formik-chakra-ui";

const EventForm = ({ data, onClose, createNew = false }) => {
  const [updateEvent, updateResponse] = useUpdateEventMutation();
  const [createEvent, createResponse] = useCreateNewEventMutation();

  let response = createResponse;
  let formAction = createEvent;
  let buttonText = "Create";

  let initialValues = {
    title: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
  };

  if (!createNew) {
    response = updateResponse;
    formAction = updateEvent;
    buttonText = "Save";
    initialValues = {
      title: data?.title,
      startDate: data?.start_date,
      endDate: data?.end_date,
      startTime: data?.start_time,
      endTime: data?.end_time,
    };
  }

  const validationSchema = Yup.object({
    title: Yup.string().required("Required"),
    startDate: Yup.date().required("Required"),
    endDate: Yup.date().required("Required"),
    startTime: Yup.string().required("Required"),
    endTime: Yup.string().required("Required"),
  });

  const onSubmit = async (values) => {
    try {
      await formAction({
        eventId: data?.id,
        body: {
          title: values.title,
          start_date: values.startDate,
          end_date: values.endDate,
          start_time: values.startTime,
          end_time: values.endTime,
        },
      });
    } catch (err) {
      alert(err.data.message);
    } finally {
      onClose();
    }
  };

  const content = (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formik) => {
        return (
          <Form>
            <ModalBody pb={6}>
              <Stack spacing={4}>
                <InputControl label="Title" name="title" />
                <InputControl
                  label="Start Date"
                  name="startDate"
                  inputProps={{ type: "date" }}
                />
                <InputControl
                  label="End Date"
                  name="endDate"
                  inputProps={{ type: "date" }}
                />
                <InputControl
                  label="Start Time"
                  name="startTime"
                  inputProps={{ type: "time" }}
                />
                <InputControl
                  label="End Time"
                  name="endTime"
                  inputProps={{ type: "time" }}
                />
              </Stack>
            </ModalBody>
            <ModalFooter>
              <Button
                type="submit"
                disabled={!formik.isValid}
                className="primary-button"
                isLoading={response.isLoading}
              >
                {buttonText}
              </Button>
            </ModalFooter>
          </Form>
        );
      }}
    </Formik>
  );

  return content;
};

export default EventForm;
