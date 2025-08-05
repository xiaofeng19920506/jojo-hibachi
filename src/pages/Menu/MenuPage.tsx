import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Paper,
  Divider,
} from "@mui/material";
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCart as ShoppingCartIcon,
  Check as CheckIcon,
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useGetUserReservationByIdQuery,
  useGetMenuItemsQuery,
  useAddFoodOrderMutation,
  useAddFoodOrderAdminMutation,
} from "../../services/api";
import type { FoodEntry } from "../../components/DataTable/types";
import type { RootState } from "../../store";

interface CartItem {
  menuItem: FoodEntry;
  quantity: number;
  specialInstructions?: string;
}

const MenuPage: React.FC = () => {
  const { reservationId } = useParams<{ reservationId: string }>();
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<FoodEntry | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    data: reservation,
    isLoading: reservationLoading,
    error: reservationError,
  } = useGetUserReservationByIdQuery(reservationId || "");

  const {
    data: menuItems = [],
    isLoading: menuLoading,
    error: menuError,
  } = useGetMenuItemsQuery();

  const [addFoodOrder, { isLoading: isSubmitting }] = useAddFoodOrderMutation();

  // Get user role from Redux store
  const userRole = useSelector(
    (state: RootState) => state.user.user?.role || "user"
  );

  const [addFoodOrderAdmin] = useAddFoodOrderAdminMutation();

  // Load existing food orders from reservation into cart
  React.useEffect(() => {
    if (
      reservation &&
      reservation.foodOrder &&
      reservation.foodOrder.length > 0
    ) {
      // Transform existing food orders to cart items
      const existingCartItems = reservation.foodOrder
        .map((order: any) => {
          // Find the corresponding menu item
          const menuItem = menuItems.find(
            (item: FoodEntry) => item.id === order.food
          );
          if (menuItem) {
            return {
              menuItem,
              quantity: order.quantity,
              specialInstructions: order.specialInstructions || "",
            };
          }
          return null;
        })
        .filter(Boolean) as CartItem[];

      setCart(existingCartItems);
    }
  }, [reservation, menuItems]);

  const totalGuests = (reservation?.adult || 0) + (reservation?.kids || 0);
  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0
  );

  // Filter menu items by category - only show active items
  const activeMenuItems = menuItems;

  // Debug: Log the menu items to see what we're getting
  console.log("MenuPage - menuItems:", menuItems);
  console.log("MenuPage - activeMenuItems:", activeMenuItems);

  const handleAddToCart = () => {
    if (!selectedItem) return;

    const existingItemIndex = cart.findIndex(
      (item) => item.menuItem.id === selectedItem.id
    );

    if (existingItemIndex >= 0) {
      // Update existing item
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += quantity;
      if (specialInstructions) {
        updatedCart[existingItemIndex].specialInstructions =
          specialInstructions;
      }
      setCart(updatedCart);
    } else {
      // Add new item
      setCart([
        ...cart,
        {
          menuItem: selectedItem,
          quantity,
          specialInstructions: specialInstructions || undefined,
        },
      ]);
    }

    setDialogOpen(false);
    setSelectedItem(null);
    setQuantity(1);
    setSpecialInstructions("");
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart(cart.filter((item) => item.menuItem.id !== itemId));
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(itemId);
      return;
    }

    setCart(
      cart.map((item) =>
        item.menuItem.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleProceedToCheckout = async () => {
    if (!reservationId || cart.length === 0) return;

    try {
      // Transform cart items to match the API payload format
      const foodOrder = cart.map((item) => ({
        food: item.menuItem.id,
        quantity: item.quantity,
        specialInstructions: item.specialInstructions || "",
        price: item.menuItem.price * item.quantity,
      }));

      // Create the payload structure
      const foodOrderData = {
        foodOrder,
      };

      // Use appropriate API based on user role
      if (userRole === "admin") {
        await addFoodOrderAdmin({
          reservationId,
          foodOrder: foodOrderData,
        }).unwrap();
      } else {
        await addFoodOrder({
          reservationId,
          foodOrder: foodOrderData,
        }).unwrap();
      }

      // Navigate to dashboard after successful save
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to save food order:", error);
      // You might want to show an error message to the user here
    }
  };

  const handleItemSelect = (item: FoodEntry) => {
    setSelectedItem(item);
    setQuantity(1);
    setSpecialInstructions("");
    setDialogOpen(true);
  };

  if (reservationLoading || menuLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (reservationError || menuError || !reservation) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Alert severity="error">
          Failed to load reservation or menu details.
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "100vh",
        bgcolor: "background.default",
        pt: { xs: "56px", sm: "64px" },
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          py: 2,
        }}
      >
        {/* Header */}
        <Paper elevation={2} sx={{ p: 3, mb: 3, flexShrink: 0 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                Hibachi Menu
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Reservation for {reservation.customerName} on {reservation.date}{" "}
                at {reservation.time}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Guests: {totalGuests} ({reservation.adult} adults,{" "}
                {reservation.kids} kids)
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={2}>
              <ShoppingCartIcon sx={{ fontSize: 32 }} />
              <Typography variant="h6">${totalPrice.toFixed(2)}</Typography>
            </Box>
          </Box>
        </Paper>

        {/* Main Content - Menu and Cart Side by Side */}
        <Box
          sx={{
            display: "flex",
            gap: 3,
            flex: 1,
            minHeight: 0,
            maxHeight: "100%", // Ensure it doesn't exceed container height
            overflow: "hidden",
          }}
        >
          {/* Menu Section */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
              maxHeight: "100%", // Ensure it doesn't exceed parent height
            }}
          >
            <Paper elevation={2} sx={{ p: 3, mb: 3, flexShrink: 0 }}>
              <Typography variant="h5" gutterBottom>
                All Menu Items
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Browse through our entire menu to build your perfect hibachi
                combo.
              </Typography>
            </Paper>

            {/* Scrollable Grid Container */}
            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                overflowX: "hidden",
                pr: 1, // Add some padding for scrollbar
                minHeight: 0,
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 3, // Changed from 1.5 to 3
                  pb: 2, // Add bottom padding for last row
                  m: 1, // Added margin of 1rem
                }}
              >
                {activeMenuItems.map((item) => (
                  <Card
                    key={item.id}
                    sx={{
                      cursor: "pointer",
                      border:
                        selectedItem?.id === item.id
                          ? "2px solid primary.main"
                          : "1px solid grey.300", // Added subtle border for better visibility
                      height: "150px", // Reduced from 200px
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      boxShadow: 3, // Increased shadow for better visibility
                      "&:hover": {
                        boxShadow: 6, // Increased hover shadow
                        transform: "translateY(-2px)",
                        border: "1px solid primary.main", // Enhanced hover border
                      },
                    }}
                    onClick={() => handleItemSelect(item)}
                  >
                    <CardContent
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        textAlign: "center",
                        p: 2, // Reduced padding from 3
                      }}
                    >
                      <Typography variant="h6" component="h3" gutterBottom>
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mb={1}>
                        {item.description}
                      </Typography>
                      <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                        ${item.price}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>
          </Box>

          {/* Cart Section */}
          <Box sx={{ width: "400px", flexShrink: 0 }}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography variant="h5" gutterBottom>
                Your Order ({totalCartItems} items)
              </Typography>

              {cart.length === 0 ? (
                <Box
                  sx={{
                    textAlign: "center",
                    py: 4,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="body1" color="text.secondary">
                    Your cart is empty
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Start building your hibachi combo or add appetizers
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
                >
                  <Box sx={{ flex: 1, overflowY: "auto", mb: 2 }}>
                    {cart.map((item) => (
                      <Box
                        key={item.menuItem.id}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="flex-start"
                        mb={2}
                        sx={{
                          p: 2,
                          border: "1px solid",
                          borderColor: "divider",
                          borderRadius: 1,
                        }}
                      >
                        <Box flex={1}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {item.menuItem.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            ${item.menuItem.price} × {item.quantity} = $
                            {(item.menuItem.price * item.quantity).toFixed(2)}
                          </Typography>
                          {item.specialInstructions && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              fontStyle="italic"
                              sx={{ mt: 1 }}
                            >
                              Note: {item.specialInstructions}
                            </Typography>
                          )}
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleUpdateQuantity(
                                item.menuItem.id,
                                item.quantity - 1
                              )
                            }
                          >
                            <RemoveIcon />
                          </IconButton>
                          <Typography
                            variant="body1"
                            sx={{ minWidth: 30, textAlign: "center" }}
                          >
                            {item.quantity}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleUpdateQuantity(
                                item.menuItem.id,
                                item.quantity + 1
                              )
                            }
                          >
                            <AddIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    ))}
                  </Box>

                  <Box sx={{ mt: "auto" }}>
                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ mb: 3 }}>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body1">Subtotal:</Typography>
                        <Typography variant="body1">
                          ${totalPrice.toFixed(2)}
                        </Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2" color="text.secondary">
                          Tax (8%):
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ${(totalPrice * 0.08).toFixed(2)}
                        </Typography>
                      </Box>
                      <Divider sx={{ my: 1 }} />
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="h6" fontWeight="bold">
                          Total:
                        </Typography>
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          color="primary"
                        >
                          ${(totalPrice * 1.08).toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>

                    <Button
                      variant="contained"
                      size="large"
                      fullWidth
                      onClick={handleProceedToCheckout}
                      startIcon={
                        isSubmitting ? (
                          <CircularProgress size={20} />
                        ) : (
                          <CheckIcon />
                        )
                      }
                      disabled={cart.length === 0 || isSubmitting}
                    >
                      {isSubmitting
                        ? "Saving Order..."
                        : "Save Order & Go to Dashboard"}
                    </Button>
                  </Box>
                </Box>
              )}
            </Paper>
          </Box>
        </Box>

        {/* Add Item Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h6">{selectedItem?.name}</Typography>
          </DialogTitle>
          <DialogContent>
            {selectedItem && (
              <Box>
                <Typography variant="body1" color="text.secondary" mb={2}>
                  {selectedItem.description}
                </Typography>

                <Box display="flex" gap={1} flexWrap="wrap" mb={3}>
                  {selectedItem.allergens?.map((allergen) => (
                    <Chip
                      key={allergen}
                      label={allergen}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>

                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <Typography variant="subtitle1">Quantity:</Typography>
                  <IconButton
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <Typography
                    variant="h6"
                    sx={{ minWidth: 40, textAlign: "center" }}
                  >
                    {quantity}
                  </Typography>
                  <IconButton onClick={() => setQuantity(quantity + 1)}>
                    <AddIcon />
                  </IconButton>
                </Box>

                <TextField
                  fullWidth
                  label="Special Instructions (Optional)"
                  multiline
                  rows={3}
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g., No onions, extra spicy, etc."
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleAddToCart}
              startIcon={<AddIcon />}
            >
              Add to Order ($
              {selectedItem
                ? (selectedItem.price * quantity).toFixed(2)
                : "0.00"}
              )
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default MenuPage;
