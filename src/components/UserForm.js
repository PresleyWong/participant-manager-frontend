import {
  Stack,
  ModalBody,
  ModalFooter,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  Switch,
  FormLabel,
  FormControl,
  useDisclosure,
  useColorModeValue,
} from "@chakra-ui/react";

import { useGetSettingQuery } from "../redux/api/settingApi";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { InputControl } from "./custom-component";

import {
  useUpdateUserMutation,
  useCreateNewUserMutation,
} from "../redux/api/userApi";
import UpdatePasswordForm from "./UpdatePasswordForm";
import { ModalContent, Button } from "./custom-component";

const UserForm = ({ data, onClose, createNew = false }) => {
  const { data: dataColor } = useGetSettingQuery();
  const switchTrackBg = useColorModeValue(
    dataColor?.secondary_button_bg_light_color,
    dataColor?.secondary_button_bg_dark_color
  );
  const [updateUser, updateResponse] = useUpdateUserMutation();
  const [createUser, createResponse] = useCreateNewUserMutation();
  const {
    isOpen: isOpenPassword,
    onOpen: onOpenPassword,
    onClose: onClosePassword,
  } = useDisclosure();

  let response = createResponse;
  let formAction = createUser;
  let buttonText = "Create";

  let validationSchema = Yup.object({
    email: Yup.string().email("Invalid email format").required("Required"),
    password: Yup.string().required("Required"),
    locality: Yup.string().required("Required"),
    name: Yup.string().required("Required"),
  });

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

    validationSchema = Yup.object({
      email: Yup.string().email("Invalid email format").required("Required"),
      locality: Yup.string().required("Required"),
      name: Yup.string().required("Required"),
    });
  }

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
    <>
      <Modal isOpen={isOpenPassword} onClose={onClosePassword}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change Password</ModalHeader>
          <ModalCloseButton />
          <UpdatePasswordForm data={data} onClose={onClosePassword} />
        </ModalContent>
      </Modal>

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
                    type="email"
                  />

                  {formAction === createUser && (
                    <InputControl
                      isRequired
                      name="password"
                      label="Password"
                      type="password"
                    />
                  )}

                  <InputControl isRequired name="locality" label="Locality" />
                  <InputControl isRequired name="name" label="Name" />

                  <FormControl display="flex">
                    <FormLabel>Is Admin?</FormLabel>
                    <Switch
                      id="isAdmin"
                      isChecked={formik.values.isAdmin}
                      onChange={formik.handleChange}
                      sx={{
                        "span.chakra-switch__track:is([data-checked])": {
                          backgroundColor: switchTrackBg,
                        },
                      }}
                    />
                    {/* <SwitchControl name="isAdmin" label="Is Admin?" colorScheme={"red"} /> */}
                  </FormControl>
                </Stack>
              </ModalBody>
              <ModalFooter>
                {formAction === updateUser && (
                  <Button
                    mr="4"
                    onClick={onOpenPassword}
                    variant="info"
                    label="Change Password"
                  />
                )}

                <Button
                  type="submit"
                  disabled={!formik.isValid}
                  variant="primary"
                  isLoading={response.isLoading}
                  label={buttonText}
                />
              </ModalFooter>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default UserForm;
