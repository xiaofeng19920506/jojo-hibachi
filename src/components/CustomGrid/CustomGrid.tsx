import React from "react";
import { Box } from "@mui/material";
import type { BoxProps } from "@mui/material";

export interface CustomGridProps extends Omit<BoxProps, "item" | "container"> {
  container?: boolean;
  item?: boolean;
  xs?: number | boolean;
  sm?: number | boolean;
  md?: number | boolean;
  lg?: number | boolean;
  xl?: number | boolean;
  spacing?: number;
  direction?: "row" | "column" | "row-reverse" | "column-reverse";
  justifyContent?:
    | "flex-start"
    | "center"
    | "flex-end"
    | "space-between"
    | "space-around"
    | "space-evenly";
  alignItems?: "flex-start" | "center" | "flex-end" | "stretch" | "baseline";
  wrap?: "nowrap" | "wrap" | "wrap-reverse";
}

const getFlexBasis = (breakpoint: number | boolean): string => {
  if (typeof breakpoint === "boolean") {
    return breakpoint ? "100%" : "auto";
  }
  return `${(breakpoint / 12) * 100}%`;
};

const getResponsiveStyles = (props: CustomGridProps) => {
  const styles: any = {};

  if (props.xs !== undefined) {
    styles.flexBasis = getFlexBasis(props.xs);
    styles.maxWidth = getFlexBasis(props.xs);
  }

  if (props.sm !== undefined) {
    styles["@media (min-width: 600px)"] = {
      flexBasis: getFlexBasis(props.sm),
      maxWidth: getFlexBasis(props.sm),
    };
  }

  if (props.md !== undefined) {
    styles["@media (min-width: 900px)"] = {
      flexBasis: getFlexBasis(props.md),
      maxWidth: getFlexBasis(props.md),
    };
  }

  if (props.lg !== undefined) {
    styles["@media (min-width: 1200px)"] = {
      flexBasis: getFlexBasis(props.lg),
      maxWidth: getFlexBasis(props.lg),
    };
  }

  if (props.xl !== undefined) {
    styles["@media (min-width: 1536px)"] = {
      flexBasis: getFlexBasis(props.xl),
      maxWidth: getFlexBasis(props.xl),
    };
  }

  return styles;
};

export const CustomGrid: React.FC<CustomGridProps> = ({
  container = false,
  item = false,
  xs,
  sm,
  md,
  lg,
  xl,
  spacing = 0,
  direction = "row",
  justifyContent,
  alignItems,
  wrap = "wrap",
  children,
  sx,
  ...otherProps
}) => {
  const containerStyles = container
    ? {
        display: "flex",
        flexDirection: direction,
        flexWrap: wrap,
        justifyContent,
        alignItems,
        gap: spacing * 8, // Convert spacing to pixels (MUI spacing unit is 8px)
        width: "100%",
      }
    : {};

  const itemStyles = item
    ? {
        flex: "0 0 auto",
        ...getResponsiveStyles({ xs, sm, md, lg, xl }),
      }
    : {};

  const combinedSx = {
    ...containerStyles,
    ...itemStyles,
    ...sx,
  };

  return (
    <Box sx={combinedSx} {...otherProps}>
      {children}
    </Box>
  );
};

export default CustomGrid;
