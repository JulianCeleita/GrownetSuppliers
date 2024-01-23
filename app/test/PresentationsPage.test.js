// Presentations.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios'; // Mockear axios
import Presentations from '../presentations/page';

jest.mock('axios');

describe('Presentations Component', () => {
  it('renders without crashing', async () => {
    // Configurar el mock de axios para la llamada a fetchPresentations
    axios.get.mockResolvedValue({
      data: {
        presentations: [
          {
            id: 1,
            code: '123',
            product_name: 'Product 1',
            uom: 'Unit',
            name: 'Packsize 1',
            cost: 10,
            quantity: 5,
          },
          // Agrega más presentaciones según sea necesario para tus pruebas
        ],
      },
    });

    render(<Presentations />);

    // Espera a que el texto "Presentations list" esté presente en el DOM
    await waitFor(() => {
      expect(screen.getByText('Presentations list')).toBeInTheDocument();
    });

    // Agrega más expectativas según sea necesario para tus pruebas
  });

  // Puedes agregar más pruebas según sea necesario
});
