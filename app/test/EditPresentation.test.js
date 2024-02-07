import React from "react";
import "@testing-library/jest-dom";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import EditPresentation from "../components/EditPresentation";
import axios from "axios";
import { updatePresentationUrl } from "../config/urls.config";

jest.mock("axios");

describe("EditPresentation component", () => {
  test("handles presentation editing", async () => {
    // Mock data for presentation and user
    const presentation = {
      id: 1,
      // other properties...
    };

    const user = {
      id_supplier: 1,
      // other properties...
    };

    // Mock values for form fields
    const selectedUomsStatus = "1";
    const editedQuantity = "1";
    const editedName = "prueba";
    const selecteUomsStatus2 = "2";
    const editedCost = "2";
    const selectedProductsStatus = "1";
    const codePresentation = "1";
    const selectedTax = "1";

    // Renderiza el componente
    render(
      <EditPresentation
        isvisible={true}
        onClose={() => {}}
        presentation={presentation}
        setPresentations={() => {}}
        setIsLoading={() => {}}
      />
    );

    // Simula el envío del formulario
    act(() => {
      fireEvent.submit(
        screen.getByRole("button", { name: "Edit Presentation" })
      );
    });

    // Espera a que se complete la solicitud de axios
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        `${updatePresentationUrl}${presentation.id}`,
        {
          uoms_id: 1,
          quantity: 1,
          name: `${editedName}  ${selecteUomsStatus2}`,
          cost: 1,
          products_id: 1,
          code: 1,
          tax: 1,
          supplier_id: 1,
        }
      );
    });

    // Verifica que onClose haya sido llamado
    expect(screen.getByRole("button", { name: "Close" })).toHaveBeenCalledTimes(1);
  });
});
