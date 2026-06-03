import {describe, expect, it} from "vitest";
import {parseKitchenCableMessage} from "@/app/kitchen/_lib/parse-kitchen-cable-message";

describe("parseKitchenCableMessage", () => {
  it("parses a flat cable payload", () => {
    const result = parseKitchenCableMessage({
      action: "create",
      obj: {id: 1, status: "awaiting", item_type: "Dish"},
    });

    expect(result.action).toBe("create");
    expect(result.obj).toMatchObject({id: 1, status: "awaiting"});
  });

  it("unwraps nested message and stringified obj", () => {
    const result = parseKitchenCableMessage({
      message: JSON.stringify({
        action: "update",
        obj: JSON.stringify({id: 2, status: 1, item_type: "Dish"}),
      }),
    });

    expect(result.action).toBe("update");
    expect(result.obj).toMatchObject({id: 2, status: 1});
  });

  it("returns empty object for invalid payloads", () => {
    expect(parseKitchenCableMessage("not-json")).toEqual({});
    expect(parseKitchenCableMessage(null)).toEqual({});
  });
});
