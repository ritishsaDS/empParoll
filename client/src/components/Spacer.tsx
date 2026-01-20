
type SpacerSize = 2 | 4 | 6 | 8 | 10 | 12;

type SpacerProps = {
  size?: SpacerSize;
  axis?: "horizontal" | "vertical";
};

const sizeMap: Record<SpacerSize, number> = {
  2: 8,
  4: 16,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
};

export const Spacer = ({
  size = 6,
  axis = "horizontal",
}: SpacerProps) => {
  return (
    <div
      style={
        axis === "horizontal"
          ? { width: sizeMap[size] }
          : { height: sizeMap[size] }
      }
    />
  );
};
