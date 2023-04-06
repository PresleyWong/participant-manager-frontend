import { useState, useEffect } from "react";
import reactCSS from "reactcss";
import { SketchPicker } from "react-color";
import { colord } from "colord";
import { FormControl, FormLabel, HStack } from "@chakra-ui/react";

const ColorPicker = ({ id, values, label }) => {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [color, setColor] = useState(colord(values[id]).toRgb());

  const styles = reactCSS({
    default: {
      color: {
        width: "36px",
        height: "14px",
        borderRadius: "2px",
        background: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`,
      },
      swatch: {
        padding: "5px",
        background: "#fff",
        borderRadius: "1px",
        boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
        display: "inline-block",
        cursor: "pointer",
      },
      popover: {
        position: "absolute",
        zIndex: "2",
      },
      cover: {
        position: "fixed",
        top: "0px",
        right: "0px",
        bottom: "0px",
        left: "0px",
      },
    },
  });

  const handleClick = () => {
    setDisplayColorPicker(
      (previousDisplayColorPicker) => !previousDisplayColorPicker
    );
  };

  const handleChange = (color) => {
    setColor(color.rgb);
    values[id] = color.hex;
  };

  return (
    <div>
      <HStack>
        <FormLabel m={0}>{label}</FormLabel>
        <div style={styles.swatch} onClick={handleClick}>
          <div style={styles.color} />
        </div>
      </HStack>
      {displayColorPicker ? (
        <div style={styles.popover}>
          <div style={styles.cover} onClick={handleClick} />
          <SketchPicker
            color={color}
            onChange={handleChange}
            width={200}
            disableAlpha
          />
        </div>
      ) : null}
    </div>
  );
};

export default ColorPicker;
