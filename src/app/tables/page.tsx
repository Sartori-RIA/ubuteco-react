import {TablesList} from "@/app/tables/components";
import {Card} from "@/app/_components";
import {Metadata} from "next";

export const metadata: Metadata = {
  title: "uButeco | Tables",
};

export default function Page() {
  return (
    <Card title="Tables">
      <div className="mx-auto max-w-xl space-y-4">
        <TablesList/>
      </div>
    </Card>
  )
}
