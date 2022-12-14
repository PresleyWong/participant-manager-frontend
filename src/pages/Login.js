import { useLoginMutation } from "../redux/api/authApi";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, Link as ReachLink } from "react-router-dom";
import { setCredentials } from "../redux/features/auth/authSlice";
import {
  Box,
  Checkbox,
  Stack,
  Button,
  useColorModeValue,
  Text,
  Link,
  Flex,
} from "@chakra-ui/react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { InputControl } from "formik-chakra-ui";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading, isSuccess, isError, error }] = useLoginMutation();
  const { state } = useLocation();
  const backgroundColor = useColorModeValue("white", "gray.700");

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
          <Box rounded={"lg"} bg={backgroundColor} boxShadow={"lg"} p={8}>
            <Stack spacing={4}>
              <Form>
                <Stack spacing={4}>
                  <InputControl
                    name="email"
                    label="Email"
                    inputProps={{ type: "email" }}
                  />
                  <InputControl
                    name="password"
                    label="Password"
                    inputProps={{ type: "password" }}
                  />

                  <Box id="error-message"></Box>

                  <Button
                    type="submit"
                    disabled={!formik.isValid}
                    className="primary-button"
                    isLoading={isLoading}
                  >
                    Sign in
                  </Button>
                </Stack>
              </Form>

              <Text fontWeight="medium">
                Don't have an account?
                <Link as={ReachLink} ms="5px" fontWeight="bold" to="/signup">
                  Sign Up
                </Link>
              </Text>
            </Stack>
          </Box>
        );
      }}
    </Formik>
  );
};

export default Login;
