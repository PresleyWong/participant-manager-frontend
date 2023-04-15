import {
  Card as ChakraCard,
  CardHeader as ChakraCardHeader,
  Button as ChakraButton,
  Spinner as ChakraSpinner,
  IconButton as ChakraIconButton,
  Table as ChakraTable,
  ModalContent as ChakraModalContent,
  Link as ChakraLink,
  Input as ChakraInput,
  FormControl as ChakraFormControl,
  FormLabel,
  FormErrorMessage,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  chakra,
  Tooltip,
  Box,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";
import { Field } from "formik";
import { Link as ReachLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { flexRender } from "@tanstack/react-table";

import { selectCurrentColorMode } from "../redux/features/colorMode/colorModeSlice";
import { useGetSettingQuery } from "../redux/api/settingApi";
import Pagination from "./Pagination";

export const InputControl = ({ label, name, ...rest }) => {
  const { data } = useGetSettingQuery();
  const colorMode = useSelector(selectCurrentColorMode);

  return (
    <Field name={name}>
      {({ field, form }) => (
        <ChakraFormControl isInvalid={form.errors[name] && form.touched[name]}>
          <FormLabel>{label}</FormLabel>
          <ChakraInput
            id={name}
            {...rest}
            {...field}
            focusBorderColor={
              colorMode === "light"
                ? data?.input_border_light_color
                : data?.input_border_dark_color
            }
            boxShadow="xs"
          />
          <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
        </ChakraFormControl>
      )}
    </Field>
  );
};

export const Link = (props) => {
  const { data } = useGetSettingQuery();

  return (
    <ChakraLink {...props} as={ReachLink}>
      <Text
        fontSize="sm"
        fontWeight="extrabold"
        as="u"
        color={useColorModeValue(
          data?.primary_button_text_light_color,
          data?.primary_button_text_dark_color
        )}
      >
        {props.children}
      </Text>
    </ChakraLink>
  );
};

export const ModalContent = (props) => {
  const { data } = useGetSettingQuery();

  return (
    <ChakraModalContent>
      <span
        style={{
          backgroundColor: useColorModeValue(
            data?.card_bg_light_color,
            data?.card_bg_dark_color
          ),
          color: useColorModeValue(
            data?.card_text_light_color,
            data?.card_text_dark_color
          ),
        }}
      >
        {props.children}
      </span>
    </ChakraModalContent>
  );
};

export const Spinner = () => {
  return (
    <Box position="absolute" top="50%" left="50%">
      <ChakraSpinner />
    </Box>
  );
};

export const Card = (props) => {
  const { data } = useGetSettingQuery();

  return (
    <ChakraCard
      bg={useColorModeValue(
        data?.card_bg_light_color,
        data?.card_bg_dark_color
      )}
      color={useColorModeValue(
        data?.card_text_light_color,
        data?.card_text_dark_color
      )}
      boxShadow="lg"
      width="100%"
    >
      {props.children}
    </ChakraCard>
  );
};

export const CardHeader = (props) => {
  const { data } = useGetSettingQuery();

  return (
    <ChakraCardHeader
      bg={useColorModeValue(
        data?.card_header_bg_light_color,
        data?.card_header_bg_dark_color
      )}
      color={useColorModeValue(
        data?.card_header_text_light_color,
        data?.card_header_text_dark_color
      )}
      {...props}
    >
      {props.children}
    </ChakraCardHeader>
  );
};

export const Button = ({ label, onClick, variant, ...rest }) => {
  const { data } = useGetSettingQuery();
  const colorMode = useSelector(selectCurrentColorMode);
  let bgColor;
  let textColor;
  let borderColor;

  switch (variant) {
    case "primary":
      bgColor =
        colorMode === "light"
          ? data?.primary_button_bg_light_color
          : data?.primary_button_bg_dark_color;

      textColor =
        colorMode === "light"
          ? data?.primary_button_text_light_color
          : data?.primary_button_text_dark_color;
      break;
    case "secondary":
      bgColor =
        colorMode === "light"
          ? data?.secondary_button_bg_light_color
          : data?.secondary_button_bg_dark_color;

      textColor =
        colorMode === "light"
          ? data?.secondary_button_text_light_color
          : data?.secondary_button_text_dark_color;
      break;
    case "info":
      bgColor =
        colorMode === "light"
          ? data?.info_button_bg_light_color
          : data?.info_button_bg_dark_color;

      textColor =
        colorMode === "light"
          ? data?.info_button_text_light_color
          : data?.info_button_text_dark_color;
      break;
    case "error":
      bgColor =
        colorMode === "light"
          ? data?.error_button_bg_light_color
          : data?.error_button_bg_dark_color;

      textColor =
        colorMode === "light"
          ? data?.error_button_text_light_color
          : data?.error_button_text_dark_color;
      break;
    case "primaryOutline":
      borderColor =
        colorMode === "light"
          ? data?.primary_outline_button_bg_light_color
          : data?.primary_outline_button_bg_dark_color;
      textColor =
        colorMode === "light"
          ? data?.primary_outline_button_text_light_color
          : data?.primary_outline_button_text_dark_color;
      bgColor = "transparent";
      break;
    case "secondaryOutline":
      borderColor =
        colorMode === "light"
          ? data?.secondary_outline_button_bg_light_color
          : data?.secondary_outline_button_bg_dark_color;
      textColor =
        colorMode === "light"
          ? data?.secondary_outline_button_text_light_color
          : data?.secondary_outline_button_text_dark_color;
      bgColor = "transparent";
      break;
    case "infoOutline":
      borderColor =
        colorMode === "light"
          ? data?.info_outline_button_bg_light_color
          : data?.info_outline_button_bg_dark_color;
      textColor =
        colorMode === "light"
          ? data?.info_outline_button_text_light_color
          : data?.info_outline_button_text_dark_color;
      bgColor = "transparent";
      break;
    case "errorOutline":
      borderColor =
        colorMode === "light"
          ? data?.error_outline_button_bg_light_color
          : data?.error_outline_button_bg_dark_color;
      textColor =
        colorMode === "light"
          ? data?.error_outline_button_text_light_color
          : data?.error_outline_button_text_dark_color;
      bgColor = "transparent";
      break;
    default:
      bgColor =
        colorMode === "light"
          ? data?.primary_button_bg_light_color
          : data?.primary_button_bg_dark_color;

      textColor =
        colorMode === "light"
          ? data?.primary_button_text_light_color
          : data?.primary_button_text_dark_color;
  }

  return (
    <ChakraButton
      {...rest}
      onClick={onClick}
      bg={bgColor}
      borderColor={borderColor}
      color={textColor}
      _hover={{ bg: bgColor, color: textColor }}
    >
      {label}
    </ChakraButton>
  );
};

export const IconButton = ({ onClick, variant, tooltipLabel, ...rest }) => {
  const { data } = useGetSettingQuery();
  const colorMode = useSelector(selectCurrentColorMode);
  let borderColor;
  let textColor;

  switch (variant) {
    case "primaryOutline":
      borderColor =
        colorMode === "light"
          ? data?.primary_outline_button_bg_light_color
          : data?.primary_outline_button_bg_dark_color;
      textColor =
        colorMode === "light"
          ? data?.primary_outline_button_text_light_color
          : data?.primary_outline_button_text_dark_color;
      break;
    case "secondaryOutline":
      borderColor =
        colorMode === "light"
          ? data?.secondary_outline_button_bg_light_color
          : data?.secondary_outline_button_bg_dark_color;
      textColor =
        colorMode === "light"
          ? data?.secondary_outline_button_text_light_color
          : data?.secondary_outline_button_text_dark_color;
      break;
    case "infoOutline":
      borderColor =
        colorMode === "light"
          ? data?.info_outline_button_bg_light_color
          : data?.info_outline_button_bg_dark_color;
      textColor =
        colorMode === "light"
          ? data?.info_outline_button_text_light_color
          : data?.info_outline_button_text_dark_color;
      break;
    case "errorOutline":
      borderColor =
        colorMode === "light"
          ? data?.error_outline_button_bg_light_color
          : data?.error_outline_button_bg_dark_color;
      textColor =
        colorMode === "light"
          ? data?.error_outline_button_text_light_color
          : data?.error_outline_button_text_dark_color;
      break;
    default:
      borderColor = colorMode === "light" ? "#e2e8f0" : "#ffffff29";
      textColor = colorMode === "light" ? "black" : "#ffffffeb";
  }
  return (
    <Tooltip label={tooltipLabel}>
      <ChakraIconButton
        {...rest}
        onClick={onClick}
        borderColor={borderColor}
        color={textColor}
        bg="transparent"
        border="1px"
        _hover={{ borderColor: borderColor, color: textColor }}
      ></ChakraIconButton>
    </Tooltip>
  );
};

export const Table = ({ table }) => {
  const { data } = useGetSettingQuery();

  const headerBg = useColorModeValue(
    data?.table_header_bg_light_color,
    data?.table_header_bg_dark_color
  );
  const headerTextColor = useColorModeValue(
    data?.table_header_text_light_color,
    data?.table_header_text_dark_color
  );
  const oddBg = useColorModeValue(
    data?.table_strip_odd_bg_light_color,
    data?.table_strip_odd_bg_dark_color
  );
  const evenBg = useColorModeValue(
    data?.table_strip_even_bg_light_color,
    data?.table_strip_even_bg_dark_color
  );
  const bodyTextColor = useColorModeValue(
    data?.table_text_light_color,
    data?.table_text_dark_color
  );

  return (
    <>
      <ChakraTable variant="simple" size="small" boxShadow={"lg"}>
        <Thead bg={headerBg} color={headerTextColor}>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const meta = header.column.columnDef.meta;
                return (
                  <Th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    isNumeric={meta?.isNumeric}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}

                    <chakra.span pl={1}>
                      {header.column.getIsSorted() ? (
                        header.column.getIsSorted() === "desc" ? (
                          <TriangleDownIcon aria-label="sorted descending" />
                        ) : (
                          <TriangleUpIcon aria-label="sorted ascending" />
                        )
                      ) : null}
                    </chakra.span>
                  </Th>
                );
              })}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          {table.getRowModel().rows.map((row, index) => (
            <Tr
              key={index}
              bg={index % 2 === 0 ? oddBg : evenBg}
              color={bodyTextColor}
            >
              {row.getVisibleCells().map((cell) => {
                const meta = cell.column.columnDef.meta;
                return (
                  <Td key={cell.id} isNumeric={meta?.isNumeric}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                );
              })}
            </Tr>
          ))}
        </Tbody>
      </ChakraTable>

      <Pagination table={table} />
    </>
  );
};
