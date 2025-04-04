import { getNameInitials } from "@/utilities";
import { Avatar as AntdAvatar, AvatarProps } from "antd";
// Define the type for the custom Avatar props
type props = AvatarProps & {
  name ?: string; // Add your custom 'name' prop here
};

// Define the CustomAvatar component
const CustomAvatar = ({ name, style, ...rest }: props) => {
  return (
    <AntdAvatar
      alt={name} // Using the 'name' prop for alt text
      size="small"
      style={{
        backgroundColor: "#3461eb",
        display: "flex",
        alignItems: "center",
        border: "none",
        ...style,
      }}
      {...rest} 
    >
{getNameInitials(name || '')}
    </AntdAvatar>
  );
};

export default CustomAvatar;
