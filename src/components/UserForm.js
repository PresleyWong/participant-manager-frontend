import { Stack, Button, ModalBody, ModalFooter } from "@chakra-ui/react";
import { InputControl, SwitchControl } from "formik-chakra-ui";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import {
  useUpdateUserMutation,
  useCreateNewUserMutation,
} from "../redux/api/userApi";

const UserForm = ({ data, onClose, createNew = false }) => {
  const [updateUser, updateResponse] = useUpdateUserMutation();
  const [createUser, createResponse] = useCreateNewUserMutation();

  let response = createResponse;
  let formAction = createUser;
  let buttonText = "Create";
  let initialValues = {
    email: "",
    password: "",
    locality: "",
    name: "",
    isAdmin: false,
  };

  if (!createNew) {
    response = updateResponse;
    formAction = updateUser;
    buttonText = "Save";

    initialValues = {
      email: data?.email,
      password: data?.password,
      locality: data?.locality,
      name: data?.name,
      isAdmin: data?.is_admin,
    };
  }

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email format").required("Required"),
    password: Yup.string().required("Required"),
    locality: Yup.string().required("Required"),
    name: Yup.string().required("Required"),
  });

  const onSubmit = async (values) => {
    try {
      await formAction({
        userId: data?.id,
        body: {
          email: values.email,
          password: values.password,
          locality: values.locality,
          name: values.name,
          is_admin: values.isAdmin,
        },
      });
    } catch (err) {
      alert(err.data.message);
    } finally {
      onClose();
    }
  };

  return (
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
                <InputControl
                  isRequired
                  name="email"
                  label="Email"
                  inputProps={{ type: "email" }}
                />

                <InputControl
                  isRequired
                  name="password"
                  label="Password"
                  inputProps={{ type: "password" }}
                />
                <InputControl isRequired name="locality" label="Locality" />
                <InputControl isRequired name="name" label="Name" />
                <SwitchControl name="isAdmin" label="Is Admin?" />
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
};

export default UserForm;
