import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter as Router } from "react-router-dom";
import NavBar from "../components/NavBar"; 

describe("Create Post button functionality", () => {
  const renderWithProps = (isLoggedIn, userId = null) => {
    return render(
      <Router>
        <NavBar isLoggedIn={isLoggedIn} userId={userId} />
      </Router>
    );
  };

  test("is disabled when the user is a guest", () => {
    renderWithProps(false); // Guest user
    const createPostButton = screen.getByRole("button", { name: /create post/i });
    expect(createPostButton).toBeDisabled(); // Verify that the button is disabled
  });

  test("is enabled when the user is logged in", () => {
    renderWithProps(true, "12345"); // Logged-in user with a user ID
    const createPostButton = screen.getByRole("button", { name: /create post/i });
    expect(createPostButton).toBeEnabled(); // Verify that the button is enabled
  });
});
