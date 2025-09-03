import Image from "next/image";
import InfiniteScrollTodos from "./componets/apicomponent";

export default function Home() {
  return (
    <div className="">
      <InfiniteScrollTodos />
    </div>
  );
}
