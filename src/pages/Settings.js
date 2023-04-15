import {
  Flex,
  Heading,
  Box,
  Stack,
  CardBody,
  CardFooter,
  StackDivider,
} from "@chakra-ui/react";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import {
  useGetSettingQuery,
  useUpdateSettingMutation,
} from "../redux/api/settingApi";
import ColorPicker from "../components/ColorPicker";
import {
  Button,
  Card,
  CardHeader,
  Spinner,
} from "../components/custom-component";

const Settings = () => {
  const { data, isSuccess } = useGetSettingQuery();
  const [updateSetting, updateSettingResponse] = useUpdateSettingMutation();

  let validationSchema = Yup.object({
    headerBgLightColor: Yup.string().required("Required"),
    headerTxtLightColor: Yup.string().required("Required"),
    navbarBgLightColor: Yup.string().required("Required"),
    navbarTxtLightColor: Yup.string().required("Required"),
    footerBgLightColor: Yup.string().required("Required"),
    footerTxtLightColor: Yup.string().required("Required"),
    primaryBtnBgLightColor: Yup.string().required("Required"),
    primaryBtnTxtLightColor: Yup.string().required("Required"),
    secondaryBtnBgLightColor: Yup.string().required("Required"),
    secondaryBtnTxtLightColor: Yup.string().required("Required"),
    infoBtnBgLightColor: Yup.string().required("Required"),
    infoBtnTxtLightColor: Yup.string().required("Required"),
    primaryOutlineBtnBgLightColor: Yup.string().required("Required"),
    primaryOutlineBtnTxtLightColor: Yup.string().required("Required"),
    errorOutlineBtnBgLightColor: Yup.string().required("Required"),
    errorOutlineBtnTxtLightColor: Yup.string().required("Required"),
    mainBgLightColor: Yup.string().required("Required"),
    cardHeaderBgLightColor: Yup.string().required("Required"),
    cardHeaderTxtLightColor: Yup.string().required("Required"),
    cardBgLightColor: Yup.string().required("Required"),
    cardTxtLightColor: Yup.string().required("Required"),
    tableHeaderBgLightColor: Yup.string().required("Required"),
    tableHeaderTxtLightColor: Yup.string().required("Required"),
    tableStripOddBgLightColor: Yup.string().required("Required"),
    tableStripEvenBgLightColor: Yup.string().required("Required"),
    tableTxtLightColor: Yup.string().required("Required"),
    brotherTxtLightColor: Yup.string().required("Required"),
    sisterTxtLightColor: Yup.string().required("Required"),
    headerBgDarkColor: Yup.string().required("Required"),
    headerTxtDarkColor: Yup.string().required("Required"),
    navbarBgDarkColor: Yup.string().required("Required"),
    navbarTxtDarkColor: Yup.string().required("Required"),
    footerBgDarkColor: Yup.string().required("Required"),
    footerTxtDarkColor: Yup.string().required("Required"),
    primaryBtnBgDarkColor: Yup.string().required("Required"),
    primaryBtnTxtDarkColor: Yup.string().required("Required"),
    secondaryBtnBgDarkColor: Yup.string().required("Required"),
    secondaryBtnTxtDarkColor: Yup.string().required("Required"),
    infoBtnBgDarkColor: Yup.string().required("Required"),
    infoBtnTxtDarkColor: Yup.string().required("Required"),
    primaryOutlineBtnBgDarkColor: Yup.string().required("Required"),
    primaryOutlineBtnTxtDarkColor: Yup.string().required("Required"),
    errorOutlineBtnBgDarkColor: Yup.string().required("Required"),
    errorOutlineBtnTxtDarkColor: Yup.string().required("Required"),
    mainBgDarkColor: Yup.string().required("Required"),
    cardHeaderBgDarkColor: Yup.string().required("Required"),
    cardHeaderTxtDarkColor: Yup.string().required("Required"),
    cardBgDarkColor: Yup.string().required("Required"),
    cardTxtDarkColor: Yup.string().required("Required"),
    tableHeaderBgDarkColor: Yup.string().required("Required"),
    tableHeaderTxtDarkColor: Yup.string().required("Required"),
    tableStripOddBgDarkColor: Yup.string().required("Required"),
    tableStripEvenBgDarkColor: Yup.string().required("Required"),
    tableTxtDarkColor: Yup.string().required("Required"),
    brotherTxtDarkColor: Yup.string().required("Required"),
    sisterTxtDarkColor: Yup.string().required("Required"),
    inputBoderLightColor: Yup.string().required("Required"),
    inputBoderDarkColor: Yup.string().required("Required"),
  });

  let content;

  if (isSuccess) {
    let initialValues = {
      headerBgLightColor: data.header_bg_light_color,
      headerTxtLightColor: data.header_text_light_color,
      navbarBgLightColor: data.navbar_bg_light_color,
      navbarTxtLightColor: data.navbar_text_light_color,
      footerBgLightColor: data.footer_bg_light_color,
      footerTxtLightColor: data.footer_text_light_color,
      primaryBtnBgLightColor: data.primary_button_bg_light_color,
      primaryBtnTxtLightColor: data.primary_button_text_light_color,
      secondaryBtnBgLightColor: data.secondary_button_bg_light_color,
      secondaryBtnTxtLightColor: data.secondary_button_text_light_color,
      infoBtnBgLightColor: data.info_button_bg_light_color,
      infoBtnTxtLightColor: data.info_button_text_light_color,
      primaryOutlineBtnBgLightColor: data.primary_outline_button_bg_light_color,
      primaryOutlineBtnTxtLightColor:
        data.primary_outline_button_text_light_color,
      errorOutlineBtnBgLightColor: data.error_outline_button_bg_light_color,
      errorOutlineBtnTxtLightColor: data.error_outline_button_text_light_color,
      mainBgLightColor: data.main_bg_light_color,
      cardHeaderBgLightColor: data.card_header_bg_light_color,
      cardHeaderTxtLightColor: data.card_header_text_light_color,
      cardBgLightColor: data.card_bg_light_color,
      cardTxtLightColor: data.card_text_light_color,
      tableHeaderBgLightColor: data.table_header_bg_light_color,
      tableHeaderTxtLightColor: data.table_header_text_light_color,
      tableStripOddBgLightColor: data.table_strip_odd_bg_light_color,
      tableStripEvenBgLightColor: data.table_strip_even_bg_light_color,
      tableTxtLightColor: data.table_text_light_color,
      brotherTxtLightColor: data.brother_text_light_color,
      sisterTxtLightColor: data.sister_text_light_color,
      headerBgDarkColor: data.header_bg_dark_color,
      headerTxtDarkColor: data.header_text_dark_color,
      navbarBgDarkColor: data.navbar_bg_dark_color,
      navbarTxtDarkColor: data.navbar_text_dark_color,
      footerBgDarkColor: data.footer_bg_dark_color,
      footerTxtDarkColor: data.footer_text_dark_color,
      primaryBtnBgDarkColor: data.primary_button_bg_dark_color,
      primaryBtnTxtDarkColor: data.primary_button_text_dark_color,
      secondaryBtnBgDarkColor: data.secondary_button_bg_dark_color,
      secondaryBtnTxtDarkColor: data.secondary_button_text_dark_color,
      infoBtnBgDarkColor: data.info_button_bg_dark_color,
      infoBtnTxtDarkColor: data.info_button_text_dark_color,
      primaryOutlineBtnBgDarkColor: data.primary_outline_button_bg_dark_color,
      primaryOutlineBtnTxtDarkColor:
        data.primary_outline_button_text_dark_color,
      errorOutlineBtnBgDarkColor: data.error_outline_button_bg_dark_color,
      errorOutlineBtnTxtDarkColor: data.error_outline_button_text_dark_color,
      mainBgDarkColor: data.main_bg_dark_color,
      cardHeaderBgDarkColor: data.card_header_bg_dark_color,
      cardHeaderTxtDarkColor: data.card_header_text_dark_color,
      cardBgDarkColor: data.card_bg_dark_color,
      cardTxtDarkColor: data.card_text_dark_color,
      tableHeaderBgDarkColor: data.table_header_bg_dark_color,
      tableHeaderTxtDarkColor: data.table_header_text_dark_color,
      tableStripOddBgDarkColor: data.table_strip_odd_bg_dark_color,
      tableStripEvenBgDarkColor: data.table_strip_even_bg_dark_color,
      tableTxtDarkColor: data.table_text_dark_color,
      brotherTxtDarkColor: data.brother_text_dark_color,
      sisterTxtDarkColor: data.sister_text_dark_color,
      inputBoderLightColor: data.input_border_light_color,
      inputBoderDarkColor: data.input_border_dark_color,
    };

    const onSubmit = async (values) => {
      try {
        await updateSetting({
          body: {
            header_bg_light_color: values.headerBgLightColor,
            header_text_light_color: values.headerTxtLightColor,
            navbar_bg_light_color: values.navbarBgLightColor,
            navbar_text_light_color: values.navbarTxtLightColor,
            footer_bg_light_color: values.footerBgLightColor,
            footer_text_light_color: values.footerTxtLightColor,
            primary_button_bg_light_color: values.primaryBtnBgLightColor,
            primary_button_text_light_color: values.primaryBtnTxtLightColor,
            secondary_button_bg_light_color: values.secondaryBtnBgLightColor,
            secondary_button_text_light_color: values.secondaryBtnTxtLightColor,
            info_button_bg_light_color: values.infoBtnBgLightColor,
            info_button_text_light_color: values.infoBtnTxtLightColor,
            primary_outline_button_bg_light_color:
              values.primaryOutlineBtnBgLightColor,
            primary_outline_button_text_light_color:
              values.primaryOutlineBtnTxtLightColor,
            error_outline_button_bg_light_color:
              values.errorOutlineBtnBgLightColor,
            error_outline_button_text_light_color:
              values.errorOutlineBtnTxtLightColor,
            main_bg_light_color: values.mainBgLightColor,
            card_header_bg_light_color: values.cardHeaderBgLightColor,
            card_header_text_light_color: values.cardHeaderTxtLightColor,
            card_bg_light_color: values.cardBgLightColor,
            card_text_light_color: values.cardTxtLightColor,
            table_header_bg_light_color: values.tableHeaderBgLightColor,
            table_header_text_light_color: values.tableHeaderTxtLightColor,
            table_strip_odd_bg_light_color: values.tableStripOddBgLightColor,
            table_strip_even_bg_light_color: values.tableStripEvenBgLightColor,
            table_text_light_color: values.tableTxtLightColor,
            brother_text_light_color: values.brotherTxtLightColor,
            sister_text_light_color: values.sisterTxtLightColor,
            header_bg_dark_color: values.headerBgDarkColor,
            header_text_dark_color: values.headerTxtDarkColor,
            navbar_bg_dark_color: values.navbarBgDarkColor,
            navbar_text_dark_color: values.navbarTxtDarkColor,
            footer_bg_dark_color: values.footerBgDarkColor,
            footer_text_dark_color: values.footerTxtDarkColor,
            primary_button_bg_dark_color: values.primaryBtnBgDarkColor,
            primary_button_text_dark_color: values.primaryBtnTxtDarkColor,
            secondary_button_bg_dark_color: values.secondaryBtnBgDarkColor,
            secondary_button_text_dark_color: values.secondaryBtnTxtDarkColor,
            info_button_bg_dark_color: values.infoBtnBgDarkColor,
            info_button_text_dark_color: values.infoBtnTxtDarkColor,
            primary_outline_button_bg_dark_color:
              values.primaryOutlineBtnBgDarkColor,
            primary_outline_button_text_dark_color:
              values.primaryOutlineBtnTxtDarkColor,
            error_outline_button_bg_dark_color:
              values.errorOutlineBtnBgDarkColor,
            error_outline_button_text_dark_color:
              values.errorOutlineBtnTxtDarkColor,
            main_bg_dark_color: values.mainBgDarkColor,
            card_header_bg_dark_color: values.cardHeaderBgDarkColor,
            card_header_text_dark_color: values.cardHeaderTxtDarkColor,
            card_bg_dark_color: values.cardBgDarkColor,
            card_text_dark_color: values.cardTxtDarkColor,
            table_header_bg_dark_color: values.tableHeaderBgDarkColor,
            table_header_text_dark_color: values.tableHeaderTxtDarkColor,
            table_strip_odd_bg_dark_color: values.tableStripOddBgDarkColor,
            table_strip_even_bg_dark_color: values.tableStripEvenBgDarkColor,
            table_text_dark_color: values.tableTxtDarkColor,
            brother_text_dark_color: values.brotherTxtDarkColor,
            sister_text_dark_color: values.sisterTxtDarkColor,
            input_border_light_color: values.inputBoderLightColor,
            input_border_dark_color: values.inputBoderDarkColor,
          },
        });
      } catch (err) {
        alert(err.data.message);
      }
    };

    content = (
      <Card>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {(formik) => (
            <Form>
              <CardHeader>
                <Heading size="md">Colors</Heading>
              </CardHeader>

              <CardBody>
                <Stack
                  direction={"row"}
                  spacing="20"
                  divider={<StackDivider />}
                >
                  <Stack divider={<StackDivider />} spacing="4">
                    <Box>
                      <Heading size="xs" mb={2}>
                        Header Background Color
                      </Heading>

                      <Flex direction="row" gap="6">
                        <ColorPicker
                          label="Light"
                          id="headerBgLightColor"
                          values={formik.values}
                        />
                        <ColorPicker
                          label="Dark"
                          id="headerBgDarkColor"
                          values={formik.values}
                        />
                      </Flex>
                    </Box>

                    <Box>
                      <Heading size="xs" mb={2}>
                        Header Text Color
                      </Heading>

                      <Flex direction="row" gap="6">
                        <ColorPicker
                          label="Light"
                          id="headerTxtLightColor"
                          values={formik.values}
                        />
                        <ColorPicker
                          label="Dark"
                          id="headerTxtDarkColor"
                          values={formik.values}
                        />
                      </Flex>
                    </Box>

                    <Box>
                      <Heading size="xs" mb={2}>
                        Navbar Background Color
                      </Heading>

                      <Flex direction="row" gap="6">
                        <ColorPicker
                          label="Light"
                          id="navbarBgLightColor"
                          values={formik.values}
                        />
                        <ColorPicker
                          label="Dark"
                          id="navbarBgDarkColor"
                          values={formik.values}
                        />
                      </Flex>
                    </Box>

                    <Box>
                      <Heading size="xs" mb={2}>
                        Navbar Text Color
                      </Heading>

                      <Flex direction="row" gap="6">
                        <ColorPicker
                          label="Light"
                          id="navbarTxtLightColor"
                          values={formik.values}
                        />
                        <ColorPicker
                          label="Dark"
                          id="navbarTxtDarkColor"
                          values={formik.values}
                        />
                      </Flex>
                    </Box>

                    <Box>
                      <Heading size="xs" mb={2}>
                        Footer Background Color
                      </Heading>

                      <Flex direction="row" gap="6">
                        <ColorPicker
                          label="Light"
                          id="footerBgLightColor"
                          values={formik.values}
                        />
                        <ColorPicker
                          label="Dark"
                          id="footerBgDarkColor"
                          values={formik.values}
                        />
                      </Flex>
                    </Box>

                    <Box>
                      <Heading size="xs" mb={2}>
                        Footer Text Color
                      </Heading>

                      <Flex direction="row" gap="6">
                        <ColorPicker
                          label="Light"
                          id="footerTxtLightColor"
                          values={formik.values}
                        />
                        <ColorPicker
                          label="Dark"
                          id="footerTxtDarkColor"
                          values={formik.values}
                        />
                      </Flex>
                    </Box>
                    <Box>
                      <Heading size="xs" mb={2}>
                        Main Background Color
                      </Heading>

                      <Flex direction="row" gap="6">
                        <ColorPicker
                          label="Light"
                          id="mainBgLightColor"
                          values={formik.values}
                        />
                        <ColorPicker
                          label="Dark"
                          id="mainBgDarkColor"
                          values={formik.values}
                        />
                      </Flex>
                    </Box>
                    <Box>
                      <Heading size="xs" mb={2}>
                        Brother Text Color
                      </Heading>

                      <Flex direction="row" gap="6">
                        <ColorPicker
                          label="Light"
                          id="brotherTxtLightColor"
                          values={formik.values}
                        />
                        <ColorPicker
                          label="Dark"
                          id="brotherTxtDarkColor"
                          values={formik.values}
                        />
                      </Flex>
                    </Box>

                    <Box>
                      <Heading size="xs" mb={2}>
                        Sister Text Color
                      </Heading>

                      <Flex direction="row" gap="6">
                        <ColorPicker
                          label="Light"
                          id="sisterTxtLightColor"
                          values={formik.values}
                        />
                        <ColorPicker
                          label="Dark"
                          id="sisterTxtDarkColor"
                          values={formik.values}
                        />
                      </Flex>
                    </Box>
                  </Stack>

                  <Stack divider={<StackDivider />} spacing="4">
                    <Box>
                      <Heading size="xs" mb={2}>
                        Card Header Background Color
                      </Heading>

                      <Flex direction="row" gap="6">
                        <ColorPicker
                          label="Light"
                          id="cardHeaderBgLightColor"
                          values={formik.values}
                        />
                        <ColorPicker
                          label="Dark"
                          id="cardHeaderBgDarkColor"
                          values={formik.values}
                        />
                      </Flex>
                    </Box>

                    <Box>
                      <Heading size="xs" mb={2}>
                        Card Header Text Color
                      </Heading>

                      <Flex direction="row" gap="6">
                        <ColorPicker
                          label="Light"
                          id="cardHeaderTxtLightColor"
                          values={formik.values}
                        />
                        <ColorPicker
                          label="Dark"
                          id="cardHeaderTxtDarkColor"
                          values={formik.values}
                        />
                      </Flex>
                    </Box>

                    <Box>
                      <Heading size="xs" mb={2}>
                        Card Background Color
                      </Heading>

                      <Flex direction="row" gap="6">
                        <ColorPicker
                          label="Light"
                          id="cardBgLightColor"
                          values={formik.values}
                        />
                        <ColorPicker
                          label="Dark"
                          id="cardBgDarkColor"
                          values={formik.values}
                        />
                      </Flex>
                    </Box>

                    <Box>
                      <Heading size="xs" mb={2}>
                        Card Text Color
                      </Heading>

                      <Flex direction="row" gap="6">
                        <ColorPicker
                          label="Light"
                          id="cardTxtLightColor"
                          values={formik.values}
                        />
                        <ColorPicker
                          label="Dark"
                          id="cardTxtDarkColor"
                          values={formik.values}
                        />
                      </Flex>
                    </Box>

                    <Box>
                      <Heading size="xs" mb={2}>
                        Table Header Background Color
                      </Heading>

                      <Flex direction="row" gap="6">
                        <ColorPicker
                          label="Light"
                          id="tableHeaderBgLightColor"
                          values={formik.values}
                        />
                        <ColorPicker
                          label="Dark"
                          id="tableHeaderBgDarkColor"
                          values={formik.values}
                        />
                      </Flex>
                    </Box>

                    <Box>
                      <Heading size="xs" mb={2}>
                        Table Header Text Color
                      </Heading>

                      <Flex direction="row" gap="6">
                        <ColorPicker
                          label="Light"
                          id="tableHeaderTxtLightColor"
                          values={formik.values}
                        />
                        <ColorPicker
                          label="Dark"
                          id="tableHeaderTxtDarkColor"
                          values={formik.values}
                        />
                      </Flex>
                    </Box>

                    <Box>
                      <Heading size="xs" mb={2}>
                        Table Strip Odd Background Color
                      </Heading>

                      <Flex direction="row" gap="6">
                        <ColorPicker
                          label="Light"
                          id="tableStripOddBgLightColor"
                          values={formik.values}
                        />
                        <ColorPicker
                          label="Dark"
                          id="tableStripOddBgDarkColor"
                          values={formik.values}
                        />
                      </Flex>
                    </Box>

                    <Box>
                      <Heading size="xs" mb={2}>
                        Table Strip Even Background Color
                      </Heading>

                      <Flex direction="row" gap="6">
                        <ColorPicker
                          label="Light"
                          id="tableStripEvenBgLightColor"
                          values={formik.values}
                        />
                        <ColorPicker
                          label="Dark"
                          id="tableStripEvenBgDarkColor"
                          values={formik.values}
                        />
                      </Flex>
                    </Box>

                    <Box>
                      <Heading size="xs" mb={2}>
                        Table Text Color
                      </Heading>

                      <Flex direction="row" gap="6">
                        <ColorPicker
                          label="Light"
                          id="tableTxtLightColor"
                          values={formik.values}
                        />
                        <ColorPicker
                          label="Dark"
                          id="tableTxtDarkColor"
                          values={formik.values}
                        />
                      </Flex>
                    </Box>

                    <Box>
                      <Heading size="xs" mb={2}>
                        Form Input Focus Border Color
                      </Heading>

                      <Flex direction="row" gap="6">
                        <ColorPicker
                          label="Light"
                          id="inputBoderLightColor"
                          values={formik.values}
                        />
                        <ColorPicker
                          label="Dark"
                          id="inputBoderDarkColor"
                          values={formik.values}
                        />
                      </Flex>
                    </Box>
                  </Stack>

                  <Stack divider={<StackDivider />} spacing="4">
                    <Box>
                      <Heading size="xs" mb={2}>
                        Primary Button Background Color
                      </Heading>

                      <Flex direction="row" gap="6">
                        <ColorPicker
                          label="Light"
                          id="primaryBtnBgLightColor"
                          values={formik.values}
                        />
                        <ColorPicker
                          label="Dark"
                          id="primaryBtnBgDarkColor"
                          values={formik.values}
                        />
                      </Flex>
                    </Box>

                    <Box>
                      <Heading size="xs" mb={2}>
                        Primary Button Text Color
                      </Heading>

                      <Flex direction="row" gap="6">
                        <ColorPicker
                          label="Light"
                          id="primaryBtnTxtLightColor"
                          values={formik.values}
                        />
                        <ColorPicker
                          label="Dark"
                          id="primaryBtnTxtDarkColor"
                          values={formik.values}
                        />
                      </Flex>
                    </Box>

                    <Box>
                      <Heading size="xs" mb={2}>
                        Secondary Button Background Color
                      </Heading>

                      <Flex direction="row" gap="6">
                        <ColorPicker
                          label="Light"
                          id="secondaryBtnBgLightColor"
                          values={formik.values}
                        />
                        <ColorPicker
                          label="Dark"
                          id="secondaryBtnBgDarkColor"
                          values={formik.values}
                        />
                      </Flex>
                    </Box>

                    <Box>
                      <Heading size="xs" mb={2}>
                        Secondary Button Text Color
                      </Heading>

                      <Flex direction="row" gap="6">
                        <ColorPicker
                          label="Light"
                          id="secondaryBtnTxtLightColor"
                          values={formik.values}
                        />
                        <ColorPicker
                          label="Dark"
                          id="secondaryBtnTxtDarkColor"
                          values={formik.values}
                        />
                      </Flex>
                    </Box>

                    <Box>
                      <Heading size="xs" mb={2}>
                        Info Button Background Color
                      </Heading>

                      <Flex direction="row" gap="6">
                        <ColorPicker
                          label="Light"
                          id="infoBtnBgLightColor"
                          values={formik.values}
                        />
                        <ColorPicker
                          label="Dark"
                          id="infoBtnBgDarkColor"
                          values={formik.values}
                        />
                      </Flex>
                    </Box>

                    <Box>
                      <Heading size="xs" mb={2}>
                        Info Button Text Color
                      </Heading>

                      <Flex direction="row" gap="6">
                        <ColorPicker
                          label="Light"
                          id="infoBtnTxtLightColor"
                          values={formik.values}
                        />
                        <ColorPicker
                          label="Dark"
                          id="infoBtnTxtDarkColor"
                          values={formik.values}
                        />
                      </Flex>
                    </Box>

                    <Box>
                      <Heading size="xs" mb={2}>
                        Primary Outline Button Background Color
                      </Heading>

                      <Flex direction="row" gap="6">
                        <ColorPicker
                          label="Light"
                          id="primaryOutlineBtnBgLightColor"
                          values={formik.values}
                        />
                        <ColorPicker
                          label="Dark"
                          id="primaryOutlineBtnBgDarkColor"
                          values={formik.values}
                        />
                      </Flex>
                    </Box>

                    <Box>
                      <Heading size="xs" mb={2}>
                        Primary Outline Button Text Color
                      </Heading>

                      <Flex direction="row" gap="6">
                        <ColorPicker
                          label="Light"
                          id="primaryOutlineBtnTxtLightColor"
                          values={formik.values}
                        />
                        <ColorPicker
                          label="Dark"
                          id="primaryOutlineBtnTxtDarkColor"
                          values={formik.values}
                        />
                      </Flex>
                    </Box>

                    <Box>
                      <Heading size="xs" mb={2}>
                        Error Outline Button Background Color
                      </Heading>

                      <Flex direction="row" gap="6">
                        <ColorPicker
                          label="Light"
                          id="errorOutlineBtnBgLightColor"
                          values={formik.values}
                        />
                        <ColorPicker
                          label="Dark"
                          id="errorOutlineBtnBgDarkColor"
                          values={formik.values}
                        />
                      </Flex>
                    </Box>

                    <Box>
                      <Heading size="xs" mb={2}>
                        Error Outline Button Text Color
                      </Heading>

                      <Flex direction="row" gap="6">
                        <ColorPicker
                          label="Light"
                          id="errorOutlineBtnTxtLightColor"
                          values={formik.values}
                        />
                        <ColorPicker
                          label="Dark"
                          id="errorOutlineBtnTxtDarkColor"
                          values={formik.values}
                        />
                      </Flex>
                    </Box>
                  </Stack>
                </Stack>
              </CardBody>

              <CardFooter>
                <Button
                  type="submit"
                  disabled={!formik.isValid}
                  variant="primary"
                  isLoading={updateSettingResponse.isLoading}
                  label="Save"
                />
              </CardFooter>
            </Form>
          )}
        </Formik>
      </Card>
    );
  } else {
    content = <Spinner />;
  }

  return content;
};

export default Settings;
