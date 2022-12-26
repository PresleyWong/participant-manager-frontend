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

// import { useLoginMutation } from "../redux/api/authApi";
// import { useDispatch } from "react-redux";
// import { useState, useRef } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { setCredentials } from "../redux/features/auth/authSlice";
// import { InputGroup, InputRightElement, Icon } from "@chakra-ui/react";

// import {
//   Flex,
//   Box,
//   FormControl,
//   FormLabel,
//   Input,
//   Checkbox,
//   Stack,
//   Link,
//   Button,
//   Heading,
//   Text,
//   useColorModeValue,
// } from "@chakra-ui/react";
// import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

// const Login = () => {
//   const emailRef = useRef();
//   const passwordRef = useRef();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [login, { isLoading, isSuccess, isError, error }] = useLoginMutation();
//   const { state } = useLocation();
//   const [showPassword, setShowPassword] = useState(false);
//   const handlePasswordVisibility = () => setShowPassword(!showPassword);

//   const handleSubmit = async (e, redirect) => {
//     e.preventDefault();
//     try {
//       const user = await login({
//         email: emailRef.current.value,
//         password: passwordRef.current.value,
//       }).unwrap();
//       dispatch(setCredentials(user));
//       if (state) navigate(state.from.pathname);
//       else navigate("/events");
//     } catch (err) {
//       alert(err.data.message);
//     }
//   };

//   const backgroundColor = useColorModeValue("white", "gray.700");

//   const content = (
//     <Box rounded={"lg"} bg={backgroundColor} boxShadow={"lg"} p={8}>
//       <Stack spacing={4}>
//         <FormControl id="email">
//           <FormLabel>Email address</FormLabel>
//           <Input type="email" ref={emailRef} />
//         </FormControl>
//         <FormControl id="password">
//           <FormLabel>Password</FormLabel>
//           <InputGroup>
//             <Input
//               ref={passwordRef}
//               type={showPassword ? "text" : "password"}
//             />
//             <InputRightElement width="3rem">
//               <Button h="1.5rem" size="sm" onClick={handlePasswordVisibility}>
//                 {showPassword ? (
//                   <Icon as={ViewIcon} />
//                 ) : (
//                   <Icon as={ViewOffIcon} />
//                 )}
//               </Button>
//             </InputRightElement>
//           </InputGroup>
//         </FormControl>
//         <Stack spacing={10}>
//           <Stack
//             direction={{ base: "column", sm: "row" }}
//             align={"start"}
//             justify={"space-between"}
//           >
//             <Checkbox>Remember me</Checkbox>
//           </Stack>
//           <Button
//             className="primary-button"
//             isLoading={isLoading}
//             onClick={(e) => handleSubmit(e, state)}
//           >
//             Sign in
//           </Button>
//         </Stack>
//       </Stack>
//     </Box>
//   );

//   return content;
// };

// export default Login;
