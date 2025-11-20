import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";

type Props = {
  iconName: string;
  color?: string;
  size?: number;
};

const iconComponents: Record<string, (color?: string, size?: number) => JSX.Element> = {
  plus: (color = "white", size = 24) => <AntDesign name="plus" size={size} color={color} />,
  check: (color = "white", size = 24) => <AntDesign name="check" size={size} color={color} />,
  edit: (color = "white", size = 24) => <Entypo name="edit" size={size} color={color} />,
  trash: (color = "red", size = 24) => <Feather name="trash" size={size} color={color} />,
  calendar: (color = "white", size = 24) => <AntDesign name="calendar" size={size} color={color} />,
  arrowDown: (color = "white", size = 24) => <AntDesign name="arrowdown" size={size} color={color} />,
};

const Icon = ({ iconName, color, size }: Props) => {
  const Icon = iconComponents[iconName];
  return Icon ? Icon(color, size) : null;
};

export default Icon;
