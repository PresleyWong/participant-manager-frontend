import {
  Stack,
  Button,
  ModalBody,
  ModalFooter,
  Text,
  VStack,
  HStack,
  ButtonGroup,
} from "@chakra-ui/react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { InputControl, SwitchControl } from "formik-chakra-ui";
import { useState } from "react";
import { FaTrashAlt } from "react-icons/fa";

import ConfirmButton from "./ConfirmButton";
import {
  useUpdateEventMutation,
  useDeleteEventAttachmentsMutation,
  useCreateNewEventMutation,
} from "../redux/api/eventApi";

const EventForm = ({ data, onClose, createNew = false }) => {
  const [updateEvent, updateResponse] = useUpdateEventMutation();
  const [createEvent, createResponse] = useCreateNewEventMutation();
  const [deleteEventAttachments, deleteAttachmentsResponse] =
    useDeleteEventAttachmentsMutation();

  const [uploadedFiles, setUploadedFiles] = useState(null);
  const handleFileChange = (e) => {
    const chosenFiles = Array.prototype.slice.call(e.target.files);
    setUploadedFiles(chosenFiles);
  };

  let response = createResponse;
  let formAction = createEvent;
  let buttonText = "Create";

  let initialValues = {
    title: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    isClosed: false,
    isArchived: false,
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
      isClosed: data?.is_closed,
      isArchived: data?.is_archived,
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
      let formData = new FormData();

      if (uploadedFiles) {
        uploadedFiles.forEach((file, i) => {
          formData.append(`attachments[]`, file);
        });
      }

      formData.append("title", values.title);
      formData.append("start_date", values.startDate);
      formData.append("end_date", values.endDate);
      formData.append("start_time", values.startTime);
      formData.append("end_time", values.endTime);
      formData.append("is_closed", values.isClosed);
      formData.append("is_archived", values.isArchived);

      await formAction({
        eventId: data?.id,
        body: formData,
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
                <InputControl isRequired label="Title" name="title" />
                <InputControl
                  isRequired
                  label="Start Date"
                  name="startDate"
                  inputProps={{ type: "date" }}
                />
                <InputControl
                  isRequired
                  label="End Date"
                  name="endDate"
                  inputProps={{ type: "date" }}
                />
                <InputControl
                  isRequired
                  label="Start Time"
                  name="startTime"
                  inputProps={{ type: "time" }}
                />
                <InputControl
                  isRequired
                  label="End Time"
                  name="endTime"
                  inputProps={{ type: "time" }}
                />

                <SwitchControl name="isClosed" label="Is Closed?" />
                <SwitchControl name="isArchived" label="Is Archived?" />

                <label>Attachments</label>
                <VStack>
                  {data?.attachments.map((file, index) => (
                    <HStack justify="space-between" key={index}>
                      <Text>
                        {file.url.split("/").pop().replace(/%20/g, " ")}
                      </Text>

                      <ConfirmButton
                        headerText="Confirm?"
                        bodyText="Are you sure you want to delete?"
                        onSuccessAction={() => {
                          deleteEventAttachments({
                            eventId: data?.id,
                            fileIndex: index,
                          });
                        }}
                        buttonText="Delete"
                        buttonIcon={<FaTrashAlt />}
                        isDanger={true}
                        isLoading={deleteAttachmentsResponse.isLoading}
                      />
                    </HStack>
                  ))}
                </VStack>

                <input
                  multiple
                  type="file"
                  accept=".pdf, .xlsx"
                  onChange={handleFileChange}
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
