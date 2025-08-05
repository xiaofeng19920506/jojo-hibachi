import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  CardMedia,
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
import { useGetUserReservationByIdQuery } from "../../services/api";
import {
  menuItems,
  getBaseProteins,
  getAdditionalProteins,
} from "../../services/menuData";
import type { MenuItem as MenuItemType } from "../../services/menuData";

interface CartItem {
  menuItem: MenuItemType;
  quantity: number;
  specialInstructions?: string;
}

const MenuPage: React.FC = () => {
  const { reservationId } = useParams<{ reservationId: string }>();
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItemType | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  // Hibachi combo building state
  const [hibachiComboDialogOpen, setHibachiComboDialogOpen] = useState(false);
  const [selectedBaseProtein, setSelectedBaseProtein] =
    useState<MenuItemType | null>(null);
  const [selectedAdditionalProteins, setSelectedAdditionalProteins] = useState<
    MenuItemType[]
  >([]);
  const [comboSpecialInstructions, setComboSpecialInstructions] = useState("");
  const [comboQuantity, setComboQuantity] = useState(1);

  // Appetizer and protein selection modals
  const [appetizerModalOpen, setAppetizerModalOpen] = useState(false);
  const [proteinModalOpen, setProteinModalOpen] = useState(false);
  const [selectedAppetizer, setSelectedAppetizer] =
    useState<MenuItemType | null>(null);
  const [selectedProtein, setSelectedProtein] = useState<MenuItemType | null>(
    null
  );
  const [appetizerQuantity, setAppetizerQuantity] = useState(1);
  const [proteinQuantity, setProteinQuantity] = useState(1);
  const [appetizerInstructions, setAppetizerInstructions] = useState("");
  const [proteinInstructions, setProteinInstructions] = useState("");

  const {
    data: reservation,
    isLoading,
    error,
  } = useGetUserReservationByIdQuery(reservationId || "");

  const totalGuests = (reservation?.adult || 0) + (reservation?.kids || 0);
  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0
  );

  const baseProteins = getBaseProteins();
  const additionalProteins = getAdditionalProteins();
  const appetizers = menuItems.filter((item) => item.category === "Appetizer");

  // Fallback to ensure proteins are always available
  const displayProteins =
    baseProteins.length > 0
      ? baseProteins
      : menuItems.filter((item) => item.category === "Base Protein");

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

  const handleProceedToCheckout = () => {
    navigate(`/reservation/${reservationId}/checkout`, {
      state: { cart, reservation },
    });
  };

  // Hibachi combo handlers
  const handleAddAdditionalProtein = (additionalProtein: MenuItemType) => {
    setSelectedAdditionalProteins([
      ...selectedAdditionalProteins,
      additionalProtein,
    ]);
  };

  const handleRemoveAdditionalProtein = (proteinId: string) => {
    setSelectedAdditionalProteins(
      selectedAdditionalProteins.filter((protein) => protein.id !== proteinId)
    );
  };

  const handleAddHibachiComboToCart = () => {
    if (!selectedBaseProtein) return;

    // Calculate total price for the combo
    const basePrice = selectedBaseProtein.price;
    const additionalPrice = selectedAdditionalProteins.reduce(
      (sum, protein) => sum + protein.price,
      0
    );
    const totalComboPrice = basePrice + additionalPrice;

    // Create a custom combo name
    const comboName =
      selectedAdditionalProteins.length > 0
        ? `${selectedBaseProtein.name} + ${selectedAdditionalProteins
            .map((p) => p.name.replace("Add ", ""))
            .join(", ")}`
        : selectedBaseProtein.name;

    // Create a custom menu item for the combo
    const comboItem: MenuItemType = {
      id: `combo-${Date.now()}`,
      name: comboName,
      description: `${selectedBaseProtein.description}${
        selectedAdditionalProteins.length > 0
          ? ` with additional ${selectedAdditionalProteins
              .map((p) => p.name.replace("Add ", ""))
              .join(", ")}`
          : ""
      }`,
      price: totalComboPrice,
      category: "Hibachi Combo",
      image: selectedBaseProtein.image,
      allergens: [
        ...(selectedBaseProtein.allergens || []),
        ...selectedAdditionalProteins.flatMap((p) => p.allergens || []),
      ],
      isVegetarian:
        selectedBaseProtein.isVegetarian &&
        selectedAdditionalProteins.every((p) => p.isVegetarian),
      isSpicy:
        selectedBaseProtein.isSpicy ||
        selectedAdditionalProteins.some((p) => p.isSpicy),
      preparationTime: Math.max(
        selectedBaseProtein.preparationTime || 0,
        ...selectedAdditionalProteins.map((p) => p.preparationTime || 0)
      ),
    };

    // Add to cart
    setCart([
      ...cart,
      {
        menuItem: comboItem,
        quantity: comboQuantity,
        specialInstructions: comboSpecialInstructions || undefined,
      },
    ]);

    // Reset combo state
    setHibachiComboDialogOpen(false);
    setSelectedBaseProtein(null);
    setSelectedAdditionalProteins([]);
    setComboSpecialInstructions("");
    setComboQuantity(1);
  };

  // Appetizer selection handlers
  const handleAppetizerSelect = (appetizer: MenuItemType) => {
    setSelectedAppetizer(appetizer);
    setAppetizerQuantity(1);
    setAppetizerInstructions("");
  };

  const handleAddAppetizerToCart = () => {
    if (!selectedAppetizer) return;

    const existingItemIndex = cart.findIndex(
      (item) => item.menuItem.id === selectedAppetizer.id
    );

    if (existingItemIndex >= 0) {
      // Update existing item
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += appetizerQuantity;
      if (appetizerInstructions) {
        updatedCart[existingItemIndex].specialInstructions =
          appetizerInstructions;
      }
      setCart(updatedCart);
    } else {
      // Add new item
      setCart([
        ...cart,
        {
          menuItem: selectedAppetizer,
          quantity: appetizerQuantity,
          specialInstructions: appetizerInstructions || undefined,
        },
      ]);
    }

    setAppetizerModalOpen(false);
    setSelectedAppetizer(null);
    setAppetizerQuantity(1);
    setAppetizerInstructions("");
  };

  // Protein selection handlers
  const handleProteinSelect = (protein: MenuItemType) => {
    setSelectedProtein(protein);
    setProteinQuantity(1);
    setProteinInstructions("");
  };

  const handleAddProteinToCart = () => {
    if (!selectedProtein) return;

    const existingItemIndex = cart.findIndex(
      (item) => item.menuItem.id === selectedProtein.id
    );

    if (existingItemIndex >= 0) {
      // Update existing item
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += proteinQuantity;
      if (proteinInstructions) {
        updatedCart[existingItemIndex].specialInstructions =
          proteinInstructions;
      }
      setCart(updatedCart);
    } else {
      // Add new item
      setCart([
        ...cart,
        {
          menuItem: selectedProtein,
          quantity: proteinQuantity,
          specialInstructions: proteinInstructions || undefined,
        },
      ]);
    }

    setProteinModalOpen(false);
    setSelectedProtein(null);
    setProteinQuantity(1);
    setProteinInstructions("");
  };

  if (isLoading) {
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

  if (error || !reservation) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Alert severity="error">Failed to load reservation details.</Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        pt: { xs: "56px", sm: "64px" },
      }}
    >
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Header */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
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
        <Box sx={{ display: "flex", gap: 3, height: "calc(100vh - 200px)" }}>
          {/* Menu Section */}
          <Box sx={{ flex: 1, overflowY: "auto" }}>
            {/* Hibachi Proteins Section */}
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h5" gutterBottom>
                Hibachi Proteins
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Choose your base protein and add additional proteins to create
                your perfect combo
              </Typography>

              <Card
                sx={{
                  height: "300px",
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                  },
                }}
                onClick={() => {
                  setProteinModalOpen(true);
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image="https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Hibachi Proteins"
                  sx={{ objectFit: "cover" }}
                />
                <CardContent
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h4" component="h3" gutterBottom>
                    Hibachi Proteins
                  </Typography>
                  <Typography variant="body1" color="text.secondary" mb={2}>
                    Build your perfect hibachi combo with our selection of
                    proteins
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<AddIcon />}
                    sx={{ mt: 2 }}
                  >
                    Browse Proteins
                  </Button>
                </CardContent>
              </Card>
            </Paper>

            {/* Appetizers Section */}
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h5" gutterBottom>
                Appetizers
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Start your meal with our delicious appetizers
              </Typography>

              <Card
                sx={{
                  height: "300px",
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                  },
                }}
                onClick={() => {
                  setAppetizerModalOpen(true);
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Appetizers"
                  sx={{ objectFit: "cover" }}
                />
                <CardContent
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h4" component="h3" gutterBottom>
                    Appetizers
                  </Typography>
                  <Typography variant="body1" color="text.secondary" mb={2}>
                    Start your meal with our delicious appetizers and sides
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<AddIcon />}
                    sx={{ mt: 2 }}
                  >
                    Browse Appetizers
                  </Button>
                </CardContent>
              </Card>
            </Paper>
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
                  <ShoppingCartIcon
                    sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
                  />
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
                      startIcon={<CheckIcon />}
                      disabled={cart.length === 0}
                    >
                      Proceed to Checkout
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
                <CardMedia
                  component="img"
                  height="200"
                  image={selectedItem.image}
                  alt={selectedItem.name}
                  sx={{ objectFit: "cover", borderRadius: 1, mb: 2 }}
                />
                <Typography variant="body1" color="text.secondary" mb={2}>
                  {selectedItem.description}
                </Typography>

                <Box display="flex" gap={1} flexWrap="wrap" mb={3}>
                  {selectedItem.isVegetarian && (
                    <Chip label="Vegetarian" size="small" color="success" />
                  )}
                  {selectedItem.isSpicy && (
                    <Chip label="Spicy" size="small" color="error" />
                  )}
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

        {/* Hibachi Combo Builder Dialog */}
        <Dialog
          open={hibachiComboDialogOpen}
          onClose={() => setHibachiComboDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h6">
              Build Your Hibachi Combo: {selectedBaseProtein?.name}
            </Typography>
          </DialogTitle>
          <DialogContent>
            {selectedBaseProtein && (
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: 3,
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      Base Protein
                    </Typography>
                    <Card>
                      <CardMedia
                        component="img"
                        height="150"
                        image={selectedBaseProtein.image}
                        alt={selectedBaseProtein.name}
                        sx={{ objectFit: "cover" }}
                      />
                      <CardContent>
                        <Typography variant="h6">
                          {selectedBaseProtein.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {selectedBaseProtein.description}
                        </Typography>
                        <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                          ${selectedBaseProtein.price}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      Add Additional Proteins
                    </Typography>
                    <Box display="flex" flexDirection="column" gap={2}>
                      {additionalProteins.map((protein) => (
                        <Card
                          key={protein.id}
                          sx={{
                            cursor: "pointer",
                            border: selectedAdditionalProteins.some(
                              (p) => p.id === protein.id
                            )
                              ? "2px solid primary.main"
                              : "2px solid transparent",
                          }}
                          onClick={() => {
                            if (
                              selectedAdditionalProteins.some(
                                (p) => p.id === protein.id
                              )
                            ) {
                              handleRemoveAdditionalProtein(protein.id);
                            } else {
                              handleAddAdditionalProtein(protein);
                            }
                          }}
                        >
                          <CardContent sx={{ py: 2 }}>
                            <Box
                              display="flex"
                              justifyContent="space-between"
                              alignItems="center"
                            >
                              <Box>
                                <Typography
                                  variant="subtitle1"
                                  fontWeight="bold"
                                >
                                  {protein.name}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {protein.description}
                                </Typography>
                              </Box>
                              <Typography variant="h6" color="primary">
                                +${protein.price}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <Typography variant="subtitle1">Quantity:</Typography>
                  <IconButton
                    onClick={() =>
                      setComboQuantity(Math.max(1, comboQuantity - 1))
                    }
                  >
                    <RemoveIcon />
                  </IconButton>
                  <Typography
                    variant="h6"
                    sx={{ minWidth: 40, textAlign: "center" }}
                  >
                    {comboQuantity}
                  </Typography>
                  <IconButton
                    onClick={() => setComboQuantity(comboQuantity + 1)}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>

                <TextField
                  fullWidth
                  label="Special Instructions (Optional)"
                  multiline
                  rows={3}
                  value={comboSpecialInstructions}
                  onChange={(e) => setComboSpecialInstructions(e.target.value)}
                  placeholder="e.g., No onions, extra spicy, etc."
                />

                <Box sx={{ mt: 2, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    Combo Summary
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Base: {selectedBaseProtein.name} ($
                    {selectedBaseProtein.price})
                  </Typography>
                  {selectedAdditionalProteins.map((protein) => (
                    <Typography
                      key={protein.id}
                      variant="body2"
                      color="text.secondary"
                    >
                      + {protein.name} (+${protein.price})
                    </Typography>
                  ))}
                  <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                    Total: $
                    {(
                      selectedBaseProtein.price +
                      selectedAdditionalProteins.reduce(
                        (sum, p) => sum + p.price,
                        0
                      )
                    ).toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setHibachiComboDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleAddHibachiComboToCart}
              startIcon={<AddIcon />}
            >
              Add Combo to Order ($
              {selectedBaseProtein
                ? (
                    (selectedBaseProtein.price +
                      selectedAdditionalProteins.reduce(
                        (sum, p) => sum + p.price,
                        0
                      )) *
                    comboQuantity
                  ).toFixed(2)
                : "0.00"}
              )
            </Button>
          </DialogActions>
        </Dialog>

        {/* Appetizer Selection Dialog */}
        <Dialog
          open={appetizerModalOpen}
          onClose={() => setAppetizerModalOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Select Appetizer</DialogTitle>
          <DialogContent>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2,
              }}
            >
              {appetizers.map((appetizer) => (
                <Card
                  key={appetizer.id}
                  sx={{
                    cursor: "pointer",
                    border:
                      selectedAppetizer?.id === appetizer.id
                        ? "2px solid primary.main"
                        : "2px solid transparent",
                  }}
                  onClick={() => handleAppetizerSelect(appetizer)}
                >
                  <CardMedia
                    component="img"
                    height="150"
                    image={appetizer.image}
                    alt={appetizer.name}
                    sx={{ objectFit: "cover" }}
                  />
                  <CardContent>
                    <Typography variant="h6">{appetizer.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {appetizer.description}
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                      ${appetizer.price}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>

            {selectedAppetizer && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  {selectedAppetizer.name}
                </Typography>

                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <Typography variant="subtitle1">Quantity:</Typography>
                  <IconButton
                    onClick={() =>
                      setAppetizerQuantity(Math.max(1, appetizerQuantity - 1))
                    }
                  >
                    <RemoveIcon />
                  </IconButton>
                  <Typography
                    variant="h6"
                    sx={{ minWidth: 40, textAlign: "center" }}
                  >
                    {appetizerQuantity}
                  </Typography>
                  <IconButton
                    onClick={() => setAppetizerQuantity(appetizerQuantity + 1)}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>

                <TextField
                  fullWidth
                  label="Special Instructions (Optional)"
                  multiline
                  rows={3}
                  value={appetizerInstructions}
                  onChange={(e) => setAppetizerInstructions(e.target.value)}
                  placeholder="e.g., No onions, extra spicy, etc."
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAppetizerModalOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleAddAppetizerToCart}
              startIcon={<AddIcon />}
              disabled={!selectedAppetizer}
            >
              Add to Order ($
              {selectedAppetizer
                ? (selectedAppetizer.price * appetizerQuantity).toFixed(2)
                : "0.00"}
              )
            </Button>
          </DialogActions>
        </Dialog>

        {/* Protein Selection Dialog */}
        <Dialog
          open={proteinModalOpen}
          onClose={() => setProteinModalOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Select Protein</DialogTitle>
          <DialogContent>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 2,
                maxWidth: "100%",
              }}
            >
              {displayProteins.map((protein) => (
                <Card
                  key={protein.id}
                  sx={{
                    cursor: "pointer",
                    border:
                      selectedProtein?.id === protein.id
                        ? "2px solid primary.main"
                        : "2px solid transparent",
                    height: "320px",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                  onClick={() => handleProteinSelect(protein)}
                >
                  <CardMedia
                    component="img"
                    height="180"
                    image={protein.image}
                    alt={protein.name}
                    sx={{ objectFit: "cover" }}
                  />
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      p: 2,
                    }}
                  >
                    <Box>
                      <Typography variant="h6" gutterBottom sx={{ mb: 1 }}>
                        {protein.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2, lineHeight: 1.4 }}
                      >
                        {protein.description}
                      </Typography>
                    </Box>
                    <Typography
                      variant="h6"
                      color="primary"
                      sx={{ mt: "auto", textAlign: "right" }}
                    >
                      ${protein.price}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>

            {selectedProtein && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  {selectedProtein.name}
                </Typography>

                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <Typography variant="subtitle1">Quantity:</Typography>
                  <IconButton
                    onClick={() =>
                      setProteinQuantity(Math.max(1, proteinQuantity - 1))
                    }
                  >
                    <RemoveIcon />
                  </IconButton>
                  <Typography
                    variant="h6"
                    sx={{ minWidth: 40, textAlign: "center" }}
                  >
                    {proteinQuantity}
                  </Typography>
                  <IconButton
                    onClick={() => setProteinQuantity(proteinQuantity + 1)}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>

                <TextField
                  fullWidth
                  label="Special Instructions (Optional)"
                  multiline
                  rows={3}
                  value={proteinInstructions}
                  onChange={(e) => setProteinInstructions(e.target.value)}
                  placeholder="e.g., No onions, extra spicy, etc."
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setProteinModalOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleAddProteinToCart}
              startIcon={<AddIcon />}
              disabled={!selectedProtein}
            >
              Add to Order ($
              {selectedProtein
                ? (selectedProtein.price * proteinQuantity).toFixed(2)
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
