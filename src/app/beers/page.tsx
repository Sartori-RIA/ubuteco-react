import {Beer, BeerStyle} from "@/app/types";
import {Button, Card, DestroyButton, EditButton} from "@/app/components";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";

const beer_styles: BeerStyle[] = [
  {id: 1, name: "lager"}
]


const beers_mock: Beer[] = Array.from({length: 100}, (_, index: number): Beer => {
    return {
      id: index,
      beer_style: beer_styles[0],
      name: `Beer ${index}`,
      alcohol: 10,
      beer_style_id: beer_styles[0].id,
      description: `beer ${index} description`,
      ibu: 10,
    }
  }
)

function BeerLine({beer}: { beer: Beer }) {
  return (
    <Card title={beer.name} className="min-h-[200px] flex flex-col justify-between">
      <p className="text-sm text-gray-500 break-words">
        {JSON.stringify(beer)}
      </p>
      <div className="flex justify-end">
        <EditButton/>
        <DestroyButton/>
      </div>
    </Card>
  )
}

export default function Page() {
  console.log(beers_mock)
  return (<>
      <div className="space-y-6">
        <div className="flex justify-between space-between">
          <h1 className="text-3xl">Beers</h1>

          <Button variant="outline"><FontAwesomeIcon icon={faPlus}/></Button>
        </div>
        <br/>
        <div className="
            grid
            grid-cols-1
            sm:grid-cols-2
            xl:grid-cols-3
            2xl:grid-cols-4
            gap-6"
        >
          {beers_mock.map((beer: Beer) => <BeerLine key={beer.name} beer={beer}/>)}
        </div>
      </div>
    </>
  )
}