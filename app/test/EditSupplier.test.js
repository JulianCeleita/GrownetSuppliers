import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios"; // Mockear axios
import EditSupplier from "../components/EditSupplier";
import React from "react";
import { updateSupplierUrl } from "../config/urls.config";

// Mockear axios
jest.mock("axios");

describe("EditSupplier", () => {
  it("renders without crashing", () => {
    render(<EditSupplier />);
    // TODO: hacer test a esta parte al renderizar
    const elements = screen.getAllByText("Edit category");
    expect(elements.length).toBeGreaterThan(1);
  });

  it("handles form submission", async () => {
    // Configurar el mock de axios
    axios.post.mockResolvedValueOnce({ data: "success" });

    render(<EditSupplier isvisible onClose={() => {}} />);

    // Simular la entrada de datos
    fireEvent.change(screen.getByLabelText("Name:"), {
      target: { value: "Test Name" },
    });
    fireEvent.change(screen.getByLabelText("Email:"), {
      target: { value: "test@example.com" },
    });

    // Realizar la acción
    fireEvent.click(screen.getByText("Add supplier"));

    // Esperar a que axios haya sido llamado
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("updateSupplier"),
        expect.any(FormData),
        expect.any(Object)
      );
    });

    const supplier = {
        id: 1
      };

      <EditSupplier
      isvisible={true}
      onClose={true}
      supplier={supplier}
      setSuppliers={() => {}}
      setIsLoading={() => {}}
    />
  });
});
