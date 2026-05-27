import {BeerStylesList} from "@/app/beer-styles/components";
import {Card} from "@/app/_components";
import {Metadata} from "next";

export const metadata: Metadata = {
  title: "uButeco | Beer Styles",
};

export default function Page() {
  return (
    <Card title={"Beer styles"}>
      <div className="mx-auto max-w-xl space-y-4">
        <BeerStylesList/>
      </div>
    </Card>
  )
}