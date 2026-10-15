import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

// Jest does not understand webpack's require.context, so the data modules are replaced
// by two real champions (Gojo and Geto reference each other in their interactions).
jest.mock("./data/championsData", () => {
  const champions = [
    { ...require("./data/champions/gojo.json"), slug: "gojo" },
    { ...require("./data/champions/geto.json"), slug: "geto" }
  ];
  return {
    __esModule: true,
    default: champions,
    championsData: champions,
    filterOptions: { anime: ["Jujutsu Kaisen"], role: ["Mid"], class: ["Sorcerer"], difficulty: ["Easy", "Medium"] }
  };
});
jest.mock("./data/galleryData", () => ({ galleryBySlug: {} }));

beforeEach(() => {
  window.history.pushState({}, "", "/");
  window.scrollTo = jest.fn();
});

test("the grid shows every champion as a link to its page", () => {
  render(<App />);
  const card = screen.getByRole("link", { name: /gojo satoru/i });
  expect(card).toHaveAttribute("href", "/champion/gojo");
  expect(screen.getByRole("link", { name: /suguru geto/i })).toBeInTheDocument();
});

test("searching hides the champions that do not match", async () => {
  render(<App />);
  await userEvent.type(screen.getByPlaceholderText(/search champion/i), "zzz");
  expect(screen.getByText(/no champions found/i)).toBeInTheDocument();
});

test("a champion page shows its profile, sections and linked interactions", async () => {
  render(<App />);
  await userEvent.click(screen.getByRole("link", { name: /gojo satoru/i }));

  expect(screen.getByRole("heading", { level: 1, name: /gojo satoru/i })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: /^passives$/i })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: /^abilities$/i })).toBeInTheDocument();
  expect(document.title).toBe("Gojo Satoru | Sanctus Caelum");

  // Geto is in the roster, so his interaction links to his page; Yuji is not, so it is plain text
  const interactions = screen.getByRole("heading", { name: /interactive quotes/i }).parentElement;
  expect(within(interactions).getByRole("link", { name: "Geto" })).toHaveAttribute("href", "/champion/geto");
  expect(within(interactions).getByText("Yuji")).toBeInTheDocument();
});

test("an unknown champion shows a not found message", () => {
  window.history.pushState({}, "", "/champion/nobody");
  render(<App />);
  expect(screen.getByText(/champion not found/i)).toBeInTheDocument();
});
