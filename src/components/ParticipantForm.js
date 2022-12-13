import { useRef } from "react";
import { Stack, Button, ModalBody, ModalFooter } from "@chakra-ui/react";
import {
  useUpdateParticipantMutation,
  useCreateNewParticipantMutation,
} from "../redux/api/participantApi";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  InputControl,
  SelectControl,
  TextareaControl,
  NumberInputControl,
} from "formik-chakra-ui";

const ParticipantForm = ({ data, onClose, createNew = false }) => {
  const [update, updateResponse] = useUpdateParticipantMutation();
  const [create, createResponse] = useCreateNewParticipantMutation();

  let response = createResponse;
  let formAction = create;
  let buttonText = "Create";

  let initialValues = {
    english_name: "",
    chinese_name: "",
    gender: "",
    email: "",
    phone: "",
    language: "",
    college: "",
    academic_year: "",
    remarks: "",
    locality: "",
  };

  if (!createNew) {
    response = updateResponse;
    formAction = update;
    buttonText = "Save";
    initialValues = {
      english_name: data?.english_name,
      chinese_name: data?.chinese_name,
      gender: data?.gender,
      email: data?.email,
      phone: data?.phone,
      language: data?.language,
      college: data?.college,
      academic_year: data?.academic_year,
      remarks: data?.remarks,
      locality: data?.locality,
    };
  }

  const validationSchema = Yup.object({
    english_name: Yup.string().required("Required"),
    chinese_name: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email format").required("Required"),
    phone: Yup.number().required("Required"),
    language: Yup.string().required("Required"),
    locality: Yup.string().required("Required"),
    gender: Yup.string().required("Required"),
    college: Yup.string().required("Required"),
    academic_year: Yup.number().required("Required"),
  });

  const onSubmit = async (values) => {
    try {
      await formAction({
        participantId: data?.id,
        body: {
          english_name: values.english_name,
          chinese_name: values.chinese_name,
          gender: values.gender,
          locality: values.locality,
          email: values.email,
          phone: values.phone,
          language: values.language,
          college: values.college,
          academic_year: values.academic_year,
          remarks: values.remarks,
        },
      });
    } catch (err) {
      alert(err.data.message);
    } finally {
      onClose();
    }
  };

  const languageOptions = ["English", "Chinese", "Bahasa Malaysia"];
  const genderOptions = ["Brother", "Sister"];

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
                <InputControl label="English Name" name="english_name" />
                <InputControl label="Chinese Name" name="chinese_name" />
                <SelectControl
                  label="Gender"
                  name="gender"
                  selectProps={{ placeholder: "Select option" }}
                >
                  {genderOptions.map((option, index) => {
                    return (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    );
                  })}
                </SelectControl>
                <InputControl
                  label="Email"
                  name="email"
                  inputProps={{ type: "email" }}
                />
                <InputControl
                  label="Phone"
                  name="phone"
                  inputProps={{ type: "tel" }}
                />

                <SelectControl
                  label="Language"
                  name="language"
                  selectProps={{ placeholder: "Select option" }}
                >
                  {languageOptions.map((option, index) => {
                    return (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    );
                  })}
                </SelectControl>
                <InputControl label="Locality" name="locality" />
                <InputControl label="College" name="college" />
                <NumberInputControl
                  label="Academic Year"
                  name="academic_year"
                />
                <TextareaControl label="Remarks" name="remarks" />
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

export default ParticipantForm;
