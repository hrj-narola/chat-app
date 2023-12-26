import PropTypes from "prop-types";
import {Chip} from "@mui/material";

/**
 * Renders Tag (actually MUI Chip) with given text Label styling by MUI Color name
 * @component Tag
 * @param {string} color - name of color from Material UI palette 'primary', 'secondary', 'warning', and so on
 * @param {string} label - text to show in UpperCase, if label is empty nothing is rendered
 */
const Tag = ({
  color = "default",
  label = "",
  onClick,
  variant,
  ...restOfProps
}) => {
  if (!label) return null; // Don't render anything for empty label

  return (
    <Chip
      variant={variant}
      color={color}
      label={label.toUpperCase()}
      size="small"
      sx={{
        flex: "1 auto",
        margin: "0.2rem",
        width: "10px",
        fontWeight: "bolder",
      }}
      onClick={onClick}
      {...restOfProps}
    />
  );
};

Tag.propTypes = {
  color: PropTypes.string,
  variant: PropTypes.string,
  className: PropTypes.string,
  label: PropTypes.string,
  onClick: PropTypes.func,
};

export default Tag;
