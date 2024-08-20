import Image from "next/image";
import Nav from "./components/Nav/Nav";
import Createmarket from "./components/CreateMarket/Createmarket";
import GetmarketList from "./components/MarketList/GetmarketList";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import TokenApprove from "./components/TokenApprove/TokenApprove";

export default function Home() {
  return (
    <>
      <Nav/>
      <Createmarket />
      <GetmarketList />
      <Header />
      <Footer />
      {/* <TokenApprove/> */}
    </>
  );
}
