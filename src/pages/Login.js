import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Stack, Tooltip, useColorModeValue } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import { useGetSettingQuery } from "../redux/api/settingApi";
import { useLoginMutation } from "../redux/api/authApi";
import { setCredentials } from "../redux/features/auth/authSlice";
import { Button, InputControl } from "../components/custom-component";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data } = useGetSettingQuery();
  const [login, { isLoading, isSuccess, isError, error }] = useLoginMutation();
  const { state } = useLocation();
  const backgroundColor = useColorModeValue(
    data?.card_bg_light_color,
    data?.card_bg_dark_color
  );
  const textColor = useColorModeValue(
    data?.card_text_light_color,
    data?.card_text_dark_color
  );

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email format").required("Required"),
    password: Yup.string().required("Required"),
  });

  const onSubmit = async (values) => {
    try {
      const user = await login({
        email: values.email,
        password: values.password,
      }).unwrap();
      dispatch(setCredentials(user));
      if (state) navigate(state.from.pathname);
      else navigate("/events");
    } catch (err) {
      // alert(err.data.message);
      document.getElementById("error-message").innerHTML =
        "Incorrect email or password";
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
          <Box
            rounded={"lg"}
            bg={backgroundColor}
            color={textColor}
            boxShadow={"lg"}
            p={8}
            minW="376px"
          >
            <Stack spacing={4}>
              <Form>
                <Stack spacing={4}>
                  <InputControl name="email" label="Email" type="email" />

                  <InputControl
                    name="password"
                    label="Password"
                    type="password"
                  />

                  <Box id="error-message"></Box>

                  <Button
                    type="submit"
                    disabled={!formik.isValid}
                    isLoading={isLoading}
                    variant="primary"
                    label="Sign in"
                  />
                </Stack>
              </Form>
            </Stack>
          </Box>
        );
      }}
    </Formik>
  );
};

export default Login;
