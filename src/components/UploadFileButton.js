import { Input, useColorModeValue } from "@chakra-ui/react";
import { useGetSettingQuery } from "../redux/api/settingApi";

const UploadFileButton = ({ onChange }) => {
  const { data } = useGetSettingQuery();
  const textColor = useColorModeValue(
    data?.primary_outline_button_text_light_color,
    data?.primary_outline_button_text_dark_color
  );
  const borderColor = useColorModeValue(
    data?.primary_outline_button_bg_light_color,
    data?.primary_outline_button_bg_dark_color
  );

  return (
    <Input
      sx={{
        "::file-selector-button": {
          border: "1px",
          borderColor: borderColor,
          bg: "transparent",
          color: textColor,
          fontWeight: "600",
          padding: "5px 10px",
          borderRadius: "0.375rem",
          cursor: "pointer",
        },
      }}
      variant="unstyled"
      multiple
      type="file"
      accept=".pdf, .xlsx, .xls"
      onChange={onChange}
    />
  );
};

export default UploadFileButton;
