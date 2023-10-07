import Image from "next/image";

export default function CanteenDetailPage({
  params,
}: {
  params: { cid: string };
}) {
  //Data
  const mockVendor = new Map();
  mockVendor.set("001", {
    name: "Tam sang",
    image: "/img/cat_meme.jpg",
  });
  mockVendor.set("002", {
    name: "Kanom",
    image: "/img/cat_peek.jpg",
  });
  mockVendor.set("003", {
    name: "Nam pun",
    image: "/img/cat.jpg",
  });

  return (
    <div className="text-center p-5">
      <div className="flex flex-row my-5">
        <Image
          src={mockVendor.get(params.cid).image}
          alt="Vendor Picture"
          width={0}
          height={0}
          sizes="100vw"
          className="rounded-lg w-[30%]"
        />
        <div className="text-md mx-5">
          Vendor: {mockVendor.get(params.cid).name}
        </div>
      </div>
    </div>
  );
}
