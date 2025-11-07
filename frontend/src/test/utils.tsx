import { ReactElement } from "react";
// @ts-ignore - Type definitions might not be available until dependencies are installed
import { render as rtlRender, RenderOptions } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => rtlRender(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
// @ts-ignore - Type definitions might not be available until dependencies are installed
export * from "@testing-library/react";
export { customRender as render };

// Mock user data for tests
export const mockUser = {
  id: "1",
  email: "test@example.com",
  name: "Test User",
  role: "USER",
  phone: "1234567890",
};

export const mockAdmin = {
  id: "2",
  email: "admin@example.com",
  name: "Admin User",
  role: "ADMIN",
  phone: "0987654321",
};

export const mockVolunteer = {
  id: "3",
  email: "volunteer@example.com",
  name: "Volunteer User",
  role: "VOLUNTEER",
  phone: "5555555555",
};

// Mock dog data
export const mockDog = {
  id: "1",
  name: "Max",
  breed: "Golden Retriever",
  age: 3,
  gender: "Male",
  size: "Large",
  status: "AVAILABLE",
  description: "Friendly and energetic dog",
  location: "Test Location",
  photos: ["photo1.jpg", "photo2.jpg"],
  vaccinationStatus: "UP_TO_DATE",
  neutered: true,
};

// Mock report data
export const mockReport = {
  id: "1",
  location: "Test Street, Test City",
  latitude: 40.7128,
  longitude: -74.006,
  description: "Found a stray dog",
  status: "PENDING",
  photos: ["report1.jpg"],
  urgency: "MEDIUM",
  reportedBy: mockUser,
  createdAt: new Date().toISOString(),
};

// Mock adoption data
export const mockAdoption = {
  id: "1",
  dog: mockDog,
  applicant: mockUser,
  status: "PENDING",
  applicationDate: new Date().toISOString(),
  notes: "I would love to adopt this dog",
};

// Mock volunteer data
export const mockVolunteerProfile = {
  id: "1",
  user: mockVolunteer,
  skills: ["Dog Walking", "Dog Training"],
  availability: "Weekends",
  experience: "2 years",
  status: "ACTIVE",
};

// Mock donation data
export const mockDonation = {
  id: "1",
  amount: 100,
  donor: mockUser,
  date: new Date().toISOString(),
  paymentMethod: "CREDIT_CARD",
  status: "COMPLETED",
  message: "Keep up the good work!",
};

// Helper to create QueryClient for tests
export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

// Helper to wait for async updates
export const waitForLoadingToFinish = () =>
  new Promise((resolve) => setTimeout(resolve, 0));

// Helper to mock API responses
export const mockApiResponse = <T,>(data: T, delay = 0): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

// Helper to mock API errors
export const mockApiError = (
  message = "API Error",
  delay = 0,
): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(message)), delay);
  });
};

// Helper to mock file upload
export const createMockFile = (
  name = "test.jpg",
  _size = 1024,
  type = "image/jpeg",
): File => {
  const blob = new Blob(["test"], { type });
  return new File([blob], name, { type });
};

// Helper to mock geolocation
export const mockGeolocation = (latitude = 40.7128, longitude = -74.006) => {
  const mockGeolocation = {
    getCurrentPosition: (success: (position: any) => void) =>
      success({
        coords: {
          latitude,
          longitude,
          accuracy: 100,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        },
        timestamp: Date.now(),
      }),
    watchPosition: () => {},
    clearWatch: () => {},
  };

  Object.defineProperty(global.navigator, "geolocation", {
    value: mockGeolocation,
    writable: true,
  });

  return mockGeolocation;
};

// Helper to simulate form input
export const fillForm = async (
  getByLabelText: (text: string) => HTMLElement,
  data: Record<string, string>,
) => {
  for (const [label, value] of Object.entries(data)) {
    const input = getByLabelText(label) as HTMLInputElement;
    input.value = value;
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }
};
