import {WineStylesList} from "@/app/wine-styles/components";
import {Card} from "@/app/_components";
import {Metadata} from "next";

export const metadata: Metadata = {
  title: "uButeco | Wine Styles",
};

export default function Page() {
  return (
    <Card title={"Wine styles"}>
      <div className="max-w-xl space-y-4">
        <WineStylesList/>
      </div>
    </Card>
  )
}
