import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Container,
  Card,
  CardContent,
  Divider,
  Button,
  Chip,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress,
  TextField,
} from "@mui/material";
import {
  Check as CheckIcon,
  ArrowBack as ArrowBackIcon,
  Restaurant as RestaurantIcon,
  ShoppingCart as ShoppingCartIcon,
} from "@mui/icons-material";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  useGetUserReservationByIdQuery,
  useAddFoodOrderMutation,
  useAddFoodOrderAdminMutation,
} from "../../services/api";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  allergens?: string[];
  isVegetarian?: boolean;
  isSpicy?: boolean;
}

interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
}

const CheckoutPage: React.FC = () => {
  const { reservationId } = useParams<{ reservationId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [deliveryInstructions, setDeliveryInstructions] = useState("");

  // Get user role from Redux store
  const userRole = useSelector(
    (state: RootState) => state.user.user?.role || "user"
  );

  // Food order mutations
  const [addFoodOrder] = useAddFoodOrderMutation();
  const [addFoodOrderAdmin] = useAddFoodOrderAdminMutation();

  const { cart } = location.state || {
    cart: [],
  };

  const {
    data: reservationData,
    isLoading,
    error,
  } = useGetUserReservationByIdQuery(reservationId || "");

  const totalCartItems = cart.reduce(
    (sum: number, item: CartItem) => sum + item.quantity,
    0
  );
  const subtotal = cart.reduce(
    (sum: number, item: CartItem) => sum + item.menuItem.price * item.quantity,
    0
  );
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  const steps = ["Review Order", "Additional Details", "Confirmation"];

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmitOrder = async () => {
    setIsSubmitting(true);

    try {
      // Both admin and regular users use the same structured food order format
      const foodOrderData = {
        foodOrder: cart.map((item: CartItem) => ({
          food: item.menuItem.id,
          quantity: item.quantity,
          specialInstructions: item.specialInstructions || "",
          price: item.menuItem.price * item.quantity,
        })),
      };

      if (userRole === "admin") {
        await addFoodOrderAdmin({
          reservationId: reservationId!,
          foodOrder: foodOrderData,
        }).unwrap();
      } else {
        await addFoodOrder({
          reservationId: reservationId!,
          foodOrder: foodOrderData,
        }).unwrap();
      }

      setActiveStep(2);
    } catch (error) {
      console.error("Failed to submit order:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToMenu = () => {
    navigate(`/reservation/${reservationId}/menu`);
  };

  const handleViewReservation = () => {
    navigate(`/reservation/${reservationId}`);
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

  if (error || !reservationData) {
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
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* Header */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleBackToMenu}
              variant="outlined"
            >
              Back to Menu
            </Button>
            <Typography variant="h4" component="h1">
              Checkout
            </Typography>
          </Box>

          <Typography variant="body1" color="text.secondary">
            Reservation for {reservationData.customerName} on{" "}
            {reservationData.date} at {reservationData.time}
          </Typography>
        </Paper>

        {/* Stepper */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

        {/* Step Content */}
        {activeStep === 0 && (
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Review Your Order
            </Typography>

            {cart.length === 0 ? (
              <Alert severity="info" sx={{ mb: 2 }}>
                No items in your cart. Please go back to the menu to add items.
              </Alert>
            ) : (
              <>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: 3,
                  }}
                >
                  <Box sx={{ flex: { xs: 1, md: 2 } }}>
                    <Typography variant="h6" gutterBottom>
                      Selected Items ({totalCartItems})
                    </Typography>

                    {cart.map((item: CartItem) => (
                      <Card key={item.menuItem.id} sx={{ mb: 2 }}>
                        <CardContent>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="flex-start"
                          >
                            <Box flex={1}>
                              <Typography variant="subtitle1" fontWeight="bold">
                                {item.menuItem.name}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                mb={1}
                              >
                                {item.menuItem.description}
                              </Typography>

                              <Box
                                display="flex"
                                gap={1}
                                flexWrap="wrap"
                                mb={1}
                              >
                                {item.menuItem.isVegetarian && (
                                  <Chip
                                    label="Vegetarian"
                                    size="small"
                                    color="success"
                                  />
                                )}
                                {item.menuItem.isSpicy && (
                                  <Chip
                                    label="Spicy"
                                    size="small"
                                    color="error"
                                  />
                                )}
                                {item.menuItem.allergens?.map((allergen) => (
                                  <Chip
                                    key={allergen}
                                    label={allergen}
                                    size="small"
                                    variant="outlined"
                                  />
                                ))}
                              </Box>

                              {item.specialInstructions && (
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  fontStyle="italic"
                                >
                                  Note: {item.specialInstructions}
                                </Typography>
                              )}
                            </Box>
                            <Box textAlign="right">
                              <Typography variant="h6" color="primary">
                                ${item.menuItem.price}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Qty: {item.quantity}
                              </Typography>
                              <Typography variant="subtitle1" fontWeight="bold">
                                $
                                {(item.menuItem.price * item.quantity).toFixed(
                                  2
                                )}
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>

                  <Box sx={{ flex: { xs: 1, md: 1 } }}>
                    <Paper elevation={1} sx={{ p: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        Order Summary
                      </Typography>

                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography>Subtotal:</Typography>
                        <Typography>${subtotal.toFixed(2)}</Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography>Tax (8%):</Typography>
                        <Typography>${tax.toFixed(2)}</Typography>
                      </Box>
                      <Divider sx={{ my: 1 }} />
                      <Box display="flex" justifyContent="space-between" mb={2}>
                        <Typography variant="h6" fontWeight="bold">
                          Total:
                        </Typography>
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          color="primary"
                        >
                          ${total.toFixed(2)}
                        </Typography>
                      </Box>

                      <Button
                        variant="contained"
                        fullWidth
                        onClick={handleNext}
                        startIcon={<CheckIcon />}
                      >
                        Continue
                      </Button>
                    </Paper>
                  </Box>
                </Box>
              </>
            )}
          </Paper>
        )}

        {activeStep === 1 && (
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Additional Details
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 3,
              }}
            >
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  label="Additional Notes"
                  multiline
                  rows={4}
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="Any special requests or notes for your order..."
                  helperText="Optional: Add any special requests or notes for your order"
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  label="Delivery Instructions"
                  multiline
                  rows={4}
                  value={deliveryInstructions}
                  onChange={(e) => setDeliveryInstructions(e.target.value)}
                  placeholder="Any specific delivery instructions..."
                  helperText="Optional: Add any specific delivery instructions"
                />
              </Box>
            </Box>

            <Box display="flex" gap={2} mt={3}>
              <Button variant="outlined" onClick={handleBack}>
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmitOrder}
                disabled={isSubmitting}
                startIcon={
                  isSubmitting ? <CircularProgress size={20} /> : <CheckIcon />
                }
              >
                {isSubmitting ? "Submitting..." : "Submit Order"}
              </Button>
            </Box>
          </Paper>
        )}

        {activeStep === 2 && (
          <Paper elevation={2} sx={{ p: 3, textAlign: "center" }}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={2}
            >
              <CheckIcon sx={{ fontSize: 64, color: "success.main" }} />
              <Typography variant="h4" color="success.main">
                Order Submitted Successfully!
              </Typography>

              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ maxWidth: 600 }}
              >
                Your menu selections have been added to your reservation. Our
                team will prepare your order according to your specifications.
                You will receive a confirmation email shortly.
              </Typography>

              <Box display="flex" gap={2} mt={3}>
                <Button
                  variant="outlined"
                  onClick={handleViewReservation}
                  startIcon={<RestaurantIcon />}
                >
                  View Reservation
                </Button>
                <Button
                  variant="contained"
                  onClick={() => navigate("/dashboard")}
                  startIcon={<ShoppingCartIcon />}
                >
                  Go to Dashboard
                </Button>
              </Box>
            </Box>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default CheckoutPage;
