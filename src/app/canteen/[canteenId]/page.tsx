import Image from "next/image";

export default function CanteenDetailPage({
  params,
}: {
  params: { canteenId: string };
}) {
  //Data
  const mockCanteen = new Map();
  mockCanteen.set("01", {
    name: "iCanteen",
    image: "/img/cat_meme.jpg",
  });
  mockCanteen.set("02", {
    name: "Aksorn",
    image: "/img/cat_peek.jpg",
  });
  mockCanteen.set("03", {
    name: "Mahit",
    image: "/img/cat.jpg",
  });

  return (
    <div className="text-center p-5">
      <div className="flex flex-row my-5">
        <Image
          src={mockCanteen.get(params.canteenId).image}
          alt="Vendor Picture"
          width={0}
          height={0}
          sizes="100vw"
          className="rounded-lg w-[30%]"
        />
        <div className="text-md mx-5">
          Vendor: {mockCanteen.get(params.canteenId).name}
        </div>
      </div>
    </div>
  );
}
