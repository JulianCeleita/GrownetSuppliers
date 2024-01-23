import { act, render, screen, fireEvent, waitFor } from "@testing-library/react";
import EditProduct from "../components/EditProduct";
import React from 'react';

// Mock de axios para evitar llamadas reales a la API
jest.mock("axios");

// Mock de la función fetchProducts
const fetchProductsMock = jest.fn();

describe("EditProduct component", () => {
  test("renders EditProduct component", () => {
    act(() => {
      render(
        <EditProduct
          isvisible={true}
          onClose={() => {}}
          fetchProducts={fetchProductsMock}
          product={{
            // Datos simulados para el producto
          }}
        />
      );
    });

    // Verifica que el componente se renderice correctamente
    expect(screen.getByText("Edit Product")).toBeInTheDocument();
  });

  test("handles product editing", async () => {
    act(() => {
      render(
        <EditProduct
          isvisible={true}
          onClose={() => {}}
          fetchProducts={fetchProductsMock}
          product={{
            // Datos simulados para el producto
          }}
        />
      );
    });

    // Simula el envío del formulario
    act(() => {
      fireEvent.change(/* elemento del formulario */);
      // ... otros eventos de formulario ...
      fireEvent.submit(screen.getByRole("button", { name: "Edit Product" }));
    });

    // Espera a que se complete la solicitud de axios (simulada con waitFor)
    await waitFor(() => {
      // Asegúrate de que axios.post haya sido llamado con los argumentos esperados
      expect(axios.post).toHaveBeenCalledWith(
        "URL_ESPERADA", // Reemplaza con la URL correcta
        {
          // Datos simulados del formulario
        },
        {
          headers: {
            Authorization: "Bearer TOKEN_ESPERADO", // Reemplaza con el token correcto
            "Content-Type": "multipart/form-data",
          },
        }
      );
    });

    // Verifica que onClose haya sido llamado
    expect(screen.getByRole("button", { name: "Close" })).toHaveBeenCalledTimes(1);

    // Verifica que fetchProducts haya sido llamado
    expect(fetchProductsMock).toHaveBeenCalledTimes(1);
  });
});
