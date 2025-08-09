import React from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import type { FoodEntry } from "../../../../components/DataTable/types";

interface FoodEditFormProps {
  editFormData: Partial<FoodEntry>;
  onEditFormChange: (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>
  ) => void;
}

const FoodEditForm: React.FC<FoodEditFormProps> = ({
  editFormData,
  onEditFormChange,
}) => {
  return (
    <Box sx={{ pt: 1 }}>
      <TextField
        label="Name"
        name="name"
        fullWidth
        margin="normal"
        value={editFormData.name || ""}
        onChange={onEditFormChange}
        sx={{ fontSize: { xs: 16, sm: 18 } }}
        InputLabelProps={{ style: { fontSize: 16 } }}
        inputProps={{ style: { fontSize: 16 } }}
      />
      <TextField
        label="Description"
        name="description"
        fullWidth
        margin="normal"
        multiline
        rows={3}
        value={editFormData.description || ""}
        onChange={onEditFormChange}
        sx={{ fontSize: { xs: 16, sm: 18 } }}
        InputLabelProps={{ style: { fontSize: 16 } }}
        inputProps={{ style: { fontSize: 16 } }}
      />
      <TextField
        label="Price"
        name="price"
        type="number"
        fullWidth
        margin="normal"
        inputProps={{ min: 0, step: 0.01, style: { fontSize: 16 } }}
        value={editFormData.price || 0}
        onChange={onEditFormChange}
        sx={{ fontSize: { xs: 16, sm: 18 } }}
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Category</InputLabel>
        <Select
          name="category"
          value={editFormData.category || ""}
          onChange={(e) => onEditFormChange(e as SelectChangeEvent<string>)}
          label="Category"
        >
          <MenuItem value="appetizer">Appetizer</MenuItem>
          <MenuItem value="protein">Protein</MenuItem>
          <MenuItem value="combo">Combo</MenuItem>
          <MenuItem value="beverage">Beverage</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default FoodEditForm;
