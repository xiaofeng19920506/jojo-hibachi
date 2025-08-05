import React from "react";
import { Typography, Card, CardContent } from "@mui/material";
import { CustomGrid } from "./CustomGrid";

export const CustomGridExample: React.FC = () => {
  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        CustomGrid Example
      </Typography>

      {/* Basic Grid Container */}
      <CustomGrid container spacing={2} sx={{ mb: 3 }}>
        <CustomGrid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Item 1</Typography>
              <Typography>
                This is a grid item that takes 12 columns on mobile, 6 on
                tablet, and 4 on desktop.
              </Typography>
            </CardContent>
          </Card>
        </CustomGrid>

        <CustomGrid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Item 2</Typography>
              <Typography>
                Another grid item with responsive behavior.
              </Typography>
            </CardContent>
          </Card>
        </CustomGrid>

        <CustomGrid item xs={12} sm={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Item 3</Typography>
              <Typography>
                This item takes full width on mobile and tablet, but 4 columns
                on desktop.
              </Typography>
            </CardContent>
          </Card>
        </CustomGrid>
      </CustomGrid>

      {/* Grid with different alignment */}
      <CustomGrid
        container
        spacing={2}
        justifyContent="center"
        alignItems="stretch"
        sx={{ mb: 3 }}
      >
        <CustomGrid item xs={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6">Centered Item</Typography>
              <Typography>
                This grid is centered and items are stretched to equal height.
              </Typography>
            </CardContent>
          </Card>
        </CustomGrid>

        <CustomGrid item xs={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6">Equal Height</Typography>
              <Typography>
                Both cards have the same height due to alignItems="stretch".
              </Typography>
            </CardContent>
          </Card>
        </CustomGrid>
      </CustomGrid>

      {/* Grid with column direction */}
      <CustomGrid
        container
        direction="column"
        spacing={2}
        sx={{ maxWidth: "400px" }}
      >
        <CustomGrid item>
          <Card>
            <CardContent>
              <Typography variant="h6">Column Layout</Typography>
              <Typography>
                This grid uses column direction instead of row.
              </Typography>
            </CardContent>
          </Card>
        </CustomGrid>

        <CustomGrid item>
          <Card>
            <CardContent>
              <Typography variant="h6">Stacked Items</Typography>
              <Typography>
                Items are stacked vertically in a column layout.
              </Typography>
            </CardContent>
          </Card>
        </CustomGrid>
      </CustomGrid>
    </div>
  );
};

export default CustomGridExample;
