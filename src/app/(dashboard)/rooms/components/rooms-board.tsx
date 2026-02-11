import RoomsConfigPage from "./rooms-config-page";
import RoomsPage from "./rooms-page";

export interface RoomsBoardProps {
  mode: "ops" | "admin";
  permissions?: Record<string, boolean>;
  actions?: {
    onPrimaryAction?: () => void;
    onSecondaryAction?: () => void;
  };
}

export default function RoomsBoard(props: RoomsBoardProps) {
  if (props.mode === "admin") {
    return <RoomsConfigPage />;
  }

  return <RoomsPage />;
}
