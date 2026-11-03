/**
 * @vitest-environment jsdom
 */
import {cleanup, fireEvent, render, screen} from "@testing-library/react";
import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {Provider} from "react-redux";
import {AiSettings} from "@/app/settings/components/AiSettings";
import {organizationsService} from "@/app/_services/organizations.service";
import {setAuthenticatedUser} from "@/app/_store/features/auth/authSlice";
import {store} from "@/app/_store";
import {User} from "@/app/_types";

vi.mock("next/link", () => ({
  default: ({href, children}: {href: string; children: React.ReactNode}) => <a href={href}>{children}</a>,
}));

vi.mock("@/app/_services/organizations.service", () => ({
  organizationsService: {update: vi.fn()},
}));

function signIn(user: User) {
  store.dispatch(setAuthenticatedUser(user));
}

const admin = {
  id: 1,
  name: "Admin",
  email: "admin@email.com",
  role: {id: 1, name: "ADMIN"},
  organization: {id: 7, name: "Bar", ai_enabled: false},
} as User;

describe("AiSettings", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    vi.mocked(organizationsService.update).mockReset();
  });

  it("hides the control from a waiter", () => {
    signIn({
      ...admin,
      role: {id: 2, name: "WAITER"},
    });

    render(<Provider store={store}><AiSettings/></Provider>);

    expect(screen.queryByRole("switch")).not.toBeInTheDocument();
  });

  it("asks before turning AI on and keeps the choice after save", async () => {
    signIn(admin);
    vi.mocked(organizationsService.update).mockResolvedValue({id: 7, name: "Bar", ai_enabled: true});

    render(<Provider store={store}><AiSettings/></Provider>);

    fireEvent.click(screen.getByRole("switch"));
    expect(organizationsService.update).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", {name: "Ligar"}));

    expect(organizationsService.update).toHaveBeenCalledWith(7, {ai_enabled: true});
    expect(await screen.findByRole("switch")).toBeChecked();
  });

  it("turns AI off immediately", () => {
    signIn({...admin, organization: {id: 7, name: "Bar", ai_enabled: true}});
    vi.mocked(organizationsService.update).mockResolvedValue({id: 7, name: "Bar", ai_enabled: false});

    render(<Provider store={store}><AiSettings/></Provider>);

    fireEvent.click(screen.getByRole("switch"));

    expect(organizationsService.update).toHaveBeenCalledWith(7, {ai_enabled: false});
    expect(screen.queryByRole("button", {name: "Ligar"})).not.toBeInTheDocument();
  });
});
