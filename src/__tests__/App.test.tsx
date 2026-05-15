import { render, screen } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { describe, it, expect } from "vitest";
import { GET_CARS } from "@/graphql/queries";
import App from "@/App";

// 1. Mock the GraphQL response exactly like the Example test did
const mockCars = [
  {
    id: "1",
    make: "Toyota",
    model: "Camry",
    year: 2024,
    color: "Silver",
    mobile: "https://placehold.co/640x360",
    tablet: "https://placehold.co/1023x576",
    desktop: "https://placehold.co/1440x810",
  },
];

const mockCarsWithTypename = mockCars.map((car) => ({
  ...car,
  __typename: "Car" as const,
}));

const mocks = [
  {
    request: { query: GET_CARS },
    result: { data: { cars: mockCarsWithTypename } },
  },
];

describe("App Integration Test", () => {
  it("shows a loading spinner initially", () => {
    render(
      <MockedProvider mocks={mocks}>
        <App />
      </MockedProvider>
    );

    // Verify the CircularProgress renders while Apollo fetches
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("renders the app title, search controls, and fetches car data", async () => {
    render(
      <MockedProvider mocks={mocks}>
        <App />
      </MockedProvider>
    );

    // 1. Verify the static UI loaded
    expect(screen.getByText("Car Inventory Manager")).toBeInTheDocument();
    expect(screen.getByLabelText("Search by Model")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add New Car" })).toBeInTheDocument();

    // 2. Wait for Apollo to resolve and verify the mocked car is rendered
    // findByText is asynchronous and will wait for the loading state to finish
    expect(await screen.findByText("Toyota Camry")).toBeInTheDocument();
    expect(screen.getByText("Year: 2024")).toBeInTheDocument();
    expect(screen.getByText("Color: Silver")).toBeInTheDocument();
  });
});