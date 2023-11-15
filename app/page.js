import Cart from "./common/Cart";
import Contacts from "./common/Contacts";
import DeliveryLocation from "./common/DeliveryLocation";
import Footer from "./common/Footer";
import Header from "./common/Header";
import Intro from "./common/Intro";
import MainItems from "./common/MainItems";
import MostSelling from "./common/MostSelling";
import NavBar from "./common/NavBar";
import Offers from "./common/Offers";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import PlaceOrder from "./common/PlaceOrder";
config.autoAddCss = false;

export default function Home() {
  return (
    <main className="text-center m-0 mx-auto max-w-[460px] relative border-solid border-[#dfe2e7] border-[1px]">
      <Header />
      <Intro />

      {/* Contacts */}
      <div className="flex py-4 justify-center text-center border-t-[1px]  border-solid border-[#cbd5e0]  shadow-sm drop-shadow-sm ">
        <Contacts />
      </div>
      {/* End Contacts */}

      <Offers />
      <NavBar />
      <MostSelling />
      <MainItems />
      <Footer />
    </main>
  );
}
