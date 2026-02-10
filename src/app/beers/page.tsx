import {Beer, BeerStyle, Maker} from "@/app/types";
import {Button, Card, DestroyButton, EditButton} from "@/app/components";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faPlus} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import {truncateWords} from "@/app/lib";
import Image from "next/image";

const beer_styles: BeerStyle[] = [
  {id: 1, name: "lager"}
]

const makers: Maker[] = [
  {id: 1, name: "maker"}
]


const beers_mock: Beer[] = Array.from({length: 100}, (_, index: number): Beer => {
    return {
      id: index,
      beer_style_id: beer_styles[0].id,
      beer_style: beer_styles[0],
      maker_id: makers[0].id,
      maker: makers[0],
      name: `Beer ${index}`,
      alcohol: 10,
      description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
      ibu: 10,
      image: {
        thumb: {
          url: "http://lorempixel.com.br/500/400/?1"
        },
        url: "http://lorempixel.com.br/500/400/?1"
      }
    }
  }
)

function BeerLine({beer}: { beer: Beer }) {
  return (
    <Card title={beer.name} className="min-h-[200px] flex flex-col justify-between">
      <div className="grid xs:grid-cols-1 grid-cols-2 gap-1">
        <p className="text-sm text-gray-500 break-words">
          <strong>Style</strong>: {beer.beer_style?.name} <br/>
          <strong>Maker</strong>: {beer.maker?.name} <br/>
          <strong>Alcohol</strong>: {beer.alcohol}&nbsp;<strong>IBU</strong>: {beer.ibu}
          <br/>
          <br/>
          {truncateWords(beer.description || "", 50)}
        </p>
        {beer.image && (<div>
          <Image src={beer.image?.thumb.url} width={100} height={100} alt={beer.name}/>
        </div>)}
      </div>
      <div className="flex justify-end">
        <Link href={`/beers/${beer.id}`}><FontAwesomeIcon icon={faEye}/></Link>
        <EditButton/>
        <DestroyButton/>
      </div>
    </Card>
  )
}

export default function Page() {
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