import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EditCategory from "../components/EditCategory";
import axios from 'axios';

// Mock para axios
jest.mock("axios", () => ({
  post: jest.fn(() => Promise.resolve({ data: {} })),
}));

describe("EditCategory component", () => {
  test("renders EditCategory component", () => {
    render(
      <EditCategory
        isvisible={true}
        onClose={() => {}}
        category={{ id: 1, name: "Test Category" }}
        setCategories={() => {}}
        setIsLoading={() => {}}
      />
    );

    // Verifica que el componente se renderice correctamente
    const elements = screen.getAllByText("Edit category");
    expect(elements.length).toBeGreaterThan(1);
  });

  test("handles category editing", async () => {
    render(
      <EditCategory
        isvisible={true}
        onClose={() => {}}
        category={{ id: 1, name: "Test Category" }}
        setCategories={() => {}}
        setIsLoading={() => {}}
      />
    );

    // Simula la edición del nombre de la categoría
    fireEvent.change(screen.getByPlaceholderText("Fruit"), {
      target: { value: "New Fruit" },
    });

    const editCategoryButtons = screen.getAllByText("Edit category");

    // Simula el clic en cada botón "Edit category"
    editCategoryButtons.forEach((button) => {
      fireEvent.click(button);
    });

    // Espera a que se complete la solicitud de axios
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "https://api.grownetapp.com/grownet/api/categories/updated/1",
        { name: "New Fruit" },
        expect.any(Object)
      );
    });
  });
});
